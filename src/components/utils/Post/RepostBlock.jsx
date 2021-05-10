
import { useEffect, useState } from 'react';
import styles from './post.module.scss';
import useTargetPost from '../../customHooks/useTargetPost';
import AuthorBlock from '../AuthorBlock/AuthorBlock';
import PostContent from '../PostContent/PostContent';
import { getReadFormat } from '../../../libs/date.js';
import { useStore } from 'react-redux';
import Preview from '../Preview/Preview';
import getImgArr from '../../customHooks/getImgSources';

const RepostBlock = ({ postHash, type }) => {
    const [currentPost, setCurrentPost] = useState('');
    const [imgSources, setImgSources] = useState([]);
    const targetPost = useTargetPost(postHash);
    useEffect(() => {
        setCurrentPost(targetPost);
        if (targetPost?.attachments?.length > 0) {
            console.log('fjjfjfasdas');
            const imgSourceArr = getImgArr(targetPost.attachments)
            setImgSources(imgSourceArr);
        }
    }, [targetPost])

    console.log('---', imgSources);

    return (
        <div className={styles.repostBlock}>
            <div className={styles.wrapperContent}>
                {currentPost && <AuthorBlock name={currentPost?.source?.name} imgSmall={true} createdAt={getReadFormat(currentPost?.createdAt)} />}
            </div>
            <PostContent text={targetPost.text} />
            { imgSources && <Preview uploadImgArr={imgSources} />}
        </div>
    )
}


export default RepostBlock;