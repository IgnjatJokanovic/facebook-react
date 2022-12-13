import React from 'react'
import MessageItem from './MessageItem';

export default function MessageNotifications() {
    const refOption = React.useRef();
    const [open, setOpen] = React.useState(false);

    const searchMessages = data => {
        console.log(data)
    }

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
          <i className='fas fa-envelope-square' onClick={e => setOpen(!open)}>
              <span>10</span>
          </i>
          <div className={open ? 'dropdown active' : 'dropdown'}>
              <form onInput={e => searchMessages(e.target.value)}>
                  <input type="text" placeholder='Search messages'/>
              </form>
              <MessageItem img='https://dummyimage.com/300.png/09f/fff' name='Ignjat' surname='Jokanovic' lastMessage='Test' setOpen={setOpen} />
          </div>
    </div>
  )
}
