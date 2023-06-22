import axios from "axios";
import { useRouter } from "next/router"
import React, { useState } from "react";
import NewPost from "../../components/posts/NewPost";
import PostItem from "../../components/posts/PostItem";
import { Article } from "../../types/types";
import PostLoader from "../../components/loaders/PostLoader";

export default function Post() {
    const router = useRouter();
    const postId = router.query.postId;

    const [post, setPost] = React.useState<Article>({});
    const [isLoading, setIsloading] = React.useState(true);

    const [editArticle, setEditArticle] = React.useState<Article>({});

    React.useEffect(() => {

        if (!postId) {
            return;
        }
       
        axios.get(`/post/show/${postId}`)
            .then(res => {
                setPost(res.data);
                setIsloading(false);
            })
            .catch(err => {
                router.push('/404/post')
            });
        
    }, [postId, router])

    return (
        <div className="show-post">
            {isLoading ? (
                <PostLoader />
            ): (
                Object.keys(post).length !== 0 ? (
                    <div className="post">
                        {!!Object.keys(editArticle).length && (
                            <NewPost owner={editArticle.owner.id} editArticle={editArticle} url={'update'} setOriginalPost={setPost} close={setEditArticle} />
                        )}
                            <PostItem post={post} isEditable={true} linkable={false} setArticle={setEditArticle} />            
                    </div>
                ) : null
            )}
            
        </div>
    )
}
