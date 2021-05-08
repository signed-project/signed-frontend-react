import React, { useState } from 'react';
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper.min.css";
import "swiper/components/pagination/pagination.min.css"
import "swiper/components/navigation/navigation.min.css"
import "./swiper.scss";
import SwiperCore, {
    Pagination, Navigation
} from 'swiper/core';
import icon from '../../../assets/svg/icon';
import styles from './slider.module.scss';


SwiperCore.use([Pagination, Navigation]);

const Slider = ({ uploadImgArr, firstSlide, setIsFullImgPrev, handleDeleteImgPreview }) => {

    const [currentSlider, setCurrentSlider] = useState(firstSlide);

    return (
        <div className={styles.sliderMain}>
            <img src={icon.cancel} alt="" className={styles.cancelIcon} onClick={() => setIsFullImgPrev(false)} />
            <img src={icon.del} onClick={() => handleDeleteImgPreview(currentSlider)} alt="" className={styles.delIconSlider} />
            <Swiper pagination={{
                "type": "fraction"
            }} navigation={true} initialSlide={firstSlide}
                onSlideChange={(e) => setCurrentSlider(e.activeIndex)}
            >
                {uploadImgArr.map((img, i) =>
                    <SwiperSlide key={i} >
                        <div className={styles.sliderItem} >
                            <img src={img.imagePreviewUrl} />
                        </div>
                    </SwiperSlide>

                )}
            </Swiper>
        </div >
    )
}

export default Slider;