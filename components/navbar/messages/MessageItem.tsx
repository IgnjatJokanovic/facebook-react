import React from 'react'
import DefaultPrefixImage from '../../DefaultPrefixImage'

export default function MessageItem({ img, name, surname, message, setOpen }) {
  return (
    <div className='item message-item' onClick={() => setOpen(false)}>
          <DefaultPrefixImage src={img} alt="" />
          <div className="last-message-container">
              <div>{name} {surname}</div>
              <div dangerouslySetInnerHTML={{__html: message}}></div>
          </div>
    </div>
  )
}
