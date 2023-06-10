import axios from 'axios';
import moment from 'moment';
import { useRouter } from 'next/router';
import React from 'react'
import { useForm } from 'react-hook-form';
import Context from '../../context/context';
import { getClaims, login, logout, refreshToken } from '../../helpers/helpers';
import { UpdateUserRequest } from '../../types/types';

export default function Reset() {

  const maxDate = moment();
    const minDate = moment().subtract(100, 'years');
    
    const router = useRouter()

  const ctx = React.useContext(Context);
  const claims = getClaims();

  const { register, handleSubmit, formState: { errors }, setValue } = useForm<UpdateUserRequest>();
  
  const onSubmit = (data:UpdateUserRequest) => {

    axios.post('/user/update', data)
      .then(async res => {
          ctx.setAlert(res.data.msg, 'success');
          await refreshToken();
          
      })
      .catch(err => ctx.setAlert(err.response.data.error, 'error'));
      
     
    
  }

  React.useEffect(() => {
    setValue('firstName', claims?.firstName);
    setValue('lastName', claims?.lastName);
    setValue('birthday', claims?.birthday);
    setValue('email', claims?.email);
  
    return () => {
      
    }
  }, [claims?.birthday, claims?.email, claims?.firstName, claims?.lastName, setValue])
  

  return (
    <div className="generic-form">
        <div className="form-container register">
            <form onSubmit={handleSubmit(onSubmit)}>
                <h1>Update Account</h1>
                <input type="text" placeholder="First name" {...register("firstName", {required: "First name field is required",})} />
                { errors.firstName && <span className='error'>{ errors.firstName.message }</span> }
                <input type="text" placeholder="Last name" {...register("lastName", {required: "Last name field is required",})} />
                { errors.lastName && <span className='error'>{ errors.lastName.message }</span> }
                <span>Date of birth</span>
                <input type="date" min={minDate.format("YYYY-MM-DD")} max={maxDate.format("YYYY-MM-DD")} {...register("birthday", {required: "Birthday field is required",})} />
                { errors.birthday && <span className='error'>{ errors.birthday.message }</span> }
                <input type="text" placeholder="Email" {...register("email", {
                    required: "Email field is required",
                    pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address"
                    }
                })} />
                { errors.email && <span className='error'>{ errors.email.message }</span> }
                <button>Update</button>
            </form>
        </div>
    </div>
  )
}
