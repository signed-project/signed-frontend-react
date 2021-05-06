
import { useEffect, useState } from 'react';
import styles from './post.module.scss';
import useTargetPost from '../../customHooks/useTargetPost';
import AuthorBlock from '../AuthorBlock/AuthorBlock';
import PostContent from '../PostContent/PostContent';
import { getReadFormat } from '../../../libs/date.js';
import { useStore } from 'react-redux';

const RepostBlock = ({ postHash, type }) => {
    const [currentPost, setCurrentPost] = useState('');
    const targetPost = useTargetPost(postHash);
    useEffect(() => {
        setCurrentPost(targetPost)
    }, [targetPost])

    return (
        < div className={styles.repostBlock}>
            <div className={styles.wrapperContent}>
                {currentPost && <AuthorBlock name={currentPost?.source?.name} imgSmall={true} createdAt={getReadFormat(currentPost?.createdAt)} />}
            </div>
            <PostContent text={targetPost.text} />
        </div>
    )
}


export default RepostBlock;