import React from "react";
import Context from "../../context/context";
import { useSocket } from "../../helpers/broadcasting";
import { ChannelList } from "../../helpers/channels";
import { getClaims, validateMessage } from "../../helpers/helpers";
import { ActiveMessage, MessageNotification } from "../../types/types";
import MessageComponent from "./MessageComponent";
import axios from "axios";
import Test from "./Test";


export default function MessagesContainer({ messageThreads, setMessageThreads, messageNotifications, setMessageNotifications, setCount  }) {
  const claims = getClaims();
  const ctx = React.useContext(Context);
  
  const toggleMinimize = (id: number) => {
    let curr: ActiveMessage[] = [...messageThreads];
    let index = curr.findIndex(obj => obj.id == id);
    let currObj = curr[index];

    if (!currObj.isOpen) {
      let unreads = currObj.messages.filter(msg => msg.to == claims?.id && msg.opened == false);
      if (unreads.length) {
        markAsRead(unreads.map(obj => obj.id), true);
        currObj.messages.map(obj => obj.opened = true);
      }
    }

    currObj.isOpen = !currObj.isOpen;
    setMessageThreads(curr);
  }

  const close = React.useCallback((id: number) => {
    let curr: ActiveMessage[] = [...messageThreads];
    let index = curr.findIndex(obj => obj.id == id);

    curr.map(obj => obj.dontTriggerIntersect = true);
    
    if (index != -1) {
      curr.splice(index, 1)
      setMessageThreads(curr);
    }
  }, [messageThreads, setMessageThreads])

  const markAsRead = React.useCallback((ids, related, set = false, msg = null) => {
    if (ids.length) {
      axios.post('/message/markAsRead', {
        ids: ids,
        related: related
      })
      .then(res => {
          let curr = [...messageNotifications];
          let index = curr.findIndex(obj => obj.id == related);

          if (index >= 0) {
            if (msg != null) {
              msg.opened = res.data.opened;
              curr[index] = msg;
              
            } else {
              curr[index].opened = res.data.opened;
            }

            setMessageNotifications(curr);
          }

          if (set) {
            setCount(prevCount => prevCount - res.data.count < 0 ? 0 :  prevCount - res.data.count);
            
          }
      })
      .catch(err => {
        
      })
    }
  }, [messageNotifications, setCount, setMessageNotifications])

  const handleChanAdd = (payload) => {
    let curr = [...messageThreads];
    let msg = payload.message;
    let id = msg.from;
    let index = curr.findIndex(obj => obj.id == id);

    console.log('handleChanAdd')

    if (index >= 0) {
      if (curr[index].isOpen) {
        markAsRead([msg.id], id, false, payload.notification)
        msg.opened = true;
        curr[index].messages.unshift(msg);
      } else {
        curr[index].messages.unshift(msg);
      }
  
      setMessageThreads(curr);
    }

  }

  const handleChanDelete = (payload) => {
    let curr = [...messageThreads];
    let msg = payload.message;
    let indexThread = curr.findIndex(obj =>  obj.id == msg.from || obj.id == msg.to);

    console.log('delete', msg)
    
    if (indexThread > -1) {
      let messageIndex = curr[indexThread].messages.findIndex(obj => obj.id == msg.id);
      if (messageIndex > -1) {
        curr[indexThread].messages.splice(messageIndex, 1);
        setMessageThreads(curr)
      }
    }
  }

  const handleChanUpdate = (payload) => {
    let curr = [...messageThreads];
    let msg = payload.message;
    let indexThread = curr.findIndex(obj => obj.id == msg.from || obj.id == msg.to);

    console.log('handleChanUpdate', payload)

    if (indexThread > -1) {
      let index = curr[indexThread].messages.findIndex(obj => obj.id == msg.id);
      console.log(index)
      if (index > -1) {
        curr[indexThread].messages[index].body = msg.body;
        curr[indexThread].messages[index].opened = msg.opened;
        setMessageThreads(curr)
      }
    }
  }

  useSocket({
      channel: `${ChannelList.newMessage.channel}${claims?.id}`,
      event: ChannelList.newMessage.listen,
      isPrivate: false,
      callBack: (payload) => {
        handleChanAdd(payload);
      },
  })

  useSocket({
      channel: `${ChannelList.messageDeleted.channel}${claims?.id}`,
      event: ChannelList.messageDeleted.listen,
      isPrivate: false,
      callBack: (payload) => {
        handleChanDelete(payload);
      },
  })

  useSocket({
    channel: `${ChannelList.messageUpdated.channel}${claims?.id}`,
    event: ChannelList.messageUpdated.listen,
    isPrivate: false,
    callBack: (payload) => {
      handleChanUpdate(payload);
    },
  })

  const updateNotifications = (data, isUpdate = false) => {
    let curr = [...messageNotifications];

    if (isUpdate) {
      
      let index = curr.findIndex(obj => obj.messageId == data.id);

      if (index >= 0) {
        curr[index].body = data.body;
      }

    } else {
      let index = curr.findIndex(obj => obj.id == data.id);

      if (index >= 0) {
        curr[index].body = data.body;
      } else {
        let newMsg: MessageNotification = {
          id: data.id,
          firstName: data.firstName,
          lastName: data.lastName,
          profile: data.profile,
          messageId: data.messageId,
          from: data.from,
          to: data.to,
          body: data.body,
          created_at: data.created_at,
          opened: true,
        }
        
        curr.unshift(newMsg);
      }

    }

    setMessageNotifications(curr);
  }

  const handleSubmit = (id: number) => {
    let curr = [...messageThreads];
    let index = curr.findIndex(obj => obj.id == id);

    if (index > -1) {
      let msgThread: ActiveMessage = curr[index];

      if (Object.keys(msgThread.editMessage).length) {
        validateMessage(msgThread.editMessage.body)
          .then(() => {
            axios.post('/message/update', msgThread.editMessage)
              .then(res => {
                ctx.setAlert(res.data.msg, 'success');
                let data = res.data.data;
                let msgIndex = msgThread.messages.findIndex(obj => obj.id == msgThread.editMessage.id);
                msgThread.messages[msgIndex].body = data.body;
               
                msgThread.editMessage = {};
                msgThread.newMessage.body = "";

                curr[index] = msgThread;
                setMessageThreads(curr)

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
        let newMsg = msgThread.newMessage;
        validateMessage(newMsg.body)
          .then(() => {
            axios.post('/message/create', newMsg)
              .then(res => {
                ctx.setAlert(res.data.msg, 'success');
  
                let data = res.data.data;
                let msgId = data.id;
                data.firstName = msgThread.firstName;
                data.firstName = msgThread.firstName;
                data.id = msgThread.id;
                data.messageId = msgId;
                data.profile = msgThread.profile;

                msgThread.messages.unshift(data);
             

                msgThread.editMessage = {};
                msgThread.newMessage.body = "";
                
                curr[index] = msgThread;
                setMessageThreads(curr)
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

    }
  };

  const setBody = (id:number, body: string) => {
    let curr = [...messageThreads];
    let index = curr.findIndex(obj => obj.id == id);
    if (index > -1) {
      let msgThread :ActiveMessage = curr[index];
      if (Object.keys(msgThread.editMessage).length) {

        if (msgThread.editMessage.body === null) {
          msgThread.editMessage.body = body;
        }
        else {
          var newValue = msgThread.editMessage.body + body;
          msgThread.editMessage.body = newValue;
        }
  
      } else {
  
        if (msgThread.newMessage.body === null) {
          msgThread.newMessage.body = body;
        }
        else {
          var newValue = msgThread.newMessage.body + body;
          msgThread.newMessage.body = newValue;
        }
  
      }

      curr[index] = msgThread;
      setMessageThreads(curr);
    }
  }

  const openEdit = (id:number, item) => {
    let curr = [...messageThreads];
    let index = curr.findIndex(obj => obj.id == id);

    if (index > -1) {
      let msgThread: ActiveMessage = curr[index];
      msgThread.editMessage = {
        id: item.id,
        body: item.body
      }

      curr[index] = msgThread;
      setMessageThreads(curr);
    }
  }

  const handleMessageDelete = (id:number, msgId:number) => {
    let notifications = [...messageNotifications];
    let notificationIndex = notifications.findIndex(obj => obj.messageId == msgId);

    let curr = [...messageThreads];
    let index = curr.findIndex(obj => obj.id == id);

    axios.post('/message/delete', { id: msgId })
      .then(res => {
        ctx.setAlert(res.data.msg, 'success')
        if (notificationIndex >= 0) {
          if (res.data.data != null) {
            notifications[notificationIndex] = res.data.data;
          } else {
            notifications.splice(notificationIndex, 1);
          }

          if (index > -1) {
            let msgThread: ActiveMessage = curr[index];
            let msgIndex = msgThread.messages.findIndex(obj => obj.id == msgId);
            
            if (msgIndex > -1) {
              msgThread.messages = msgThread.messages.splice(msgIndex, 1);
            }

            if (msgThread.editMessage?.id == msgId) {
              msgThread.editMessage = {};
            }

            curr[index] = msgThread;
          }
       
          setMessageNotifications(notifications);
          setMessageThreads(curr);
        }
      })
      .catch(err => {
        ctx.setAlert(err.response.data.error, 'error')
      })

    
  }

  const reset = (id:number) => {
    let curr = [...messageThreads];
    let index = curr.findIndex(obj => obj.id == id);

    if (index > -1) {
      let msgThread: ActiveMessage = curr[index];
      msgThread.editMessage = {};
      curr[index] = msgThread;
      setMessageThreads(curr)
    }
  }

  const handleChange = (id: number, isUpdate: boolean, value: string) => {
    let curr = [...messageThreads];
    let index = curr.findIndex(obj => obj.id == id);

    if (index > -1) {
      let msg: ActiveMessage = curr[index];
      if (isUpdate) {
        msg.editMessage.body = value;
      } else {
        msg.newMessage.body = value;
      }
      curr[index] = msg;

      setMessageThreads(curr);
    }
  }

  const loadData = React.useCallback((id: number) => {
    let curr = [...messageThreads];
    let index = curr.findIndex(obj => obj.id == id);
    console.log('XXXXXXXXXXXXXXXX', index, id)
    if (index > -1) {
      let msgThread: ActiveMessage = curr[index];

      if (!msgThread.isLoading) {
        msgThread.isLoading = true;
        curr[index] = msgThread;
        // setMessageThreads(curr);

        console.log('USAO NOT LOADING')

        if (msgThread.nextPage >= 0) {

          console.log('USAO NEXT PAGE')
          axios.get(`/message/show/${msgThread.id}?page=${msgThread.nextPage}`)
            .then(res => {
  
              let data = res.data.data;
              let ids = [];
  
              data.forEach(obj => {
                if (obj.to != msgThread.id && !obj.opened) {
                  obj.opened = true;
                  ids.push(obj.id);
                }
              });

              msgThread.messages = msgThread.messages.concat(data);
  
              markAsRead(ids, msgThread.id, true);
  
              let nextPage = msgThread.nextPage;
    
              if (res.data.next_page_url == null) {
                nextPage = -1;
              } else {
                nextPage = parseInt(res.data.next_page_url[res.data.next_page_url.length - 1], 10);
              }

              msgThread.isLoading = false;
              msgThread.nextPage = nextPage;
              curr[index] = msgThread;
              setMessageThreads(curr);
              
             
            })
            .catch(err => {
              
            })
        } else {
          msgThread.isLoading = false;
          curr[index] = msgThread;
          setMessageThreads(curr);
        }
      } else {
        msgThread.isLoading = false;
        curr[index] = msgThread;
        setMessageThreads(curr);
      }
    }
  }, [markAsRead, messageThreads, setMessageThreads])


  const SCREEN_SIZES = {
    small: 490,
    medium: 1550,
  };

  const handleResize = React.useCallback(() => {
    console.log('handleResize')
    const width = window.innerWidth;
    let msgLenght = messageThreads.length;
    let curr = [...messageThreads];
    console.log('width', width)
    if (width < SCREEN_SIZES.small && msgLenght > 1) {
      curr.splice(0, msgLenght - 1)
      console.log('curr.slice(0, 3)')
      setMessageThreads(curr)
    } else if (width < SCREEN_SIZES.medium && msgLenght > 3) {
      curr.splice(msgLenght - 1, 1)
      console.log('curr.slice(0, 3)')
      setMessageThreads(curr)
    }
  }, [SCREEN_SIZES.medium, SCREEN_SIZES.small, messageThreads, setMessageThreads]);

  React.useEffect(() => {
    console.log("USE EFFECT")
    console.log(messageThreads)
   
    
    
   

    window.addEventListener('resize', handleResize);
  
    return () => {
      window.removeEventListener('resize', handleResize);
    }
  }, [handleResize, messageThreads, setMessageThreads])
  

  return (
    <div className="messages-container">
        {messageThreads.length > 0 && (
          messageThreads.map((item, i) => (
            <MessageComponent
              key={i}
              messageThread={item}
              isLoading={item.isLoading}
              loadData={loadData}
              minimize={toggleMinimize}
              close={close}
              handleChange={handleChange}
              reset={reset}
              handleMessageDelete={handleMessageDelete}
              openEdit={openEdit}
              setBody={setBody}
              handleSubmit={handleSubmit}
            />
          ))
        )}
    </div>
  )
}
