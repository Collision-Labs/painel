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

export function useLeads() {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const leadsCollection = collection(db, 'leads')

  // Carregar leads em tempo real
  useEffect(() => {
    const q = query(leadsCollection, orderBy('createdAt', 'desc'))
    
    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const leadsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        setLeads(leadsData)
        setLoading(false)
      },
      (err) => {
        setError(err.message)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [])

  // Adicionar novo lead
  const addLead = async (leadData) => {
    try {
      const docRef = await addDoc(leadsCollection, {
        ...leadData,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      return docRef.id
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  // Atualizar lead
  const updateLead = async (leadId, updates) => {
    try {
      const leadRef = doc(db, 'leads', leadId)
      await updateDoc(leadRef, {
        ...updates,
        updatedAt: new Date()
      })
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  // Deletar lead
  const deleteLead = async (leadId) => {
    try {
      await deleteDoc(doc(db, 'leads', leadId))
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  return {
    leads,
    loading,
    error,
    addLead,
    updateLead,
    deleteLead
  }
}

