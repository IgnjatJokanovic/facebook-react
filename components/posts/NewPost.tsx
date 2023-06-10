import axios from 'axios';
import Link from 'next/link';
import React from 'react'
import Context from '../../context/context';
import OpeanbleImage from '../OpenableImage';
import AddEmotion from './newPost/AddEmotion';
import AddImage from './newPost/AddImage';
import TagFriends from './newPost/TagFriends';
import ContentEditable from 'react-contenteditable'
import { getClaims, refreshToken, validateActiveUser } from '../../helpers/helpers';
import { Article } from '../../types/types';
import TagFriendsRender from './newPost/TagFriendsRender';
import DefaultPrefixImage from '../DefaultPrefixImage';

export default function NewPost({ owner, url, editArticle = null, setOriginalPost = (post) => { }, close = (post) => {} }) {

    const ctx = React.useContext(Context);
    const emojies = ctx.emojiList;

    const claims = getClaims();

    const [openTagged, setOpenTagged] = React.useState(false);
    const [openEmoji, setOpenEmoji] = React.useState(false)
    const [openEmotions, setOpenEmotions] = React.useState(false)

    const [article, setArticle] = React.useState<Article>({
        id: null,
        owner: parseInt(owner),
        creator: claims?.id,
        body: '',
        image: {
          id: null,
          src: null
        },
        emotion: null,
        taged: [],
    });

    // Image handle
    const refFile = React.useRef(null);
    const openFile = () => {
        refFile.current.click();
    }

    const updateImage = (image) => {
        let imageObj = article.image;
        console.log(imageObj);

        if (imageObj === null) {
            imageObj = {
                id: null,
                src: null
            }
        }

        imageObj.src = image;
        setArticle({ ...article, image: imageObj });
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
        validateActiveUser()
            .then(() => {
                axios.post(`/post/${url}`, article)
                .then(async res => {
                    ctx.setAlert(res.data.msg, 'success', `/post/${res.data.data.id}`);
                    if (url == 'update') {
                        if (claims?.profile?.id == article.id) {
                            await refreshToken();
                        }
                        setOriginalPost(res.data.post);
                    }
                    setArticle({
                        id: null,
                        owner: null,
                        creator: null,
                        body: '',
                        image: {
                          id: null,
                          src: null
                        },
                        emotion: null,
                        taged: [],
                    });
                    close({})
                })
                .catch(err => {
                    ctx.setAlert(err.response.data.error, 'error')
                });
            })
            .catch(err => {
                ctx.setAlert(err, 'error');
            })
        
    }


    React.useEffect(() => {

        if (editArticle !== null) {
            setArticle(editArticle);
        }
    
      
    }, [editArticle])
    

  return (
    <div className='new-post-form'>
        <form onSubmit={e => {
            e.preventDefault();
            handleSubmit();
          }}>
            <div className="info-container">
                <div className="image-container">
                    <Link href={`/user/${claims?.id}`}>
                          <DefaultPrefixImage src={claims?.profile?.image?.src} alt={`${claims?.firstName} ${claims?.lastName}`} />
                        <span className='bold'>{`${claims?.firstName} ${claims?.lastName}`}</span> 
                    </Link>
                </div>
                <div className="info">
                    
                    {article.emotion != null ? (
                        <div><div dangerouslySetInnerHTML={{ __html: article.emotion.code }}></div> is feeling <div className='bold pointer' onClick={() => setOpenEmotions(!openEmotions)}>{ article.emotion.description }</div></div>
                    ) : ''}
                    {article.taged.length ? (
                        <div>
                            {article.emotion === null && ('is')} with <TagFriendsRender taged={article.taged} />
                        </div>
                    ) : ''}  
                   
                  
                </div>    
            </div>
            <div className="body-container">
                  <ContentEditable
                      className="txt  hide-bar"
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
            {article.image?.src != null ? (
                <div className="image-container">
                    <div className="controlls">
                        <span onClick={openFile}>
                            Edit
                        </span> 
                          <span onClick={() => updateImage(null)}>
                            Delete
                        </span>  
                    </div>
                    <OpeanbleImage src={ article.image.src } alt="" />      
                </div>      
            ) : "" }
            <div className="insert-options">
                <div className="title">
                    Add to post
                </div>
                <div className="controlls">
                      <AddImage refFile={refFile} openFile={openFile} updateImage={ updateImage } />
                      <TagFriends owner={owner} article={article} setArticle={setArticle} openTagged={openTagged} setOpenTagged={setOpenTagged} />
                      <AddEmotion article={article} setArticle={setArticle} openEmotions={openEmotions} setOpenEmotions={setOpenEmotions} />  
                </div>
               
            </div>
            <button className='submit'>Post</button>  
        </form>      
    </div>
  )
}
