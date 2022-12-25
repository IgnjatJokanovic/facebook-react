import React from 'react'
import SearchItem from './SearchItem';

export default function Search() {
    const refOption = React.useRef();
    const [open, setOpen] = React.useState(false);
    const [searchParam, setSearchParam] = React.useState('')

    const toggleNavOption = e => {
        if (refOption.current.contains(e.target)) {
            return;
        }
        setOpen(false);
    };
    const search = (value) => {
        setSearchParam(value.trim())
        setOpen(true);
    }
    const reset = () => {
        setSearchParam('');
        setOpen(false);
    }

    React.useEffect(() => {
        document.addEventListener("mousedown", toggleNavOption);

        return () => {
            document.removeEventListener("mousedown", toggleNavOption);
        };
    }, [])
    
  return (
    <form ref={refOption} onInput={e => search(e.target.value)}>
        <input type="text" placeholder='Search' defaultValue={searchParam}/>
          <div className={open ? 'results active' : 'results'}>
            <SearchItem image='/logo.png' name='Ignjat' surname='Jokanovic' url='/user/1' close={() => reset}/>
        </div>
    </form>
  )
}
