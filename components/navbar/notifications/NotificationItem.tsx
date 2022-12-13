import Link from 'next/link'
import React from 'react'

export default function NotificationItem({ img, link, name, surname, text }) {
  return (
      <div className='item notification-item'>
          <Link href={ link }>
              <img src={img} alt="" />
              <div><span>{name} {surname}</span> { text}</div>
          </Link>
        
    </div>
  )
}
