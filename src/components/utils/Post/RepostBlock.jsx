
import styles from './post.module.scss';
import { useTargetPost } from './Post';
import AuthorBlock from '../AuthorBlock/AuthorBlock';
import PostContent from '../PostContent/PostContent';
import { getReadFormat } from '../../../libs/date.js';

const RepostBlock = ({ postHash, type }) => {
    const targetPost = useTargetPost(postHash);
    return (
        < div className={styles.repostBlock}>
            <div className={styles.wrapperContent}>
                <AuthorBlock name={targetPost?.source?.name} createdAt={getReadFormat(targetPost?.createdAt)} />
            </div>
            <PostContent text={targetPost.text} />
        </div>
    )
}


export default RepostBlock;