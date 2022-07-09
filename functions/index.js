const functions = require("firebase-functions")
const admin = require("firebase-admin")
const _ = require("lodash");
admin.initializeApp()
admin.firestore().settings({ ignoreUndefinedProperties: true })
// const cors = require("cors")({ origin: true });

// const avatarURL = "https://avatars.dicebear.com/api/identicon/"
const pointsForVote = 1;
const pointsToVote = 5;

// Listens for votes changes to update photo rating and user points
exports.updatePhotoRating = functions.firestore.document("/users/{userId}/photos/{photoId}/votes/{documentId}")
  .onWrite(async (change, context) => {
    // Grab the current value of what was written to Firestore.
    const snap = change.after.exists ? change.after : null;

    let voterId = undefined;
    if (snap) {
      voterId = snap.data().userId;
    }
    const userId = context.params.userId;
    const photoId = context.params.photoId;

    const votesSnap = await admin.firestore()
      .collection("users").doc(userId)
      .collection("photos").doc(photoId)
      .collection("votes").get();

    const photoSnap = await admin.firestore()
      .collection("users").doc(userId)
      .collection("photos").doc(photoId).get();

    const votes = [];
    votesSnap.forEach((vote) => {
      votes.push(vote.data());
    });

    let votesTotal = 0, avg = 0

    if (photoSnap.data().type === "rate") {
      votesTotal = votes.reduce((acc, vote) => {
        return parseFloat(acc) + parseFloat(vote.vote);
      }, 0);

      avg = votesTotal / votes.length;
    }

    let updatedChoices = photoSnap.data().choices || null

    if (photoSnap.data().type === "poll") {
      const choicesGroups = _.groupBy(votes, "vote");
      updatedChoices = updatedChoices.map((choice) => {
        const votesForChoice = choicesGroups[choice.text] || [];
        const votesCount = votesForChoice.length;
        return { ...choice, votesCount };
      }
      );
    }

    const roundedAvg = Math.round(avg * 10) / 10;

    photoSnap.ref.set(
      {
        rate: roundedAvg,
        votesCount: votes.length,
        choices: updatedChoices,
        // updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      }, { merge: true });

    const userSnap = await admin.firestore()
      .collection("users").doc(userId).get();
    const points = userSnap.data().points || 0;
    const newVotes = userSnap.data().newVotes || 0;
    if (points > 0) {
      userSnap.ref.set({ points: points - pointsToVote, newVotes: newVotes + 1 }, { merge: true });
    }

    if (voterId) {
      const voterSnap = await admin.firestore()
        .collection("users").doc(voterId).get();
      if (voterSnap.exists) {
        // add vote object to voter
        const voteObj = Object.assign(snap.data());
        delete voteObj.userId;
        admin.firestore().collection(`users/${voterId}/votes`).doc(photoId).set(voteObj);
        // increase voter points
        if (voterSnap.data().points <= 100) {
          const points = voterSnap.data().points || 0;
          voterSnap.ref.set({ points: points + pointsForVote, lastVotedAt: admin.firestore.FieldValue.serverTimestamp() }, { merge: true });
        }
      }
    }
    return true;
  });


exports.onUserStatusChanged = functions.database
  .ref("/status/{uid}")
  .onUpdate(async (change, context) => {
    // Get the data written to Realtime Database
    const eventStatus = change.after.val()
    const uid = context.params.uid
    // Then use other event data to create a reference to the
    // corresponding Firestore document.
    const userStatusFirestoreRef = admin.firestore().doc(`users/${uid}`)

    const statusSnapshot = await change.after.ref.once("value")
    const status = statusSnapshot.val()

    // Otherwise, we convert the last_changed field to a Date
    eventStatus.last_changed = new Date(eventStatus.last_changed)
    functions.logger.log(eventStatus)
    userStatusFirestoreRef.set({ status }, { merge: true }).then(() => {
      if (status === "offline") {
        const removePLayersBatch = admin.firestore().batch()
        const removeRequestsBatch = admin.firestore().batch()
        admin
          .firestore()
          .collectionGroup("players")
          .where("id", "==", uid)
          .get()
          .then((snapshot) => {
            snapshot.docs.forEach((doc) => {
              removePLayersBatch.delete(doc.ref)
            })
            return removePLayersBatch.commit()
          })
        admin
          .firestore()
          .collection("requests")
          .where("uid", "==", uid)
          .get()
          .then((snapshot) => {
            snapshot.docs.forEach((doc) => {
              removeRequestsBatch.delete(doc.ref)
            })
            return removeRequestsBatch.commit()
          })
      }
    })
  })


// Listens for photos removal to cleanup
exports.photoRemoved = functions.firestore.document("/users/{userId}/photos/{photoId}")
  .onDelete(async (snap, context) => {
    const batch = admin.firestore().batch();
    const photoId = context.params.photoId;
    const userId = context.params.userId;

    const photoObj = snap.data();

    admin.firestore()
      .collectionGroup("votes").where("photoId", "==", photoId).get().then((snapshot) => {
        snapshot.docs.forEach((doc) => {
          batch.delete(doc.ref);
        });
        return batch.commit();
      });
    admin.storage().bucket().file(`images/${userId}/${photoObj.imageName}`).delete();
    try {
      admin.storage().bucket().file(`images/${userId}/resized/${getResizedName(photoObj.imageName)}`).delete();
    } catch (error) {
      functions.logger.log(error);
    }
    return true;
  });

// Listens for reports changes to deactivate photo
exports.onReport = functions.firestore.document("/users/{userId}/photos/{photoId}/reports/{documentId}")
  .onWrite(async (change, context) => {
    // Grab the current value of what was written to Firestore.
    // const snap = change.after.exists ? change.after : null;

    const snap = change.after.exists ? change.after : null;
    let reporterId = undefined;
    if (snap) {
      reporterId = snap.data().userId;
    }

    const userId = context.params.userId;
    const photoId = context.params.photoId;
    const photoSnap = await admin.firestore()
      .collection("users").doc(userId)
      .collection("photos").doc(photoId).get();
    photoSnap.ref.set(
      {
        active: false,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      }, { merge: true });

    if (reporterId) {
      const reporterSnap = await admin.firestore()
        .collection("users").doc(reporterId).get();
      functions.logger.log("reporterSnap", reporterSnap);

      if (reporterSnap.exists) {
        // add blocked user to blocks
        const originalBlocks = reporterSnap.data().blockedUsers;
        const blocks = originalBlocks ? [...originalBlocks, userId] : [userId]
        functions.logger.log("blocks", blocks);
        reporterSnap.ref.set({ blocks }, { merge: true });
      }
    }

    return true;
  });

exports.scheduledStreakCalculate = functions.pubsub.schedule("0 00 * * *")
  .onRun(() => {
    const date = new Date();
    const pastDate = date.getDate() - 1;
    date.setDate(pastDate);

    const notPlayedUsersSnap = admin.firestore().collection("users")
      .where("streak", ">", 0)
      .where("lastVotedAt", "<", admin.firestore.Timestamp.fromDate(date));

    notPlayedUsersSnap.get().then((snapshot) => {
      const batch = admin.firestore().batch();
      snapshot.docs.forEach((doc) => {
        batch.update(doc.ref, "streak", 0);
      });
      return batch.commit();
    });

    return null;
  });

// Listens for user creation
exports.userCreated = functions.firestore.document("/users/{userId}")
  .onCreate(async (snap) => {
    snap.ref.set({ points: 20, onBoarding: false }, { merge: true });
    return true;
  });


const getResizedName = (fileName, dimensions = "600x600") => {
  const extIndex = fileName.lastIndexOf(".");
  const ext = fileName.substring(extIndex);
  return `${fileName.substring(0, extIndex)}_${dimensions}${ext}`;
};