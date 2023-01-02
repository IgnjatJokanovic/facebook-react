import React from 'react'

export default function ImageModal({open, src, togleFun, refImg}) {
  return (
    <div className={open ? "image-modal active" : "image-modal"}>
        <span className="image-modal--close" onClick={() => togleFun()}>&times;</span>
        <img ref={refImg} className="image-modal--content" src={src} />
    </div>
  )
}
