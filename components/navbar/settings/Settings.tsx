import React from 'react'
import Link from 'next/link'
import { logout } from '../../../helpers/helpers';
import { useRouter } from 'next/router';
import Context from '../../../context/context';

export default function Settings() {
    const ctx = React.useContext(Context)
    const refOption = React.useRef();
    const [open, setOpen] = React.useState(false);

    const router = useRouter();

    const toggleNavOption = e => {
        if (refOption.current.contains(e.target)) {
            return;
        }
        setOpen(false);
    };

    const handleLogout = () => {
        logout();
        ctx.setauthenticated(false);
        router.push("/");

    }

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
                        <Link href='/user/1'>
                            <img src="https://dummyimage.com/300.png/09f/fff" alt="" />
                            <span>Ignjat Jokanovic</span>
                        </Link>
                        <hr />
                    </div>
                   
                    <div>
                        <Link href='/updateinfo'>
                            Update basic info
                        </Link>
                    </div>
                    <div>
                        <Link href='/changepassword'>
                            Change password
                        </Link>
                    </div>
                    <div className='logout' onClick={handleLogout}>
                        Logout
                    </div>
                </div>
          </div>
      </div>
  )
}
