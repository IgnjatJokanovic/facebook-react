import axios from 'axios';
import Link from 'next/link';
import React from 'react'
import Context from '../../context/context';
import OpeanbleImage from '../OpenableImage';
import AddEmotion from './newPost/AddEmotion';
import AddImage from './newPost/AddImage';
import TagFriends from './newPost/TagFriends';
import ContentEditable from 'react-contenteditable'

export default function NewPost({ article, setArticle, claims }) {

    const ctx = React.useContext(Context);
    const emojies = ctx.emojiList;

    const [openTagged, setOpenTagged] = React.useState(false);
    const [openEmoji, setOpenEmoji] = React.useState(false)
    const [openEmotions, setOpenEmotions] = React.useState(false)

    // Image handle
    const refFile = React.useRef(null);
    const openFile = () => {
        refFile.current.click();
    }

    const updateImage = (image) => {
        setArticle({...article, image: image});
    }

    const setBody = (body) => {

        if (article.body === null) {
            setArticle({...article, body: body});
        }
        else {
            var newValue = article.body + body;
            console.log(1, article.body, newValue)
            setArticle({...article, body: newValue});
        }

        console.log(body);
       
        
       
    }

    const handleBodyChange = evt => {
        setArticle({...article, body: evt.target.value})
    }
    
    const handleSubmit = () => {
        console.log(article);
        if (article.id === null) {
            axios.post('/post/create', article)
                .then(res => {
                    ctx.setAlert(res.data.msg, 'success', `/post/${res.data.id}`)
                }).catch(err => {
                    ctx.setAlert(err.response.data.error, 'error')
                });
        }
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
            <div className="body-container">
                <ContentEditable className="txt  hide-bar"
                    //  innerRef={refEditable}
                     html={article.body} // innerHTML of the editable div
                     disabled={false}       // use true to disable editing
                     onChange={handleBodyChange} // handle innerHTML change
                 />
                <div className="emoji-holder">
                <i onClick={e => setOpenEmoji(!openEmoji)} className="fas fa-smile-beam"></i>
                      <div className={ openEmoji ? 'dropdown active' : 'dropdown' }>
                        <div className="flex hide-bar">
                            {!!emojies && emojies.map((item, i) => (
                                <div className="emoji-item" key={i} dangerouslySetInnerHTML={{ __html: item.code }} onClick={() => setBody(item.code) }>
                                </div>
                            ))}
                        </div>
                    </div>
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
