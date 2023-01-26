import React from 'react'
import Context from '../../../context/context';
import FriendItem from './FriendItem';
import { ChannelList } from '../../../helpers/channels'

export default function FriendNotifications() {
    const refOption = React.useRef();
    const [open, setOpen] = React.useState(false);
    const ctx = React.useContext(Context);
    const echo = ctx.echo;

    const toggleNavOption = e => {
        if (refOption.current.contains(e.target)) {
            return;
        }
        setOpen(false);
    };

    React.useEffect(() => {
        document.addEventListener("mousedown", toggleNavOption);

        ctx.echo.channel(ChannelList.friends.channel)
        .listen(ChannelList.friends.listen, (e) => {
            console.log(e);
        });

        return () => {
            ctx.echo.leave('private-chat')
            document.removeEventListener("mousedown", toggleNavOption);
        };
    }, []);
  return (
    <div ref={ refOption} className='item friend-notifications-container'>
          <i className='fas fa-user-friends' onClick={e => setOpen(!open)}></i>
          <div className={ open ? 'dropdown active' : 'dropdown' }>
              <FriendItem profile='/user/1' img='https://dummyimage.com/300.png/09f/fff' name='Ignjat' surname='Jokanovic' id='1' />
              <FriendItem profile='/user/1' img='https://dummyimage.com/300.png/09f/fff' name='Ignjat' surname='Jokanovic' id='1'/>
          </div>
    </div>
  )
}
