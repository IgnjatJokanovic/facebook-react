import React from 'react'
import Context from '../context/context';


export default function OpenableImage({ src, alt = "Placeholdrer" }) {
  const ctx = React.useContext(Context);

  const imagePreview = (src) => {
    ctx.setImgObj({
        src: src,
        open: true
    });
  console.log(src);
}

  return (
    <img className='img-click' src={src} onClick={() => imagePreview(src)} alt={ alt } />
  )
}
