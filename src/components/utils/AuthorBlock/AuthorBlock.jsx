
import Avatar from '../Avatar/Avatar';
import InfoAuthor from '../InfoAuthor/InfoAuthor';

import styles from './authorBlock.module.scss';

const AuthorBlock = ({ name, date }) => {
    return (
        <>
            <div className={styles.author}>
                <Avatar />
                <InfoAuthor date={date} name={name} />
            </div>
        </>
    )
}

export default AuthorBlock