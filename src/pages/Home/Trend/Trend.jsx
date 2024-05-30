import classNames from "classnames/bind";
import styles from "./Trend.module.scss";
import ItemTrend from "./ItemTrend";
import Slider from "react-slick";

const cx = classNames.bind(styles);

function Trend({ data }) {
  const settings = {
    dots: false,
    accessibility: true,
    autoplaySpeed: 3000,
    autoplay: true,
    arrows: false,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    swipeToSlide: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
    ],
  };
  return (
    <section className={cx("py-3")}>
      <div className={cx("container-fluid p-0")}>
        <div data-aos="fade-right" data-aos-duration="1000">
          <div className="flex justify-content-center align-items-baseline">
            <h2 className={cx("title")}>Trends on</h2>
            <h3 className={cx("title-stroke")}>Social Media</h3>
          </div>
          <h3
            className={cx("text-center text-800 mt-1 mb-3 text-xl capitalize ")}
          >
            Xu hướng trên mạng xã hội
          </h3>
        </div>
        <div className={cx("content-slider")} data-aos="fade-up">
          <Slider {...settings}>
            {data.map((item, index) => (
              <ItemTrend key={index} data={item} />
            ))}
          </Slider>
        </div>
      </div>
    </section>
  );
}

export default Trend;
