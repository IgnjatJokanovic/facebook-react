import React from 'react'

export default function AddEmotion({ setArticle }) {
    const refOption = React.useRef();
    const [open, setOpen] = React.useState(false);

    const toggleNavOption = e => {
        if (refOption.current.contains(e.target)) {
            return;
        }
        setOpen(false);
    };

    React.useEffect(() => {
        document.addEventListener("mousedown", toggleNavOption);

        return () => {
            document.removeEventListener("mousedown", toggleNavOption);
        };
    }, []);
  return (
      <div ref={refOption} className='controll-item emotion'>
        <div className="icon-holder">
            <div className="dropdown-title">Add emotion</div>
            <i onClick={e => setOpen(!open)} className="fas fa-smile-beam"></i>
        </div>
        
        <div className={ open ? 'dropdown active' : 'dropdown' }></div>  
    </div>
  )
}
