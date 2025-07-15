import { useState, useEffect } from 'react'
import { 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy,
  onSnapshot 
} from 'firebase/firestore'
import { db } from '../lib/firebase'

export function useCampaigns() {
  const [campaigns, setCampaigns] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const campaignsCollection = collection(db, 'campaigns')

  useEffect(() => {
    const q = query(campaignsCollection, orderBy('createdAt', 'desc'))
    
    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const campaignsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        setCampaigns(campaignsData)
        setLoading(false)
      },
      (err) => {
        setError(err.message)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [])

  const addCampaign = async (campaignData) => {
    try {
      const docRef = await addDoc(campaignsCollection, {
        ...campaignData,
        createdAt: new Date(),
        updatedAt: new Date(),
        sent: 0,
        opened: 0,
        clicked: 0,
        status: 'draft'
      })
      return docRef.id
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const updateCampaign = async (campaignId, updates) => {
    try {
      const campaignRef = doc(db, 'campaigns', campaignId)
      await updateDoc(campaignRef, {
        ...updates,
        updatedAt: new Date()
      })
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const deleteCampaign = async (campaignId) => {
    try {
      await deleteDoc(doc(db, 'campaigns', campaignId))
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  return {
    campaigns,
    loading,
    error,
    addCampaign,
    updateCampaign,
    deleteCampaign
  }
}

