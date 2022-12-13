import React from 'react'

export default function MessageItem({ img, name, surname, lastMessage, setOpen }) {
  return (
    <div className='item message-item' onClick={() => setOpen(false)}>
          <img src={img} alt="" />
          <div className="last-message-container">
              <div>{name} {surname}</div>
              <div>{ lastMessage }</div>
          </div>
    </div>
  )
}
