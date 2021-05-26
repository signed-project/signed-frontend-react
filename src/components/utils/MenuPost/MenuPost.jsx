import styles from "./menuPost.module.scss";

const MenuPost = ({ dataHash, handleEditPost }) => {
  return (
    <div className={styles.menu} data-hash={dataHash}>
      <div className={styles.triangle} data-hash={dataHash}></div>
      <ul className="" data-hash={dataHash}>
        <li data-hash={dataHash}>Mute likes for 1 day</li>
        <li data-hash={dataHash}>Mute likes for 1 month</li>
        <li data-hash={dataHash}>Mute likes forever</li>
        <li data-hash={dataHash}>Enable likes</li>
        <li data-hash={dataHash} onClick={() => handleEditPost(dataHash)}>
          Edit post
        </li>
      </ul>
    </div>
  );
};

export default MenuPost;
