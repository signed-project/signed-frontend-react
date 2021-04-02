import React from 'react';
import styles from './welcomeSing.module.scss';
import icon from '../../../assets/svg/icon';
import Button from '../../utils/Button/Button';

const WelcomeSing = () => {
    return (
        <>
            <div className={styles.bar}>
                <div className={styles.description}>
                    <img src={icon.infoIcon} alt='information icon' className={styles.infoIcon} />
                    <p>To post or comment on other users' posts, you
                    need to register</p>
                </div>
                <div className={styles.buttonWrapper}>
                    {/* clean_white, clean, red, secondary, primary */}
                    <Button className="clean">Sing up </Button>
                    <Button className="secondary">Sing in</Button>
                </div>
            </div>
        </>
    )
}

export default WelcomeSing;