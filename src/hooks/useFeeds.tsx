import { useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"
import { State } from "../types/state"
import firebase from "../config"
import { Poll } from "../types/poll"
import { UserVote } from "../types/user"

export type sort = "uploadedAt" | "rate" | "votesCount"
const photosLimit = 8

const useFeeds = () => {
  const user = useSelector((state: State) => state.user.value)
  const [pollsLoaded, setPollsLoaded] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [votes, setVotes] = useState<UserVote[]>([])
  const [votesLoaded, setVotesLoaded] = useState(false)
  const [polls, setPolls] = useState<Poll[]>([])

  const lastId = useRef<string | null>(null)
  const loading = useRef(false)

  const loadFeeds = (refresh?: boolean) => {
    return new Promise((resolve, reject) => {
      if (!user || !votesLoaded || loading.current) {
        resolve(false)
        return
      }
      loading.current = true
      if (refresh) {
        setHasMore(true)
      }

      let query = firebase
        .firestore()
        .collectionGroup(`photos`)
        .where("active", "==", true)

      if (votes.length) {
        query = query.where(
          "id",
          "not-in",
          votes.map((v) => v.id)
        )
      }

      return query
        .orderBy("id")
        .startAfter((!refresh && lastId.current) || 0)
        .limit(photosLimit)
        .get()
        .then((querySnapshot: any) => {
          if (!querySnapshot?.size) {
            setHasMore(false)
          }
          const fetchedPolls: Poll[] = []
          querySnapshot?.forEach((doc: any) => {
            if (
              doc.data().userId !== user.uid &&
              (!user.blocks || user.blocks.indexOf(doc.data().userId) === -1) &&
              (doc.data().showTo === "both" ||
                doc.data().showTo === user.gender)
            ) {
              fetchedPolls.push({ id: doc.id, ...doc.data() })
            }
            lastId.current = doc.id
          })
          if (!fetchedPolls.length) {
            setHasMore(false)
          } else {
            setPolls((prevPolls) =>
              refresh ? [...fetchedPolls] : [...prevPolls, ...fetchedPolls]
            )
          }
          setPollsLoaded(true)
          loading.current = false
          resolve(true)
        })
        .catch((error: any) => {
          console.log("error", error)
          loading.current = false
          reject(error)
        })
    })
  }

  useEffect(() => {
    loadFeeds()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.uid, votesLoaded])

  useEffect(() => {
    const votesUnsubscribe = firebase
      .firestore()
      .collection(`users/${user?.uid}/votes`)
      .onSnapshot((querySnapshot: any) => {
        const userVotes: UserVote[] = []
        querySnapshot.forEach((doc: any) => {
          userVotes.push({ id: doc.id, ...doc.data() })
        })
        setVotes(userVotes)
        setVotesLoaded(true)
      })
    return () => {
      votesUnsubscribe()
    }
  }, [user])

  return {
    polls,
    pollsLoaded,
    hasMore,
    loadFeeds,
    votes,
    votesLoaded,
  }
}

export default useFeeds
