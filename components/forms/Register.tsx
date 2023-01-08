import moment from 'moment'
import axios from 'axios';
import React from 'react';

import { useForm } from "react-hook-form";
import Context from '../../context/context';

type RegisterRequest = {
    name: string;
    surname: string;
    birthday: string;
    email: string;
    password: string;
  }

export default function Register({ setActiveForm }) {

    const ctx = React.useContext(Context);
    
    const maxDate = moment();
    const minDate = moment().subtract(100, 'years');

    const { register, handleSubmit, formState: { errors } } = useForm<RegisterRequest>();

    const onSubmit = (data:RegisterRequest) => {
        axios.post('/user/create', data)
            .then(res => {
                ctx.setAlert(res.data, 'success')
            }).catch(err => {
                ctx.setAlert(err.response.data.error, 'error');
            });
    }
  return (
        <div className="form-container register">
            <form onSubmit={handleSubmit(onSubmit)}>
                <h1>Create Account</h1>
                <p>Already have account? <span onClick={() => setActiveForm("login")}>Login</span></p>
                <input type="text" placeholder="First name" {...register("name", {required: "First name field is required",})} />
                { errors.name && <span className='error'>{ errors.name.message }</span> }
                <input type="text" placeholder="Last name" {...register("surname", {required: "Last name field is required",})} />
                { errors.surname && <span className='error'>{ errors.surname.message }</span> }
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
                <input type="password" placeholder="Password" {...register("password", {required: "Password field is required",})} />
                { errors.password && <span className='error'>{ errors.password.message }</span> }
                <button>Sign Up</button>
            </form>
        </div>
  )
}
