import React from 'react'
import Link from 'next/link'

export default function Settings() {
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
          <i className='fa fa-cogs' onClick={e => setOpen(!open)}></i>
          <div className={ open ? 'dropdown active' : 'dropdown' }>
              <div className="settings">
                    <div className="profile">
                        <Link href='/test'>
                            <img src="https://dummyimage.com/300.png/09f/fff" alt="" />
                            <span>Ignjat Jokanovic</span>
                        </Link>
                        <hr />
                    </div>
                   
                    <div>
                        <Link href='/updateInfo'>
                            Update basic info
                        </Link>
                    </div>
                    <div>
                        <Link href='/changePassword'>
                            Change password
                        </Link>
                    </div>
                    <div className='logout'>
                        Logout
                    </div>
                </div>
          </div>
      </div>
  )
}
