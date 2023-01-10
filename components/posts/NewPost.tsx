import Link from 'next/link';
import React from 'react'
import Context from '../../context/context';
import OpeanbleImage from '../OpenableImage';
import AddEmotion from './newPost/AddEmotion';
import AddImage from './newPost/AddImage';
import TagFriends from './newPost/TagFriends';

export default function NewPost({ article, setArticle, claims }) {

    const ctx = React.useContext(Context);

    const [openTagged, setOpenTagged] = React.useState(false);
    const [openEmotions, setOpenEmotions] = React.useState(false)

    // Image handle
    const refFile = React.useRef(null);
    const openFile = () => {
        refFile.current.click();
    }

    const updateImage = (image) => {
        setArticle({...article, image: image});
    }

    const updateEmotion = (emotion) => {
        setArticle({...article, emotion: emotion});
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
            <div className="info-container">
                <div className="image-container">
                    <Link href={`/user/${claims.id}`}>
                        <img src="/default_profile.png" alt="" />
                    </Link>
                </div>
                <div className="info">
                    <span className='bold'>{`${claims.firstName} ${claims.lastName}`}</span> 
                    {article.emotion != null ? (
                          <span><span dangerouslySetInnerHTML={{ __html: article.emotion.code }}></span> is feeling <span className='bold pointer' onClick={() => setOpenEmotions(!openEmotions)}>{ article.emotion.desctiption }</span></span>
                    ) : ''}
                    {article.tagged != null ? (
                          <span><span dangerouslySetInnerHTML={{ __html: article.emotion.code }}></span> is feeling <span className='bold pointer'>{ article.emotion.desctiption }</span></span>
                    ) : ''}    
                </div>    
            </div>
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
                      <AddImage refFile={refFile} openFile={openFile} updateImage={ updateImage } />
                      <TagFriends taged={article.taged} setArticle={setArticle} openTagged={openTagged} setOpenTagged={setOpenTagged} />
                      <AddEmotion article={article} setArticle={setArticle} openEmotions={openEmotions} setOpenEmotions={setOpenEmotions} />  
                </div>
               
            </div>
            <button>Post</button>  
        </form>      
    </div>
  )
}
