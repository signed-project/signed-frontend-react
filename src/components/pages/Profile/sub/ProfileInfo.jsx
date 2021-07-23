import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import mime from "mime";
import styles from '../profile.module.scss';
import { getFilePath } from '../../../customHooks/getImgSources.js';
import Input from '../../../utils/Input/Input';
import Button from "../../../utils/Button/Button";
import useFiles from "../../../customHooks/useFiles";
import { User } from '../../../../api/models/user';
import { userActions } from '../../../../api/storage/user';
import ChangeUserPic from '../../../utils/ChangeUserPic/ChangeUserPic';
import userPlaceHolder from "../../../../assets/svg/icon/userPlaceHolder.jpg";


/**
 *  way to get is img download 
 *  const img = new Image();
 *  img.src = imgScr;
 *  img.onload = function () { console.log('img exist !!!!!!!!!!!!!'); }; 
 */
const ProfileInfo = () => {
    const user = useSelector(store => store.user);
    const imgScr = getFilePath({ hash: 'HZPM8Dj1CNAbkjADug42pfruGmihq4Tynd9SsPCv9VzW', fileExtension: 'png' })


    const avatarInitial = {
        file: '',
        imageSrc: userPlaceHolder,
    }
    const initialForm = {
        publicName: { value: '', warning: '' },
    };
    const [form, setForm] = useState(initialForm);
    const [avatar, setAvatar] = useState(avatarInitial);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setForm({ publicName: { value: user.source.publicName, warning: '' } })
    }, [user])

    useEffect(() => {
        if (user?.source?.avatar) {
            const extension = mime.getExtension(user?.source?.avatar.contentType);
            const imgScr = getFilePath({ hash: user?.source?.avatar?.hash, fileExtension: extension });
            setAvatar({ file: '', imageSrc: imgScr })
        }
    }, [user])

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
            const userObject = {
                ...currentUser,
                source: {
                    ...currentUser.source,
                    hash: '',
                    signatures: '',
                    avatar: data ? data : currentUser.source.avatar,
                    publicName: form.publicName.value
                }
            };
            const userModel = new User({});
            userModel.setUserData = userObject;
            const newUser = userModel.newUser;
            dispatch(userActions.updateUser(newUser));
        })();
    }


    return (
        <>
            <div className={styles.userPicWrapper}>
                <ChangeUserPic srcData={avatar.imageSrc} handleChangeFile={handleChangeFile} />
            </div>
            <div className={styles.fields}>
                <Input title={'Public name'} name={'publicName'} warning={form.publicName.warning} type={'text'} handleChange={handleForm} value={form.publicName.value} />
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
