import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styles from '../profile.module.scss';
import { getFilePath } from '../../../customHooks/getImgSources.js';
import InputPlain from '../../../utils/Input/InputPlain/InputPlain';
import Button from "../../../utils/Button/Button";
import useFiles from "../../../customHooks/useFiles";
import { User } from '../../../../api/models/user';
import { userActions } from '../../../../api/storage/user';

/**
 *  way to get is img download 
 *  const img = new Image();
 *  img.src = imgScr;
 *  img.onload = function () { console.log('img exist !!!!!!!!!!!!!'); }; 
 */
const ProfileInfo = () => {
    const imgScr = getFilePath({ hash: 'HZPM8Dj1CNAbkjADug42pfruGmihq4Tynd9SsPCv9VzW', fileExtension: 'png' })
    const avatarInitial = {
        file: '',
        imageSrc: imgScr,
    }
    const initialForm = {
        publicName: { value: '', warning: '' },
    };
    const [form, setForm] = useState(initialForm);
    const [avatar, setAvatar] = useState(avatarInitial);
    const [isLoading, setIsLoading] = useState(false);

    const { uploadFile } = useFiles();

    const currentUser = useSelector(state => state.user);
    const dispatch = useDispatch();

    const handleChangeFile = (e) => {
        let file = e.target.files[0];
        const filePrev = {
            file: file,
            imageSrc: URL.createObjectURL(file),
        };
        setAvatar(filePrev);
    };

    const handleForm = (e) => {
        const value = e.target.value;
        const name = e.target.name;
        const newForm = JSON.parse(JSON.stringify(form));
        newForm[name].value = value;
        newForm[name].warning = '';
        setForm(newForm);
    }


    const handleSaveChanges = () => {
        if (!avatar.file && currentUser.source.publicName === form.publicName.value) {
            return
        }
        let data;
        (async () => {
            if (avatar.file) {
                try {
                    ({ data } = await uploadFile(avatar.file));
                } catch (e) {
                    console.warn("[ProfileInfo][uploadFile]", e);
                }
            }
            console.log('currentUser=======', currentUser);
            const userObject = {
                ...currentUser,
                source: {
                    ...currentUser.source,
                    avatar: data ? data : currentUser.source.avatar,
                    publicName: form.publicName.value
                }
            };
            const userModel = new User({});
            console.log('3333333333userObject3333333333', userObject);
            userModel.setUserData = userObject;
            const newUser = userModel.newUser;
            console.log('newUser=======', newUser);

            dispatch(userActions.updateUser(newUser));
        })();

        // const newPost = postInstance.newPost;
        // setMessage('');
        // setUploadedImg([]);
        // dispatch(postActions.sendPost(newPost));
        // history.push(routes.feed);
    }

    return (
        <>
            <div className={styles.avatar}>
                <img src={avatar.imageSrc} alt="" className={styles.avatarImg} />
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
            <div className={styles.fields}>
                <InputPlain title={'Public name'} type={'text'} name={'publicName'} value={form.publicName.value} handleChange={handleForm} warning={form.publicName.warning} />
            </div>
            <div className={styles.buttonWrapper}>
                <Button
                    // isLoading={isLoading} disabled={isLoading}
                    className="clean fullWidth" onClick={() => {
                        setIsLoading(true);
                        handleSaveChanges();
                    }}>
                    Save
                </Button>
            </div>
        </>
    );
};

// HZPM8Dj1CNAbkjADug42pfruGmihq4Tynd9SsPCv9VzW.png
export default ProfileInfo;
