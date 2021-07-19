
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

    console.log('currentPos222222222t', currentPost);
    console.log('currentPos222222222t', currentPost);
    console.log('currentPos222222222t', currentPost);
    console.log('currentPos222222222t', currentPost);

    useEffect(() => {
        setCurrentPost(targetPost);
        if (targetPost?.attachments?.length > 0) {
            const imgSourceArr = getImgArr(targetPost.attachments)
            setImgSources(imgSourceArr);
        }
    }, [targetPost])



    return (
        <div className={styles.repostBlock}>
            <div className={styles.wrapperContent}>
                {currentPost && <AuthorBlock avatar={currentPost.source.avatar} name={currentPost?.source?.name} imgSmall={true} createdAt={getReadFormat(currentPost?.createdAt)} />}
            </div>
            <PostContent
                text={currentPost.text}
                hostAssets={currentPost.source?.hosts[0]?.assets}
                postHash={currentPost.hash}
                type={currentPost.type}
                imgHostArr={imgSources}
            />
            {imgSources && <Preview uploadImgArr={imgSources} postHash={targetPost.hash} />}
        </div>
    )
}


export default RepostBlock;