import Link from 'next/link'
import React from 'react'

export default function Posts({ userId, setNavigationOption }) {

  const renderPhotos = () => {
    setNavigationOption('photos')
  }

  const renderFriends = () => {
    setNavigationOption('friends')
  }
  return (
    <div className='posts'>
      <div className="options">
        <div className='item photos-container'>
            <div className="heading">
                <span>Photos</span>
                <span className='link' onClick={renderPhotos}>Show all photos</span>
            </div>
            <div className="body">
              <Link href='/post/1'>
                <img src="/default_profile.png" alt="" />  
            </Link>
            <Link href='/post/1'>
                <img src="/default_profile.png" alt="" />  
            </Link>
            <Link href='/post/1'>
                <img src="/default_profile.png" alt="" />  
            </Link>
            <Link href='/post/1'>
                <img src="/default_profile.png" alt="" />  
              </Link>
            </div>
        </div>
        <div className='item friends-container'>
            <div className="heading">
                <span>Friends</span>
                <span className='link' onClick={renderFriends}>Show all friends</span>
            </div>
            <div className="body">

            </div>
        </div>
      </div>
      <div className="actual-posts">
        
      </div>
    </div>
  )
}
