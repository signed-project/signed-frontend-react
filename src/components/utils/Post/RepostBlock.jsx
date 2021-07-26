
import { useEffect, useState } from 'react';
import styles from './post.module.scss';
import useTargetPost from '../../customHooks/useTargetPost';
import useSourcePost from '../../customHooks/useSourcePost';
import AuthorBlock from '../AuthorBlock/AuthorBlock';
import PostContent from '../PostContent/PostContent';
import { getReadFormat } from '../../../libs/date.js';
import Preview from '../Preview/Preview';
import getImgArr from '../../customHooks/getImgSources';

const RepostBlock = ({ postHash, type }) => {
    const [imgSources, setImgSources] = useState([]);
    const targetPost = useTargetPost(postHash);
    const sourceTargetPost = useSourcePost(targetPost?.source?.address);



    useEffect(() => {
        // setCurrentPost(targetPost);
        if (targetPost?.attachments?.length > 0) {
            const imgSourceArr = getImgArr(targetPost.attachments)
            setImgSources(imgSourceArr);
        }
    }, [targetPost])


    return (
        <div className={styles.repostBlock}>
            <div className={styles.wrapperContent}>
                {targetPost && <AuthorBlock
                    avatar={sourceTargetPost?.avatar} name={sourceTargetPost?.name}
                    imgSmall={true} createdAt={getReadFormat(targetPost?.createdAt)}
                    address={targetPost.source.address} />}
            </div>
            {sourceTargetPost?.hosts && <PostContent
                text={targetPost.text}
                hostAssets={sourceTargetPost?.hosts[0]?.assets}
                postHash={targetPost.hash}
                type={targetPost.type}
                imgHostArr={imgSources}
            />}
            {imgSources && <Preview uploadImgArr={imgSources} postHash={targetPost.hash} />}
        </div>
    )
}


export default RepostBlock;