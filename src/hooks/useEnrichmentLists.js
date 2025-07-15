import { useState, useEffect } from 'react'
import { 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc, 
  doc, 
  query, 
  orderBy,
  onSnapshot,
  where
} from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage } from '../lib/firebase'
import { useAuth } from '../contexts/AuthContext'

export function useEnrichmentLists() {
  const [lists, setLists] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { currentUser } = useAuth()

  const listsCollection = collection(db, 'enrichmentLists')

  useEffect(() => {
    if (!currentUser) return

    const q = query(
      listsCollection, 
      where('userId', '==', currentUser.uid),
      orderBy('createdAt', 'desc')
    )
    
    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const listsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        setLists(listsData)
        setLoading(false)
      },
      (err) => {
        setError(err.message)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [currentUser])

  const addList = async (listData) => {
    try {
      const docRef = await addDoc(listsCollection, {
        ...listData,
        userId: currentUser.uid,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      })
      return docRef.id
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const updateListStatus = async (listId, status, resultFileUrl = null) => {
    try {
      const listRef = doc(db, 'enrichmentLists', listId)
      const updateData = {
        status,
        updatedAt: new Date()
      }
      
      if (resultFileUrl) {
        updateData.resultFileUrl = resultFileUrl
      }
      
      await updateDoc(listRef, updateData)
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const uploadResultFile = async (listId, file) => {
    try {
      const storageRef = ref(storage, `enrichment-results/${listId}/${file.name}`)
      await uploadBytes(storageRef, file)
      const downloadURL = await getDownloadURL(storageRef)
      
      await updateListStatus(listId, 'completed', downloadURL)
      return downloadURL
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const downloadResult = async (listId, fileUrl) => {
    try {
      const response = await fetch(fileUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `enrichment-result-${listId}.xlsx`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  return {
    lists,
    loading,
    error,
    addList,
    updateListStatus,
    uploadResultFile,
    downloadResult
  }
}

