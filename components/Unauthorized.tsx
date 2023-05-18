// import styles from '../styles/App.Module.scss';

import { useState } from "react";
import Login from "./forms/Login";
import Register from "./forms/Register";

export default function Unauthorized() {
  const [activeForm, setActiveForm] = useState('login')
  return (
    <div className={'auth-container ' + activeForm}>
      <Login setActiveForm={setActiveForm  } />
      <Register setActiveForm={ setActiveForm } />
    </div>
  )
}
