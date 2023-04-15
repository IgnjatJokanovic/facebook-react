import React from 'react'
import Context from '../../../context/context';
import MessageLoader from '../../loaders/MessageLoader';
import NotificationItem from './NotificationItem';

export default function Notifications() {

    const ctx = React.useContext(Context);

    const [isLoading, setIsLoading] = React.useState(true);
    const [notifications, setNotifications] = React.useState([]);
    const [unreadCount, setUnreadCount] = React.useState(0);
    const [nextPage, setNextPage] = React.useState(0);

    const refOption = React.useRef();
    const [open, setOpen] = React.useState(false);

    const toggleNavOption = e => {
        if (refOption.current.contains(e.target)) {
            return;
        }
        setOpen(false);
    };

    React.useEffect(() => {
         
        document.addEventListener("mousedown", toggleNavOption);

        return () => {
            document.removeEventListener("mousedown", toggleNavOption);
        };
    }, []);
  return (
    <div ref={ refOption} className='friend-notifications-container'>
          <i className='fas fa-bell' onClick={e => setOpen(!open)}></i>
          <div className={ open ? 'dropdown active' : 'dropdown' }>
          {isLoading ? (
                 <MessageLoader />
              ) : (
                    notifications.length ? (
                        notifications.map((item, i) => (
                            <MessageItem 
                                key={i}
                                img={item.profile}
                                name={item.firstName}
                                surname={item.lastName}
                                message={item.body}
                                openMessage={() => openMessage(item)}
                            /> 
                        ))
                    ): (
                        <div className="zero-notifications">No new messages</div>
                    )
                    
              )}
              
              <NotificationItem img='https://dummyimage.com/300.png/09f/fff' name='Ignjat' surname='Jokanovic' link='/posts/1' text='added new photo ddawdawdwadaawddawdawdwadwadawdawd' />
          </div>
    </div>
  )
}
