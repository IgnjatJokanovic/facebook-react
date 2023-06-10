import axios from 'axios';
import React from 'react'
import MessageItem from './MessageItem';
import MessageLoader from '../../loaders/MessageLoader';
import Context from '../../../context/context';
import { useSocket } from '../../../helpers/broadcasting';
import { ChannelList } from '../../../helpers/channels';
import { getClaims } from '../../../helpers/helpers';
import { MessageDto, MessageNotification } from '../../../types/types';

export default function MessageNotifications() {

    const ctx = React.useContext(Context);

    const messages = ctx.messageNotifications;
    const setMessages = ctx.setMessageNotifications;
    const count = ctx.count;
    const setCount = ctx.setCount;
    const activeMessages = ctx.activeMessages;
    const setActiveMessages = ctx.setActiveMessages;

    const claims = getClaims();
   
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
        console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAa', item)
        ctx.openMessage(item);
        setOpen(false);
        setSearch('');

    }

    const handleAdd = (payload: MessageDto) => {
        let currActive = [...activeMessages];
        let indexActive = currActive.findIndex(obj => obj.id == payload.notification.id);

        console.log("ADD TRIGGERED", indexActive, payload.notification);
    
        if (indexActive >= 0) {
            let activeMsg = currActive[indexActive];
            if (!activeMsg.isOpen) {
                setCount(prevCount => prevCount + 1);
                updateNotifications(payload.notification)
            }
        } else {
            setCount(prevCount => prevCount + 1);
            updateNotifications(payload.notification)
            
        }
    }

    const updateNotifications = (msg: MessageNotification) => {
        let curr = [...messages];
        let index = curr.findIndex(obj => obj.id == msg.id);

        console.log('updateNotifications', index)
        console.log('updateNotifications', curr)
        console.log('updateNotifications', msg)
        if (index >= 0) {
            curr[index] = msg;
        } else {
            curr.unshift(msg);
        }

        setMessages(curr)
        
    }
    
      const handleDelte = (payload) => {
        console.log('MESSAGE DELETED', payload)
        let curr = [...messages];
        let index = curr.findIndex(obj => obj.messageId == payload.message.id);
        console.log("messageId", index)
        
        if(index >= 0){
            let id = curr[index].id;
            axios.get(`/message/latest/${id}`)
                .then(res => {
                    console.log('RES DELETING', res.data)
                    if (res.data.message != null) {
                        curr[index] = res.data;
                    } else {
                        curr.splice(index, 1);
                    }

                    setMessages(curr);
                })
                .catch(err => { });
        }
          
        if (!payload.message.opened && payload.message.to == claims?.id) {
            setCount(prevCount => prevCount > 0 ? prevCount - 1 : 0);
        }
        
      }
    
    const handleUpdate = (payload) => {
        let curr = [...messages];
        let index = curr.findIndex(obj => obj.messageId == payload.message.id);
        if (index >= 0) {
            let msg = curr[index];
            msg.body = payload.message.body;
            setMessages(curr);
        }
    }
    
      useSocket({
          channel: `${ChannelList.newMessage.channel}${claims?.id}`,
          event: ChannelList.newMessage.listen,
          isPrivate: false,
          callBack: (payload) => {
              handleAdd(payload);
          },
      })
    
      useSocket({
          channel: `${ChannelList.messageDeleted.channel}${claims?.id}`,
          event: ChannelList.messageDeleted.listen,
          isPrivate: false,
          callBack: (payload) => {
              handleDelte(payload);
          },
      })
    
      useSocket({
        channel: `${ChannelList.messageUpdated.channel}${claims?.id}`,
        event: ChannelList.messageUpdated.listen,
        isPrivate: false,
        callBack: (payload) => {
            handleUpdate(payload);
        },
      })

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
            axios.get('/message/unreadCount')
                .then(res => {
                    setCount(res.data);
                })
                .catch(err => { })
            loadData();
        }

        document.addEventListener("mousedown", toggleNavOption);

        refDropdown.current.addEventListener("wheel", loadData);

        return () => {
            document.removeEventListener("mousedown", toggleNavOption);
            refDropdown?.current?.removeEventListener("wheel", loadData);
        };
    }, [messages.length, nextPage, search.length, loadData]);


  return (
    <div ref={ refOption} className='item friend-notifications-container'>
          <i className='fas fa-envelope-square' onClick={e => setOpen(!open)}>
            {!!count  && (
              <span>{count < 100 ? count : '99+'}</span>
            )}
          </i>
          <div ref={refDropdown} className={open ? 'dropdown active' : 'dropdown'}>
              
                <form>
                  <input
                      onChange={e => {
                          handleChange(e);
                      }}
                      type="text" 
                      placeholder='Search messages'
                      value={search}
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
                                    opened={item.opened}
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
                                    opened={item.opened}
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
