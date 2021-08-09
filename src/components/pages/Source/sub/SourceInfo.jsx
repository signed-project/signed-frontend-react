import React, { useEffect, useState } from 'react';
import styles from '../source.module.scss';
import Avatar from '../../../utils/Avatar/Avatar';
import InfoItem from '../../../utils/InfoItem/InfoItem';

const SourceInfo = ({ source }) => {
    return (
        <>
            <div className={styles.AvatarWrapper}>
                <Avatar imgBig={true} avatar={source.avatar} />
            </div>
            <div className={styles.fields}>
                < InfoItem title={'Public name'} value={source.publicName} />

            </div>

        </>
    );
};

export default SourceInfo;
