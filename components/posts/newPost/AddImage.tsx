import React from 'react'
import Context from '../../../context/context';

export default function AddImage({ openFile, refFile, updateImage }) {
  const ctx = React.useContext(Context);
  
  return (
      <div className='controll-item image'>
        <div className="icon-holder">
            <div className="dropdown-title">Add image</div>
            <i className="fas fa-image image-icon" title='Add image' onClick={openFile}></i>
            <input ref={refFile} type="file" className="d-none" onChange={e => ctx.handleFileRead(e, updateImage)}/>
        </div>
        
    </div>
  )
}
