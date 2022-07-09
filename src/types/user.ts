import firebase from "../config"

export interface User extends UserStats {
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
  history?: UserStats[]
  providers?: string[]
  complete?: boolean
  blocks?: string[]
  interests?: string[]
}

export interface UserStats {
  gamesPlayed?: number
  roundsPlayed?: number
  accuracy?: number
  xp?: number
  lifeScore?: number
  streak?: number
  level?: number
  languages?: string[]
  statDate?: Date
  points?: number
}

export interface UserSettings {}

export interface UserVote {
  id?: string
  vote?: string | number
  votedAt?: firebase.firestore.Timestamp
}
