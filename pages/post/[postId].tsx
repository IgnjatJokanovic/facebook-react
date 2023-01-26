import axios from "axios";
import { useRouter } from "next/router"
import React from "react";
import NewPost from "../../components/posts/NewPost";
import PostItem from "../../components/posts/PostItem";
import { Article } from "../../types/types";

export default function Post() {
    const router = useRouter();
    const postId = router.query.postId;

    const [post, setPost] = React.useState<Article>({})

    const [editArticle, setEditArticle] = React.useState<Article>({});

    React.useEffect(() => {

        if (!postId) {
            return;
        }

        console.log(postId)
       
        axios.get(`/post/${postId}`)
            .then(res => {
                setPost(res.data);
            })
            .catch(err => {
                
            });
    
        
    }, [postId])
    

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
                        <PostItem post={post} isEditable={true} setArticle={setEditArticle} />            
                    </div>
                    
                ) 
            )}
            
        </div>
    )
}
