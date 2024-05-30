import classNames from "classnames/bind";
import styles from "./Gallery.module.scss";
import Slider from "react-slick";
import ItemGallery from "./ItemGallery";

const cx = classNames.bind(styles);

function Gallery({ data }) {
  console.log(data);
  const settings = {
    dots: false,
    accessibility: true,
    autoplaySpeed: 5000,
    autoplay: true,
    arrows: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    rows: 2,
    swipeToSlide: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
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
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  return (
    <section className={cx("gallery-area", "py-3 relative overflow-hidden")}>
      <div className={cx("container-custom container")}>
        <div className="relative" style={{ paddingLeft: "120px" }}>
          <div data-aos="fade-left">
            <div className="flex justify-content-center align-items-baseline">
              <h2 className={cx("title")}>On the</h2>
              <h3 className={cx("title-stroke")}>Gallery</h3>
            </div>
            <h3
              className={cx(
                "text-center text-800 mt-1 mb-3 text-xl capitalize "
              )}
            >
              Trên thư viện ảnh
            </h3>
          </div>
          <div className={cx("title-rotate")}>
            <h2
              data-aos="fade-right"
              data-aos-duration="1500"
              className={cx("title", "text-7xl font-bold uppercase m-0 pr-4")}
            >
              New Gallery
            </h2>
          </div>
          <div data-aos="fade-up">
            <Slider {...settings} className={cx("gallery-slider")}>
              {data.map((item, index) => (
                <ItemGallery data={item} key={index} />
              ))}
            </Slider>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Gallery;
