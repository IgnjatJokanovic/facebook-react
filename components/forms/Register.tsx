import moment from 'moment'

export default function Register({ setActiveForm }) {
    
    const maxDate = moment();
    const minDate = moment().subtract(100, 'years');

    const handleSubmit = data => {
        console.log(data)
    }
  return (
        <div className="form-container register">
            <form onSubmit={e => handleSubmit(e)}>
                <h1>Create Account</h1>
                <p>Already have account? <span onClick={() => setActiveForm("login")}>Login</span></p>
                <input type="text" placeholder="First name" />
                <input type="text" placeholder="Last name" />
                <span>Date of birth</span>
                <input type="date" min={ minDate.format("YYYY-MM-DD") } max={ maxDate.format("YYYY-MM-DD") } />
                <input type="email" placeholder="Email" />
                <input type="password" placeholder="Password" />
                <button>Sign Up</button>
            </form>
        </div>
  )
}
