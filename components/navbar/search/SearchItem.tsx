import React from 'react'
import Link from 'next/link'

export default function SearchItem({ url, image, name, surname }) {
  return (
    <div className='item'>
          <Link href={url}>
              <img src={image} alt={name} />
              <span>{name} {surname}</span>
          </Link>
    </div>
  )
}
