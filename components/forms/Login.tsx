import Link from 'next/link'
import React from 'react'

export default function Login({ setActiveForm }) {
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('x');
    }
  return (
    <div className="form-container login">
        <form onSubmit={e => handleSubmit(e)}>
            <h1>Sign in</h1>
            <input type="email" placeholder="Email" />
            <input type="password" placeholder="Password" />
            <Link href={'/forgotPassword'}>Forgot your password?</Link>
            <p>Dont have account? <span onClick={() => setActiveForm('register')}>Sign up</span></p>  
            <button>Sign In</button>
        </form>
    </div>
  )
}
