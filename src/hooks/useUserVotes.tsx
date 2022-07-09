import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import firebase from "../config"
import { userSelector } from "../store/userSlice"
import { UserVote } from "../types/user"

export const useUserVotes = () => {
  const [votes, setVotes] = useState<UserVote[]>([])
  const user = useSelector(userSelector)

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
      })
    return () => {
      votesUnsubscribe()
    }
  }, [user])

  return { votes }
}
