import React from 'react'
import Context from '../../../context/context';
import FriendItem from './FriendItem';
import { ChannelList } from '../../../helpers/channels'
import { getClaims } from '../../../helpers/helpers';
import axios from 'axios';
import MessageLoader from '../../loaders/MessageLoader';
import { useSocket } from '../../../helpers/broadcasting';

export default function FriendNotifications() {
    const ctx = React.useContext(Context);
    const refOption = React.useRef();
    const refDropdown = React.useRef();
    
    const [open, setOpen] = React.useState(false);
    const [friendRequests, setFriendRequests] = React.useState([]);
    const [count, setCount] = React.useState(0);
    const [nextPage, setNextPage] = React.useState(0);
    const [isLoading, setIsloading] = React.useState(true);
    
    const claims = getClaims();
    // const echo = ctx.echo;

    const toggleNavOption = e => {
        if (refOption.current.contains(e.target)) {
            return;
        }
        setOpen(false);
    };
  
    const handleChanChange = (payload) => {
      let curr = [...friendRequests];
      curr.unshift(payload.user);
      setFriendRequests(curr);
      setCount(prevCount => prevCount + 1);
    }
    
    const handleCancel = (payload) => {
      let curr = [...friendRequests];
      let index = curr.findIndex(obj => obj.id == payload.id);
    
      if (index > -1) {
        curr.splice(index, 1);
        setFriendRequests(curr)
      }
      
      setCount(prevCount => prevCount > 0 ? prevCount - 1 : 0);
    }
  
    const markAllAsRead = () => {
        axios.post(`/friend/markAllAsRead`)
          .then(res => {
            let curr = [...friendRequests];
            curr.map((item, i) => {
              item.opened = true;
            })

            setFriendRequests(curr);
            setCount(0)
          })
          .catch(err => {
            
          })
    }
  
    useSocket({
      channel: `${ChannelList.friends.channel}${claims?.id}`,
      event: ChannelList.friends.listen,
      isPrivate: false,
      callBack: (payload) => {
        handleChanChange(payload);
      },
    })
  
    useSocket({
      channel: `${ChannelList.friendCanceled.channel}${claims?.id}`,
      event: ChannelList.friendCanceled.listen,
      isPrivate: false,
      callBack: (payload) => {
        handleCancel(payload);
      },
    })

    

    React.useEffect(() => {
        document.addEventListener("mousedown", toggleNavOption);
      
        const loadData = () => {
          if (nextPage >= 0) {
            axios.get(`/friend/pending?page=${nextPage}`)
            .then(res => {
              setFriendRequests([...friendRequests, ...res.data.data]);
              setIsloading(false);
              if (res.data.next_page_url === null) {
                setNextPage(-1);
              }
              let lastIndex = parseInt(res.data.next_page_url[res.data.next_page_url.length - 1], 10);
              setNextPage(lastIndex);
            })
            .catch(err => {
              
            })
          } else {
            refDropdown?.current?.removeEventListener('wheel', loadData);
          }
        }
        
        if(nextPage == 0){
          loadData();

          axios.get('/friend/unreadCount')
            .then(res => {
              setCount(res.data);
            })
            .catch(err => {

            })
        }
      
        refDropdown?.current?.addEventListener('wheel', loadData);

        return () => {
            document.removeEventListener("mousedown", toggleNavOption);
            refDropdown?.current?.removeEventListener('wheel', loadData);
        };
    }, [friendRequests, nextPage]);
  
  return (
    <div ref={ refOption} className='item friend-notifications-container'>
          <i className='fas fa-user-friends' onClick={e => setOpen(!open)}>
            {!!count  && (
              <span>{count < 100 ? count : '99+'}</span>
            )}
          </i>
          <div ref={refDropdown} className={open ? 'dropdown active' : 'dropdown'}>
            {!!count  && (
              <div className="btn link" onClick={markAllAsRead}>Mark all as read</div>
            )}
             
              
              {isLoading ? (
                 <MessageLoader />
              ) : (
                friendRequests.length ? friendRequests.map((item, i) => (
                  <FriendItem
                    key={i}
                    profile={`/user/${item.id}`}
                    img={item.profile_photo?.image.src}
                    name={item.firstName}
                    surname={item.lastName}
                    id={item.id}
                    opened={item.opened}
                    setFriendRequests={setFriendRequests}
                    friendRequests={friendRequests}
                    setCount={setCount}
                    setOpen={setOpen}
                  />
                )) : (
                  <div className='zero-notifications'>No new notifications</div>
                )  
              )}
          </div>
    </div>
  )
}
