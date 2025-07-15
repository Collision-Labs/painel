import { useState, useEffect } from 'react'
import { 
  collection, 
  addDoc, 
  query, 
  where,
  orderBy,
  onSnapshot
} from 'firebase/firestore'
import { db } from '../lib/firebase'
import { useAuth } from '../contexts/AuthContext'
import { useCRM } from './useCRM'
import { useCredits } from './useCredits'

export function useImportExcel() {
  const [importHistory, setImportHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { currentUser } = useAuth()
  const { createDealFromLead } = useCRM()
  const { deductCredits, checkUserCredits } = useCredits()

  const importsCollection = collection(db, 'imports')

  useEffect(() => {
    if (!currentUser) return

    const q = query(
      importsCollection,
      where('userId', '==', currentUser.uid),
      orderBy('createdAt', 'desc')
    )

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const importsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        setImportHistory(importsData)
        setLoading(false)
      },
      (err) => {
        setError(err.message)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [currentUser])

  const parseExcelFile = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      
      reader.onload = (e) => {
        try {
          const data = e.target.result
          
          if (file.name.endsWith('.csv')) {
            // Parse CSV
            const lines = data.split('\n')
            const headers = lines[0].split(',').map(h => h.trim().toLowerCase())
            
            const rows = lines.slice(1)
              .filter(line => line.trim())
              .map(line => {
                const values = line.split(',')
                const row = {}
                headers.forEach((header, index) => {
                  row[header] = values[index]?.trim() || ''
                })
                return row
              })
            
            resolve(rows)
          } else {
            // Para Excel, seria necessário usar uma biblioteca como xlsx
            // Por simplicidade, vamos assumir que o usuário converte para CSV
            reject(new Error('Por favor, converta o arquivo Excel para CSV'))
          }
        } catch (error) {
          reject(error)
        }
      }
      
      reader.onerror = () => reject(new Error('Erro ao ler arquivo'))
      
      if (file.name.endsWith('.csv')) {
        reader.readAsText(file)
      } else {
        reader.readAsArrayBuffer(file)
      }
    })
  }

  const importLeadsToCRM = async (leadsData, onProgress) => {
    try {
      // Verificar créditos disponíveis
      const userCredits = await checkUserCredits(currentUser.uid)
      const requiredCredits = leadsData.length
      
      if (userCredits < requiredCredits) {
        throw new Error(`Créditos insuficientes. Necessário: ${requiredCredits}, Disponível: ${userCredits}`)
      }

      // Criar registro de importação
      const importRecord = await addDoc(importsCollection, {
        userId: currentUser.uid,
        fileName: 'leads_importados.csv',
        totalRecords: leadsData.length,
        status: 'processing',
        createdAt: new Date()
      })

      let successCount = 0
      let errorCount = 0
      const errors = []

      // Processar cada lead
      for (let i = 0; i < leadsData.length; i++) {
        const leadData = leadsData[i]
        
        try {
          // Normalizar dados do lead
          const normalizedLead = {
            company: leadData.empresa || leadData.company || 'Empresa não informada',
            name: leadData.contato || leadData.name || 'Contato não informado',
            email: leadData.email || '',
            phone: leadData.telefone || leadData.phone || '',
            cnpj: leadData.cnpj || '',
            source: 'Importação Excel',
            userId: currentUser.uid
          }

          // Criar negócio no CRM
          await createDealFromLead(normalizedLead)
          
          // Deduzir 1 crédito
          await deductCredits(
            currentUser.uid, 
            1, 
            `Importação de lead: ${normalizedLead.company}`
          )
          
          successCount++
        } catch (error) {
          console.error(`Erro ao importar lead ${i + 1}:`, error)
          errorCount++
          errors.push({
            row: i + 1,
            data: leadData,
            error: error.message
          })
        }
        
        // Atualizar progresso
        const progress = ((i + 1) / leadsData.length) * 100
        onProgress(progress)
      }

      // Atualizar registro de importação
      await updateDoc(doc(db, 'imports', importRecord.id), {
        status: 'completed',
        successCount,
        errorCount,
        errors: errors.slice(0, 10), // Salvar apenas os primeiros 10 erros
        completedAt: new Date()
      })

      return {
        successCount,
        errorCount,
        errors
      }
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const validateLeadData = (leadData) => {
    const errors = []
    
    if (!leadData.empresa && !leadData.company) {
      errors.push('Nome da empresa é obrigatório')
    }
    
    if (!leadData.contato && !leadData.name) {
      errors.push('Nome do contato é obrigatório')
    }
    
    if (leadData.email && !isValidEmail(leadData.email)) {
      errors.push('Email inválido')
    }
    
    return errors
  }

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  return {
    importHistory,
    loading,
    error,
    parseExcelFile,
    importLeadsToCRM,
    validateLeadData
  }
}

