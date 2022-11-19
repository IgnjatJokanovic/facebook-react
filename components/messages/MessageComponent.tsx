import { useForm } from "react-hook-form";

export default function MessageComponent() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      message: ''
    }
  });
  const onSubmit = data => console.log(data);
  return (
    <div className="message-component">
        <div className="header">
            <div className="user">
                <img src="https://dummyimage.com/300.png/09f/fff" alt="" />
                <p>Ignjat Jokanovic</p>
            </div>
        <div className="navigation">
          <i className="fa fa-window-minimize" aria-hidden="true"></i>
          <i className="fa fa-window-close" aria-hidden="true"></i>
        </div>  
        </div>
        <div className="body">
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
                <textarea placeholder="Write message" rows="2"></textarea>
                <div className="controlls">
                  <i className="fas fa-smile"></i>
                  <button>Send</button>
                </div>
                
              </div>
             
              {errors.message && <span className="error">Message field is required</span> }
            </form>
            
        </div>
    </div>
  )
}
