import React from 'react'
import Link from 'next/link'
import DefaultPrefixImage from '../../DefaultPrefixImage'
import { useRouter } from 'next/router';

export default function SearchItem({ url, name, surname, reset, profile = null }) {
  
  const router = useRouter();

  const handleClick = () => {
    reset();
    router.push(url);
  }


  return (
    <div className='item' onClick={handleClick}>
      <DefaultPrefixImage src={profile} alt={`${name} ${surname}`} />
      <div>{name} {surname}</div> 
    </div>
  )
}
