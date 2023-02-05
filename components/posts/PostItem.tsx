import moment from 'moment'
import Link from 'next/link'
import React from 'react'
import Context from '../../context/context';
import { ChannelList } from '../../helpers/channels';
import { getClaims } from '../../helpers/helpers';
import OpenableImage from '../OpenableImage';
import axios from 'axios';
import { useSocket } from '../../helpers/broadcasting';

export default function PostItem({ post, setPost, isEditable = false, setArticle = () => { } }) {
  const createdAt = moment(post.created_at).diff(moment(), 'days') > 7 ? moment(post.created_at).format('d. MMM, YYYY') : moment(post.created_at).fromNow();
  const claims = getClaims();

  const ctx = React.useContext(Context);
  const reactions = ctx.reactions;
  
  const [activeEdit, setActiveEdit] = React.useState(false);
  const [reactionsCount, setReactionsCount] = React.useState(0);

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
        setPost({...post, currentUserReaction: res.data.data})
      })
      .catch();
  }

  const test = (test) => {
    console.log('test');
  }

  // const handleChanChange = (e) => {
  //   var reactions = post.distinct_reactions;
  //   console.log(e)
  //   if (e.action === 'add') {
      
  //     if (reactions.filter(item => item.id === e.reaction.emotion.id).length <= 0) {
  //       var apendable = e.reaction.emotion;
  //       apendable.reaction_count = 1;
  //       reactions.push(apendable);
  //       setPost({ ...post, distinct_reactions: reactions });
  //     } else {
  //       var existingIndex = reactions.findIndex(item => item.id == e.reaction.emotion.id);
  //       var newObj = reactions[existingIndex];
  //       newObj.reaction_count += 1;
  
  //       reactions[existingIndex] = newObj;
  
  //       setPost({...post, distinct_reactions: reactions});
  //     }

     
  //     // reactions.push()
  //     // setArticle(...setArticle, )
  //   } else {
  //     var curr = reactions.filter(item => item.id === e.reaction.emotion.id);
  //     var newCount = curr.reaction_count - 1;
  //     var index = reactions.findIndex(item => item.id == e.reaction.emotion.id);
  //     if (newCount <= 0) {
  //       reactions.splice(index, 1);
  //     } else {
  //       curr.reaction_count = newCount;
  //       reactions[index] = curr;
  //     }

  //     setPost({...post, distinct_reactions: reactions});
  //   }
  // }



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
          // RADI NE DIRAJ
        // var chan = `${ChannelList.postReaction.channel}${post.id}`
        // ctx.echo.channel(chan)
        // .listen(ChannelList.postReaction.listen, (e) => {
        //     if(e.action === 'add'){
        //       var reactions = post.distinct_reactions;
        //       if (reactions.filter(item => item.id === e.reaction.emotion.id).length <= 0) {
        //         var apendable = e.reaction.emotion;
        //         apendable.reaction_count = 1;
        //         reactions.push(apendable);
        //         setPost({...post, distinct_reactions: reactions});
        //       }

        //       var existingIndex = reactions.findIndex(item => item.id == e.reaction.emotion.id);
        //       var newObj = reactions[existingIndex];
        //       newObj.reaction_count += 1;

        //       reactions[existingIndex] = newObj;

        //       setPost({...post, distinct_reactions: reactions});
        //       // reactions.push()
        //       // setArticle(...setArticle, )
        //     }
        //     console.log(e)
        // });
      
        
      
        if(post.distinct_reactions.length) {
          var reactions = post.distinct_reactions;
          var rctCount = reactions.reduce(function (acc, obj) { return acc + obj.reaction_count; }, 0);
          console.log('test');
          setReactionsCount(rctCount);
         
        }

        return () => {
            // ctx.echo.leave(chan)
            document.removeEventListener("mousedown", toggleEdit);
        };
    }, [reactionsCount]);
  
  return (
    <div className="single-post-container">
      {!!ctx.authenticated && (
        isEditable && (post.owner.id === claims?.id || post.creator.id === claims?.id) ? (
          <div className="post-actions" ref={refEdit}>
            <div className={activeEdit ? 'dropdown active' : 'dropdown'}>
              {post.owner.id === claims.id || post.creator.id === claims.id ? (
                <>
                  <div className='item' onClick={setEditArticle}>Edit</div>
                  <div className='item'>Delete</div>
                </>
              ): (
                <div className='item'>Delete</div>
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
              <Link href={`/user/${post.creator.id}`}>
                {post.creator.firstName} {post.creator.lastName}
              </Link>
            </>
          )}
        </div>
        <div className="other">
          {!!post.emotion && (
            <span>
              <span dangerouslySetInnerHTML={{ __html: post.emotion.code}}></span>
              &nbsp;<span>is feeling <span className='bold'>{post.emotion.description}</span></span>
            </span>
          )}
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
        {post.distinct_reactions.length ? (
          <div className="reactions">
            <div className="container">
              {post.distinct_reactions.map((item, i) => (
                <div className="reaction-item" key={i} dangerouslySetInnerHTML={{ __html: item.code }}>
                </div>
              ))}
            </div>
            <div className="counter">
              {post.distinct_reactions.reduce(function (acc, obj) { return acc + obj.reaction_count; }, 0)}
            </div>
          </div>
        ): null}
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
        {post.currentUserReaction === null ? (
          <span>React</span>
        ): (
          <span onClick={() => handleReact(post.currentUserReaction.emotion.id) }><span dangerouslySetInnerHTML={{ __html: post.currentUserReaction.emotion.code }}></span> {post.currentUserReaction.emotion.description}</span>
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
