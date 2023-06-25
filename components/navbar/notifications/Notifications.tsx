import axios from 'axios';
import React from 'react'
import Context from '../../../context/context';
import { ChannelList } from '../../../helpers/channels';
import { getClaims } from '../../../helpers/helpers';
import MessageLoader from '../../loaders/MessageLoader';
import NotificationItem from './NotificationItem';
import { useSocket } from '../../../helpers/broadcasting';

export default function Notifications() {

    const ctx = React.useContext(Context);

    const claims = getClaims();

    const [notifications, setNotifications] = React.useState([]);
    const [count, setCount] = React.useState(0);
    const [nextPage, setNextPage] = React.useState(0);
    const [isLoading, setIsloading] = React.useState(true);

    const refOption = React.useRef();
    const refDropdown = React.useRef();

    const [open, setOpen] = React.useState(false);

    const toggleNavOption = e => {
        if (refOption.current.contains(e.target)) {
            return;
        }
        setOpen(false);
    };

    const markAllAsRead = () => {
        axios.post(`/notification/markAllAsRead`)
          .then(res => {
            let curr = [...notifications];
            curr.map((item, i) => {
              item.opened = true;
            })

            setNotifications(curr);
            setCount(0)
          })
          .catch(err => {
            
          })
    }

    const handleChanChange = (payload) => {
        let curr = [...notifications];
        curr.unshift(payload.notification);
        setNotifications(curr);
        setCount(prevCount => prevCount + 1);
    }
      
    const handleCancel = (payload) => {
        let curr = [...notifications];
        let index = curr.findIndex(obj => obj.id == payload.id);
      
        if (index > -1) {
          curr.splice(index, 1);
          setNotifications(curr)
        }
        
        setCount(prevCount => prevCount > 0 ? prevCount - 1 : 0);
    }
  
   
  useSocket({
    channel: `${ChannelList.notification.channel}${claims?.id}`,
    event: ChannelList.notification.listen,
    isPrivate: false,
    callBack: (payload) => {
      handleChanChange(payload);
    },
  })

  useSocket({
    channel: `${ChannelList.notificationRemoved.channel}${claims?.id}`,
    event: ChannelList.notificationRemoved.listen,
    isPrivate: false,
    callBack: (payload) => {
      handleCancel(payload);
    },
  })

    React.useEffect(() => {
        document.addEventListener("mousedown", toggleNavOption);
      
        const loadData = () => {
          if (nextPage >= 0) {
            axios.get(`/notification?page=${nextPage}`)
            .then(res => {
              setNotifications([...notifications, ...res.data.data]);
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

          axios.get('/notification/unreadCount')
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
    }, [nextPage, notifications]);


  return (
    <div ref={ refOption} className='friend-notifications-container'>
          <i className='fas fa-bell' onClick={e => setOpen(!open)}>
            {!!count  && (
              <span>{count < 100 ? count : '99+'}</span>
            )}
          </i>
          <div ref={refDropdown} className={ open ? 'dropdown active' : 'dropdown' }>
          {!!count  && (
              <div className="btn link" onClick={markAllAsRead}>Mark all as read</div>
          )}
          {isLoading ? (
                 <MessageLoader />
              ) : (
                    notifications.length ? (
                        notifications.map((item, i) => (
                          <NotificationItem 
                            key={i}
                            url={item.type == 'friendship' ? `/user/${item.creator}` : `/post/${item.post_id}`}
                            img={item.user.profile_photo?.image?.src}
                            name={item.user.firstName}
                            surname={item.user.lastName}
                            id={item.id}
                            text={item.body}
                            opened={item.opened}
                            setNotifications={setNotifications}
                            notifications={notifications}
                            setCount={setCount}
                            setOpen={setOpen}
                          />
                        ))
                    ): (
                        <div className="zero-notifications">No new notifications</div>
                    )
                    
              )}
          </div>
    </div>
  )
}
