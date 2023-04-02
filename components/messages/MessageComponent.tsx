import { useForm } from "react-hook-form";
import React from 'react'
import ContentEditable from "react-contenteditable"
import DefaultPrefixImage from "../DefaultPrefixImage";
import Link from "next/link";
import Context from "../../context/context";
import { getClaims, validateMessage } from "../../helpers/helpers";
import axios from "axios";
import MessageItemLoader from "../loaders/MessageItemLoader";

export default function MessageComponent({ messageThread, minimize, close }) {
  
  const ctx = React.useContext(Context)
  const emojies = ctx.emojiList;
  const claims = getClaims();

  const notifications = ctx.messageNotifications;
  const setNotifications = ctx.setMessageNotifications;

  const refBody = React.useRef();

  const [openEmoji, setOpenEmoji] = React.useState(false);
  const [messages, setMessages] = React.useState([]);
  const [nextPage, setNextPage] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(true);
  
  const [newMessage, setNewMessage] = React.useState({
    to: messageThread.id,
    body: ''
  })

  const [edit, setEdit] = React.useState({})

  const handleChange = e => {
    setNewMessage({ ...newMessage, body: e.target.value })
  }

  const handleChangeEdit = e => {
    setEdit({ ...edit, body: e.target.value })
  }

  const setBody = (body) => {
    if (Object.keys(edit).length) {

      if (edit.body === null) {
        setEdit({ ...edit, body: body });
      }
      else {
        var newValue = edit.body + body;
        console.log(1, edit.body, newValue)
        setEdit({ ...edit, body: newValue });
      }

    } else {

      if (newMessage.body === null) {
        setNewMessage({ ...newMessage, body: body });
      }
      else {
        var newValue = newMessage.body + body;
        console.log(1, newMessage.body, newValue)
        setNewMessage({ ...newMessage, body: newValue });
      }

    }
   
  }

  const openEdit = (item) => {
    setEdit({
      id: item.id,
      body: item.body
    })
  }

  const reset = () => {
    
    if (Object.keys(edit).length) {
      setEdit({});
    } else {
      setNewMessage({...newMessage, body: ''})
    }
  }

  const updateNotifications = (data: string, id = null) => {
    // handle update
    if (id != null) {
      let curr = [...notifications];
      let index = curr.findIndex(obj => obj.messageId === id);

      if (index >= 0) {
        let currObj = curr[index];

        currObj.body = data;
        setNotifications(curr);
      }

    } else {
      //handle insert
      let curr = [...notifications];
      let index = curr.findIndex(obj => obj.id === messageThread.id);
      let currObj = curr[index];

      currObj.body = data;
      setNotifications(curr);
    }
  }

  const handleSubmit = () => {
    if (Object.keys(edit).length) {
      validateMessage(edit.body)
        .then(() => {
          axios.post('/message/update', edit)
            .then(res => {
              ctx.setAlert(res.data.msg, 'success');
              let body = res.data.data.body;
              let id = res.data.data.id;

              let curr = [...messages];
              let index = curr.findIndex(obj => obj.id === id);
        
              if (index >= 0) {
                let currObj = curr[index];
        
                currObj.body = body;
                setNotifications(curr);
              }

              updateNotifications(res.data.data.body, res.data.data.id);
              reset();
            })
            .catch(err => {
              ctx.setAlert(err.response.data.error, 'error')
            })
        })
        .catch(err => {
          ctx.setAlert(err, 'error');
      })
    } else {
      validateMessage(newMessage.body)
        .then(() => {
          axios.post('/message/create', newMessage)
            .then(res => {
              ctx.setAlert(res.data.msg, 'success');

              let body = res.data.data.body;

              let curr = [...messages];
              curr.push(res.data.data);

              setMessages(curr);
              updateNotifications(body);

              reset();
            })
            .catch(err => {
              ctx.setAlert(err.response.data.error, 'error')
            })
        })
        .catch(err => {
          ctx.setAlert(err, 'error');
       })
  
    }
  };

  React.useEffect(() => {
    
    const loadData = () => {
      console.log(nextPage);
      if (nextPage >= 0) {
        axios.get(`/message/show/${messageThread.id}?page=${nextPage}`)
          .then(res => {
            console.log('setting messages', res)
            setMessages(prevState => [...prevState, ...res.data.data]);
            setIsLoading(false);
  
            if (res.data.next_page_url === null) {
              setNextPage(-1);
            }
  
            let lastIndex = parseInt(res.data.next_page_url[res.data.next_page_url.length - 1], 10);
            console.log(lastIndex)
            setNextPage(lastIndex);
          })
          .catch(err => {
            
          })
      } else {
        refBody?.current?.removeEventListener('wheel', loadData);
      }
    }

    if (!messages.length) {
      console.log('re-render MESSAGE THREAD');
      loadData();
    }
    
    
    refBody?.current?.addEventListener('wheel', loadData);
  

    return () => {
      refBody?.current?.removeEventListener('wheel', loadData);
    }
  }, [messageThread.id, messages.length, nextPage])
  

  
  return (
    <div className="message-component">
      <div className="outline">
        <div className="header">
          <Link href={`/user/${messageThread.id}`}>
              <DefaultPrefixImage src={messageThread.profile} alt={`${messageThread.firstName} ${messageThread.lastName}`}/>
              <div>{messageThread.firstName} {messageThread.lastName}</div>
          </Link>
          <div className="navigation">
            <i className="fa fa-window-minimize" aria-hidden="true" onClick={minimize}></i>
            <i className="fa fa-window-close" aria-hidden="true" onClick={close}></i>
          </div>  
        </div>
        <div className={ messageThread.isOpen ? "body active" : "body" }>
          <div ref={refBody} className="messages">
            {isLoading ? (
                <>
                  <MessageItemLoader />
                  <MessageItemLoader />
                  <MessageItemLoader />
                </>
              ): (
                <>
                  {messages.length ? (
                    messages.map((item, i) => (
                      <div key={i} className={item.from == claims?.id ? "bubble right" : "bubble"} dangerouslySetInnerHTML={{ __html: item.body }}>
                       
                      </div>
                    ))
                  ): null}
              </>
            )}
            
          </div>
          <form onSubmit={e => {
              e.preventDefault();
              handleSubmit();
            }}>
              <div className="form-inputs">
                {Object.keys(edit).length ? (
                  <ContentEditable
                    className="txt  hide-bar"
                    html={edit.body} // innerHTML of the editable div
                    disabled={false}       // use true to disable editing
                    onChange={handleChangeEdit} // handle innerHTML change
                  />
                ): (
                  <ContentEditable
                    className="txt  hide-bar"
                    html={newMessage.body} // innerHTML of the editable div
                    disabled={false}       // use true to disable editing
                    onChange={handleChange} // handle innerHTML change
                  />
                )}
                <div className="controlls">
                  <div className="emoji-holder">
                    <i onClick={e => setOpenEmoji(!openEmoji)} className="fas fa-smile-beam"></i>
                      <div className={ openEmoji ? 'dropdown active' : 'dropdown' }>
                      <div className="flex hide-bar">
                          {!!emojies && emojies.map((item, i) => (
                              <div className="emoji-item" key={i} dangerouslySetInnerHTML={{ __html: item.code }} onClick={() => setBody(item.code) }>
                              </div>
                          ))}
                      </div>
                    </div>
                  </div>
                    
                 <div className="btns">
                  <button className="btn">{Object.keys(edit).length ? 'Update' : 'Save'}</button>
                  {!!Object.keys(edit).length && (
                    <div className="btn" onClick={reset}>Cancel</div>
                  )}
                 </div>
                </div>
              </div>
          </form>    
        </div>
      </div>
    </div>
  )
}
