import React, { useEffect } from 'react'

export default function MessageItem({opened, body, owner, deleteCallback, editCallback}) {
    const [open, setOpen] = React.useState(false)

    const refOpen = React.useRef();

    const toggleOpen = e => {
        if (refOpen?.current?.contains(e.target)) {
          return;
        }
        setOpen(false);
    }
    
    React.useEffect(() => {
        document.addEventListener("mousedown", toggleOpen);
    
        return () => {
            document.removeEventListener("mousedown", toggleOpen);
        }
    }, [])
    
  
    return (
    <div className="message-item">
        {owner && (
            <div className="actions" ref={refOpen}>
                <i className="fa fa-ellipsis-v" onClick={() => setOpen(!open)}></i>
                <div className={open ? 'dropdown active' : 'dropdown'}>
                    <div className="item" onClick={editCallback}>
                        Edit
                    </div>
                    <div className="item" onClick={deleteCallback}>
                        Delete
                    </div>
                </div>
            </div>
        )}
        <div className={owner ? "bubble right" : "bubble"}>
        <div className="txt" dangerouslySetInnerHTML={{ __html: body }}></div>
        <div className="read" dangerouslySetInnerHTML={{ __html: opened ? '&check;&check;' : '&check;' }}></div>
        </div>
    </div>
  )
}
