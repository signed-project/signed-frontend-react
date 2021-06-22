import React from 'react';
import styles from './welcomeSing.module.scss';
import icon from '../../../assets/svg/icon';
import Button from '../../utils/Button/Button';
import { useHistory } from 'react-router-dom';
import routes from '../../../config/routes.config';

const WelcomeSing = () => {
    const history = useHistory();

    const handleGoingTo = (path) => {
        history.push(path);
    }

    return (
        <>
            <div className={styles.bar}>
                <div className={styles.description}>
                    <img src={icon.info} alt='information icon' className={styles.infoIcon} />
                    <p>To post or comment on other users' posts, you
                    need to register</p>
                </div>
                <div className={styles.buttonWrapper}>
                    <Button className="clean" onClick={() => handleGoingTo(routes.register)}>Sing up </Button>
                    {/* <Button className="secondary">Sing in</Button> */}
                    <Button className="primary" onClick={() => handleGoingTo(routes.login)}>Sing in</Button>
                </div>
            </div>
        </>
    )
}

export default WelcomeSing;