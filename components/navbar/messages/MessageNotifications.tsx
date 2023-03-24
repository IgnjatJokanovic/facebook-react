import axios from 'axios';
import React from 'react'
import MessageItem from './MessageItem';
import MessageLoader from '../../loaders/MessageLoader';

export default function MessageNotifications() {
   
    const [open, setOpen] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(true);
    const [messages, setMessages] = React.useState([]);
    const [search, setSearch] = React.useState('');
    const [nextPage, setNextPage] = React.useState(0);

    const refOption = React.useRef();
    const refDropdown = React.useRef();

    const searchMessages = data => {
        console.log(data)
    }

    const toggleNavOption = e => {
        if (refOption.current.contains(e.target)) {
            return;
        }
        setOpen(false);
    };

    React.useEffect(() => {

        const loadData = () => {
            console.log(nextPage);
            if (nextPage >= 0 && search.length === 0) {
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
            } else {
                refDropdown.current.removeEventListener("wheel", loadData);
            }
        };

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
    }, [messages.length, nextPage, search.length]);
  return (
    <div ref={ refOption} className='item friend-notifications-container'>
          <i className='fas fa-envelope-square' onClick={e => setOpen(!open)}>
              <span>10</span>
          </i>
          <div ref={refDropdown} className={open ? 'dropdown active' : 'dropdown'}>
              <form onInput={e => searchMessages(e.target.value)}>
                  <input type="text" placeholder='Search messages'/>
              </form>
              {isLoading ? (
                 <MessageLoader />
              ) : (
                    messages.length ? (
                          messages.map((item, i) => (
                            <MessageItem 
                                  key={i}
                                  img={item.profile}
                                  name={item.firstName}
                                  surname={item.lastName}
                                  message={item.body}
                                  setOpen={setOpen}
                            /> 
                          ))
                      ): (
                        <div className="not-found">No new messages</div>
                    )
              )}
          </div>
    </div>
  )
}
