import { createContext, useContext, useEffect, useState } from 'react'
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged
} from 'firebase/auth'
import { 
  doc, 
  setDoc, 
  getDoc, 
  onSnapshot 
} from 'firebase/firestore'
import { auth, db } from '../lib/firebase'

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  async function signup(email, password, name) {
    const { user } = await createUserWithEmailAndPassword(auth, email, password)
    
    // Criar perfil do usuário no Firestore
    await setDoc(doc(db, 'users', user.uid), {
      name,
      email,
      role: 'client', // Role padrão
      credits: 0, // Créditos iniciais
      createdAt: new Date(),
      updatedAt: new Date()
    })
    
    return user
  }

  async function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password)
  }

  async function logout() {
    return signOut(auth)
  }

  async function resetPassword(email) {
    return sendPasswordResetEmail(auth, email)
  }

  async function updateUserProfile(updates) {
    if (!currentUser) return
    
    const userRef = doc(db, 'users', currentUser.uid)
    await setDoc(userRef, {
      ...updates,
      updatedAt: new Date()
    }, { merge: true })
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user)
      
      if (user) {
        // Buscar perfil do usuário
        const userRef = doc(db, 'users', user.uid)
        
        // Escutar mudanças no perfil em tempo real
        const unsubscribeProfile = onSnapshot(userRef, (doc) => {
          if (doc.exists()) {
            setUserProfile({ id: doc.id, ...doc.data() })
          } else {
            // Se não existe perfil, criar um básico
            setDoc(userRef, {
              name: user.displayName || user.email.split('@')[0],
              email: user.email,
              role: 'client',
              credits: 0,
              createdAt: new Date(),
              updatedAt: new Date()
            })
          }
        })
        
        setLoading(false)
        return () => unsubscribeProfile()
      } else {
        setUserProfile(null)
        setLoading(false)
      }
    })

    return unsubscribe
  }, [])

  const value = {
    currentUser,
    userProfile,
    signup,
    login,
    logout,
    resetPassword,
    updateUserProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

