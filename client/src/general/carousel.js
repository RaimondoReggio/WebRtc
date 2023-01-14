import React from "react";
import Slider from "react-slick"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretRight, faCaretLeft } from '@fortawesome/free-solid-svg-icons';

const SlickSlider = ({children, setActiveSlide, nav, dots}) => {
    var settings = {
        dots: dots,
        arrows: nav,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        nextArrow: <FontAwesomeIcon icon={faCaretRight} />,
        prevArrow: <FontAwesomeIcon icon={faCaretLeft} />,
        beforeChange: (current, next) => setActiveSlide(next),
    };
    return (
        <Slider {...settings}>
            {children}
        </Slider>        
    );
}

export default SlickSlider;