import axios from "axios";
import { useRouter } from "next/router"
import React from "react";
import NewPost from "../../components/posts/NewPost";
import PostItem from "../../components/posts/PostItem";
import Context from "../../context/context";
import { useSocket } from "../../helpers/broadcasting";
import { ChannelList } from "../../helpers/channels";
import { Article } from "../../types/types";

export default function Post() {
    const router = useRouter();
    const postId = router.query.postId;
    const ctx = React.useContext(Context)

    const [post, setPost] = React.useState<Article>({})

    const [editArticle, setEditArticle] = React.useState<Article>({});

    React.useEffect(() => {

        if (!postId) {
            return;
        }

        console.log(postId);
       
        axios.get(`/post/${postId}`)
            .then(res => {
                setPost(res.data);
            })
            .catch(err => {
                
            });
        
        // var chan = `${ChannelList.postReaction.channel}${postId}`
        // ctx.echo.channel(chan)
        // .listen(ChannelList.postReaction.listen, (e) => {
        //     if(e.action === 'add'){
        //         var reactions = post.distinct_reactions;
        //         if (reactions.filter(item => item.id === e.reaction.emotion.id).length <= 0) {
        //         var apendable = e.reaction.emotion;
        //         apendable.reaction_count = 1;
        //         reactions.push(apendable);
        //         setPost({...post, distinct_reactions: reactions});
        //         }

        //         var existingIndex = reactions.findIndex(item => item.id == e.reaction.emotion.id);
        //         var newObj = reactions[existingIndex];
        //         newObj.reaction_count += 1;

        //         reactions[existingIndex] = newObj;

        //         setPost({...post, distinct_reactions: reactions});
        //         // reactions.push()
        //         // setArticle(...setArticle, )
        //     }
        //     console.log(e)
        // });

       
    
        
    }, [postId])


    const handleChanChange = (e) => {
        var reactions = post.distinct_reactions;
        console.log(e)
       
        if (e.action === 'add') {
            alert("NIJE USO")
          if (reactions.filter(item => item.id === e.reaction.emotion.id).length <= 0) {
            var apendable = e.reaction.emotion;
            apendable.reaction_count = 1;
            reactions.push(apendable);
            setPost({ ...post, distinct_reactions: reactions });
          } else {
            var existingIndex = reactions.findIndex(item => item.id == e.reaction.emotion.id);
            var newObj = reactions[existingIndex];
            newObj.reaction_count += 1;
      
            reactions[existingIndex] = newObj;
      
            setPost({...post, distinct_reactions: reactions});
          }
    
         
          // reactions.push()
          // setArticle(...setArticle, )
        } else {
            alert(" USO")
          var curr = reactions.filter(item => item.id === e.reaction.emotion.id);
          var newCount = curr.reaction_count - 1;
          var index = reactions.findIndex(item => item.id == e.reaction.emotion.id);
          if (newCount === 0) {
            reactions.splice(index, 1);
            console.log('reactions', reactions)
          } else {
            curr.reaction_count = newCount;
            reactions[index] = curr;
          }
    
          setPost({...post, distinct_reactions: reactions});
        }
      }
      
    
      useSocket({
        channel: `${ChannelList.postReaction.channel}${post.id}`,
        event: ChannelList.postReaction.listen,
        isPrivate: false,
        callBack: (payload) => {
          handleChanChange(payload);
        },
      })
    
    
     
    
    

    return (
        <div className="show-post">
            {postId === undefined ? (
                null
            ) : (
                Object.keys(post).length === 0 ? (
                    <h1>Post not found</h1>
                ): (
                    <div className="post">
                        {!!Object.keys(editArticle).length && (
                            <NewPost article={editArticle} setArticle={setEditArticle} url={'update'} setOriginalPost={setPost} />
                        )}
                        <PostItem post={post} setPost={setPost} isEditable={true} setArticle={setEditArticle} />            
                    </div>
                    
                ) 
            )}
            
        </div>
    )
}
