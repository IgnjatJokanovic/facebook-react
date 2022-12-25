import React from 'react'
import AddEmotion from './newPost/AddEmotion';
import AddImage from './newPost/AddImage';
import TagFriends from './newPost/TagFriends';

export default function NewPost({ article, setArticle }) {
    
    const handleSubmit = () => {
        console.log(article)
    }
  return (
    <div className='new-post-form'>
        <form onSubmit={e => {
            e.preventDefault();
            handleSubmit();
        }}>
            <div className="insert-options">
                <div className="title">
                    Add to post
                </div>
                <div className="controlls">
                    <AddImage />
                      <TagFriends taged={article.taged} setArticle={setArticle} />
                    {/* <AddEmotion />   */}
                </div>
               
            </div>
            <button>Post</button>  
        </form>      
    </div>
  )
}
