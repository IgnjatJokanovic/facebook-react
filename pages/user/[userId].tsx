import React from 'react'
import { useRouter } from 'next/router'
import Posts from '../../components/userProfile/posts/Posts'
import Photos from '../../components/userProfile/photos/Photos'
import Friends from '../../components/userProfile/firends/Friends'
import Information from '../../components/userProfile/information/Information'

export default function UserProfile() {
  const defaultCover = "/default_cover.png"
  const defaultProfile = "/default_profile.png"

   const refDropdown = React.useRef();
  
  const [open, setOpen] = React.useState(false)
  const img = null
  const userId = useRouter().query.userId;
  const [navigationOption, setNavigationOption] = React.useState('posts')

  const toggleOpen = e => {
      if (refDropdown.current.contains(e.target)) {
          return;
      }
      setOpen(false);
  };

  const renderContent = () => {
    console.log(`rendering${navigationOption}`)
    switch(navigationOption) {
      case 'info':
        return <Information userId={userId} />;
      case 'friends':
        return <Friends userId={userId} />;
      case 'photos':
          return  <Photos userId={userId} />;
      default:
        return <Posts userId={userId} setNavigationOption={setNavigationOption} />;
    }
  }

  React.useEffect(() => {

    renderContent()
  
    document.addEventListener("mousedown", toggleOpen);

    return () => {
        document.removeEventListener("mousedown", toggleOpen);
    };
  }, [userId, navigationOption])
  
  return (
    <div className='user-profile-container'>
      <div className="cover-photo-container">
        <div className="cover-pohoto" style={{ '--bg-image': `url('${img ?? defaultCover}')` }}></div>
        <div className="profile-picture-container">
          <div className="img">
            <img src={img ?? defaultProfile} alt="" />
            <div className="info">
              Ignjat Jokanovic
            </div>
          </div>
          <div className="buttons" ref={refDropdown}>
            <div className={open ? 'dropdown active' : 'dropdown'}>
              <div className="button">
                Send friend request
              </div>
              <div className="button">
                Send friend request
              </div>
            </div>
            <span onClick={() => setOpen(!open)}>...</span>
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
      <div className="main-content-container">
          {renderContent()} 
      </div>
    </div>
  )
}
