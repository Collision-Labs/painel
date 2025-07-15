import { useState, useEffect } from 'react'
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where,
  orderBy,
  onSnapshot
} from 'firebase/firestore'
import { db } from '../lib/firebase'
import { useAuth } from '../contexts/AuthContext'

export function useCRM() {
  const [deals, setDeals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { currentUser } = useAuth()

  const dealsCollection = collection(db, 'deals')

  useEffect(() => {
    if (!currentUser) return

    const q = query(
      dealsCollection,
      where('userId', '==', currentUser.uid),
      orderBy('createdAt', 'desc')
    )

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const dealsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        setDeals(dealsData)
        setLoading(false)
      },
      (err) => {
        setError(err.message)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [currentUser])

  const addDeal = async (dealData) => {
    try {
      const docRef = await addDoc(dealsCollection, {
        ...dealData,
        userId: currentUser.uid,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      return docRef.id
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const updateDeal = async (dealId, dealData) => {
    try {
      const dealRef = doc(db, 'deals', dealId)
      await updateDoc(dealRef, {
        ...dealData,
        updatedAt: new Date()
      })
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const deleteDeal = async (dealId) => {
    try {
      const dealRef = doc(db, 'deals', dealId)
      await deleteDoc(dealRef)
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const moveDeal = async (dealId, newStage) => {
    try {
      const dealRef = doc(db, 'deals', dealId)
      await updateDoc(dealRef, {
        stage: newStage,
        updatedAt: new Date(),
        ...(newStage === 'won' && { closedAt: new Date() }),
        ...(newStage === 'lost' && { closedAt: new Date() })
      })
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const createDealFromLead = async (leadData) => {
    try {
      const dealData = {
        company: leadData.company || leadData.name,
        contactName: leadData.name || leadData.contactName,
        contactEmail: leadData.email,
        contactPhone: leadData.phone || leadData.telefone,
        value: 0,
        expectedCloseDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 dias
        stage: 'proposal_sent',
        notes: `Lead importado automaticamente. Origem: ${leadData.source || 'Enriquecimento'}`,
        leadId: leadData.id,
        userId: currentUser.uid,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
      const docRef = await addDoc(dealsCollection, dealData)
      return docRef.id
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  return {
    deals,
    loading,
    error,
    addDeal,
    updateDeal,
    deleteDeal,
    moveDeal,
    createDealFromLead
  }
}

