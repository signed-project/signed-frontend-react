
import Avatar from '../Avatar/Avatar';
import InfoAuthor from '../InfoAuthor/InfoAuthor';
import icon from '../../../assets/svg/icon';
import styles from './authorBlock.module.scss';

const AuthorBlock = ({ name, date }) => {

    return (
        <>
            <div className={styles.author}>
                <Avatar />
                <div className={styles.wrapperContent}>
                    <InfoAuthor date={date} name={name} />
                    <img src={icon.menuIcon} alt="menu icon" className={styles.menuIcon} />
                </div>
            </div>
        </>
    )
}

export default AuthorBlock