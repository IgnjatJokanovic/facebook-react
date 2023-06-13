import { useForm } from "react-hook-form";
import React from 'react'
import ContentEditable from "react-contenteditable"
import DefaultPrefixImage from "../DefaultPrefixImage";
import Link from "next/link";
import Context from "../../context/context";
import { getClaims, validateMessage } from "../../helpers/helpers";
import axios from "axios";
import MessageItemLoader from "../loaders/MessageItemLoader";
import { useSocket } from "../../helpers/broadcasting";
import { ChannelList } from "../../helpers/channels";
import MessageItem from "./MessageItem";
import { MessageDto, MessageNotification } from "../../types/types";

export default function MessageComponent({ messageThread, markAsRead, handleAddMessage,  handleUpdateMessage, handleDeleteMessage, handleAfterload, minimize, close }) {
  
  const ctx = React.useContext(Context)
  const emojies = ctx.emojiList;
  const claims = getClaims();
  const activeMessages = ctx.activeMessages;
  const setActiveMessages = ctx.setActiveMessages;

  const prevMessagesLengthRef = React.useRef(messageThread.messages.length);

  

  const notifications  = ctx.messageNotifications;
  const setNotifications = ctx.setMessageNotifications;

  const refArray = React.useRef([])


   // Function to create a new ref
   const createRef = () => {
    const newRef = React.useRef();
    refArray.current.push(newRef);
    return newRef;
  };

  const refBody = createRef();

  const ref = createRef();

  const [openEmoji, setOpenEmoji] = React.useState(false);

  const [edit, setEdit] = React.useState({})

  const getNewMessageObj = () => {
    let curr = [...activeMessages];
    let index = curr.findIndex(obj => obj.id == messageThread.id)

    if (index > -1) {
      return curr[index].newMessage;
    }
  }

  const updateNewMessageState = (val) => {
    let curr = [...activeMessages];
    let index = curr.findIndex(obj => obj.id == messageThread.id)

    if (index > -1) {
      curr[index].newMessage.body = val;
      setActiveMessages(curr);
    }
  }

  const handleChange = e => {
    updateNewMessageState(e.target.value);
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
        setEdit({ ...edit, body: newValue });
      }

    } else {

      if (messageThread.newMessage.body === null) {
        updateNewMessageState(body)
      }
      else {
        var newValue = messageThread.newMessage.body + body;
        updateNewMessageState(newValue)
      }

    }
   
  }

  const openEdit = (item) => {
    setEdit({
      id: item.id,
      body: item.body
    })
  }

  const handleMessageDelete = (id) => {
    let curr = [...notifications];
    let index = curr.findIndex(obj => obj.messageId == id);

    axios.post('/message/delete', { id: id })
    .then(res => {
      ctx.setAlert(res.data.msg, 'success')
      if (index >= 0) {
        if (res.data.data != null) {
            curr[index] = res.data.data;
        } else {
          curr.splice(index, 1);
        }
       
        setNotifications(curr);
      }
      reset();
      handleDeleteMessage(messageThread.id, id);
    })
    .catch(err => {
      ctx.setAlert(err.response.data.error, 'error')
    })

    
  }

  const reset = () => {
    
    if (Object.keys(edit).length) {
      setEdit({});
    } else {
      updateNewMessageState('')
    }
  }

  const updateNotifications = (data, isUpdate = false) => {
    let curr = [...notifications];

    if (isUpdate) {
      
      let index = curr.findIndex(obj => obj.messageId == data.id);

      if (index >= 0) {
        curr[index].body = data.body;
      }

    } else {
      let index = curr.findIndex(obj => obj.id == messageThread.id);

      if (index >= 0) {
        curr[index].body = data.body;
        curr[index].messageId = data.id;
      } else {
        let newMsg: MessageNotification = {
            id: messageThread.id,
            firstName: messageThread.firstName,
            lastName: messageThread.lastName,
            profile: messageThread.profile,
            messageId: data.id,
            from: data.from,
            to: data.to,
            body: data.body,
            created_at: data.created_at,
            opened: true,
          }
        
        curr.unshift(newMsg);
      }

    }

    setNotifications(curr);
  }

  const handleSubmit = () => {
    if (Object.keys(edit).length) {
      validateMessage(edit.body)
        .then(() => {
          axios.post('/message/update', edit)
            .then(res => {
              ctx.setAlert(res.data.msg, 'success');
              let data = res.data.data;
              reset();

              handleUpdateMessage(messageThread.id, data)

              updateNotifications(data, true);

              
              
            })
            .catch(err => {
              ctx.setAlert(err.response.data.error, 'error')
            })
        })
        .catch(err => {
          ctx.setAlert(err, 'error');
      })
    } else {
      let msg = getNewMessageObj();
      validateMessage(msg.body)
        .then(() => {
          axios.post('/message/create', msg)
            .then(res => {
              ctx.setAlert(res.data.msg, 'success');

              let data = res.data.data;

              reset();
              handleAddMessage(messageThread.id, [data])
              updateNotifications(data);

              
            })
            .catch(err => {
              ctx.setAlert(err?.response?.data?.error, 'error')
            })
        })
        .catch(err => {
          ctx.setAlert(err, 'error');
       })
  
    }
  };

  const handleScroll = () => {
    refBody?.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
      passive: true
    });
  }

  React.useEffect(() => {
    if (prevMessagesLengthRef.current == 0 && messageThread.messages.length > 0) {
      handleScroll()
    }
    if (messageThread.messages.length == prevMessagesLengthRef.current + 1) {
      handleScroll();
    }

    prevMessagesLengthRef.current = messageThread.messages.length;
  }, [messageThread.messages.length]);

  React.useEffect(() => {


    const loadData = () => {
      if (!messageThread.isLoading || messageThread.nextPage == 0) {
        if (messageThread.nextPage >= 0) {
          axios.get(`/message/show/${messageThread.id}?page=${messageThread.nextPage}`)
            .then(res => {

              let data = res.data.data;
              let ids = [];

              data.forEach(obj => {
                if (obj.to == claims?.id && !obj.opened) {
                  obj.opened = true;
                  ids.push(obj.id);
                }
              });

              markAsRead(ids, messageThread.id, true);

              handleAddMessage(messageThread.id, data);

              let nextPage = messageThread.nextPage;
    
              if (res.data.next_page_url == null) {
                nextPage = -1;
              } else {
                nextPage = parseInt(res.data.next_page_url[res.data.next_page_url.length - 1], 10);
              }
              
              handleAfterload(messageThread.id, false, nextPage)
            })
            .catch(err => {
              
            })
        } else {
          refBody?.current?.removeEventListener('wheel', loadData);
        }
      }
    }

    if (messageThread.messages.length == 0) {
      loadData();
    }
    
    
    refBody?.current?.addEventListener('wheel', loadData);

    return () => {
      refBody?.current?.removeEventListener('wheel', loadData);
    }
  }, [claims?.id, handleAddMessage, handleAfterload, markAsRead, messageThread.id, messageThread.isLoading, messageThread.messages, messageThread.messages.length, messageThread.nextPage])
  
  

  // React.useEffect(() => {

   

  //   const observer = new IntersectionObserver(
  //     ([entry]) => {
  //       if (!entry.isIntersecting) {
  //         close(messageThread.id)
  //       }
  //     },
  //     {
  //       root: null,
  //       rootMargin: "0px",
  //       threshold: 1.0,
  //     }
  //   );

  //   observer.observe(ref?.current);

    
  

  //   return () => {
  //     if (ref?.current) {
  //       observer.unobserve(ref.current);
  //     }

      
  //   }
  // }, [activeMessages, close, messageThread.dontTriggerIntersect, messageThread.id, ref, setActiveMessages])

  

  
  return (
    <div ref={ref} className="message-component">
      <div className="outline">
        <div className="header">
          <Link href={`/user/${messageThread.id}`}>
              <DefaultPrefixImage src={messageThread.profile} alt={`${messageThread.firstName} ${messageThread.lastName}`}/>
              <div>{messageThread.firstName} {messageThread.lastName}</div>
          </Link>
          <div className="navigation">
            <i className="fa fa-window-minimize" aria-hidden="true" onClick={() => minimize(messageThread.id)}></i>
            <i className="fa fa-window-close" aria-hidden="true" onClick={() => close(messageThread.id)}></i>
          </div>  
        </div>
        <div className={ messageThread.isOpen ? "body active" : "body" }>
          <div ref={refBody} className="messages">
            {messageThread.isLoading && (
              <>
                <MessageItemLoader />
                <MessageItemLoader />
                <MessageItemLoader />
              </>
            )}
            {messageThread.messages.length ? (
              messageThread.messages.map((item, i) => (
                <MessageItem
                  key={i}
                  opened={item.opened}
                  owner={item.from == claims?.id}
                  created_at={item.created_at}
                  body={item.body}
                  deleteCallback={() => handleMessageDelete(item.id)}
                  editCallback={() => openEdit(item)}
                />
              ))
            ) : null}
          </div>
          <div>
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
                    html={messageThread.newMessage.body} // innerHTML of the editable div
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
                  <div className="btn" onClick={handleSubmit}>{Object.keys(edit).length ? 'Update' : 'Send'}</div>
                  {!!Object.keys(edit).length && (
                    <div className="btn" onClick={reset}>Cancel</div>
                  )}
                 </div>
                </div>
              </div>
          </div>    
        </div>
      </div>
    </div>
  )
}
