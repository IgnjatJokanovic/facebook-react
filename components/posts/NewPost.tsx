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
import { useRouter } from 'next/router';

export default function NewPost({ owner, url, editArticle = null, setOriginalPost = (post) => { }, close = (post) => {} }) {

    const ctx = React.useContext(Context);
    const emojies = ctx.emojiList;

    const router = useRouter();

    const claims = getClaims();

    const [openTagged, setOpenTagged] = React.useState(false);
    const [openEmoji, setOpenEmoji] = React.useState(false)
    const [openEmotions, setOpenEmotions] = React.useState(false)

    const refEmoji = React.useRef();

    const toggleEmoji = e => {
        if (refEmoji?.current?.contains(e.target)) {
            return;
        }
        setOpenEmoji(false);
    };

    const [article, setArticle] = React.useState<Article>({
        id: editArticle != null ? editArticle.id : null,
        owner: parseInt(owner),
        creator: claims?.id,
        body:  editArticle != null && editArticle.body != null ? editArticle.body : '',
        image: {
            id: editArticle != null && editArticle.image != null ? editArticle.image.id : null,
            src: editArticle != null && editArticle.image != null ? editArticle.image.src : null,
        },
        emotion: editArticle != null ? editArticle.emotion : null,
        taged: editArticle != null ? editArticle.taged : [],
    });

    // Image handle
    const refFile = React.useRef(null);
    const openFile = () => {
        refFile.current.click();
    }

    const updateImage = (image) => {
        let imageObj = article.image;

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
            setArticle({...article, body: newValue});
        }
    }

    const handleBodyChange = evt => {
        setArticle({...article, body: evt.target.value})
    }
    
    const handleSubmit = () => {
        validateActiveUser()
            .then(() => {
                axios.post(`/post/${url}`, article)
                .then(async res => {
                    ctx.setAlert(res.data.msg, 'success');
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

                    if (url == 'update') {
                        if (claims?.profile?.id == article.id) {
                            await refreshToken();
                        }
                        setOriginalPost(res.data.post);
                       
                    } else {
                        router.push(`/post/${res.data.data.id}`)
                    }
                })
                .catch(err => {
                    ctx.setAlert(err.response?.data?.error, 'error')
                });
            })
            .catch(err => {
                ctx.setAlert(err, 'error');
            })
        
    }

    React.useEffect(() => {
        const handleToggleEmoji = e => toggleEmoji(e);
    
        document.addEventListener("mousedown", handleToggleEmoji);
      
        return () => {
          document.removeEventListener("mousedown", handleToggleEmoji);
        }
    }, [])
    

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
                        <span><span dangerouslySetInnerHTML={{ __html: article.emotion.code }}></span> is feeling <span className='bold pointer' onClick={() => setOpenEmotions(!openEmotions)}>{ article.emotion.description }</span></span>
                    ) : ''}
                    {article.taged.length ? (
                        <span>
                            {article.emotion === null && ('is')} with <TagFriendsRender taged={article.taged} />
                        </span>
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
                <div ref={refEmoji} className="emoji-holder">
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
            <button className='submit'>{editArticle != null ? "Update" : "Post"}</button>  
        </form>      
    </div>
  )
}
