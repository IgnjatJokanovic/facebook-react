import React from 'react'
import { useRouter } from 'next/router';
import axios from 'axios';
import Context from '../../context/context';
import { refreshToken } from '../../helpers/helpers';

export default function Activation() {
  const router = useRouter();
  const { token } = router.query;

  const ctx = React.useContext(Context);

  React.useEffect(() => {

    if (!token) {
      return;
    }

    console.log("ACTIVATE")
    
    axios.post('/activation/activate', { token: token })
      .then(async res => {
        if (ctx.authenticated) {
          await refreshToken();
        }
        ctx.setAlert(res.data, 'success', "/");
      })
      .catch(err => {
        ctx.setAlert(err.response.data.error, 'error', "/")
      })
  
    return () => {
      
    }
  }, [token])
  

  return null;
}
