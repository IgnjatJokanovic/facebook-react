import Link from 'next/link'
import React from 'react'

export default function Information({ firstName, lastName, birthDay, showEdit, userId }) {
  return (
    <div className='information-container'>
      <div className="content">
        <div className="item">
          First Name: {firstName}
        </div>
        <div className="item">
          Last Name: {lastName}
        </div>
        <div className="item">
          Birthday: {birthDay}
        </div>

        {showEdit && (
          <div className="item">
            <Link href={`/user/update`} className="btn">
              Edit
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
