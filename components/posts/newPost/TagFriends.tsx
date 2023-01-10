import React from 'react'

export default function TagFriends({ taged = [], setArticle, openTagged, setOpenTagged }) {
    const refOption = React.useRef();
    const [searchParam, setSearchParam] = React.useState('');

    const toggleNavOption = e => {
        if (refOption.current.contains(e.target)) {
            return;
        }
        setOpenTagged(false);
    };
    const search = () => {
        console.log(searchParam)
    }

    React.useEffect(() => {
        document.addEventListener("mousedown", toggleNavOption);

        return () => {
            document.removeEventListener("mousedown", toggleNavOption);
        };
    }, []);
  return (
      <div ref={refOption} className='controll-item tag-friends'>
        <div className="icon-holder">
            <div className="dropdown-title">Tag friends</div>
            <i onClick={e => setOpenTagged(!openTagged)} className="fas fa-user-tag"></i>
        </div>
          <div className={ openTagged ? 'dropdown active' : 'dropdown' }>
              <input onChange={e => { setSearchParam(e.target.value) }} onKeyUp={ search } value={searchParam} className='search' type="text" placeholder='Search friends' />
            <div className="friend-options">
                <div className="item">
                    <div className="link">
                    </div>
                    <div className="actions">
                        <i className="fa fa-minus" aria-hidden="true"></i>    
                    </div>  
                </div>      
            </div>  
        </div>  
    </div>
  )
}
