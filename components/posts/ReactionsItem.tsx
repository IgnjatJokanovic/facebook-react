import axios from 'axios';
import Link from 'next/link'
import React from 'react'
import DefaultPrefixImage from '../DefaultPrefixImage'

export default function ReactionsItem({ reactions, isOpen, activeReaction, setActiveReaction, postId, refOpen }) {
    
  const [nextPage, setNextPage] = React.useState(0);
  const [usersReaction, setUsersReaction] = React.useState([])
  

  const openReactions = (id: number) => {
    
    if (activeReaction != id) {
      setNextPage(0);
      setUsersReaction([]);
    }

    setActiveReaction(id);

   

    // initial load
    loadUsersReaction();
  }

  const loadUsersReaction = React.useCallback(() => {
    // Load paginated users
    console.log(nextPage);
    if (nextPage >= 0) {
      axios.get(`/reaction/users/${postId}/${activeReaction}?page=${nextPage}`)
      .then(res => {
        console.log(res.data)
        setUsersReaction([...usersReaction, ...res.data.data]);
        if (res.data.next_page_url === null) {
          refOpen.current.removeEventListener('wheel', loadUsersReaction);
          setNextPage(-1);
        } else {
          let lastIndex = parseInt(res.data.next_page_url[res.data.next_page_url.length - 1], 10);
          console.log(lastIndex)
          setNextPage(lastIndex);
        }
        
      })
      .catch(err => {
        
      })
    } else {
      
    }
  
  }, [activeReaction, nextPage, postId, refOpen, usersReaction])
    
  React.useEffect(() => {
    refOpen.current.addEventListener("wheel", loadUsersReaction);
    
    if(!usersReaction.length){
        loadUsersReaction();
    }
    return () => {
        refOpen.current.removeEventListener('wheel', loadUsersReaction);
    }
  }, [isOpen, activeReaction, refOpen, loadUsersReaction, usersReaction.length])
  

  return (
    <div ref={refOpen} className={isOpen ? 'dropdown active' : 'dropdown'}>
        <div className="heading">
            <div className={activeReaction == 0 ? "item active":"item"} onClick={() => openReactions(0)}>
                All
            </div>
            {reactions.map((item, i) => (
                <div className={activeReaction == item.id ? "item active":"item"} key={i} onClick={() => openReactions(item.id)}>
                    <div className="code" dangerouslySetInnerHTML={{ __html: item.code }}></div>
                    <div className="count">&nbsp;{item.reaction_count}</div>
                </div>
            ))}
            </div>
            <div className="body">
            {usersReaction.map((item, i) => (
                <Link key={i} href={`/user/${item.user.id}`}>
                    <DefaultPrefixImage src={item.user.profile_photo?.image.src} />
                    <div>{item.user.firstName} {item.user.lastName}</div>
                </Link>
            ))}
        </div>
    </div>
  )
}
