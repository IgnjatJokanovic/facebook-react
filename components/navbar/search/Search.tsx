import axios from 'axios';
import React from 'react'
import SearchItem from './SearchItem';

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
        console.log('LOADING', param)
        if (param != "") {

            // Load paginated iamges
            console.log(nextPage);
            if (nextPage >= 0) {
                axios.post(`/user/search?page=${nextPage}`, { search: param })
                    .then(res => {
                        console.log('fetching')
                        setUsers(prevUsers => [...prevUsers, ...res.data.data]);
                        
                        if (res.data.next_page_url === null) {
                            setNextPage(-1);
                        } else {
                            let lastIndex = parseInt(res.data.next_page_url[res.data.next_page_url.length - 1], 10);
                            console.log(lastIndex)
                            setNextPage(lastIndex);
                            setOpen(true);
                        }

                        
                    })
                    .catch(err => {
                        console.log(err)
                        setUsers([]);
                    })
            }
           
        } else {
            setOpen(false);
        }

        setIsloading(false);

    }, [nextPage, param])

    const reset = () => {
        setParam('');
        setOpen(false);
        setNextPage(0);
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
            refOption.current.removeEventListener('wheel', handleSearch);
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
            onClick={openDropdown}
        />
        <div className={open ? 'results active' : 'results'}>
            {users.length ? (
                users.map((item, i) => (
                    <SearchItem key={i} name={item.firstName} surname={item.lastName} url={`/user/${item.id}`} profile={item.profile_photo?.image.src} />
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
