import React from 'react'
import { getClaims } from '../helpers/helpers';
import { Article, AuthUser } from '../types/types';
import NewPost from './posts/NewPost'
import axios from 'axios';
import RecomendedFriends from './RecomendedFriends';
import PostLoader from './loaders/PostLoader';
import PostItem from './posts/PostItem';

export default function Authorized() {

  const claims: AuthUser | null = getClaims();
  
  const [posts, setPosts] = React.useState([]);
  const [nextPage, setNextPage] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(true);

  const handleDelete = (index, id) => {
    let curr = posts;
    curr.splice(index, 1);
    setPosts(curr);
  }
  
  React.useEffect(() => {
    
    const loadData = () => {
      console.log(nextPage);
      if (nextPage >= 0) {
        axios.get(`/post?page=${nextPage}`)
          .then(res => {
            setPosts(prevPosts => [...prevPosts, ...res.data.data]);
            setIsLoading(false);
  
            if (res.data.next_page_url === null) {
              setNextPage(-1);
            }
  
            let lastIndex = parseInt(res.data.next_page_url[res.data.next_page_url.length - 1], 10);
            console.log(lastIndex)
            setNextPage(lastIndex);
          })
          .catch(err => {
            
          })
      } else {
        document.removeEventListener('wheel', loadData);
      }
    }

    if (!posts.length) {
      console.log('re-render');
      loadData();
    }
    
    
    document.addEventListener('wheel', loadData);
  

    return () => {
      document.removeEventListener('wheel', loadData);
    }
  }, [nextPage, posts.length])
  

  return (
    <div className='home-container'>
      <RecomendedFriends />
      <NewPost owner={claims?.id} url={'create'} />
      <div className="posts-container">
      {isLoading ? (
            <PostLoader />
          ): (
            <>
              {posts.length ? (
    
                posts.map((item, i) => (
                  <PostItem key={i} post={item} deleteCallback={() => handleDelete(i, item.id)} />
                ))
              ): (
                <div className='not-found'>No posts yet</div>
              )}
          </>
        )}
      </div>
    </div>
  )
}
