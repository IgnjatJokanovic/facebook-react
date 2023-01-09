import React from 'react'
import Context from '../../context/context';
import OpeanbleImage from '../OpenableImage';
import AddEmotion from './newPost/AddEmotion';
import AddImage from './newPost/AddImage';
import TagFriends from './newPost/TagFriends';

export default function NewPost({ article, setArticle }) {

    const ctx = React.useContext(Context);

    // Image handle
    const refFile = React.useRef(null);
    const openFile = () => {
        refFile.current.click();
    }

    const updateImage = (image) => {
        setArticle({...article, image: image});
    }
    
    const handleSubmit = () => {
        console.log(article)
    }
  return (
    <div className='new-post-form'>
        <form onSubmit={e => {
            e.preventDefault();
            handleSubmit();
          }}>
            {article.image != null ? (
                <div className="image-container">
                    <div className="controlls">
                        <span onClick={openFile}>
                            Edit
                        </span> 
                          <span onClick={() => updateImage(null)}>
                            Delete
                        </span>  
                    </div>
                    <OpeanbleImage src={ article.image } alt="" />      
                </div>      
            ) : "" }
            <div className="insert-options">
                <div className="title">
                    Add to post
                </div>
                <div className="controlls">
                      <AddImage post={article} setPost={setArticle} refFile={refFile} openFile={openFile} updateImage={ updateImage } />
                      <TagFriends taged={article.taged} setArticle={setArticle} />
                    {/* <AddEmotion />   */}
                </div>
               
            </div>
            <button>Post</button>  
        </form>      
    </div>
  )
}
