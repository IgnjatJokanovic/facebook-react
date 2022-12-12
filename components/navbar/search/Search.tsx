import React from 'react'
import SearchItem from './SearchItem';

export default function Search() {
    const refOption = React.useRef();
    const [open, setOpen] = React.useState(false);
    const toggleNavOption = e => {
        if (refOption.current.contains(e.target)) {
            return;
        }
        setOpen(false);
    };
    const search = (value) => {
        // make axios call
        setOpen(true);
    }  
    React.useEffect(() => {
        document.addEventListener("mousedown", toggleNavOption);

        return () => {
            document.removeEventListener("mousedown", toggleNavOption);
        };
    }, [])
    
  return (
    <form ref={refOption} onInput={e => search(e.target.value)}>
        <input type="text" placeholder='Search' />
        <div className={ open ? 'results active' : 'results' }>
            <SearchItem image='/logo.png' name='Ignjat' surname='Jokanovic' url='/profile/1'/>
        </div>
    </form>
  )
}
