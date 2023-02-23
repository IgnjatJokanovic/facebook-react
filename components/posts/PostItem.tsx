import moment from 'moment'
import Link from 'next/link'
import React, { useState } from 'react'
import Context from '../../context/context';
import { ChannelList } from '../../helpers/channels';
import { getClaims } from '../../helpers/helpers';
import OpenableImage from '../OpenableImage';
import axios from 'axios';
import { useSocket } from '../../helpers/broadcasting';
import { CLIENT_RENEG_LIMIT } from 'tls';
import TagFriendsRender from './newPost/TagFriendsRender';

export default function PostItem({ post, isEditable = false, setArticle = (obj) => { }, deleteCallback = () => {} }) {
  const createdAt = moment(post.created_at).diff(moment(), 'days') > 7 ? moment(post.created_at).format('d. MMM, YYYY') : moment(post.created_at).fromNow();
  const claims = getClaims();

  const ctx = React.useContext(Context);
  const reactions = ctx.reactions;
  
  const [activeEdit, setActiveEdit] = React.useState(false);
  const [reactionsCount, setReactionsCount] = React.useState(0);

  const [distinctReactions, setDistinctReactions] = React.useState(post.distinct_reactions)
  const [currentUserReaction, setCurrentUserReaction] = React.useState(post.currentUserReaction)

  const refEdit = React.useRef();

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



  const deletePost = () => {
    axios.post('/post/delete', { id: post.id })
         .then(res => {
           ctx.setAlert(res.data.msg, 'success');
           deleteCallback();
         })
         .catch(err => {
          
         })
  }
  

  // useSocket({
  //   channel: `${ChannelList.postReaction.channel}${post.id}`,
  //   event: ChannelList.postReaction.listen,
  //   isPrivate: false,
  //   callBack: (payload) => {
  //     handleChanChange(payload);
  //   },
  // })


    React.useEffect(() => {
        if (ctx.authenticated && post.owner.id === claims?.id || post.creator.id === claims?.id) {
          document.addEventListener("mousedown", toggleEdit);
        }
      
        const handleChanChange = (e: { reaction: { emotion: any; }; action: string; }) => {
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
        
    
        ctx.echo.channel(`${ChannelList.postReaction.channel}${post.id}`).listen(ChannelList.postReaction.listen, (e) => {
          handleChanChange(e);
        });
      
        console.log('listening')

        return () => {
            ctx.echo.leave(`${ChannelList.postReaction.channel}${post.id}`)
            console.log('leaving')
            document.removeEventListener("mousedown", toggleEdit);
        };
    }, [claims?.id, ctx.authenticated, ctx.echo, post.owner.id, post.creator.id, post.id, distinctReactions]);
  
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
                      <div className='item'>Set profile photo</div>
                      <div className='item'>Set cover photo</div>
                    </>
                  ) : null}
                  {isEditable ? (
                     <div className='item' onClick={setEditArticle}>Edit</div>
                  ) : null}
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
              <img src={post.creator.profile === null ? "/default_profile.png" : post.creator.profile} alt={post.creator.firstName + " "+ post.creator.lastName} />
              <span>{post.creator.firstName} {post.creator.lastName}</span>  
            </Link>
          ) : (
            <>
              <Link href={`/user/${post.creator.id}`}>
                  <img src={post.creator.profile === null ? "/default_profile.png" : post.creator.profile} alt={post.creator.firstName + " "+ post.creator.lastName} />
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
              <div><div dangerouslySetInnerHTML={{ __html: post.emotion.code }}></div> is feeling <div className='bold pointer'>{ post.emotion.description }</div></div>
          ) : ''}
          {post.taged.length ? (
              <div>
                  {post.emotion === null && ('is')} with <TagFriendsRender taged={post.taged} />
              </div>
          ) : ''}  
        </div>
      </div>
      <div className="created">
        {createdAt }
      </div>
      {!!post.body && (
        <div className="body" dangerouslySetInnerHTML={{ __html: post.body}}></div>
      )}
      <div className="image">
        {!!post.image && (
          <OpenableImage src={post.image.src}/>
        )}
      </div>
      <div className="info-container">
        {!!distinctReactions.length && (
          <div className="reactions">
            <div className="container">
              { distinctReactions.map((item, i) => (
                <div className="reaction-item" key={i} dangerouslySetInnerHTML={{ __html: item.code }}>
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
        <div className="Comment item">
          Comment
        </div>
      </div>
      <div className="comments-section">
      </div>  
    </div>
  )
}
