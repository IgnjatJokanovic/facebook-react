import axios from 'axios'
import Link from 'next/link';
import React from 'react'
import DefaultPrefixImage from './DefaultPrefixImage';
import UserLoader from './loaders/UserLoader';

export default function RecomendedFriends() {

    const [nextPage, setNextPage] = React.useState(0);
    const [users, setUsers] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true)

    const refSlider = React.useRef();

    

    React.useEffect(() => {

        const loadData = () => {
            if (nextPage >= 0) {
                axios.get(`/friend/recomended?page=${nextPage}`)
                    .then(res => {
                        console.log('fetching')
                        setUsers(prevUsers => [...prevUsers, ...res.data.data]);
                        
                        setIsLoading(false);
                        if (res.data.next_page_url === null) {
                            setNextPage(-1);
                        } else {
                            let lastIndex = parseInt(res.data.next_page_url[res.data.next_page_url.length - 1], 10);
                            console.log(lastIndex)
                            setNextPage(lastIndex);
                        }

                        
                    })
                    .catch(err => {
                        console.log(err);
                    })
            }
        }
    
        refSlider.current.addEventListener('scroll', loadData);

        if (!users.length) {
            console.log('re-render');
            loadData();
        }
    
        return () => {
            refSlider?.current?.removeEventListener('scroll', loadData);
        };
    }, [nextPage, users.length, isLoading])
    
  return (
    <div ref={refSlider} className='recomended'>
        <div className="fixed">
            <div className="text-left"><span>Recomended friends</span></div>
            {isLoading ? (
                <div className='loading-slider'>
                    <UserLoader />
                    <UserLoader />
                    <UserLoader />
                </div>
            ): (
                users.length ? (
                    <div className="slider">
                        {users.map((item, i) => (
                            <Link className='item' key={i} href={`/user/${item.id}`}>
                                <DefaultPrefixImage src={item.profile} alt={`${item.firstName} ${item.lastName}`} />
                                <div className='credentials'>{item.firstName} {item.lastName}</div>
                            </Link>
                        ))}
                    </div>
                ): (
                    <div className='not-found'>No recomendations try adding some friends</div>
                )
            )}
        </div>
    </div>
  )
}
