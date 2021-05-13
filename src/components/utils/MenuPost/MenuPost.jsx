import styles from './menuPost.module.scss';

const MenuPost = () => {

    return (
        <div className={styles.menu}>
            <div className={styles.triangle}></div>
            <ul className="">
                <li>Mute likes for 1 day</li>
                <li>Mute likes for 1 month</li>
                <li>Mute likes forever</li>
                <li>Enable likes</li>
                <li>Edit post</li>
            </ul>
        </div>
    )
};

export default MenuPost;