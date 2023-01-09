import { useForm } from "react-hook-form";
import React from 'react'
import ContentEditable from "react-contenteditable"

export default function MessageComponent() {
  const [isOpen, setIsOpen] = React.useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      message: ''
    }
  });
  const onSubmit = data => console.log(data);
  const minimize = () => {

  }
  return (
    <div className="message-component">
      <div className="outline">
        <div className="header">
              <div className="user">
                  <img src="https://dummyimage.com/300.png/09f/fff" alt="" />
                  <div>Ignjat Jokanovic</div>
              </div>
          <div className="navigation">
            <i className="fa fa-window-minimize" aria-hidden="true" onClick={() => setIsOpen(!isOpen)}></i>
            <i className="fa fa-window-close" aria-hidden="true"></i>
          </div>  
          </div>
        <div className={ isOpen ? "body active" : "body" }>
            <div className="messages">
              <div className="bubble">
                    Test
                </div>
                <div className="bubble">
                    Test
                </div>
                <div className="bubble">
                    Test
                </div>
                <div className="bubble">
                    Test
                </div>
                <div className="bubble">
                    Test
                </div>
                <div className="bubble">
                    Test
                </div>
                <div className="bubble">
                    Test
                </div>
                <div className="bubble right">
                    Test
                </div>
              
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-inputs">
                  <div className="message-input" contentEditable={true}></div>
                  <div className="controlls">
                    <i className="fas fa-smile"></i>
                    <button>Send</button>
                  </div>
                  
                </div>
              
                {errors.message && <span className="error">Message field is required</span> }
              </form>
              
          </div>
       </div>
    </div>
  )
}
