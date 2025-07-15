import { useState, useEffect } from 'react'
import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  query, 
  orderBy,
  onSnapshot,
  runTransaction,
  where
} from 'firebase/firestore'
import { db } from '../lib/firebase'
import { useAuth } from '../contexts/AuthContext'

export function useCredits() {
  const [users, setUsers] = useState([])
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { currentUser } = useAuth()

  const usersCollection = collection(db, 'users')
  const transactionsCollection = collection(db, 'creditTransactions')

  useEffect(() => {
    if (!currentUser) return

    // Buscar usuários
    const usersQuery = query(usersCollection, orderBy('name'))
    const unsubscribeUsers = onSnapshot(usersQuery, 
      (snapshot) => {
        const usersData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        setUsers(usersData)
      },
      (err) => setError(err.message)
    )

    // Buscar transações
    const transactionsQuery = query(transactionsCollection, orderBy('createdAt', 'desc'))
    const unsubscribeTransactions = onSnapshot(transactionsQuery,
      (snapshot) => {
        const transactionsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        setTransactions(transactionsData)
        setLoading(false)
      },
      (err) => {
        setError(err.message)
        setLoading(false)
      }
    )

    return () => {
      unsubscribeUsers()
      unsubscribeTransactions()
    }
  }, [currentUser])

  const addCredits = async ({ userId, amount, reason }) => {
    try {
      await runTransaction(db, async (transaction) => {
        const userRef = doc(db, 'users', userId)
        const userDoc = await transaction.get(userRef)
        
        if (!userDoc.exists()) {
          throw new Error('Usuário não encontrado')
        }
        
        const currentCredits = userDoc.data().credits || 0
        const newBalance = currentCredits + amount
        
        // Atualizar créditos do usuário
        transaction.update(userRef, { 
          credits: newBalance,
          updatedAt: new Date()
        })
        
        // Criar registro de transação
        const transactionRef = doc(transactionsCollection)
        transaction.set(transactionRef, {
          userId,
          userName: userDoc.data().name,
          userEmail: userDoc.data().email,
          amount,
          reason,
          balanceAfter: newBalance,
          adminId: currentUser.uid,
          createdAt: new Date()
        })
      })
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const deductCredits = async (userId, amount, reason) => {
    try {
      await runTransaction(db, async (transaction) => {
        const userRef = doc(db, 'users', userId)
        const userDoc = await transaction.get(userRef)
        
        if (!userDoc.exists()) {
          throw new Error('Usuário não encontrado')
        }
        
        const currentCredits = userDoc.data().credits || 0
        
        if (currentCredits < amount) {
          throw new Error('Créditos insuficientes')
        }
        
        const newBalance = currentCredits - amount
        
        // Atualizar créditos do usuário
        transaction.update(userRef, { 
          credits: newBalance,
          updatedAt: new Date()
        })
        
        // Criar registro de transação
        const transactionRef = doc(transactionsCollection)
        transaction.set(transactionRef, {
          userId,
          userName: userDoc.data().name,
          userEmail: userDoc.data().email,
          amount: -amount, // Negativo para indicar dedução
          reason,
          balanceAfter: newBalance,
          createdAt: new Date()
        })
      })
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const getUserTransactions = (userId) => {
    return transactions.filter(t => t.userId === userId)
  }

  const checkUserCredits = async (userId) => {
    const user = users.find(u => u.id === userId)
    return user?.credits || 0
  }

  return {
    users,
    transactions,
    loading,
    error,
    addCredits,
    deductCredits,
    getUserTransactions,
    checkUserCredits
  }
}

