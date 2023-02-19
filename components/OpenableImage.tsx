import React from 'react'
import Context from '../context/context';
import DefaultPrefixImage from './DefaultPrefixImage';


export default function OpenableImage({ src, alt = "Placeholdrer" }) {

  return (
    <DefaultPrefixImage className='img-click' src={src} alt={alt} openable={true} />
  )
}
