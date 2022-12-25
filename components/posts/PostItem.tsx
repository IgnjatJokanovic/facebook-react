import Link from 'next/link'
import React from 'react'

export default function PostItem({ href = null, postId, created_at, creator, poster, tagged = [], feeling = null  }) {
  return (
    <div className="single-post-container">
        <div className="heading">
            <div className="links">
            </div>
            <div className="other">
            </div>
        </div>
        <div className="body">
              
        </div>
        <div className="comments-section">
        </div>  
    </div>
  )
}
