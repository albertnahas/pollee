import firebase from "../config"

export interface User {
  uid?: string
  age?: number
  displayName?: string
  photoURL?: string
  email?: string
  emailVerified?: boolean
  gender?: "male" | "female"
  lastVotedAt?: firebase.firestore.Timestamp
  lastStreakUpdateAt?: firebase.firestore.Timestamp
  onBoarding?: boolean
  feedback?: boolean
  isAnonymous?: boolean
  colorMode?: "light" | "dark"
  settings?: UserSettings
  messagingToken?: string
  providers?: string[]
  complete?: boolean
  blocks?: string[]
  interests?: string[]
  points?: number
}

export interface UserSettings { }

export interface UserVote {
  id?: string
  vote?: string | number
  votedAt?: firebase.firestore.Timestamp
}
