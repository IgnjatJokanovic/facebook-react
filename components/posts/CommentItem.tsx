import axios from 'axios'
import moment from 'moment'
import Link from 'next/link'
import React from 'react'
import ContentEditable from 'react-contenteditable'
import Context from '../../context/context'
import { getClaims, validateComment } from '../../helpers/helpers'
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

  const refDropdown = React.useRef();
  
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

  const openEdit = () => {
    let curr = structuredClone(comment);
    setEdit(curr)
  }

  const toggleOpen = e => {
    if (refDropdown.current.contains(e.target)) {
        return;
    }
    setOpen(false);
  };

  const handleUpdate = () => {
    validateComment(edit).then(() => {
      axios.post(`comment/update`, edit)
      .then(res => {
        setEdit({})
        ctx.setAlert(res.data.msg, 'success')

        let updated = res.data.data;
        let curr = [...comments];
        let index = curr.findIndex(obj => obj.id == updated.id);
        
        curr[index].body = updated.body;

        setComments(curr);
       
      })
      .catch(err => {
        ctx.setAlert(err.response.data.error, 'error');
      })
    }).catch(err => {
        ctx.setAlert(err, 'error');
    })

  }

  const handleDelete = (id) => {
    axios.post(`comment/delete`, { id: id })
      .then(res => {
        setEdit({})
        ctx.setAlert(res.data.msg, 'success')

        let id = res.data.data;
        let curr = [...comments];
        let index = curr.findIndex(obj => obj.id === id);
      
        curr.splice(index, 1);

        setComments(curr);
     
      })
      .catch(err => {
        console.log('err', err)
        ctx.setAlert(err.response.data.error, 'error');
      })
  }

  const handleSave = () => {
    validateComment(newComment).then(() => {
      axios.post(`comment/create`, newComment)
      .then(res => {
        setNewComment({...newComment, body: ''})
        ctx.setAlert(res.data.msg, 'success')

        let curr = [...children];
        curr.push(res.data.data)

        setChildren(curr);
     
      })
      .catch(err => {
        ctx.setAlert(err.response.data.error, 'error');
      })
    }).catch(err => {
      ctx.setAlert(err, 'error');
    })
    
  }

  const loadChildren = () => {
    setOpenNew(true);
    console.log("CUM");
    let url = `/comment/postRelated/${comment.post_id}/${comment.id}?page=${nextPage}`;
    if (nextPage >= 0 && comment.repliesCount > 0) {
      axios.get(url)
      .then(res => {
        setChildren([...children, ...res.data.data]);
        if (res.data.next_page_url == null) {
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

  React.useEffect(() => {
    
    
    if (ctx.authenticated && (comment.user_id == claims?.id || owner == claims?.id)) {
      document.addEventListener("mousedown", toggleOpen);
    }
   
    return () => {
      document.removeEventListener("mousedown", toggleOpen);
    }
  }, [])
  

  return (
    <div className='comment-item'>
      <div className="body">
        <div className="profile">
          <Link href={`/user/${comment.user_id}`}>
            <DefaultPrefixImage src={comment.user.profile_photo?.image?.src} alt={`${comment.user.firstName} ${comment.user.lastName}`} />
          </Link>
        </div>
        <div className="content-container">
          <div className="content">
            {Object.keys(edit).length ? (
                <CommentForm
                  comment={edit}
                  handleChangeCallback={handleChange}
                  setBodyCallback={setBody}
                />  
            ): (
                <div className="body">
                  <Link href={`/user/${comment.user_id}`}>
                    {comment.user.firstName} {comment.user.lastName}
                  </Link>
                  <div className='html' dangerouslySetInnerHTML={{ __html: comment.body }}></div>
                </div>
            )}
           
          </div>
          {!!Object.keys(edit).length && (
              <div className="btns">
                <div className="btn" onClick={() => setEdit({})}>Cancel</div>
                <div className="btn" onClick={handleUpdate}>Update</div>
              </div>
          )}
          <div className="actions">
            <div>{createdAt}</div>
            {parent == null && ctx.authenticated ? (
              <div className='link' onClick={() => setOpenNew(!openNew)}>Reply</div>
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
              <div className='comment-new'>
                <Link href={`/user/${claims?.id}`}>
                  <DefaultPrefixImage src={claims?.profile?.image?.src} alt={`${claims?.firstName} ${claims?.lastName}`}/>
                </Link>
                <CommentForm
                  comment={newComment}
                  handleChangeCallback={handleChangeNew}
                  setBodyCallback={setBodyNew}
                />
                <div className="btn" onClick={handleSave}>Reply</div>
              </div>
            )}
            {(comment.repliesCount > 0 && nextPage >= 0) && (
              <div className="load-more" onClick={loadChildren}>
                Load more replies
              </div>
            )}
          </div>
        </div>
        {(ctx.authenticated && (comment.user_id == claims?.id || owner == claims?.id)) && (
          <div ref={refDropdown} className="user-actions">
            <i className="fa fa-ellipsis-v" aria-hidden="true" onClick={() => setOpen(!open)}></i>
            <div className={open ? 'dropdown active' : 'dropdown'}>
              {comment.user_id == claims?.id ? (
                <div className="btn" onClick={openEdit}>Edit</div>
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
