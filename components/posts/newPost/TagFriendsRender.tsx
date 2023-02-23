import Link from 'next/link';
import React from 'react'

export default function TagFriendsRender({ taged }) {
    console.log(taged.length)
    if (taged.length > 3) {
        let firstBatch = taged.slice(0, 3);
        let lastBatch = taged.slice(3, taged.length + 1)

        return (
            <div>
                {firstBatch.map((item, i) => (
                    <div className='bold' key={i}>
                        <Link  href={`/user/${item.id}`}>
                            {item.firstName} {item.lastName} {i != firstBatch.length - 1 ? ",":null}
                        </Link>
                   </div>
                ))} and

                <div className='taged-container'>
                    <span className='bold'>{lastBatch.length} more</span> 
                    <div className="dropdown">
                        {lastBatch.map((item, i) => (
                            <div  key={i} className="item">
                                <Link href={`/user/${item.id}`}>
                                    {item.firstName} {item.lastName} {i != lastBatch.length - 1 ? ",":null}
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
          )
    }
    
  return (
    <div className='bold'>
        {!!taged.length && taged.map((item, i) => (
            <Link key={i} href={`/user/${item.id}`}>
                {item.firstName} {item.lastName} {i != taged.length - 1 ? ",":null}
            </Link>
        ))}
    </div>
  )
}
