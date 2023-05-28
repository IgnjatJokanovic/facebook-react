import React from 'react'
import Link from 'next/link'
import DefaultPrefixImage from '../../DefaultPrefixImage'
import axios from 'axios'
import { useRouter } from 'next/router';
import Context from '../../../context/context';

export default function FriendItem({ profile, img, name, surname, id, opened = false, setFriendRequests, friendRequests, setCount }) {
  const router = useRouter();
  const ctx = React.useContext(Context);

  const markAsRead = () => {
    if (opened) {
      router.push(profile);
    } else {
      axios.post('friend/markAsRead', {id: id})
        .then(res => {
          let curr = [...friendRequests];
          let index = curr.findIndex(obj => obj.id == id);
          curr[index].opened = true;
          setFriendRequests(curr);
          router.push(profile);
          setCount(prevCount => prevCount > 0 ? prevCount - 1 : 0);
        })
        .catch(err => {
          ctx.setAlert(err.response.data, 'error');
        });
    }
    
  }

  const accept = () => {
    axios.post('friend/accept', {id: id})
      .then(res => {
        let curr = [...friendRequests];
        let index = curr.findIndex(obj => obj.id == id);

        if (!curr[index].opened) {
          setCount(prevCount => prevCount > 0 ? prevCount - 1 : 0);
        }

        curr.splice(index, 1);
        setFriendRequests(curr);

        ctx.setAlert(res.data, 'success')
      })
      .catch(err => {
        ctx.setAlert(err.response.data, 'error');
      });
  }

  const decline = () => {
    axios.post('friend/decline', {id: id})
      .then(res => {
        let curr = [...friendRequests];
        let index = curr.findIndex(obj => obj.id == id);
        
        curr.splice(index, 1);

        setFriendRequests(curr);

        ctx.setAlert(res.data, 'success')
      })
      .catch(err => {
        ctx.setAlert(err.response.data, 'error');
      });
    
  }
  return (
    <div className={opened ? "item friend-item" : "item friend-item unread"}>
          <div onClick={markAsRead} className='link'>
          <DefaultPrefixImage src={img} alt={`${name} ${surname}`} />
            <span>{name} {surname}</span>
          </div>
          <div className="actions">
            <div className='btn' onClick={accept}>Accept</div>
            <div className='btn' onClick={decline}>Decline</div>
          </div>
    </div>
  )
}
