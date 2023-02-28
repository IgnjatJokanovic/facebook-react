import axios from 'axios'
import moment from 'moment'
import Link from 'next/link'
import React from 'react'
import ContentEditable from 'react-contenteditable'
import Context from '../../context/context'
import { getClaims } from '../../helpers/helpers'
import DefaultPrefixImage from '../DefaultPrefixImage'

export default function CommentItem({ comment, comments, setComments, postId, isOwner, next = -1, parent = null }) {

  const createdAt = moment(comment.created_at).diff(moment(), 'days') > 7 ? moment(comment.created_at).format('d. MMM, YYYY') : moment(comment.created_at).fromNow();
  const claims = getClaims();

  const [open, setOpen] = React.useState(false)
  const [edit, setEdit] = React.useState({})
  const [children, setChildren] = React.useState([])
  const [nextPage, setNextPage] = React.useState(next)
  const [openNew, setOpenNew] = React.useState(false)
  const [openEmoji, setOpenEmoji] = React.useState(false)
  const [newComment, setNewComment] = React.useState({
    body: '',
    user_id: claims?.id,
    post_id: postId,
    comment_id: parent
  })

  const ctx = React.useContext(Context)
  const emojies = ctx.emojiList;

 
  const handleChange = e => {
    setEdit({ ...edit, body: e.target.value })
  }

  const setBody = (body) => {

    if (edit.body === null) {
      setEdit({ ...edit, body: body });
    }
    else {
      var newValue = edit.body + body;
      console.log(1, edit.body, newValue)
      setEdit({ ...edit, body: newValue });
    }
  }

  const handleChangeNew = e => {
    setNewComment({ ...newComment, body: e.target.value })
  }

  const setBodyNew = (body) => {

    if (newComment.body === null) {
      setNewComment({ ...newComment, body: body });
    }
    else {
      var newValue = newComment.body + body;
      console.log(1, newComment.body, newValue)
      setNewComment({ ...newComment, body: newValue });
    }
  }

  const handleUpdate = () => {
    axios.post(`comment/update`, edit)
      .then(res => {
        setEdit({})
        ctx.setAlert(res.data.msg, 'success')

        let updated = res.data.data;
        let curr = [...comments];
        let index = curr.findIndex(obj => obj.id === updated.id);
        
        curr[index].body = updated.body;

        setComments(curr);
       
      })
      .catch(err => {
        ctx.setAlert(err.response.data.error, 'error');
      })
  }

  const handleDelete = (id) => {
    axios.post(`comment/delete`, { id: id })
      .then(res => {
        setEdit({})
        ctx.setAlert(res.data.msg, 'success')

        let updated = res.data.data;
        let curr = [...comments];
        let index = curr.findIndex(obj => obj.id === updated.id);
      
        curr.splice(index, 1);

        setComments(curr);
     
      })
      .catch(err => {
        ctx.setAlert(err.response.data.error, 'error');
      })
  }

  const handleSave = () => {
    axios.post(`comment/create`, newComment)
      .then(res => {
        setNewComment({...newComment, body: ''})
        ctx.setAlert(res.data.msg, 'success')

        let curr = [...comments];
        curr.push(res.data.data)

        setComments(curr);
     
      })
      .catch(err => {
        ctx.setAlert(err.response.data.error, 'error');
      })
  }

  const loadChildren = () => {
    let parentUrl = parent != null ? `/${parent}` : '';
    let url = `/comment/postRelated/${comment.post_id}${parentUrl}?page=${nextPage}`;
    if (nextPage >= 0) {
      axios.get(url)
      .then(res => {
        setChildren([...children, ...res.data]);
        if (res.data.next_page_url === null) {
          setNextPage(-1);
        } else {
          let lastIndex = parseInt(res.data.next_page_url[res.data.next_page_url.length - 1], 10);
          console.log(lastIndex)
          setNextPage(lastIndex);
        }
     
      })
      .catch(err => {
        
      })
    }
  }

  return (
    <div className='comment-item'>
      <div className="body">
        <div className="profile">
          <Link href={`/user/`}>
            <DefaultPrefixImage src={comment.user.image.src} alt={`${comment.user.firstName} ${comment.user.lastName}`} />
          </Link>
        </div>
        <div className="content-container">
          <div className="content">
            {ctx.isAuthenticated && Object.keys(edit).length ? (
              <>
                <div className="input-comment">
                  <ContentEditable
                    className="txt  hide-bar"
                    //  innerRef={refEditable}
                    html={edit.body} // innerHTML of the editable div
                    disabled={false}       // use true to disable editing
                    onChange={handleChange} // handle innerHTML change
                  />
                  <div className="emoji-holder">
                    <i onClick={e => setOpenEmoji(!openEmoji)} className="fas fa-smile-beam"></i>
                      <div className={ openEmoji ? 'dropdown active' : 'dropdown' }>
                      <div className="flex hide-bar">
                          {!!emojies && emojies.map((item, i) => (
                              <div className="emoji-item" key={i} dangerouslySetInnerHTML={{ __html: item.code }} onClick={() => setBody(item.code) }>
                              </div>
                          ))}
                      </div>
                    </div>
                  </div>  
                </div>
                <div className="btns">
                  <div className="btn" onClick={() => setEdit({})}>Cancel</div>
                  <div className="save" onClick={handleUpdate}>Save</div>
                </div>
              </>
              
            ): (
              <>
                <div className="body">
                  <Link href={`/user/`}>
                    {comment.user.firstName} {comment.user.lastName}
                  </Link>
                  <div dangerouslySetInnerHTML={{ __html: comment.body }}></div>
                </div>
                {ctx.isAuthenticated && (comment.user_id == claims?.id || isOwner) (
                  <div className="user-actions">
                    <i className="fa fa-ellipsis-v" aria-hidden="true" onClick={() => setOpen(!open)}></i>
                    <div className={open ? 'drowpdown active' : 'drowpdown'}>
                      {comment.user_id == claims?.id ? (
                        <div className="btn" onClick={() => setEdit(comment)}>Edit</div>
                      ): null}
                      {comment.user_id == claims?.id || isOwner ? (
                        <div className="btn" onClick={() => handleDelete(comment.id)}>Delete</div>
                      ): null}    
                    </div>
                  </div>
                )}
              </>
            )}
           
          </div>
          <div className="actions">
            {comment.post_id == null ? (
              <div onClick={() => console.log('')}>Reply</div>
            ) : null}
            <div>{createdAt}</div>
          </div>
          <div className="children">
            {children.length && (
              children.map((item, i) => (
                <CommentItem
                  key={i}
                  comment={item}
                  comments={children}
                  postId={postId}
                  setComments={setChildren}
                  isOwner={isOwner}
                  parent={comment.id}
                />
              ))
            )}
            {openNew && (
              <>
                <div className="input-comment">
                  <ContentEditable
                    className="txt  hide-bar"
                    //  innerRef={refEditable}
                    html={edit.body} // innerHTML of the editable div
                    disabled={false}       // use true to disable editing
                    onChange={handleChangeNew} // handle innerHTML change
                  />
                  <div className="emoji-holder">
                    <i onClick={e => setOpenEmoji(!openEmoji)} className="fas fa-smile-beam"></i>
                      <div className={ openEmoji ? 'dropdown active' : 'dropdown' }>
                      <div className="flex hide-bar">
                          {!!emojies && emojies.map((item, i) => (
                              <div className="emoji-item" key={i} dangerouslySetInnerHTML={{ __html: item.code }} onClick={() => setBodyNew(item.code) }>
                              </div>
                          ))}
                      </div>
                    </div>
                  </div>  
                </div>
                <div className="save" onClick={handleSave}>Save</div>
              </>
            )}
            {(comment.repliesCount > 0 && nextPage >= 0) && (
              <div className="link" onClick={loadChildren}>
                Load more replies
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
