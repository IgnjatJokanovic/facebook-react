import Link from 'next/link'
import { useRouter } from 'next/router';
import React from 'react'
import Context from '../../../context/context';
import axios from 'axios';
import DefaultPrefixImage from '../../DefaultPrefixImage';

export default function NotificationItem({ url, img, name, surname, id, text, opened, setNotifications, notifications, setCount }) {
  
  const router = useRouter();
  const ctx = React.useContext(Context);
  
  const markAsRead = () => {
    if (opened) {
      router.push(url);
    } else {
      axios.post('notification/markAsRead', {id: id})
        .then(res => {
          let curr = [...notifications];
          let index = curr.findIndex(obj => obj.id == id);
          curr[index].opened = true;
          setNotifications(curr);
          router.push(url);
          setCount(prevCount => prevCount > 0 ? prevCount - 1 : 0);
        })
        .catch(err => {
          ctx.setAlert(err.response.data, 'error');
        });
    }
    
  }
  
  return (
    <div className={opened ? 'item notification-item' : 'item notification-item unread'} onClick={markAsRead}>
      <DefaultPrefixImage src={img} alt={name + ' ' + surname} />
      <div className="notification">
        <div className='bold'>{name} {surname}</div>
        <div>{text}</div>
      </div>
    </div>
  )
}
