import React from 'react'
import FriendItem from './FriendItem';

export default function FriendNotifications() {
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
    <div ref={ refOption} className='item friend-notifications-container'>
          <i className='fas fa-user-friends' onClick={e => setOpen(!open)}></i>
          <div className={ open ? 'dropdown active' : 'dropdown' }>
              <FriendItem profile='/test' img='https://dummyimage.com/300.png/09f/fff' name='Ignjat' surname='Jokanovic' id='1' />
              <FriendItem profile='/test' img='https://dummyimage.com/300.png/09f/fff' name='Ignjat' surname='Jokanovic' id='1'/>
          </div>
    </div>
  )
}
