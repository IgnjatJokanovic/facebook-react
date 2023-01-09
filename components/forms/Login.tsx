import axios from 'axios';
import Link from 'next/link'
import React from 'react'
import { useForm } from "react-hook-form";
import Context from '../../context/context';
import { login } from '../../helpers/helpers';
import { useRouter } from 'next/router';

type LoginRequest = {
  email: string;
  password: string;
}

export default function Login({ setActiveForm }) {

  const router = useRouter();

  const ctx = React.useContext(Context);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginRequest>();
  
  const onSubmit = (data:LoginRequest) => {
    console.log(data)

    axios.post('/auth/login', data )
      .then(res => {
        login(res.data.token);
        router.push("/");
      })
      .catch(err => ctx.setAlert(err.response.data.error, 'error'));
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
            <span>Dont have account? <span onClick={() => setActiveForm('register')}>Sign up</span></span>  
            <button>Sign In</button>
        </form>
    </div>
  )
}
