import axios from 'axios';
import Link from 'next/link'
import React from 'react'
import { useForm } from "react-hook-form";
import { getCookie } from 'cookies-next';

export default function Login({ setActiveForm }) {

  const { register, handleSubmit, formState: { errors } } = useForm();
  
  const onSubmit = data => {
    console.log(data)
    
    axios.get('http://localhost/sanctum/csrf-cookie')
      .then(res => {
        // console.log(res.config.setC);
        let csrf = getCookie('XSRF-TOKEN')
        console.log(csrf);
        axios.post('http://localhost/login', {
          // withCredentials: true,
          headers: {
            'ContentType': 'application/json',
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'X-XSRF-TOKEN': csrf
          }
        }).then(res =>  console.log('login called'))
        .catch(err => console.log(err))
      })
      .catch(err => {
        console.log("COOKIE")
        console.log(err);
      })
      // axios.post('/login', data)
      //   .then(res => console.log(res))
      //   .catch(err => console.log(err));
    }
  return (
    <div className="form-container login">
        <form onSubmit={handleSubmit(onSubmit)}>
            <h1>Sign in</h1>
            <input type="text" placeholder="Email" {...register("email", {
              required: "Email field is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address"
              }
            })} />
            { errors.email && <span className='error'>{ errors.email.message }</span> }
            <input type="password" placeholder="Password" {...register("password", {required: "Password field is required",})}/>
            { errors.password && <span className='error'>{ errors.password.message }</span> }
            <Link href={'/forgotPassword'}>Forgot your password?</Link>
            <p>Dont have account? <span onClick={() => setActiveForm('register')}>Sign up</span></p>  
            <button>Sign In</button>
        </form>
    </div>
  )
}
