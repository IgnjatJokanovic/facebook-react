import React from 'react'

export default function ImageModal({open, src, togleFun, refImg = null, displayBtns = false, saveCallback = () => {} }) {
  return (
    <div className={open ? "image-modal active" : "image-modal"}>
        <span className="image-modal--close" onClick={togleFun}>&times;</span>
        <img ref={refImg} className="image-modal--content" src={src} />
        {!!displayBtns && (
          <div className="btns">
            <div className="btn" onClick={saveCallback}>Save</div>
            <div className="btn" onClick={togleFun}>Cancel</div>
          </div>
        )}
    </div>
  )
}
