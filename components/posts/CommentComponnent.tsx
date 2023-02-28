import axios from 'axios';
import React from 'react'
import CommentLoader from '../loaders/CommentLoader';

export default function CommentComponnent({ postId }) {
    const [comments, setComments] = React.useState([]);
    const [isLoadingComments, setIsLoadingComments] = React.useState(true)
    const [nextPage, setNextPage] = React.useState(0);

    const loadData = React.useCallback(() => {
       if (nextPage >= 0) {
        axios.get(`/comment/postRelated/${postId}?page=${nextPage}`)
        .then(res => {
        
          setIsLoadingComments(false);
          if (res.data.next_page_url === null) {
            setNextPage(-1);
          } else {
            let lastIndex = parseInt(res.data.next_page_url[res.data.next_page_url.length - 1], 10);
            console.log(lastIndex)
            setNextPage(lastIndex);
          }
          setComments([...comments, ...res.data]);
        })
        .catch(err => {
          
        })
      }
    }, [comments, nextPage, postId])

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
            {nextPage >= 0 ? (
              <div className='link' onClick={loadData}>Load more</div>
            ): null}
            <div className="new-comment-form">TEST</div>
          </>
        )}
    </div>
  )
}
