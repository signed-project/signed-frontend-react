import styles from './changeUserPic.module.scss';
import Avatar from '../Avatar/Avatar';

const ChangeUserPic = ({ imgBig = true, srcData, handleChangeFile }) => {
    return (
        <div className={styles.avatar}>


            <label htmlFor="icon-button-file" className = {styles.uploadWrapper}>
                <Avatar imgBig={imgBig} srcData={srcData} isDirect={false} />
                <p className={styles.avatarChange}>Change photo</p>
            </label>
            <input
                accept="image/*"
                id="icon-button-file"
                type="file"
                style={{ display: "none" }}
                onChange={(e) => handleChangeFile(e)}
            />

        </div>
    )
}


export default ChangeUserPic;


