import Link from 'next/link'
import React from 'react'
import DefaultPrefixImage from '../../DefaultPrefixImage'
import Context from '../../../context/context';
import { updatePhoto } from '../../../helpers/helpers';

export default function Item({ item, owner }) {
    
    const ctx = React.useContext(Context);

    const refOpen = React.useRef();
    const [open, setOpen] = React.useState(false);

    const toggleOpen = e => {
        if (refOpen?.current?.contains(e.target)) {
          return;
        }
        setOpen(false);
    }

    const handlePhotoChange = (profile: boolean, id: number) => {
        updatePhoto(profile, id)
          .then(res => {
            ctx.setAlert(res.data.msg, 'success');
          })
          .catch(err => {
            ctx.setAlert(err.response.data.error, 'error');
          });
      }

    React.useEffect(() => {
        if (owner) {
            document.addEventListener("mousedown", toggleOpen);
        }
    
      return () => {
        document.removeEventListener("mousedown", toggleOpen);
      }
    }, [owner])
    

  return (
    <>
        <Link href={`/post/${item.id}`}>
            <DefaultPrefixImage src={item.image.src} alt="" />  
        </Link>
        {owner && (
            <div className="actions" ref={refOpen}>
                <i className="fa fa-ellipsis-v" onClick={() => setOpen(!open)}></i>
                <div className={open ? 'dropdown active' : 'dropdown'}>
                    <div className="dropdown-item" onClick={() => handlePhotoChange(true, item.id)}>
                        Set profile photo
                    </div>
                    <div className="dropdown-item" onClick={() => handlePhotoChange(false, item.id)}>
                        Set cover photo
                    </div>
                </div>
            </div>
        )}
    </>
  )
}
