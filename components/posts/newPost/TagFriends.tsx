import axios from 'axios';
import Link from 'next/link';
import React from 'react'
import DefaultPrefixImage from '../../DefaultPrefixImage';
import DefaultUserLoader from '../../loaders/DefaultUserLoader';

export default function TagFriends({owner, article, setArticle, openTagged, setOpenTagged }) {
    const refOption = React.useRef();
    const [searchParam, setSearchParam] = React.useState('');
    const [nextPage, setNextPage] = React.useState(0);
    const [found, setFound] = React.useState([]);
    const [isLoading, setIsloading] = React.useState(false);

    const toggleNavOption = e => {
        if (refOption.current.contains(e.target)) {
            return;
        }
        setOpenTagged(false);
    };

    const addFriend = (item) => {
        let curr = [...article.taged];
        curr.push(item);
        setArticle({...article, taged: curr});
    }

    const removeFriend = (index) => {
        let curr = [...article.taged];
        curr.splice(index, 1);
        setArticle({...article, taged: curr});
    }

    const handleSearch = (e) => {
        let val = e.target.value;
        setSearchParam(val);
        setNextPage(0);
        setFound([]);
        if (val.length > 0) {
            setIsloading(true); 
        } else {
            setIsloading(false);
        }
       
    }

    const search = React.useCallback(() => {
        if (nextPage >= 0 && searchParam.length) {
            axios.get(`/friend/searchCurrentUser?search=${searchParam}&exlude=${owner}&page=${nextPage}`)
            .then(res => {
                setFound([...found, ...res.data.data]);
                setIsloading(false);
                if (res.data.next_page_url === null) {
                    setNextPage(-1);
                }
                let lastIndex = parseInt(res.data.next_page_url[res.data.next_page_url.length - 1], 10);
                setNextPage(lastIndex);
            })
            .catch(err => {
                
            })
        }
    }, [found, nextPage, owner, searchParam])

    React.useEffect(() => {
        document.addEventListener("mousedown", toggleNavOption);
        document.addEventListener('wheel', search);

        return () => {
            document.removeEventListener("mousedown", toggleNavOption);
            document.removeEventListener('wheel', search);
        };
    }, [search, toggleNavOption, nextPage, article.taged]);

  return (
      <div ref={refOption} className='controll-item tag-friends'>
        <div className="icon-holder">
            <div className="dropdown-title">Tag friends</div>
            <i onClick={e => setOpenTagged(!openTagged)} className="fas fa-user-tag"></i>
        </div>
          <div className={ openTagged ? 'dropdown active' : 'dropdown' }>
              <input onChange={e => { handleSearch(e) }} onKeyUp={ search } value={searchParam} className='search' type="text" placeholder='Search friends' />
            <div className="friend-options">
                {isLoading && (
                    <DefaultUserLoader />
                )}
                {found.length ? (
                    found.map((item, i) => (
                        <div key={i} className="item">
                            <Link href={`/user/${item.id}`}>
                                <DefaultPrefixImage src={item.profile} />
                                <div>{item.firstName} {item.lastName}</div>
                            </Link>

                            {article.taged.findIndex(e => e.id === item.id) > -1 ? (
                                <div className='btn' onClick={() => removeFriend(article.taged.findIndex(e => e.id === item.id))}>Remove</div>
                            ): (
                                <div className='btn' onClick={() => addFriend(item)}>Add</div> 
                            )}
                        </div>
                    ))
                ) : (
                    searchParam.length != 0 && !isLoading ? (
                        <div  className="not-found">Friend not found</div>
                    ) : null 
                )}
                
                {!!article.taged && article.taged.map((item, i) => (
                    <>
                        <hr />
                        <div key={i} className="item">
                            <Link href={`/user/${item.id}`}>
                                <DefaultPrefixImage src={item.profile} />
                                <div>{item.firstName} {item.lastName}</div>
                            </Link>

                            <div className='btn' onClick={() => removeFriend(i)}>Remove</div>
                        </div>
                    </>
                ))}   
            </div>  
        </div>  
    </div>
  )
}
