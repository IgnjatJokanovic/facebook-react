import React from 'react'
import DefaultPrefixImage from '../../DefaultPrefixImage'

export default function MessageItem({ img, name, surname, openMessage, message = null, isRead = false }) {
  return (
    <div className='item message-item' onClick={openMessage}>
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
