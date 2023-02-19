import axios from 'axios'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import Context from '../../../context/context';
import { getClaims, isAuthenticated } from '../../../helpers/helpers';
import { Article, AuthUser } from '../../../types/types';
import DefaultPrefixImage from '../../DefaultPrefixImage';
import NewPost from '../../posts/NewPost';
import PostItem from '../../posts/PostItem';
import PostLoader from '../loaders/PostLoader';

export default function Posts({ userId, setNavigationOption }) {
  const ctx = React.useContext(Context)

  const [photos, setPhotos] = useState([])
  const [friends, setFriends] = useState([])
  const [posts, setPosts] = useState([])

  const [isLoadingPhotos, setIsLoadingPhotos] = React.useState(true)
  const [isLoadingFriends, setIsLoadingFriends] = React.useState(true)
  const [isLoadingPosts, setIsLoadingPosts] = React.useState(true)

  const [nextPage, setNextPage] = React.useState(0);

  const renderPhotos = () => {
    setNavigationOption('photos')
  }

  const renderFriends = () => {
    setNavigationOption('friends')
  }

  const handleDelete = (index, id) => {
    let curr = posts;
    curr.splice(index, 1);
    setPosts(curr);

    let currPhotos = photos;
    let photoIndex = currPhotos.findIndex(obj => obj.id === id);
    if (photoIndex >= 0) {
      currPhotos.splice(photoIndex, 1);
    }
    setPhotos(currPhotos);
  }

  useEffect(() => {
    if (!userId) {
      return;
    }

    const loadData = () => {
      console.log(nextPage);
      if (nextPage >= 0) {
        axios.get(`/post/userRelated/${userId}?page=${nextPage}`)
        .then(res => {
          setPosts([...posts, ...res.data.data]);
          setIsLoadingPosts(false);
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


    document.addEventListener('wheel', loadData);
    
    if (!posts.length) {
      console.log('re-render');
      loadData();
    }

    // Load few images for photos tab
    axios.get(`/post/userRelated/photos/${userId}/1`)
        .then(res => {
          setPhotos(res.data);
          setIsLoadingPhotos(false);
        })
        .catch(err => {
          
        })
    
    // Load few images for photos tab
    axios.get(`/friend/userFriends/${userId}/1`)
        .then(res => {
          setFriends(res.data);
          setIsLoadingFriends(false);
        })
        .catch(err => {
          
        })
    
    return () => {
      document.removeEventListener('wheel', loadData);
    };

  }, [nextPage, photos.length, posts, userId])
  

  return (
    <div className='posts'>
      <div className="options">
        <div className='item photos-container'>
            <div className="heading">
                <span>Photos</span>
                <span className='link' onClick={renderPhotos}>Show all photos</span>
            </div>
            <div className={isLoadingPhotos ? "body loading" : "body"}>
              {isLoadingPhotos ? (
                <>
                  <div className="loading-item"></div>
                  <div className="loading-item"></div>
                  <div className="loading-item"></div>
                </>
              ): (
                <>
                  {photos.length ? (
        
                    photos.map((item, i) => (
                      <Link key={i} href={`/post/${item.id}`}>
                        <img src={item.image.src} alt="" />  
                      </Link>
                    ))
                  ): (
                    <div className='not-found'>User has no photos</div>
                  )}
                </>
              )}
            </div>
        </div>
        <div className='item friends-container'>
            <div className="heading">
                <span>Friends</span>
                <span className='link' onClick={renderFriends}>Show all friends</span>
            </div>
            <div className={isLoadingFriends ? "body loading" : "body friends"}>
              {isLoadingFriends ? (
                <>
                  <div className="loading-item"></div>
                  <div className="loading-item"></div>
                  <div className="loading-item"></div>
                </>
              ): (
                <>
                  {friends.length ? (
        
                    friends.map((item, i) => (
                      <Link key={i} href={`/user/${item.id}`}>
                        <DefaultPrefixImage src={item.profile} alt={`${item.firstName} ${item.lastName}`} /> 
                        <div className='name'>{item.firstName} {item.lastName}</div>
                      </Link>
                    ))
                  ): (
                    <div className='not-found'>User has no friends</div>
                  )}
              </>
              )}
            </div>
        </div>
      </div>
      <div className="actual-posts">
        {!!(ctx.authenticated && userId) && (
          <NewPost owner={userId} url={'create'} />
        )}
        {isLoadingPosts ? (
            <PostLoader />
          ): (
            <>
              {posts.length ? (
    
                posts.map((item, i) => (
                  <PostItem key={i} post={item} deleteCallback={() => handleDelete(i, item.id)} />
                ))
              ): (
                <div className='not-found'>User has no posts</div>
              )}
          </>
        )}
      </div>
    </div>
  )
}
