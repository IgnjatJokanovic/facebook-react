import React from 'react'
import Context from '../../../context/context';
import FriendItem from './FriendItem';
import { ChannelList } from '../../../helpers/channels'
import { getClaims } from '../../../helpers/helpers';
import axios from 'axios';

export default function FriendNotifications() {
    const refOption = React.useRef();
    const [open, setOpen] = React.useState(false);
    const [friendRequests, setFriendRequests] = React.useState([]);
    const ctx = React.useContext(Context);
    const claims = getClaims();
    // const echo = ctx.echo;

    const toggleNavOption = e => {
        if (refOption.current.contains(e.target)) {
            return;
        }
        setOpen(false);
    };

    const handleChanChange = (payload) => {
        console.log(payload);
        let curr = [...friendRequests];
        curr.unshift(payload);
        setFriendRequests(curr);
    }

    React.useEffect(() => {
        document.addEventListener("mousedown", toggleNavOption);

        ctx.echo.channel(`${ChannelList.friends.channel}${claims.id}`).listen(ChannelList.friends.listen, (e) => {
            handleChanChange(e.user);
        });
        
        axios.get('friend/pending')
            .then(res => {
                setFriendRequests(res.data.data)
                console.log(res.data.data);
            })
            .catch(err => {

            });

        return () => {
            ctx.echo.leave(ChannelList.friends.channel)
            document.removeEventListener("mousedown", toggleNavOption);
        };
    }, []);
  return (
    <div ref={ refOption} className='item friend-notifications-container'>
          <i className='fas fa-user-friends' onClick={e => setOpen(!open)}>
            {!!friendRequests.filter(item => item.opened === false).length &&(
                  <span>{friendRequests.filter(item => item.opened === false).length}</span>
            )}
          </i>
          <div className={open ? 'dropdown active' : 'dropdown'}>
              {friendRequests.length ? friendRequests.map((item, i) => (
                <FriendItem key={i} profile={`/user/${item.id}`} img={item.profile_photo} name={item.firstName} surname={item.lastName} id={item.id} opened={item.opened} setFriendRequests={setFriendRequests} friendRequests={friendRequests} />
              )) : (
                <div className='zero-notifications'>No new notifications</div>
              )}
          </div>
    </div>
  )
}
