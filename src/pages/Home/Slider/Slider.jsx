/* eslint-disable jsx-a11y/img-redundant-alt */
import classNames from "classnames/bind";
import styles from "./Slider.module.scss";
import ItemSlider from "./ItemSlider";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const cx = classNames.bind(styles);

function SliderCompoent({ data }) {
  const settings = {
    infinite: true,
    speed: 500,
    accessibility: true,
    autoplaySpeed: 7000,
    autoplay: true,
    slidesToShow: 1,
    arrows: false,
    slidesToScroll: 1,
    customPaging: (i) => {
      return (
        <div className={cx("swiper-pagination-bullet")}>
          <span>0{i + 1}</span>
        </div>
      );
    },
  };
  return (
    <section className="pb-3 mb-7">
      <div className="slider-area-sub">
        <Slider {...settings}>
          {data.map((item, index) => {
            return <ItemSlider data={item} key={index} />;
          })}
        </Slider>
      </div>
    </section>
  );
}

export default SliderCompoent;
