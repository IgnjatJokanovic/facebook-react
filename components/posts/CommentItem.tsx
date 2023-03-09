import axios from 'axios'
import moment from 'moment'
import Link from 'next/link'
import React from 'react'
import ContentEditable from 'react-contenteditable'
import Context from '../../context/context'
import { getClaims } from '../../helpers/helpers'
import DefaultPrefixImage from '../DefaultPrefixImage'
import CommentForm from './CommentForm'

export default function CommentItem({ comment, comments, setComments, postId, owner, next = 0, parent = null }) {

  const createdAt = moment(comment.created_at).diff(moment(), 'days') > 7 ? moment(comment.created_at).format('d. MMM, YYYY') : moment(comment.created_at).fromNow();
  const claims = getClaims();

  const [open, setOpen] = React.useState(false)
  const [edit, setEdit] = React.useState({})
  const [children, setChildren] = React.useState([])
  const [nextPage, setNextPage] = React.useState(next)
  const [openNew, setOpenNew] = React.useState(false)
  
  const [newComment, setNewComment] = React.useState({
    body: '',
    user_id: claims?.id,
    post_id: postId,
    comment_id: comment.id
  })

  const ctx = React.useContext(Context)

 
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
    if (nextPage >= 0 && comment.repliesCount > 0) {
      axios.get(url)
      .then(res => {
        setChildren([...children, ...res.data.data]);
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
          <Link href={`/user/${comment.user_id}`}>
            <DefaultPrefixImage src={comment.user.profile_photo?.src} alt={`${comment.user.firstName} ${comment.user.lastName}`} />
          </Link>
        </div>
        <div className="content-container">
          <div className="content">
            {ctx.isAuthenticated && Object.keys(edit).length ? (
              <>
                <CommentForm
                  comment={edit}
                  handleChangeCallback={handleChange}
                  setBodyCallback={setBody}
                />
                <div className="btns">
                  <div className="btn" onClick={() => setEdit({})}>Cancel</div>
                  <div className="btn" onClick={handleUpdate}>Save</div>
                </div>
              </>
              
            ): (
              <>
                <div className="body">
                  <Link href={`/user/`}>
                    {comment.user.firstName} {comment.user.lastName}1
                  </Link>
                  <div className='html' dangerouslySetInnerHTML={{ __html: comment.body }}></div>
                </div>
              
              </>
            )}
           
          </div>
          <div className="actions">
          <div>{createdAt}</div>
            {comment.coment_id == null ? (
              <div onClick={() => setOpenNew(!openNew)}>Reply</div>
            ) : null}
            
          </div>
          <div className="children">
            {!!children.length && (
              children.map((item, i) => (
                <CommentItem
                  key={i}
                  comment={item}
                  comments={children}
                  postId={postId}
                  setComments={setChildren}
                  owner={owner}
                  parent={comment.id}
                />
              ))
            )}
            {openNew && (
              <>
                <CommentForm
                  comment={newComment}
                  handleChangeCallback={handleChangeNew}
                  setBodyCallback={setBodyNew}
                />
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
        {(ctx.authenticated && (comment.user_id == claims?.id || owner == claims?.id)) && (
          <div className="user-actions">
            <i className="fa fa-ellipsis-v" aria-hidden="true" onClick={() => setOpen(!open)}></i>
            <div className={open ? 'dropdown active' : 'dropdown'}>
              {comment.user_id == claims?.id ? (
                <div className="btn" onClick={() => setEdit(comment)}>Edit</div>
              ): null}
              {comment.user_id == claims?.id || owner == claims?.id ? (
                <div className="btn" onClick={() => handleDelete(comment.id)}>Delete</div>
              ): null}    
            </div>
          </div>
        )}
      </div>
    </div>
  )
}