import React from 'react'

export default function DefaultPrefixImage({ src = null, alt = 'alt' }) {
    const defaultProfile = "/default_profile.png"
    const prefixSrc = process.env.NEXT_PUBLIC_BACKEND_BASE_URL + src;
  return (
      <img src={src === null ? defaultProfile : prefixSrc} alt={alt} />
  )
}
