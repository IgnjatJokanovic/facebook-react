import React from 'react'
import Link from 'next/link'

export default function FriendItem({ profile, img, name, surname, id }) {
  return (
      <div className='item'>
          <Link href={profile}>
            <img src={img} alt={name} />
            <span>{name} {surname}</span>
          </Link>
          
          <button>Accept</button>
          <button>Decline</button>
    </div>
  )
}
