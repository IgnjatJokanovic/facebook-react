import axios from 'axios';
import { useRouter } from 'next/router';
import React from 'react'
import { useForm } from 'react-hook-form';
import Context from '../../context/context';
import { PasswordResetUpdateRequest } from '../../types/types';

export default function Reset() {

  const router = useRouter();
  const { token } = router.query;


  const ctx = React.useContext(Context);

  const { register, handleSubmit, formState: { errors } } = useForm<PasswordResetUpdateRequest>();
  
  const onSubmit = (data:PasswordResetUpdateRequest) => {
    console.log(data)
    data.token = token;

    axios.post('/password/change', data)
      .then(res => {
        ctx.setAlert(res.data, 'success', '/')
      })
      .catch(err => ctx.setAlert(err.response.data.error, 'error'));
  }

  React.useEffect(() => {
    if (!token) {
      return;
    }
  
    return () => {
      
    }
  }, [token])
  

  return (
    <div className="generic-form">
      <div className="form-container">
        <form onSubmit={handleSubmit(onSubmit)}>
            <h1>Reset password</h1>
            <input type="password" placeholder="New password" {...register("password", {required: "Password field is required",})} />
            { errors.password && <span className='error'>{ errors.password.message }</span> }
            <button>Reset</button>
        </form>
      </div>
    </div>
  )
}