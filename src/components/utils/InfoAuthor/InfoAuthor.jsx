
import styles from './infoAuthor.module.scss';
import icon from '../../../assets/svg/icon';

const InfoAuthor = () => {
    return (
        <>
            <div className={styles.info}>
                <div className={styles.textWrapper} >
                    <div className={styles.nameBlock} >
                        <img src={icon.tickOne} alt="tick icon" className={styles.tickOne} />
                        <span className={styles.name}>Jenny Wilson</span>
                    </div>
                    <div className={styles.date}>
                        fev 24, 8:30 pm
                    </div>
                </div>
            </div>

        </>
    )
}

export default InfoAuthor