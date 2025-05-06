'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation' // <-- Important

export default function LoginPage() {
  const router = useRouter() //
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async e => {
    e.preventDefault()

    const res = await signIn('credentials', {
      email,
      password,
      redirect: false
      //   callbackUrl: '/admin'  // After login, go to /admin
    })

    console.log(res)

    if (res?.error !== null) {
      setError('Invalid email or password')
    } else {
      router.push('/admin/inventory') // <-- Manual redirect after successful login
    }
  }

  return (
    <div className='flex flex-col items-center justify-center min-h-screen p-4'>
      <h1 className='text-2xl font-bold mb-6'>Login</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4 w-full max-w-sm'>
        <input
          type='email'
          placeholder='Email'
          value={email}
          onChange={e => setEmail(e.target.value)}
          className='border p-2 rounded'
        />
        <input
          type='password'
          placeholder='Password'
          value={password}
          onChange={e => setPassword(e.target.value)}
          className='border p-2 rounded'
        />
        {error && <p className='text-red-500 text-sm'>{error}</p>}
        <button type='submit' className='bg-blue-500 text-white p-2 rounded'>
          Login
        </button>
      </form>
    </div>
  )
}
