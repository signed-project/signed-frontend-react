
import { useEffect, useState } from 'react';
import styles from './post.module.scss';
import { useTargetPost } from './Post';
import AuthorBlock from '../AuthorBlock/AuthorBlock';
import Avatar from '../Avatar/Avatar';
import InfoAuthor from '../InfoAuthor/InfoAuthor';
import PostContent from '../PostContent/PostContent';
import { getReadFormat } from '../../../libs/date.js';
import Reaction from '../Reaction/Reaction';
import icon from '../../../assets/svg/icon';
import useReaction from '../../customHooks/useReaction';
import getImgSources from '../../customHooks/getImgSources';

// TODO: signature less element ?
const CommentBlock = ({ post, img, name, type, text, createdAt, mention,
    removeLastLine = false, showReactionBlock = false, likesCount, repostsCount,
    handleLike, handleRepost, handleReply, hash }) => {

    const [imgPreview, setImgPreview] = useState([]);

    const reaction = useReaction();
    useEffect(() => {
        if (post?.attachments?.length > 0) {
            const imgArrSources = getImgSources(post.attachments);
            setImgPreview(imgArrSources);
        }
    }, [post])

    return (
        <div className={styles.commentBlock}>
            <div className={styles.avatarBlock}>
                <Avatar />
                <div className={`${styles.verticalLine} ${removeLastLine && styles.verticalLineRemove}`}></div>
            </div>
            <div className={styles.postBody}>
                <div className={styles.hover}>
                    <InfoAuthor createdAt={getReadFormat(createdAt)} name={name} />
                    <img src={icon.menu} alt="menu icon" className={styles.menuIcon} />
                </div>
                <div className={styles.commentBodyWrapper}>
                    {/* {imgPreview.length > 0 && <img src={imgPreview[0]?.imagePreviewUrl} alt="" className={styles.imgCommentPreview} />} */}
                    <PostContent hostAssets={post.source.hosts[0].assets} postHash={hash} text={text} type={type} imgPrevSrc={imgPreview[0]?.imagePreviewUrl} />
                </div>
                <Reaction
                    likesCount={likesCount}
                    repostsCount={repostsCount}
                    handleLike={() => reaction.handleLike(post)}
                    handleRepost={() => reaction.handleRepost(post)}
                    handleReply={() => reaction.handleReply(post)} />

            </div>

        </div>
    )
};


export default CommentBlock;
