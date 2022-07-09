import firebase from "../config"

export interface Photo {
  active?: boolean
  ageRange?: number[]
  imageName?: string
  imageUrl?: string
  rate?: number
  resizedImageName?: string
  showTo?: string
  updatedAt?: firebase.firestore.Timestamp
  uploadedAt?: firebase.firestore.Timestamp
  userId?: string
  votesCount?: number
  id: string
}
