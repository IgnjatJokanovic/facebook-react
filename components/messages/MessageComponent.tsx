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

export default function MessageComponent({
  messageThread,
  isLoading,
  loadData,
  minimize,
  close,
  handleChange,
  reset,
  handleMessageDelete,
  openEdit,
  setBody,
  handleSubmit,
}) {
  
  const ctx = React.useContext(Context)
  const emojies = ctx.emojiList;
  const claims = getClaims();

  const prevMessagesLengthRef = React.useRef(messageThread.messages.length);

  const refBody = React.useRef();
  const ref = React.useRef();
  const refEmoji = React.useRef();

  const [openEmoji, setOpenEmoji] = React.useState(false);

  const toggleEmoji = e => {
    if (refEmoji?.current?.contains(e.target)) {
        return;
    }
    setOpenEmoji(false);
  };

  const handleScroll = () => {
    const firstChild = refBody?.current?.firstElementChild;
    if (firstChild) {
      firstChild.scrollIntoView({
        behavior: "smooth",
        block: "start",
        passive: true
      });
    }
  };

  const triggerLoad = (e) => {
    if (e.deltaY < 0) {
     loadData(messageThread.id);
    }
  }

  React.useEffect(() => {
    if (prevMessagesLengthRef.current == 0 && messageThread.messages.length > 0) {
      handleScroll()
    }
    if (messageThread.messages.length == prevMessagesLengthRef.current + 1) {
      handleScroll();
    }

    const handleToggleEmoji = e => toggleEmoji(e);

    document.addEventListener("mousedown", handleToggleEmoji);

    prevMessagesLengthRef.current = messageThread.messages.length;

    return () => {
      document.removeEventListener("mousedown", handleToggleEmoji);
    };

  }, [messageThread.messages.length]);

  React.useEffect(() => {

    if (messageThread.messages.length == 0) {
      loadData(messageThread.id);
    }
    
    
    refBody?.current?.addEventListener('wheel', triggerLoad);

    return () => {
      refBody?.current?.removeEventListener('wheel', triggerLoad);
    }
  }, [messageThread.id, messageThread.messages.length])

  
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
            {messageThread.messages.length ? (
              messageThread.messages.map((item, i) => (
                <MessageItem
                  key={i}
                  opened={item.opened}
                  owner={item.from == claims?.id}
                  created_at={item.created_at}
                  body={item.body}
                  deleteCallback={() => handleMessageDelete(messageThread.id, item.id)}
                  editCallback={() => openEdit(messageThread.id, item)}
                />
              ))
            ) : null}
            {isLoading ? (
              <>
                {messageThread.isLoading}
                <MessageItemLoader />
                <MessageItemLoader />
                <MessageItemLoader />
              </>
            ) : null}
          </div>
          <div>
              <div className="form-inputs">
                {Object.keys(messageThread.editMessage).length > 0 ? (
                  <ContentEditable
                    className="txt  hide-bar"
                    html={messageThread.editMessage.body} // innerHTML of the editable div
                    disabled={false}       // use true to disable editing
                    onChange={e => handleChange(messageThread.id, true, e.target.value)} // handle innerHTML change
                  />
                ): (
                  <ContentEditable
                    className="txt  hide-bar"
                    html={messageThread.newMessage.body} // innerHTML of the editable div
                    disabled={false}       // use true to disable editing
                    onChange={e => handleChange(messageThread.id, false, e.target.value)} // handle innerHTML change
                  />
                )}
                <div className="controlls">
                  <div ref={refEmoji} className="emoji-holder">
                    <i onClick={e => setOpenEmoji(!openEmoji)} className="fas fa-smile-beam"></i>
                      <div className={ openEmoji ? 'dropdown active' : 'dropdown' }>
                      <div className="flex hide-bar">
                          {!!emojies && emojies.map((item, i) => (
                              <div className="emoji-item" key={i} dangerouslySetInnerHTML={{ __html: item.code }} onClick={() => setBody(messageThread.id, item.code) }>
                              </div>
                          ))}
                      </div>
                    </div>
                  </div>
                    
                 <div className="btns">
                  <div className="btn" onClick={() => handleSubmit(messageThread.id)}>{Object.keys(messageThread.editMessage).length ? 'Update' : 'Send'}</div>
                  {Object.keys(messageThread.editMessage).length > 0 && (
                    <div className="btn" onClick={() => reset(messageThread.id)}>Cancel</div>
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
