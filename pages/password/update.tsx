import axios from 'axios';
import React from 'react'
import { useForm } from 'react-hook-form';
import Context from '../../context/context';
import { UpdatePasswordRequest } from '../../types/types';

export default function Update() {

  const ctx = React.useContext(Context);

  const { register, handleSubmit, formState: { errors } } = useForm<UpdatePasswordRequest>();
  
  const onSubmit = (data:UpdatePasswordRequest) => {
    console.log(data)

    axios.post('/password/update', data)
      .then(res => {
        ctx.setAlert(res.data, 'success', '/')
      })
      .catch(err => ctx.setAlert(err.response.data.error, 'error'));
    }
  return (
    <div className="generic-form">
      <div className="form-container">
        <form onSubmit={handleSubmit(onSubmit)}>
            <h1>Change password</h1>
            <input type="password" placeholder="New password" {...register("password", {required: "Password field is required",})} />
            { errors.password && <span className='error'>{ errors.password.message }</span> }
            <button>Update</button>
        </form>
      </div>
    </div>
  )
}
