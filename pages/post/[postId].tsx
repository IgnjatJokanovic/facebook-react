import { useRouter } from "next/router"

export default function Post() {
    const router = useRouter();
    const postId = router.query.postId;

    return (
        <div>{ postId }</div>
    )
}
