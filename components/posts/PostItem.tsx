import moment from 'moment'
import Link from 'next/link'
import React, { useState } from 'react'
import Context from '../../context/context';
import { ChannelList } from '../../helpers/channels';
import { getClaims, refreshToken, updatePhoto } from '../../helpers/helpers';
import OpenableImage from '../OpenableImage';
import axios from 'axios';
import TagFriendsRender from './newPost/TagFriendsRender';
import CommentComponnent from './CommentComponnent';
import DefaultPrefixImage from '../DefaultPrefixImage';
import ReactionsItem from './ReactionsItem';
import { useSocket } from '../../helpers/broadcasting';

export default function PostItem({ post, isEditable = false, linkable = true, setArticle = (obj) => { }, deleteCallback = () => {} }) {
  const createdAt = moment(post.created_at).diff(moment(), 'days') > 7 ? moment(post.created_at).format('d. MMM, YYYY') : moment(post.created_at).fromNow();
  const claims = getClaims();

  const ctx = React.useContext(Context);
  const reactions = ctx.reactions;
  
  const [activeEdit, setActiveEdit] = React.useState(false);
  const [openComment, setOpenComment] = React.useState(false);

  const [isOpen, setIsOpen] = React.useState(false);
  const [activeReaction, setActiveReaction] = React.useState<number>(0);

  const [distinctReactions, setDistinctReactions] = React.useState(post.distinct_reactions)
  const [currentUserReaction, setCurrentUserReaction] = React.useState(post.currentUserReaction)

  const refEdit = React.useRef();
  const refOpen = React.useRef();

  const toggleOpen = e => {
    if (refOpen?.current?.contains(e.target)) {
      return;
    }
    setIsOpen(false);
  }

  const openReactions = (id: number) => {
    setIsOpen(true);
    setActiveReaction(id);
  }

  const toggleEdit = e => {
    if (refEdit.current.contains(e.target)) {
      return;
    }
    setActiveEdit(false);
  };

  const setEditArticle = () => {
    var article = structuredClone(post);
    setArticle(article);
  }

  const handleReact = (id) => {
    axios.post('/reaction/create', { reaction_id: id, post_id: post.id })
      .then(res => {
        ctx.setAlert(res.data.msg, 'success')
        setCurrentUserReaction(res.data.data);
      })
      .catch();
  }

  const handlePhotoChange = (profile: boolean, id: number) => {
    updatePhoto(profile, id)
      .then(res => {
        ctx.setAlert(res.data.msg, 'success');
      })
      .catch(err => {
        ctx.setAlert(err.response.data.error, 'error');
      });
  }



  const deletePost = () => {
    axios.post('/post/delete', { id: post.id })
      .then(async res => {
        if (deleteCallback.toString().trim() === "()=>{}") {
          ctx.setAlert(res.data.msg, 'success', '/');
        } else {
          ctx.setAlert(res.data.msg, 'success');
        }

        if (claims?.profile?.id == post.id) {
          await refreshToken();
        }
         
        deleteCallback();
      })
      .catch(err => {
          
      });
  }

  const handleChanChange = (e: { reaction: { emotion: any; }; action: string; }) => {
    console.log("NUKE", e);
    let curr = [...distinctReactions];
    let rtc = e.reaction.emotion;
    let index = curr.findIndex(obj => obj.id === rtc.id);
    console.log(e, curr);
    
    if (e.action === 'add') {
      let exists = curr.filter(item => item.id === rtc.id).length <= 0;
      console.log('existingIndex', exists, curr, rtc.id);
      // Handle ADD
      if (exists) {
        rtc.reaction_count = 1;
        curr.push(rtc)
       
      } else {
        // Handle Change
        curr[index].reaction_count += 1;
        
      }

    } else {
      let newCount = curr[index].reaction_count -= 1;
      if (newCount <= 0) {
        curr.splice(index, 1);
      } else {
        curr[index].reaction_count = newCount
      }
    }

    setDistinctReactions(curr);


  }
  

  useSocket({
    channel: `${ChannelList.postReaction.channel}${post.id}`,
    event: ChannelList.postReaction.listen,
    isPrivate: false,
    callBack: (payload) => {
      handleChanChange(payload);
    },
  })


    React.useEffect(() => {
        if (ctx.authenticated && post.owner.id === claims?.id || post.creator.id === claims?.id) {
          document.addEventListener("mousedown", toggleEdit);
        }
      
      
      
        if(post.distinct_reactions.length){
          document.addEventListener("mousedown", toggleOpen);
        }

        return () => {
            document.removeEventListener("mousedown", toggleEdit);
            document.removeEventListener("mousedown", toggleOpen);
        };
    }, [claims?.id, ctx.authenticated, ctx.echo, post.owner.id, post.creator.id, post.id, distinctReactions, post.distinct_reactions.length]);
  
  return (
    <div className="single-post-container">
      {!!ctx.authenticated && (
         post.owner.id === claims?.id || post.creator.id === claims?.id ? (
          <div className="post-actions" ref={refEdit}>
            <div className={activeEdit ? 'dropdown active' : 'dropdown'}>
              {post.owner.id === claims.id || post.creator.id === claims.id ? (
                <>
                  {post.creator.id === claims?.id && post.image ? (
                    <>
                      <div className='item' onClick={() => handlePhotoChange(true, post.id)}>Set profile photo</div>
                      <div className='item' onClick={() => handlePhotoChange(false, post.id)}>Set cover photo</div>
                    </>
                  ) : null}
                  {linkable ? (
                     <div className="item">
                      <Link className='linkable' href={`/post/${post.id}`}>
                        Edit
                      </Link>
                     </div>
                  ) : (
                    <div className='item' onClick={setEditArticle}>Edit</div>
                  )}
                  <div className='item' onClick={deletePost}>Delete</div>
                </>
              ): (
                <div className='item' onClick={deletePost}>Delete</div>
              )}
            </div>
            <i className="fa fa-ellipsis-v" aria-hidden="true" onClick={() => setActiveEdit(!activeEdit)}></i>
          </div>
        ) : null
       )}
      <div className="heading">
        <div className="links">
          {post.owner.id === post.creator.id ? (
            <Link href={`/user/${post.creator.id}`}>
              <DefaultPrefixImage
                src={post.creator.profile_photo?.image.src}
                alt={post.creator.firstName + " "+ post.creator.lastName}
              />
              <span>{post.creator.firstName} {post.creator.lastName}</span>  
            </Link>
          ) : (
            <>
              <Link href={`/user/${post.creator.id}`}>
                  <DefaultPrefixImage
                    src={post.creator.profile_photo?.image.src}
                    alt={post.creator.firstName + " "+ post.creator.lastName}
                  />
                  <span>{post.creator.firstName} {post.creator.lastName}</span>  
              </Link>
              <i className="fa-solid fa-caret-right"></i>
              <Link href={`/user/${post.owner.id}`}>
                {post.owner.firstName} {post.owner.lastName}
              </Link>
            </>
          )}
        </div>
        <div className="other">
          {post.emotion != null ? (
              <div><div dangerouslySetInnerHTML={{ __html: post.emotion.code }}></div> is feeling <Link className='linkable bold pointer' href={`/post/${post.id}`}>{ post.emotion.description }</Link></div>
          ) : ''}
          {post.taged.length ? (
              <div>
                  {post.emotion === null && ('is')} with <TagFriendsRender taged={post.taged} />
              </div>
          ) : ''}  
        </div>
      </div>
      <div className="created">
        {linkable ? (
          <Link className='linkable' href={`/post/${post.id}`}>
            {createdAt}
          </Link>
        ): (
          createdAt
        )}
      </div>
      {!!post.body && (
        linkable ? (

          <Link className='linkable' href={`/post/${post.id}`}>
            <div className="body" dangerouslySetInnerHTML={{ __html: post.body}}></div>
          </Link>
        ): (
          <div className="body" dangerouslySetInnerHTML={{ __html: post.body}}></div>
        )
        
      )}
      <div className="image">
        {!!post.image && (
          linkable ? (
            <Link className='linkable' href={`/post/${post.id}`}>
              <DefaultPrefixImage src={post.image.src}/>
            </Link>
          ): (
            <OpenableImage src={post.image.src}/> 
          )
        )}
      </div>
      <div className="info-container">
        {!!distinctReactions.length && (
          <div className="reactions">
            {!!isOpen && (
              <ReactionsItem
                reactions={distinctReactions}
                isOpen={isOpen}
                activeReaction={activeReaction}
                setActiveReaction={setActiveReaction}
                postId={post.id}
                refOpen={refOpen}
              />
            )}
            <div className="container">
              { distinctReactions.map((item, i) => (
                <div onClick={() => openReactions(item.id)} className="reaction-item" key={i} dangerouslySetInnerHTML={{ __html: item.code }}>
                </div>
              ))}
            </div>
            <div className="counter">
              { distinctReactions.reduce(function (acc, obj) { return acc + obj.reaction_count; }, 0)}
            </div>
          </div>
        )}
        <div className="comments"></div>
      </div>
      <div className="actions-container">
        <div className="react item">
          {!!ctx.authenticated && (
            <div className="dropdown">
              <div className="container">
                {!!reactions && reactions.map((item, i) => (
                    <div className="emoji-item" key={i} dangerouslySetInnerHTML={{ __html: item.code }} onClick={() => handleReact(item.id) }>
                    </div>
                ))}
              </div>
            </div>
          )}
        {currentUserReaction === null ? (
          <span>React</span>
        ): (
          <span onClick={() => handleReact(currentUserReaction.emotion.id) }><span dangerouslySetInnerHTML={{ __html: currentUserReaction.emotion.code }}></span> {currentUserReaction.emotion.description}</span>
        )}
        </div>
        <div className="Comment item" onClick={() => setOpenComment(true)}>
          Comment {!!post.commentCount && (
            <span>({post.commentCount})</span>
          )}
        </div>
      </div>
      {!!openComment && (
        <CommentComponnent postId={post.id} owner={post.owner.id} />
      )}
    </div>
  )
}
