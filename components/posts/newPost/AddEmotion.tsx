import React from 'react'
import Context from '../../../context/context';

export default function AddEmotion({ article, setArticle, openEmotions, setOpenEmotions }) {

    const ctx = React.useContext(Context);
    const emotions = ctx.emotions;

    const update = emotion => {

       if (article?.emotion?.id === emotion.id) {
           emotion = null;   
       }
       setArticle({ ...article, emotion: emotion });
       setOpenEmotions(!openEmotions); 
       
    }
    
    const refOption = React.useRef();

    const toggleNavOption = e => {
        if (refOption.current.contains(e.target)) {
            return;
        }
        setOpenEmotions(false);
    };

    React.useEffect(() => {
        document.addEventListener("mousedown", toggleNavOption);

        return () => {
            document.removeEventListener("mousedown", toggleNavOption);
        };
    }, []);
  return (
      <div ref={refOption} className='controll-item emotion'>
        <div className="icon-holder">
            <div className="dropdown-title">Add emotion</div>
            <i onClick={e => setOpenEmotions(!openEmotions)} className="fas fa-smile-beam"></i>
        </div>
        
          <div className={openEmotions ? 'dropdown active' : 'dropdown'}>
            <div className="emotion-container">
                {!!emotions && emotions.map((item, i) => (
                    <div className="emotion-item" key={i} onClick={() => update(item) }>
                        <div className={ article?.emotion?.id === item.id ? "wrapper active" : "wrapper"}>
                            <div dangerouslySetInnerHTML={{ __html: item.code }}></div>
                            <div className='description'>{ item.desctiption }</div>
                        </div>
                    </div>
                ))}
            </div>
           
        </div>  
    </div>
  )
}
