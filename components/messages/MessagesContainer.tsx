import React from "react";
import Context from "../../context/context";
import { useSocket } from "../../helpers/broadcasting";
import { ChannelList } from "../../helpers/channels";
import { getClaims } from "../../helpers/helpers";
import { ActiveMessage } from "../../types/types";
import MessageComponent from "./MessageComponent";
import axios from "axios";


export default function MessagesContainer({ activeMessages, setActiveMessages, messageNotifications, setMessageNotifications, setCount  }) {
  const claims = getClaims();
  const ctx = React.useContext(Context);
  
  const minimize = (id: number) => {
    let curr: ActiveMessage[] = [...activeMessages];
    let index = curr.findIndex(obj => obj.id == id);
    let currObj = curr[index];

    currObj.isOpen = !currObj.isOpen;
    setActiveMessages(curr);
  }

  const close = (id: number) => {
    let curr: ActiveMessage[] = [...activeMessages];
    let index = curr.findIndex(obj => obj.id == id);
    
    curr.splice(index, 1)
    setActiveMessages(curr);
  }

  return (
    <div className="messages-container">
        {!!activeMessages.length && (
          activeMessages.map((item, i) => (
            <MessageComponent
              key={i}
              messageThread={item}
              minimize={() => minimize(item.id)}
              close={() => close(item.id)}
            />
          ))
        )}
    </div>
  )
}
