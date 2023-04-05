import axios from 'axios';
import React from 'react'
import { useForm } from 'react-hook-form';
import Context from '../../context/context';
import { PasswordResetRequest } from '../../types/types';

export default function Forgot() {

  const ctx = React.useContext(Context);

  const { register, handleSubmit, formState: { errors } } = useForm<PasswordResetRequest>();
  
  const onSubmit = (data:PasswordResetRequest) => {
    console.log(data)

    axios.post('/password/reset', data)
      .then(res => {
        ctx.setAlert(res.data, 'success', '/')
      })
      .catch(err => ctx.setAlert(err.response.data.error, 'error'));
    }
  return (
    <div className="generic-form">
      <div className="form-container">
        <form onSubmit={handleSubmit(onSubmit)}>
            <h1>Reset password</h1>
            <input type="text" placeholder="Email" {...register("email", {
              required: "Email field is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address"
              }
            })} />
            { errors.email && <span className='error'>{ errors.email.message }</span> }
            <button>Reset</button>
        </form>
      </div>
    </div>
  )
}
