import React from 'react'
import { getClaims } from '../helpers/helpers';
import NewPost from './posts/NewPost'

type Article = {
  id:    string|number|null;
  owner: string|number|null;
  creator: string|number|null;
  body: string|null;
  image: object;
  emotion: null;
  taged: [],
}

export default function Authorized() {

    const claims = getClaims();
  
  const [newArticle, setNewArticle] = React.useState<Article>({
        id: null,
        owner: claims.id,
        creator: claims.id,
        body: null,
        image: {
          id: null,
          src: null
        },
        emotion: null,
        taged: [],
    });
  return (
    <div className='home-container'>
      <NewPost article={newArticle} setArticle={setNewArticle} url={'create'} />
    </div>
  )
}
