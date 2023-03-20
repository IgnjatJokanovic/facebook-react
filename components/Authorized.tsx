import React from 'react'
import { getClaims } from '../helpers/helpers';
import { Article, AuthUser } from '../types/types';
import NewPost from './posts/NewPost'
import axios from 'axios';
import RecomendedFriends from './RecomendedFriends';

export default function Authorized() {

  const claims: AuthUser|null = getClaims();
  
  React.useEffect(() => {
    axios.get("post/")
      .then(res => console.log(res.data))
      .catch()
  
    return () => {
      
    }
  }, [])
  

  return (
    <div className='home-container'>
      <RecomendedFriends />
      <NewPost owner={claims?.id} url={'create'} />
      <div className="posts-container"></div>
    </div>
  )
}
