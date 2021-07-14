import React, { useEffect, useState } from 'react';
import styles from '../profile.module.scss';
import { getFilePath } from '../../../customHooks/getImgSources.js';
import InputPlain from '../../../utils/Input/InputPlain/InputPlain';
import Button from "../../../utils/Button/Button";
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
    useEffect(() => { }, [])
    /*    const img = new Image();
       img.src = imgScr;
       img.onload = function () { console.log('img exist !!!!!!!!!!!!!'); }; */


    const handleChangeFile = (e) => {
        // setUploadedImg([]);
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
                    // clean_white, clean, primary
                    className="clean fullWidth" onClick={() => {
                        handleSaveChanges()
                    }}>
                    Done
                </Button>
            </div>
        </>
    );
};

// HZPM8Dj1CNAbkjADug42pfruGmihq4Tynd9SsPCv9VzW.png
export default ProfileInfo;
