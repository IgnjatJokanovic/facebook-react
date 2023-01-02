import React from 'react'

export default function AddImage({ post, setPost, openFile, refFile, updateImage }) {
  


  const getBase46 = (file) => {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload = () => {
            resolve(fileReader.result);
        }
        fileReader.onerror = (error) => {
            reject(error);
        }
    });
  };

  const handleFileRead = async (e) => {
      const file = e.target.files[0];
      if (file) {
        if (file.type.match('image.*')) {
          const base64 = await getBase46(file);
          updateImage(base64);
        } else {
          //handle error
          console.log('error')
        }
      }
      
      
  };

  
  return (
      <div className='controll-item image'>
        <div className="icon-holder">
            <div className="dropdown-title">Add image</div>
            <i className="fas fa-image image-icon" title='Add image' onClick={openFile}></i>
            <input ref={refFile} type="file" className="d-none" onChange={e => handleFileRead(e)}/>
        </div>
        
    </div>
  )
}
