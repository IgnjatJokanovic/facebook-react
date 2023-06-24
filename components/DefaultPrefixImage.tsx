import Link from 'next/link';
import React from 'react'
import Context from '../context/context';

export default function DefaultPrefixImage({ className = '', src = null, url = '', alt = 'alt', openable = false }) {
    const defaultProfile = "/default_profile.png";
    const ctx = React.useContext(Context);
    
    const [image, setImage] = React.useState('')
    
    const imagePreview = () => {
      if (openable) {
        ctx.setImgObj({
          src: image,
          open: true
        });
      }
    }
  
    React.useEffect(() => {
      
      if (src === null) {
        setImage(defaultProfile);
      }
      else if (String(src)?.includes("data:image")) {
        setImage(src);
      } else {
        setImage(process.env.NEXT_PUBLIC_BACKEND_BASE_URL + src);
      }
      
    }, [src])
    
  
  
  
  return (
    url.length ? (
      <Link href={url}>
        <img className={className} src={image} alt={alt} onClick={imagePreview} />
      </Link>
    ): (
      <img className={className} src={image} alt={alt} onClick={imagePreview} />
    )
  )
}
