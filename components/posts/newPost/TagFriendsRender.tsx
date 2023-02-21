import Link from 'next/link';
import React from 'react'

export default function TagFriendsRender({ taged }) {

    if (taged > 3) {
        let firstBatch = taged.slice(0, 2);
        let lastBatch = taged.slice(3, taged.length - 1)

        return (
            <span className='bold'>
                {firstBatch.map((item, i) => (
                    <Link key={i} href={`/user/${item.id}`}>
                        {item.firstName} {item.lastName}
                    </Link>
                ))} and

                <span className='taged-container'>
                    {lastBatch.length} more 
                    <div className="drowpdown">
                        {firstBatch.map((item, i) => (
                            <Link key={i} href={`/user/${item.id}`}>
                                {item.firstName} {item.lastName}
                            </Link>
                        ))}
                    </div>
                </span>
            </span>
          )
    }
    
  return (
    <span className='bold'>
        {!!taged.length && taged.map((item, i) => (
            <Link key={i} href={`/user/${item.id}`}>
                {item.firstName} {item.lastName}
            </Link>
        ))}
    </span>
  )
}
