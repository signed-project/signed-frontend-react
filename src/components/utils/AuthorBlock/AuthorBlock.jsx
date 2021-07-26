
import Avatar from '../Avatar/Avatar';
import InfoAuthor from '../InfoAuthor/InfoAuthor';

import styles from './authorBlock.module.scss';

const AuthorBlock = ({ name, createdAt, imgSmall, avatar, address }) => {
    return (
        <>
            <div className={styles.author}>
                <Avatar imgSmall={imgSmall} avatar={avatar} address={address} />
                <InfoAuthor createdAt={createdAt} name={name} address={address} />
            </div>
        </>
    )
}

export default AuthorBlock