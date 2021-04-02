
import Avatar from '../Avatar/Avatar';
import InfoAuthor from '../InfoAuthor/InfoAuthor';
import icon from '../../../assets/svg/icon';
import styles from './authorBlock.module.scss';

const AuthorBlock = () => {

    return (
        <>
            <div className={styles.author}>
                <Avatar />
                <div className={styles.wrapperContent}>
                    <InfoAuthor />
                    <img src={icon.menuIcon} alt="menu icon" className={styles.menuIcon} />
                </div>
            </div>
        </>
    )
}

export default AuthorBlock