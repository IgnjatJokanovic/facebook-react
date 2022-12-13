import React from 'react'
import NotificationItem from './NotificationItem';

export default function Notifications() {
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
              <NotificationItem img='https://dummyimage.com/300.png/09f/fff' name='Ignjat' surname='Jokanovic' link='/posts/1' text='added new photo ddawdawdwadaawddawdawdwadwadawdawd' />
          </div>
    </div>
  )
}
