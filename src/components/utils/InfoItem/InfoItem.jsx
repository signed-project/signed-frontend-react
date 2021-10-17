
import styles from './infoItem.module.scss';



const InfoItem = ({ title, value, type }) => {
    return (
        <>
            <div className={styles.infoItem}>
                <p className={
                    styles.itemTitle
                }>{title}</p>
                <p>{value}</p>
            </div>
        </>
    )
};




export default InfoItem;