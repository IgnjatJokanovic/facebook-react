import React from 'react'
import { getClaims } from '../helpers/helpers';
import { Article, AuthUser } from '../types/types';
import NewPost from './posts/NewPost'
import axios from 'axios';

// type Article = {
//   id:    string|number|null;
//   owner: string|number|null;
//   creator: string|number|null;
//   body: string|null;
//   image: object;
//   emotion: null;
//   taged: [],
// }

export default function Authorized() {

  const claims: AuthUser|null = getClaims();

  const [articles, setArticles] = React.useState([])
  
  const [newArticle, setNewArticle] = React.useState<Article>({
        id: null,
        owner: claims.id,
        creator: claims.id,
        body: '',
        image: {
          id: null,
          src: null
        },
        emotion: null,
        taged: [],
  });
  
  React.useEffect(() => {
    axios.get("post/")
      .then(res => console.log(res.data))
      .catch()
  
    return () => {
      
    }
  }, [])
  

  return (
    <div className='home-container'>
      <NewPost article={newArticle} setArticle={setNewArticle} url={'create'} />
      <div className="posts-container"></div>
    </div>
  )
}
