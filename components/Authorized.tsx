import React from 'react'
import NewPost from './posts/NewPost'

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
