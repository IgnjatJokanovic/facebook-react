import React from 'react'
import DefaultPrefixImage from '../../DefaultPrefixImage'

export default function MessageItem({ img, name, surname, openMessage, message = null, opened = false }) {
  return (
    <div className={opened ? 'item message-item' : 'item message-item unread'} onClick={openMessage}>
          <DefaultPrefixImage src={img} alt="" />
          <div className="last-message-container">
              <div>{name} {surname}</div>
              {message != null ? (
                <div dangerouslySetInnerHTML={{__html: message}}></div>
              ): null}
          </div>
    </div>
  )
}
