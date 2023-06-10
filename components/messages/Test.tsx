import React from 'react'

export default function Test({ id }) {
    React.useEffect(() => {
      console.log('TESTTTTTTTTTTTTTTTTTTTTTTTT', id)
    
      return () => {
        
      }
    }, [id])
    
  return (
      <div>Test {id}</div>
  )
}
