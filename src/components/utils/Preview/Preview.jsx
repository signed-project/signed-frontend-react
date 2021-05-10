import styles from './preview.module.scss';
import icon from '../../../assets/svg/icon';

// TODO move to this module calculate  uploadImgArr 

const Preview = ({ uploadImgArr, handleFullSlider, handleDeleteImgPreview }) => {
    let smallPreviewImg = [];
    if (uploadImgArr.length > 1) {

        smallPreviewImg = uploadImgArr.slice().map((file, i) => {
            if (i === 0) {
                return
            }
            if (i === 3 && uploadImgArr.length > 4) {
                return (
                    <div className={styles.impPreviewShowMore} onClick={() => handleFullSlider(4)} key={i} ><p>{`+${uploadImgArr.length - 3}`}</p></div >
                )
            }
            else if (i <= 3) {
                return (
                    <div className={styles.imgSmallWrapper} key={i}>
                        <img src={file?.imagePreviewUrl} onClick={() => handleFullSlider(i)} alt="" className={`${styles.imgPreviewSmall}`} />
                        { handleDeleteImgPreview && <img src={icon.del} onClick={() => handleDeleteImgPreview(i)} alt="" className={styles.delIcon} />}
                    </div>
                )
            }
            else return;
        })
    }

    return (
        uploadImgArr?.length > 0 &&
        <div className={styles.imgPreview} >
            <div className={styles.img_preview_big_img_wrapper}>
                {handleDeleteImgPreview && <img src={icon.del} onClick={() => handleDeleteImgPreview(0)} alt="" className={styles.delIcon} />}
                <img src={uploadImgArr[0]?.imagePreviewUrl} className={styles.imgPreviewBig} alt="" onClick={() => handleFullSlider(0)} />
            </div>
            {
                uploadImgArr.length > 0 &&
                <div className={styles.smallPreview}>
                    {smallPreviewImg}
                </div>
            }
        </div>
    )
}

export default Preview;

