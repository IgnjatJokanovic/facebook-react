import MessageComponent from "./MessageComponent";


export default function MessagesContainer({activeMessages, setActiveMessages}) {
  return (
    <div className="messages-container">
        <MessageComponent />
        <MessageComponent />
        <MessageComponent />
        <MessageComponent />
        <MessageComponent />
        
    </div>
  )
}
