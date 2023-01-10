import React from 'react'
import { getClaims } from '../helpers/helpers';
import NewPost from './posts/NewPost'

type Article = {
  owner: string|number|null;
  creator: string|number|null;
  body: string|null;
  image: string|null;
  emotion: null;
  taged: [],
}

export default function Authorized() {

    const claims = getClaims();
  
    const [newArticle, setNewArticle] = React.useState<Article>({
        owner: claims.id,
        creator: claims.id,
        body: null,
        image: null,
        emotion: null,
        taged: [],
    });
  return (
    <div className='home-container'>
      <NewPost article={newArticle} setArticle={setNewArticle} claims={ claims } />
    </div>
  )
}
