import Link from 'next/link'
import React from 'react'

export default function NotificationItem({ url, img, name, surname, text, opened = false }) {
  return (
      <div className='item notification-item'>
          <Link href={ '' }>
              <img src={img} alt="" />
              <div><span>{name} {surname}</span> { text}</div>
          </Link>
        
    </div>
  )
}
