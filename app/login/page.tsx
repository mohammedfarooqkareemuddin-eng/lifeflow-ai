'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
      const [loading, setLoading] = useState(false)
        const [isSignUp, setIsSignUp] = useState(false)
          const [message, setMessage] = useState('')
            const router = useRouter()
              const supabase = createClient()

                const handleAuth = async (e: React.FormEvent) => {
                    e.preventDefault()
                        setLoading(true)
                            setMessage('')

                                let error;
                                    if (isSignUp) {
                                          const { error: signUpError } = await supabase.auth.signUp({ email, password })
                                                error = signUpError
                                                      if (!error) setMessage('Check your email for the confirmation link!')
                                                          } else {
                                                                const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
                                                                      error = signInError
                                                                            if (!error) router.push('/dashboard')
                                                                                }

                                                                                    if (error) setMessage(error.message)
                                                                                        setLoading(false)
                                                                                          }

                                                                                            return (
                                                                                                <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px' }}>
                                                                                                      <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>{isSignUp ? 'Sign Up' : 'Log In'}</h1>
                                                                                                            <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
                                                                                                                    <input 
                                                                                                                              type="email" 
                                                                                                                                        placeholder="Email" 
                                                                                                                                                  value={email} 
                                                                                                                                                            onChange={(e) => setEmail(e.target.value)} 
                                                                                                                                                                      required
                                                                                                                                                                                style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}
                                                                                                                                                                                        />
                                                                                                                                                                                                <input 
                                                                                                                                                                                                          type="password" 
                                                                                                                                                                                                                    placeholder="Password" 
                                                                                                                                                                                                                              value={password} 
                                                                                                                                                                                                                                        onChange={(e) => setPassword(e.target.value)} 
                                                                                                                                                                                                                                                  required
                                                                                                                                                                                                                                                            style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}
                                                                                                                                                                                                                                                                    />
                                                                                                                                                                                                                                                                            <button type="submit" disabled={loading} style={{ padding: '10px', background: '#000', color: '#fff', borderRadius: '5px', cursor: 'pointer' }}>
                                                                                                                                                                                                                                                                                      {loading ? 'Loading...' : (isSignUp ? 'Sign Up' : 'Log In')}
                                                                                                                                                                                                                                                                                              </button>
                                                                                                                                                                                                                                                                                                    </form>
                                                                                                                                                                                                                                                                                                          {message && <p style={{ marginTop: '10px', color: 'red' }}>{message}</p>}
                                                                                                                                                                                                                                                                                                                <button onClick={() => setIsSignUp(!isSignUp)} style={{ marginTop: '15px', background: 'none', border: 'none', color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}>
                                                                                                                                                                                                                                                                                                                        {isSignUp ? 'Already have an account? Log In' : "Don't have an account? Sign Up"}
                                                                                                                                                                                                                                                                                                                              </button>
                                                                                                                                                                                                                                                                                                                                  </div>
                                                                                                                                                                                                                                                                                                                                    )
                                                                                                                                                                                                                                                                                                                                    }