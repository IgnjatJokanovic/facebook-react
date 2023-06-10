import React from 'react'
import { useRouter } from 'next/router'
import Home from '../../components/userProfile/home/Home'
import Photos from '../../components/userProfile/photos/Photos'
import Friends from '../../components/userProfile/firends/Friends'
import Information from '../../components/userProfile/information/Information'
import Context from '../../context/context'
import OpenableImage from '../../components/OpenableImage'
import axios from 'axios'
import { getClaims, login, refreshToken, validateActiveUser } from '../../helpers/helpers'
import { Article, User } from '../../types/types'
import ImageModal from '../../components/ImageModal'
import DefaultPrefixImage from '../../components/DefaultPrefixImage'
import Link from 'next/link'
import Posts from '../../components/userProfile/posts/Posts'
import moment from 'moment'

export default function UserProfile() {
  const ctx = React.useContext(Context);
  const defaultCover = "/default_cover.png"
  const defaultProfile = "/default_profile.png"
  const claims = getClaims();

  const router = useRouter()

  const [user, setUser] = React.useState<User>({})

  const [isProfile, setisprofile] = React.useState(false);
  const [post, setPost] = React.useState({
    owner: claims?.id,
    creator: claims?.id,
    image: {
      id: null,
      src: ''
    }
  });

  

  const refDropdown = React.useRef();
  const refFile = React.useRef();
  
  const [open, setOpen] = React.useState(false)

  const userId = router.query.userId;
  const [navigationOption, setNavigationOption] = React.useState('posts')

  const toggleOpen = e => {
      if (refDropdown.current.contains(e.target)) {
          return;
      }
      setOpen(false);
  };

  const renderContent = React.useCallback(() => {
    switch(navigationOption) {
      case 'info':
        return <Information firstName={user.firstName} lastName={user.lastName} birthDay={moment(user.birthday).format("D MMM Y")} showEdit={claims?.id == userId} />;
      case 'friends':
        return <Friends userId={userId} />;
      case 'photos':
        return <Photos userId={userId} owner={claims?.id == userId} />;
      default:
        return <Home userId={userId} setNavigationOption={setNavigationOption} owner={claims?.id == userId} />;
    }
  }, [claims?.id, navigationOption, user.birthday, user.firstName, user.lastName, userId])

  const addFriend = () => {
    validateActiveUser()
      .then(() => {
        axios.post('/friend/add', { to: user.id })
          .then(res => {
            setUser({ ...user, isFriends: res.data.data })
            ctx.setAlert(res.data.msg, 'success')
          })
          .catch(err => {
            ctx.setAlert(err.response.data, 'error');
          })
      })
      .catch(err => {
        ctx.setAlert(err, 'error');
      })
  }

  const removeFriend = (msg = "Removed friend") => {
    axios.post('/friend/decline', { id: user.id })
      .then(res => {
        setUser({ ...user, isFriends: null })
        ctx.setAlert(msg, 'success')
      })
      .catch(err => {
        ctx.setAlert(err.response.data, 'error');
      })
  }

  const accept = () => {
    axios.post('friend/accept', {id: user.id})
      .then(res => {
        let isFriends = user.isFriends;
        isFriends.accepted = true;
        setUser({...user, isFriends: isFriends})
        ctx.setAlert(res.data, 'success')
      })
      .catch(err => {
        ctx.setAlert(err.response.data, 'error');
      });
  }

  const openFile = (profile: boolean) => {
    setisprofile(profile);
    refFile.current.click();
  }

  const updateImage = (image) => {
    let imageObj = post.image;
    
    imageObj.src = image;
    setPost({ ...post, image: imageObj });
  }

  const previewCover = () => {
    if (user.cover_photo != null) {
      router.push(`/post/${user.cover_photo.id}`);
    }
  }

  const handleUpload = () => {
    let article = post;
    post.isProfile = isProfile;

    axios.post('/post/create', article)
      .then(async res => {
        ctx.setAlert(res.data.msg, "success");
        
        if (isProfile) {
          setUser({ ...user, profile_photo: res.data.data });
        } else {
          setUser({ ...user, cover_photo: res.data.data });
        }

        handleCancel();

        await refreshToken();
      })
      .catch(err => {
        ctx.setAlert(res.response.data.error, "error");
      });
  }

  const handleCancel = () => {
    let imageObj = {
      id: null,
      src: ''
    };
    setPost({ ...post, image: imageObj });
  }

  const openMessage = () => {
    let userObj = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      profile: user.profile_photo?.image?.src,
    }

    ctx.openMessage(userObj);
    setOpen(false);
  }

  React.useEffect(() => {

    if (!userId) {
      return;
    }

    if (Object.keys(user).length === 0 || user.id != parseInt(userId)) {
      axios.get(`/user/show/${userId}`)
        .then(res => {
          setUser(res.data);
        })
        .catch(err => {
          router.push('/404/user')
        });
    }

   

    renderContent()
    document.addEventListener("mousedown", toggleOpen);

    return () => {
        document.removeEventListener("mousedown", toggleOpen);
    };
  }, [router.isReady, userId, navigationOption, user, renderContent, router])
  
  return (
    <div className='user-profile-container'>
      <ImageModal
        open={post.image.src.length}
        src={post.image.src}
        togleFun={handleCancel}
        displayBtns={true}
        saveCallback={handleUpload}
      />
      <input type="file" ref={refFile} className="d-none" onChange={e => ctx.handleFileRead(e, updateImage)} />
      <div className="cover-photo-container">
        <div onClick={previewCover} className={Object.keys(user).length === 0 ? "cover-pohoto loading" : "cover-pohoto photo"} style={{ '--bg-image': `url('${user.cover_photo?.image?.src != null ? process.env.NEXT_PUBLIC_BACKEND_BASE_URL + user.cover_photo?.image?.src : defaultCover}')` }}></div>
        <div className="profile-picture-container">
          {Object.keys(user).length === 0 ? (
            <div className="img">
              <div className="img-loader"></div>
              <div className="info loading"></div>
            </div>
          ): (
            <div className="img">
              <DefaultPrefixImage 
                src={user.profile_photo?.image?.src}
                alt={`${user?.firstName} ${user?.lastName}`}
                url={user.profile_photo != null ? `/post/${user.profile_photo.id}` : ''} 
              />
              <div className="info">
                {user.firstName} {user.lastName}
              </div>
            </div>
          )}
          {ctx.authenticated ? (
            <div className="buttons" ref={refDropdown}>
              <div className={open ? 'dropdown active' : 'dropdown'}>
                {
                  (() => {
                      if (claims?.id === user?.id)
                          return (
                            <>
                              <div onClick={() => openFile(true)} className="button">
                                Change profile photo
                              </div>
                              <div onClick={() => openFile(false)} className="button">
                                Change cover photo
                              </div>
                            </>
                          )
                      if (user?.isFriends === null)
                          return (
                            <>
                              <div onClick={addFriend} className="button">
                                Add friend
                              </div>
                              <div className="button" onClick={() => openMessage()}>
                                Send Message
                              </div>
                            </>
                          )
                      if (user?.isFriends?.from === claims?.id)
                        return (
                          <>
                            <div onClick={() => removeFriend()} className="button">
                              {user.isFriends?.accepted ? "Remove friend" : "Cancel request"}
                            </div>
                            <div className="button" onClick={() => openMessage()}>
                              Send Message
                            </div>
                          </>
                        )
                      if (user?.isFriends?.from !== claims?.id && user?.isFriends?.accepted)
                      return (
                        <>
                          <div onClick={() => removeFriend()} className="button">
                            Remove friend
                          </div>
                          <div className="button" onClick={() => openMessage()}>
                            Send Message
                          </div>
                        </>
                      )
                      else
                        return (
                          <>
                            <div onClick={accept} className="button">
                              Accept
                            </div>
                            <div onClick={() => removeFriend("Declined friend request")} className="button">
                              Decline
                            </div>
                            <div className="button" onClick={() => openMessage()}>
                              Send Message
                            </div>
                          </>
                        )
                  })()
                }
              </div>
              <span onClick={() => setOpen(!open)}>...</span>
            </div> 
          ): null}
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
