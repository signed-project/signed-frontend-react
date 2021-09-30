import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { postActions } from '../../api/storage/post';
import { Post as PostModel } from '../../api/models/post';
import routes from '../../config/routes.config.js';



const useReaction = () => {
    const user = useSelector(state => state.user);
    const postMapState = useSelector(state => state.post.hashed);
    const history = useHistory();
    const dispatch = useDispatch();

    const handleLike = (p) => {
        let data;
        if (p.type === 'post' || p.type === 'reply') {
            data = {
                source: user.source,
                type: 'like',
                wif: user.wif,
                target: {
                    "sourceHash": user.source.hash,
                    "postHash": p.hash
                },
                mentions: [p.source],
            }
        }
        else {
            const postData = postMapState[p?.target?.postHash];
            data = {
                source: user.source,
                type: 'like',
                wif: user.wif,
                target: {
                    sourceHash: p.source.hash,
                    postHash: p?.target?.postHash
                },
                mentions: [p.source],
            }
        };
        const post = new PostModel(data);
        const likePost = post.newPost;

        dispatch(postActions.sendPost({ post: likePost }));
        history.push(`${routes.feed}`);
    };

    const handleRepost = (p) => {
        let sourcePost
        let sourceAddress
        if (p.type === 'post' || p.type === 'reply') {
            sourcePost = p.hash;
            sourceAddress = p.source.address;
        } else {
            sourcePost = p.target.postHash;
            sourceAddress = p.target.sourceHash;
        }
        const type = 'repost';
        history.push(`${routes.newPost}?post=${sourcePost}&user=${sourceAddress}&type=${type}`);
    };

    const handleReply = (p) => {
        let sourcePost
        let sourceAddress
        if (p.type === 'post' || p.type === 'reply' || p.type === 'repost') {
            sourcePost = p.hash;
            sourceAddress = p.source.address;
        } else {
            sourcePost = p.target.postHash;
            sourceAddress = p.target.sourceHash;
        }
        const type = 'reply';
        history.push(`${routes.newPost}?post=${sourcePost}&user=${sourceAddress}&type=${type}`);
    }
    return {
        handleLike,
        handleRepost,
        handleReply
    }
}

export default useReaction;