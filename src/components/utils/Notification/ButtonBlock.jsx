import styles from './notification.module.scss';
import Button from '../Button/Button';



const ButtonBlock = ({ setPermission, address, id, status }) => {
    const statuses = {
        rejected: { value: 'rejected', text: 'Rejected' },
        accepted: { value: 'accepted', text: 'Approved' },
        new: { value: 'new', text: 'New' },
    };
    if (status === statuses.new.value) {
        return (
            <div className={styles.buttonWrapper}>
                <Button className="clean_white grey"
                    onClick={() => setPermission({ address: address, id, status: statuses.rejected.value })}
                >Reject</Button>
                <Button className="clean_white"
                    onClick={() => setPermission({ address: address, id, status: statuses.accepted.value })}
                >Repost</Button>
            </div>
        )
    }

    else {
        return (
            <>
                {status && <div className={styles.buttonWrapper}>
                    <span className={styles.notNewStatus}>{statuses[status].text}</span>
                </div>}
            </>
        )
    }

}

export default ButtonBlock;