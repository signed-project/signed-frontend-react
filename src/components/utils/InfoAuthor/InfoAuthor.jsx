
import styles from './infoAuthor.module.scss';
import icon from '../../../assets/svg/icon';

const InfoAuthor = ({ name, createdAt }) => {
    return (
        <>
            <div className={styles.info}>
                <div className={styles.textWrapper} >
                    <div className={styles.nameBlock} >
                        <img src={icon.tickOne} alt="tick icon" className={styles.tickOne} />
                        <span className={styles.name}>{name}</span>
                    </div>
                    <div className={styles.date}>
                        <span>{createdAt}</span>
                    </div>
                </div>
            </div>

        </>
    )
}

export default InfoAuthor