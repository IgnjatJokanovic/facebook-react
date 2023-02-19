import React from 'react'

export default function ProfileLoader() {
  return (
    <>
      <div className="cover-photo-container">
        <div className={userId !== undefined && Object.keys(user).length === 0 ? "cover-pohoto loading" : "cover-pohoto photo"} style={{ '--bg-image': `url('${img ?? defaultCover}')` }}></div>
        <div className="profile-picture-container">
          <div className="img">
            <OpenableImage src={img ?? defaultProfile} alt="" />
            <div className="info">
              {user?.firstName} {user?.lastName}
            </div>
          </div>
        </div>
      </div>
      <div className="navigation">
        <div className={ navigationOption === 'posts' ? 'item active': 'item' } onClick={() => setNavigationOption('posts')}>
          Posts
        </div>
        <div className={ navigationOption === 'info' ? 'item active': 'item' } onClick={() => setNavigationOption('info')}>
          Information
        </div>
        <div className={ navigationOption === 'friends' ? 'item active': 'item' } onClick={() => setNavigationOption('friends')}>
          Friends
        </div>
        <div className={ navigationOption === 'photos' ? 'item active': 'item' } onClick={() => setNavigationOption('photos')}>
          Photos
        </div>
      </div>
    </>
  )
}
