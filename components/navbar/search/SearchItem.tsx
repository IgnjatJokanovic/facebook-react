import React from 'react'
import Link from 'next/link'
import DefaultPrefixImage from '../../DefaultPrefixImage'

export default function SearchItem({ url, name, surname, profile = null}) {
  return (
    <div className='item'>
          <Link href={url}>
              <DefaultPrefixImage src={profile} alt={`${name} ${surname}`} />
              <div>{name} {surname}</div>
          </Link>
    </div>
  )
}
