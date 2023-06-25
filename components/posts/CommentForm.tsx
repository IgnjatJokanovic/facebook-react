import React from 'react'
import ContentEditable from 'react-contenteditable'
import Context from '../../context/context'

export default function CommentForm({comment, handleChangeCallback, setBodyCallback}) {
  const ctx = React.useContext(Context)
  const emojies = ctx.emojiList;

  const [openEmoji, setOpenEmoji] = React.useState(false)

  const refEmoji = React.useRef();

  const toggleEmoji = e => {
    if (refEmoji?.current?.contains(e.target)) {
        return;
    }
    setOpenEmoji(false);
  };

  React.useEffect(() => {
    const handleToggleEmoji = e => toggleEmoji(e);

    document.addEventListener("mousedown", handleToggleEmoji);
  
    return () => {
      document.removeEventListener("mousedown", handleToggleEmoji);
    }
  }, [])
  

  return (
    <div className="input-comment">
      <ContentEditable
        className="txt  hide-bar"
        //  innerRef={refEditable}
        html={comment.body} // innerHTML of the editable div
        disabled={false}       // use true to disable editing
        onChange={handleChangeCallback} // handle innerHTML change
      />
      <div className="emoji-holder">
        <i onClick={e => setOpenEmoji(!openEmoji)} className="fas fa-smile-beam"></i>
          <div className={ openEmoji ? 'dropdown active' : 'dropdown' }>
          <div ref={refEmoji} className="flex hide-bar">
              {!!emojies && emojies.map((item, i) => (
                  <div className="emoji-item" key={i} dangerouslySetInnerHTML={{ __html: item.code }} onClick={() => setBodyCallback(item.code) }>
                  </div>
              ))}
          </div>
        </div>
      </div>  
    </div>
  )
}
