import React from "react";
import Context from "../../context/context";
import { useSocket } from "../../helpers/broadcasting";
import { ChannelList } from "../../helpers/channels";
import { getClaims } from "../../helpers/helpers";
import { ActiveMessage } from "../../types/types";
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

  const markAsRead = (ids, related, set = false, msg = null) => {
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
  }

  const handleAddMessage = (id, messages) => {
    let curr = [...messageThreads];
    let index = curr.findIndex(obj => obj.id == id);

    if (index > -1) {
      let old = curr[index].messages;

      if (messages.length == 1) {
        old.unshift(messages[0]);
      } else if(messages.length >= 1)  {
        old = old.concat(messages);
      }
      curr[index].messages = old;
      setMessageThreads(curr);
    }
  }

  const handleUpdateMessage = (id, message) => {
    let curr = [...messageThreads];
    let index = curr.findIndex(obj => obj.id == id);
    if (index > -1) {
      let msgIndex = curr[index].messages.findIndex(obj => obj.id == message.id);
      if (msgIndex > -1) {
        curr[index].messages[msgIndex].body = message.body;
        setMessageThreads(curr);
      }
    }
  }

  const handleDeleteMessage = (id, messageId) => {
    let curr = [...messageThreads];
    let index = curr.findIndex(obj => obj.id == id);

    if (index > -1) {
      let msgIndex = curr[index].messages.findIndex(obj => obj.id == messageId);
      
      if (msgIndex > -1) {
        curr[index].messages.splice(msgIndex, 1);
        setMessageThreads(curr);
      }
    }
  }

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

  const handleAfterload = (id, isLoading, nextPage) => {
    let curr = [...messageThreads];
    let index = curr.findIndex(obj => obj.id == id);
    if (index > -1) {
      curr[index].isLoading = isLoading;
      curr[index].nextPage = nextPage;
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
              markAsRead={markAsRead}
              handleAfterload={handleAfterload}
              handleAddMessage={handleAddMessage}
              handleUpdateMessage={handleUpdateMessage}
              handleDeleteMessage={handleDeleteMessage}
              minimize={toggleMinimize}
              close={close}
            />
          ))
        )}
    </div>
  )
}
