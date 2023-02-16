import { useRouter } from 'next/router'
import React from 'react'

export default function NotFound() {
    const router = useRouter();
    const type = router.query.type;

    React.useEffect(() => {
        if (!type) {
            return;
        }
    }, [type])
    
  return (
      <div>{type} not found</div>
  )
}
