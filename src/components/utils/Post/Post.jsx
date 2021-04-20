import { useSelector } from 'react-redux';
import AuthorBlock from '../AuthorBlock/AuthorBlock';
import PostContent from '../PostContent/PostContent';
import Reaction from '../Reaction/Reaction';
import LikeMark from '../LikeMark/LikeMark';
import styles from './post.module.scss';
import icon from '../../../assets/svg/icon';


const Post = ({ name, text, date, likesCount, repostsCount, handleLike, type }) => {
    const hashed = useSelector(state => state.post.hashed);
    return (
        <>
            { type === 'post' && <>
                <div className={styles.post}>
                    <div className={styles.wrapperContent}>
                        <AuthorBlock name={name} date={date} />
                        <img src={icon.menu} alt="menu icon" className={styles.menuIcon} />
                    </div>
                    <PostContent text={text} />
                    <Reaction
                        likesCount={likesCount}
                        repostsCount={repostsCount}
                        handleLike={handleLike} />
                </div>
            </>}

            { type === 'like' && <>
                <div className={styles.post}>
                    <LikeMark date={date} name={name} />
                    <div className={styles.wrapperContent}>
                        <AuthorBlock name={name} date={date} />
                    </div>
                    <PostContent text={text} />
                    <Reaction
                        likesCount={likesCount}
                        repostsCount={repostsCount}
                        handleLike={handleLike} />
                </div>
            </>}

        </>
    )
}


export default Post;