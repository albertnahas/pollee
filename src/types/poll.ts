import firebase from "../config"

export interface Poll {
  headline?: string
  description?: string
  active?: boolean
  ageRange?: number[]
  imageName?: string
  imageUrl?: string
  resizedImageName?: string
  rate?: number
  showTo?: string
  updatedAt?: firebase.firestore.Timestamp
  uploadedAt?: firebase.firestore.Timestamp
  userId?: string
  votesCount?: number
  id?: string
  type?: "rate" | "poll" | "text"
  choices?: Choice[]
  hashtags?: string[]
  displayName?: string
  photoURL?: string
}

export interface Choice {
  id?: string
  text?: string
  imageUrl?: string
  imageName?: string
  resizedImageName?: string
  votesCount?: number
  imageFile?: any
}

export interface Comment {
  id?: string
  text?: string
  userId?: string
  displayName?: string
  photoURL?: string
  createdAt?: firebase.firestore.Timestamp
}
