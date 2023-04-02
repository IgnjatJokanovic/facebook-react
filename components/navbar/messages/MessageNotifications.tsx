import axios from 'axios';
import React from 'react'
import MessageItem from './MessageItem';
import MessageLoader from '../../loaders/MessageLoader';
import Context from '../../../context/context';
import { ActiveMessage } from '../../../types/types';

export default function MessageNotifications() {

    const ctx = React.useContext(Context);

    const messages = ctx.messageNotifications;
    const setMessages = ctx.setMessageNotifications;
   
    const [open, setOpen] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(true);
    const [searchData, setSearchData] = React.useState([]);
    const [search, setSearch] = React.useState('');

    const [nextPage, setNextPage] = React.useState(0);
    const [nextPageSearch, setNextPageSearch] = React.useState(0);


    const refOption = React.useRef();
    const refDropdown = React.useRef();

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

    const toggleNavOption = e => {
        if (refOption.current.contains(e.target)) {
            return;
        }
        setOpen(false);
    };

    const openMessage = (item) => {
        let curr: ActiveMessage[] = [...ctx.activeMessages];
        let index = curr.findIndex(obj => obj.id === item.id);

        if (index >= 0) {
            // handle set first position and open
            let currObj = curr.splice(index, 1)[0];
            currObj.isOpen = true;
            curr.unshift(currObj);

        } else {
            // handle adding new item
            let newObj: ActiveMessage = {
                isOpen: true,
                id: item.id,
                firstName: item.firstName,
                lastName: item.lastName,
                profile: item.profile,
                messages: [],
            };

            console.log('setting', newObj);

            curr.unshift(newObj);
        }

        ctx.setActiveMessages(curr);
        setOpen(false);

    }

    const loadData = React.useCallback(() => {
        if (search.length) {
            if (nextPageSearch >= 0) {
                axios
                .post(`/message/search?page=${nextPageSearch}`, { search: search })
                .then((res) => {
                    setSearchData((prevState) => [...prevState, ...res.data.data]);
                    setIsLoading(false);
                    console.log('SRCH', res.data.data);
            
                    const nextPageUrl = res.data.next_page_url;
                    if (nextPageUrl === null) {
                        setNextPageSearch(-1);
                    } else {
                        const lastIndex = parseInt(nextPageUrl.slice(-1), 10);
                        console.log(lastIndex);
                        setNextPageSearch(lastIndex);
                    }
                })
                .catch((err) => {
                    // handle error
                });
            }
        } else {
            if (nextPage >= 0) {
                axios
                .get(`/message?page=${nextPage}`)
                .then((res) => {
                    setMessages((prevState) => [...prevState, ...res.data.data]);
                    setIsLoading(false);
                    console.log('setting false');
            
                    const nextPageUrl = res.data.next_page_url;
                    if (nextPageUrl === null) {
                    setNextPage(-1);
                    } else {
                        const lastIndex = parseInt(nextPageUrl.slice(-1), 10);
                        console.log(lastIndex);
                        setNextPage(lastIndex);
                    }
                })
                .catch((err) => {
                    // handle error
                });
            }
        }
        
    }, [nextPage, nextPageSearch, search, setMessages]);

    React.useEffect(() => {
        if (search.length) {
            loadData();
        }
    }, [loadData, search]);

    React.useEffect(() => {

        

        if (!messages.length) {
            console.log('re-render messages');
            loadData();
          }

        document.addEventListener("mousedown", toggleNavOption);

        refDropdown.current.addEventListener("wheel", loadData);

        return () => {
            document.removeEventListener("mousedown", toggleNavOption);
            refDropdown.current.removeEventListener("wheel", loadData);
        };
    }, [messages.length, nextPage, search.length, loadData]);


  return (
    <div ref={ refOption} className='item friend-notifications-container'>
          <i className='fas fa-envelope-square' onClick={e => setOpen(!open)}>
              <span>10</span>
          </i>
          <div ref={refDropdown} className={open ? 'dropdown active' : 'dropdown'}>
              
                <form>
                  <input
                      onChange={e => {
                          handleChange(e);
                      }}
                      type="text" 
                      placeholder='Search messages'
                  />
                </form>
              
              {isLoading ? (
                 <MessageLoader />
              ) : (
                    search.length > 0 ? (
                        searchData.length ? (
                            searchData.map((item, i) => (
                                <MessageItem 
                                    key={i}
                                    img={item.profile}
                                    name={item.firstName}
                                    surname={item.lastName}
                                    message={item.body}
                                    openMessage={() => openMessage(item)}
                                /> 
                            ))
                        ): (
                            <div className="not-found">No results found</div>
                        )      
                    ): (
                        messages.length ? (
                            messages.map((item, i) => (
                                <MessageItem 
                                    key={i}
                                    img={item.profile}
                                    name={item.firstName}
                                    surname={item.lastName}
                                    message={item.body}
                                    openMessage={() => openMessage(item)}
                                /> 
                            ))
                        ): (
                            <div className="zero-notifications">No new messages</div>
                        )      
                    )
                    
              )}
          </div>
    </div>
  )
}
