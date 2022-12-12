import React from 'react'

export default function MessageNotifications() {
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
    <div ref={ refOption} className='friend-notifications-container'>
          <i className='fas fa-envelope-square'>
              <span>10</span>
          </i>
          <div className={ open ? 'dropdown active' : 'dropdown' }>
              
          </div>
    </div>
  )
}
