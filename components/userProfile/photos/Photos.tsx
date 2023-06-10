import axios from 'axios';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import DefaultPrefixImage from '../../DefaultPrefixImage';
import Item from './Item';

type props = {
  userId?: number
  owner?: boolean
}

export default function Photos({ userId, owner }:props) {
  const [isLoading, setIsLoading] = useState(true);
  const [photos, setPhotos] = useState([]);
  const [nextPage, setNextPage] = React.useState(0);

  const loadData = React.useCallback(() => {
    // Load paginated iamges
    console.log(nextPage);
    if (nextPage >= 0) {
      axios.get(`/post/userRelated/photos/${userId}?page=${nextPage}`)
      .then(res => {
        setPhotos([...photos, ...res.data.data]);
        setIsLoading(false);
        if (res.data.next_page_url === null) {
          setNextPage(-1);
        }
        let lastIndex = parseInt(res.data.next_page_url[res.data.next_page_url.length - 1], 10);
        console.log(lastIndex)
        setNextPage(lastIndex);
      })
      .catch(err => {
        
      })
    } else {
      document.removeEventListener('wheel', loadData);
    }
  }, [nextPage, photos, userId])


  useEffect(() => {
    if (!userId) {
      return;
    }

    document.addEventListener('wheel', loadData);
    
    if (!photos.length) {
      console.log('re-render');
      loadData();
    }

    return () => {
      document.removeEventListener('wheel', loadData);
    };
  }, [userId, loadData, photos.length])
  
  return (
    <div className={isLoading ? "photos-section loading" : 'photos-section'}>
      {isLoading ? (
        <>
          <div className="item loader"></div>
          
        </>
      ): (
        <>
          {photos.length ? (

            photos.map((item, i) => (
              <div key={i} className="item">
                <Item
                  item={item}
                  owner={owner}
                />
              </div>
            ))
          ): (
            <div className='not-found'>User has no photos</div>
          )}
        </>
      )}
    </div>
  )
}
