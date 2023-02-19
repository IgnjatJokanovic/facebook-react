import React from 'react'
import Context from '../context/context';

export default function DefaultPrefixImage({ className = '', src = null, alt = 'alt', openable = false }) {
    const defaultProfile = "/default_profile.png";
    const ctx = React.useContext(Context);
    
    const [image, setImage] = React.useState('')
    
    const prefixSrc = (item) => {
      if (item === null) {
        setImage(defaultProfile);
      }
      else if (item.includes("data:image")) {
        setImage(item);
      } else {
        setImage(process.env.NEXT_PUBLIC_BACKEND_BASE_URL + item);
      }
     
    }
  
  

    const imagePreview = (src) => {
      if (openable) {
        ctx.setImgObj({
          src: image,
          open: true
        });
      }
    }
  
    React.useEffect(() => {
      prefixSrc(src)
    }, [prefixSrc])
    
  
  
  
  return (
    <img className={className} src={image} alt={alt} onClick={imagePreview} />
  )
}
