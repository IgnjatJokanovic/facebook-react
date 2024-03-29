import axios from 'axios';
import React from 'react'
import SearchItem from './SearchItem';
import UserLoader from '../../loaders/UserLoader';
import MessageLoader from '../../loaders/MessageLoader';
import DefaultUserLoader from '../../loaders/DefaultUserLoader';

export default function Search() {
    const refOption = React.useRef();
    const [open, setOpen] = React.useState(false);
    const [param, setParam] = React.useState('')

    const [users, setUsers] = React.useState([]);
    const [nextPage, setNextPage] = React.useState(0);
    const [isLoading, setIsloading] = React.useState(false);

    const toggleNavOption = e => {
        if (refOption.current.contains(e.target)) {
            return;
        }
        setOpen(false);
    };

    const handleChange = (e) => {
        let value = e.target.value;
        setParam(value);
        setNextPage(0);
        setUsers([]);
        setIsloading(true);
        setOpen(true);
      
    }

    const handleSearch = React.useCallback(() => {
        if (param != "") {

            // Load paginated iamges
            if (nextPage >= 0) {
                axios.post(`/user/search?page=${nextPage}`, { search: param })
                    .then(res => {
                        setUsers(prevUsers => [...prevUsers, ...res.data.data]);
                        
                        if (res.data.next_page_url === null) {
                            setNextPage(-1);
                        } else {
                            let lastIndex = parseInt(res.data.next_page_url[res.data.next_page_url.length - 1], 10);
                            setNextPage(lastIndex);
                            setOpen(true);
                        }

                        setIsloading(false);
                        
                    })
                    .catch(err => {
                        setUsers([]);
                    })
            }
           
        } else {
            setOpen(false);
            setIsloading(false);
        }

    }, [nextPage, param])

    const reset = () => {
        setParam('');
        setOpen(false);
        setNextPage(0);
        setUsers([]);
    }

    const openDropdown = () => {
       if(!param.length) {
           setOpen(false);
       } else {
        setOpen(!open);
       }
    }

    React.useEffect(() => {
        document.addEventListener("mousedown", toggleNavOption);
        refOption.current.addEventListener('wheel', handleSearch);

        return () => {
            document.removeEventListener("mousedown", toggleNavOption);
            refOption?.current?.removeEventListener('wheel', handleSearch);
        };
    }, [handleSearch, open])

    React.useEffect(() => {
        handleSearch();
    }, [handleSearch, param]);
    
  return (
    <div ref={refOption}>
        <input
            onChange={e => {
                handleChange(e);
            }}
            type="text"
            placeholder="Search..."
            value={param}
            onClick={openDropdown}
        />
        <div className={open ? 'results active' : 'results'}>
            {isLoading && (
                <DefaultUserLoader />
            )}
            {users.length ? (
                users.map((item, i) => (
                    <SearchItem
                        key={i}
                        name={item.firstName}
                        surname={item.lastName}
                        reset={reset}
                        url={`/user/${item.id}`}
                        profile={item.profile_photo?.image.src} />
                ))
            ) : (
                param.length != 0 && !isLoading ? (
                    <div className="not-found">No users matched your search</div>
                ): null
            )}
        </div>
    </div>
  )
}
