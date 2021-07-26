
import styles from './infoAuthor.module.scss';
import icon from '../../../assets/svg/icon';
import routs from '../../../config/routes.config';
import { useHistory } from "react-router-dom";


const InfoAuthor = ({ name, createdAt, address, isShowDate = true }) => {
    const history = useHistory();
    return (
        <>
            <div className={styles.info}>
                <div className={styles.textWrapper} >
                    <div className={styles.nameBlock} onClick={() => {
                        history.push(`${routs.source}/${address}`);
                    }} >
                        <img src={icon.tickOne} alt="tick icon" className={styles.tickOne} />
                        <span className={styles.name}>{name}</span>
                    </div>
                    {isShowDate && <div className={styles.date}>
                        <span>{createdAt}</span>
                    </div>}
                </div>
            </div>

        </>
    )
}

export default InfoAuthor