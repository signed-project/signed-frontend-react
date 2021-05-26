import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

const useTargetPost = (postHash) => {
    const hashedPostState = useSelector(state => state.post.hashed);
    const [targetPost, setTargetPost] = useState('');
    useEffect(() => {
        if (postHash) {
            setTargetPost(hashedPostState[postHash])
        }
    }, [hashedPostState, postHash]);
    return targetPost
};
export default useTargetPost;
