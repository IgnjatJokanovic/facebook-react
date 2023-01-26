import moment from 'moment'
import Link from 'next/link'
import React from 'react'
import { getClaims } from '../../helpers/helpers';
import OpenableImage from '../OpenableImage'

export default function PostItem({ post, isEditable = false, setArticle = () => { } }) {
  const createdAt = moment(post.created_at).diff(moment(), 'days') > 7 ? moment(post.created_at).format('d. MMM, YYYY') : moment(post.created_at).fromNow();
  const claims = getClaims();
  
  const [activeEdit, setActiveEdit] = React.useState(false);

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

    React.useEffect(() => {
        document.addEventListener("mousedown", toggleEdit);

        return () => {
            document.removeEventListener("mousedown", toggleEdit);
        };
    }, []);
  
  return (
    <div className="single-post-container">
      {isEditable && (post.owner.id === claims.id || post.creator.id === claims.id) ? (
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
      ) : null}
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
                  &nbsp;<span>is feeling <span className='bold'>{post.emotion.desctiption}</span></span>
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
        <div className="comments-section">
        </div>  
    </div>
  )
}
