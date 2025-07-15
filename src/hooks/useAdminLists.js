import { useState, useEffect } from 'react'
import { 
  collection, 
  updateDoc, 
  doc, 
  query, 
  orderBy,
  onSnapshot,
  getDoc
} from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage } from '../lib/firebase'

export function useAdminLists() {
  const [lists, setLists] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const listsCollection = collection(db, 'enrichmentLists')

  useEffect(() => {
    const q = query(listsCollection, orderBy('createdAt', 'desc'))
    
    const unsubscribe = onSnapshot(q, 
      async (snapshot) => {
        const listsData = await Promise.all(
          snapshot.docs.map(async (docSnapshot) => {
            const data = docSnapshot.data()
            
            // Buscar nome do usuário
            let userName = 'N/A'
            if (data.userId) {
              try {
                const userDoc = await getDoc(doc(db, 'users', data.userId))
                if (userDoc.exists()) {
                  userName = userDoc.data().name
                }
              } catch (err) {
                console.error('Erro ao buscar usuário:', err)
              }
            }
            
            return {
              id: docSnapshot.id,
              ...data,
              userName
            }
          })
        )
        
        setLists(listsData)
        setLoading(false)
      },
      (err) => {
        setError(err.message)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [])

  const updateStatus = async (listId, status, notes = '') => {
    try {
      const listRef = doc(db, 'enrichmentLists', listId)
      await updateDoc(listRef, {
        status,
        notes,
        updatedAt: new Date()
      })
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const uploadResult = async (listId, file, notes = '') => {
    try {
      const storageRef = ref(storage, `enrichment-results/${listId}/${file.name}`)
      await uploadBytes(storageRef, file)
      const downloadURL = await getDownloadURL(storageRef)
      
      const listRef = doc(db, 'enrichmentLists', listId)
      await updateDoc(listRef, {
        status: 'completed',
        resultFileUrl: downloadURL,
        resultFileName: file.name,
        notes,
        completedAt: new Date(),
        updatedAt: new Date()
      })
      
      return downloadURL
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  return {
    lists,
    loading,
    error,
    updateStatus,
    uploadResult
  }
}

