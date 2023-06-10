import React from 'react'
import Link from 'next/link'
import { getClaims, logout } from '../../../helpers/helpers';
import { useRouter } from 'next/router';
import Context from '../../../context/context';
import DefaultPrefixImage from '../../DefaultPrefixImage';
import axios from 'axios';

export default function Settings() {
    const ctx = React.useContext(Context)
    const refOption = React.useRef();
    const [open, setOpen] = React.useState(false);

    const router = useRouter();
    const claims = getClaims();

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

    const handleSendMail = () => {
        axios.post('/activation/resend')
            .then(res => {
                ctx.setAlert(res.data, 'success')
            }).catch(err => {
                ctx.setAlert(err.response.data.error, 'error');
            });
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
                        <Link href={`/user/${claims?.id}`}>
                            <DefaultPrefixImage 
                                src={claims?.profile?.image?.src}
                                alt={`${claims?.firstName} ${claims?.lastName}`} 
                            />
                            <span>{claims?.firstName} {claims?.lastName}</span>
                        </Link>
                        <hr />
                    </div>
                   
                    <div>
                        <Link href='/user/update'>
                        <i className="fas fa-edit"></i>  &nbsp; Update basic info
                        </Link>
                    </div>
                    <div>
                        <Link href='/password/update'>
                            <i className="fas fa-edit"></i> &nbsp; Change password
                        </Link>
                    </div>
                    {!claims?.active ? (
                        <div className="logout" onClick={handleSendMail}>
                            <i className="fa fa-envelope" aria-hidden="true"></i> &nbsp;  Resend activation email
                        </div>
                    ): null}
                    <div className='logout' onClick={handleLogout}>
                        <i className="fas fa-sign-out-alt"></i>  &nbsp; Logout
                    </div>
                </div>
          </div>
      </div>
  )
}
