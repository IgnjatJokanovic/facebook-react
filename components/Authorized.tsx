import React from 'react'
import NewPost from './posts/NewPost'

type Article = {
  user_id: string|number|null;
  posted_by: string|number|null;
  body: string|null;
  image: string|null;
  emotion: null;
  taged: [],
}

export default function Authorized() {
    const [newArticle, setNewArticle] = React.useState({
        user_id: null,
        posted_by: null,
        body: null,
        image: null,
        emotion: null,
        taged: [],
    });
  return (
    <div className='home-container'>
          <NewPost article={newArticle} setArticle={ setNewArticle } />
    </div>
  )
}
