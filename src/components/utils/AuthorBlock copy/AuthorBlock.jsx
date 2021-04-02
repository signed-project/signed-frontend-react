
import styles from './authorInfo.module.scss';
import Avatar from '../Avatar/Avatar';
import AuthorInfo from '../InfoAuthor/AuthorInfo';

const AuthorBlock = () => {

    return (
        <>
            <div className={styles.author}>
                <Avatar />
                <AuthorInfo />
            </div>
        </>
    )
}

export default AuthorBlock