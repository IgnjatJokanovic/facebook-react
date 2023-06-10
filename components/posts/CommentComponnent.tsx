import axios from 'axios';
import Link from 'next/link';
import React from 'react'
import ContentEditable from 'react-contenteditable';
import Context from '../../context/context';
import { getClaims, validateComment } from '../../helpers/helpers';
import { Comment } from '../../types/types';
import DefaultPrefixImage from '../DefaultPrefixImage';
import CommentLoader from '../loaders/CommentLoader';
import CommentForm from './CommentForm';
import CommentItem from './CommentItem';

export default function CommentComponnent({ postId, owner }) {
    const [comments, setComments] = React.useState<[Comment]>([]);
    const [isLoadingComments, setIsLoadingComments] = React.useState(true)
    const [nextPage, setNextPage] = React.useState(0);
    const claims = getClaims();
    
    const [comment, setComment] = React.useState<Comment>({
      body: '',
      user_id: claims?.id,
      post_id: postId,
      comment_id: null,
    })
    
    const ctx = React.useContext(Context);
    
    const handleChange = e => {
      setComment({ ...comment, body: e.target.value })
    }
  
    const setBody = (body) => {

      if (comment.body === null) {
        setComment({ ...comment, body: body })
      }
      else {
        var newValue = comment.body + body;
        setComment({ ...comment, body: newValue })
      }
    }
  
    const handleSubmit = () => {
      validateComment(comment)
        .then(() => {
          axios.post('/comment/create', comment)
            .then(res => {
              ctx.setAlert(res.data.msg, 'success');
              let curr = [...comments];
              curr.push(res.data.data);
              setComments(curr);
              setComment({...comment, body: ''})
            })
            .catch(err => {
              ctx.setAlert(err.response.data.err, 'error');
            });
        })
        .catch(err => {
          ctx.setAlert(err, 'error');
        });
    }

    const loadData = React.useCallback(() => {
       if (nextPage >= 0) {
        axios.get(`/comment/postRelated/${postId}?page=${nextPage}`)
        .then(res => {
        
          setIsLoadingComments(false);
          if (res.data.next_page_url === null) {
            setNextPage(-1);
          } else {
            let lastIndex = parseInt(res.data.next_page_url[res.data.next_page_url.length - 1], 10);
            setNextPage(lastIndex);
          }
          setComments(prevComments => [...prevComments, ...res.data.data]);
        })
        .catch(err => {
          
        })
      }
    }, [nextPage, postId])

    React.useEffect(() => {
      if (nextPage == 0) {
          loadData();
       }
     
    }, [comments.length, loadData, postId, isLoadingComments, nextPage])
    
  return (
    <div className='comments-section'>
        {isLoadingComments ? (
          <CommentLoader/>
        ): (
          <>
            {comments.length ? comments.map((item, i) => (
              <CommentItem
                key={i}
                comment={item}
                comments={comments}
                setComments={setComments}
                postId={postId}
                owner={owner}
              />
            )): null}

            {nextPage >= 0 ? (
              <div className='load-more' onClick={loadData}>Load more</div>
            ) : null}
            
            {ctx.authenticated  && (
              <div className="new-comment-form">
                <div className="profile">
                  <Link href={`/user/${claims?.id}`}>
                    <DefaultPrefixImage src={claims?.profile?.image?.src} alt={`${claims?.firstName} ${claims?.lastName}`}/>
                  </Link>
                </div>
                <CommentForm
                  comment={comment}
                  handleChangeCallback={handleChange}
                  setBodyCallback={setBody}
                />
                <div className="btn" onClick={handleSubmit}>Comment</div>
              </div>
            )}
          </>
        )}
    </div>
  )
}
