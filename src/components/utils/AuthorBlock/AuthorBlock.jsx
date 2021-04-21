
import Avatar from '../Avatar/Avatar';
import InfoAuthor from '../InfoAuthor/InfoAuthor';

import styles from './authorBlock.module.scss';

const AuthorBlock = ({ name, createdAt }) => {
    return (
        <>
            <div className={styles.author}>
                <Avatar />
                <InfoAuthor createdAt={createdAt} name={name} />
            </div>
        </>
    )
}

export default AuthorBlock