import { useState, useEffect } from 'react'

interface Test {
  id: string
  title: string
  description: string
  category: string
  type: string
  questionsCount: number
  estimatedDuration: number
  available: boolean
  icon: string
}

interface ApiResponse {
  success: boolean
  data: Test[]
  timestamp: string
  error?: string
}

interface UseTestsReturn {
  tests: Test[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useTests(): UseTestsReturn {
  const [tests, setTests] = useState<Test[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTests = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/tests?limit=999', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result: ApiResponse = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch tests')
      }

      setTests(result.data)
      
      // Log para monitoramento
      console.log('[useTests] Tests loaded successfully:', result.data.length)
      result.data.forEach(test => {
        console.log(`[useTests] ${test.title}: ${test.questionsCount} questions`)
      })
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(errorMessage)
      console.error('[useTests] Error fetching tests:', err)
      
      // Fallback para dados mockados em caso de erro
      console.warn('[useTests] Using fallback mock data due to API error')
      setTests([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTests()
  }, [])

  return {
    tests,
    loading,
    error,
    refetch: fetchTests
  }
}

// Hook para obter um teste específico
export function useTest(testId: string) {
  const [test, setTest] = useState<Test | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!testId) {
      setLoading(false)
      return
    }

    const fetchTest = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch('/api/tests', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ testId })
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const result = await response.json()
        
        if (!result.success) {
          throw new Error(result.error || 'Failed to fetch test')
        }

        setTest(result.data)
        console.log(`[useTest] Test loaded: ${result.data.title} - ${result.data.questionsCount} questions`)
        
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
        setError(errorMessage)
        console.error('[useTest] Error fetching test:', err)
        setTest(null)
      } finally {
        setLoading(false)
      }
    }

    fetchTest()
  }, [testId])

  return { test, loading, error }
}