import { ActiveMessage } from "../../types/types";
import MessageComponent from "./MessageComponent";


export default function MessagesContainer({ activeMessages, setActiveMessages }) {
  
  const minimize = (id: number) => {
    let curr: ActiveMessage[] = [...activeMessages];
    let index = curr.findIndex(obj => obj.id === id);
    let currObj = curr[index];

    currObj.isOpen = !currObj.isOpen;
    setActiveMessages(curr);
  }

  const close = (id: number) => {
    let curr: ActiveMessage[] = [...activeMessages];
    let index = curr.findIndex(obj => obj.id === id);
    
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
