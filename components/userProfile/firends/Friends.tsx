import React, { useEffect, useState } from 'react'
import DefaultPrefixImage from '../../DefaultPrefixImage';
import Link from 'next/link';
import axios from 'axios';

export default function Friends({ userId }) {
  const [isLoading, setIsLoading] = useState(true);
  const [friends, setFriends] = useState([]);
  const [nextPage, setNextPage] = React.useState(0);
  const [nextPageSearch, setNextPageSearch] = React.useState(0);
  const [search, setSearch] = React.useState('');
  const [searchData, setSearchData] = React.useState([]);

  const handleChange = (e) => {
    let value = e.target.value;
    setSearch(value);
    setNextPageSearch(0);
    setSearchData([]);

    if (value.length) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }

  const loadData = React.useCallback(() => {
    if (search.length) {
      if (nextPageSearch >= 0) {
        axios
        .post(`/friend/searchUser/`, {
          search: search,
          id: userId
        })
        .then((res) => {
            setSearchData((prevState) => [...prevState, ...res.data.data]);
            setIsLoading(false);
    
            const nextPageUrl = res.data.next_page_url;
            if (nextPageUrl === null) {
                setNextPageSearch(-1);
            } else {
                const lastIndex = parseInt(nextPageUrl.slice(-1), 10);
                setNextPageSearch(lastIndex);
            }
        })
        .catch((err) => {
            // handle error
        });
      }
    } else {
      // Load paginated iamges
      if (nextPage >= 0) {
        axios.get(`/friend/userFriends/${userId}?page=${nextPage}`)
        .then(res => {
          setFriends([...friends, ...res.data.data]);
          setIsLoading(false);
          if (res.data.next_page_url === null) {
            setNextPage(-1);
          }
          let lastIndex = parseInt(res.data.next_page_url[res.data.next_page_url.length - 1], 10);
          setNextPage(lastIndex);
        })
        .catch(err => {
          
        })
      }
    }
  }, [search, nextPageSearch, userId, nextPage, friends])

  React.useEffect(() => {
    if (search.length) {
        loadData();
    }
  }, [loadData, search]);



  useEffect(() => {
    if (!userId) {
      return;
    }

    document.addEventListener('wheel', loadData);
    
    if (!friends.length) {
      loadData();
    }

    return () => {
      document.removeEventListener('wheel', loadData);
    };
  }, [userId, loadData, friends.length])
  
  return (
    <div className={isLoading ? "friends-section loading" : 'friends-section'}>
      {friends.length > 0 && (
        <div className="search">
          <div className="input">
            <input
              onChange={e => {
                handleChange(e);
              }}
              className='input-text'
              type="text"
              placeholder='Search user friends'
            />
          </div>
        </div>
      )}
      <div className="content">
        {isLoading ? (
          <div className="item loader"></div>
        ): (
          <>
            {search.length > 0 ? (
              searchData.length > 0 ? (
                searchData.map((item, i) => (
                  <div key={i} className="item">
                    <Link  href={`/user/${item.id}`}>
                      <DefaultPrefixImage src={item.profile} alt={`${item.firstName} ${item.lastName}`} /> 
                      <div className='name'>{item.firstName} {item.lastName}</div>
                    </Link>
                  </div>
                ))
              ): (
                  <div className="not-found">No results found</div>
              )      
            ): (
              friends.length > 0 ? (
              
                friends.map((item, i) => (
                  <div key={i} className="item">
                    <Link  href={`/user/${item.id}`}>
                      <DefaultPrefixImage src={item.profile} alt={`${item.firstName} ${item.lastName}`} /> 
                      <div className='name'>{item.firstName} {item.lastName}</div>
                    </Link>
                  </div>
                ))
              ): (
                <div className='not-found'>User has no friends</div>
              )
            )}
          </>
        )}
      </div>
    </div>
  )
}
