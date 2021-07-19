import styles from './changeUserPic.module.scss';
import Avatar from '../Avatar/Avatar';

const ChangeUserPic = ({ imgBig = true, srcData, handleChangeFile }) => {
    return (
        <div className={styles.avatar}>
            <Avatar imgBig={imgBig} srcData={srcData} />
            <div>
                <input
                    accept="image/*"
                    id="icon-button-file"
                    type="file"
                    style={{ display: "none" }}
                    onChange={(e) => handleChangeFile(e)}
                />
                <label htmlFor="icon-button-file">
                    <p className={styles.avatarChange}>Change photo</p>
                </label>
            </div>
        </div>
    )
}


export default ChangeUserPic;


