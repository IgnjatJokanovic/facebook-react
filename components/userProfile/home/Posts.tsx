import React from 'react'
import PostItem from '../../posts/PostItem';
import PostLoader from '../../loaders/PostLoader';
import axios from 'axios';

export default function Posts({ userId, photos, setPhotos }) {
    
    const [posts, setPosts] = React.useState([]);
    const [isLoadingPosts, setIsLoadingPosts] = React.useState(true);
    const [nextPage, setNextPage] = React.useState(0);

    const handleDelete = (index, id) => {
        let curr = [...posts];
        curr.splice(index, 1);
        setPosts(curr);
    
        let currPhotos = [...photos];
        let photoIndex = currPhotos.findIndex(obj => obj.id === id);
        if (photoIndex >= 0) {
            currPhotos.splice(photoIndex, 1);
            setPhotos(currPhotos);
        }
        
    }

    const loadData = React.useCallback(() => {
        if (!isLoadingPosts || nextPage == 0) {
            if (nextPage >= 0) {
                axios.get(`/post/userRelated/${userId}?page=${nextPage}`)
                    .then(res => {
                        setPosts([...posts, ...res.data.data]);
                        setIsLoadingPosts(false);
                        if (res.data.next_page_url === null) {
                            setNextPage(-1);
                        }
                        let lastIndex = parseInt(res.data.next_page_url[res.data.next_page_url.length - 1], 10);
                        setNextPage(lastIndex);
                    })
                    .catch(err => {
                    
                    })
            } else {
                document.removeEventListener('wheel', loadData);
            }
        } 
    }, [isLoadingPosts, nextPage, posts, userId])

    React.useEffect(() => {
        setNextPage(0);
        setPosts([]);
    
      return () => {
        
      }
    }, [userId])


    React.useEffect(() => {
      
        if (!userId) {
            return;
        }

        if (!posts.length) {
            loadData();
        }

        document.addEventListener('wheel', loadData);

        return () => {
            document.removeEventListener('wheel', loadData);
        }
    }, [loadData, posts.length, userId])
    

  return (
      <>
        {posts.length ? (
            posts.map((item, i) => (
                <PostItem key={i} post={item} deleteCallback={() => handleDelete(i, item.id)} />
            ))
        ): (
            !isLoadingPosts && (
                <div className='not-found'>User has no posts</div>
            )
        )}
        {isLoadingPosts && <PostLoader />}
      </>
  )
}
