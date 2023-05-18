import axios from 'axios'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import Context from '../../../context/context';
import DefaultPrefixImage from '../../DefaultPrefixImage';
import NewPost from '../../posts/NewPost';
import Posts from './Posts';

export default function Home({ userId, setNavigationOption }) {
  const ctx = React.useContext(Context)

  const [photos, setPhotos] = useState([])
  const [friends, setFriends] = useState([])

  const [isLoadingPhotos, setIsLoadingPhotos] = React.useState(true)
  const [isLoadingFriends, setIsLoadingFriends] = React.useState(true)

  const renderPhotos = () => {
    setNavigationOption('photos')
  }

  const renderFriends = () => {
    setNavigationOption('friends')
  }

  useEffect(() => {
    if (!userId) {
      return;
    }

    // Load few images for photos tab
    axios.get(`/post/userRelated/photos/${userId}/1`)
        .then(res => {
          setPhotos(res.data);
          setIsLoadingPhotos(false);
        })
        .catch(err => {
          
        })
    
    // Load few friends for friends tab
    axios.get(`/friend/userFriends/${userId}/1`)
        .then(res => {
          setFriends(res.data);
          setIsLoadingFriends(false);
        })
        .catch(err => {
          
        })
    
    return () => {
      
    };

  }, [userId])
  

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
                        <DefaultPrefixImage src={item.image.src} alt="" />  
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
        <Posts
          userId={userId}
          photos={photos}
          setPhotos={setPhotos}
        />
      </div>
    </div>
  )
}
