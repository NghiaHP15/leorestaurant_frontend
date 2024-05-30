import classNames from "classnames/bind";
import styles from "./ListItem.module.scss";
import ItemList from "./ItemList";
import Slider from "react-slick";

const cx = classNames.bind(styles);

function ListItem({ rounded = false, data, title }) {
  const settings = {
    dots: false,
    accessibility: true,
    autoplaySpeed: 5000,
    autoplay: true,
    arrows: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
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

  const classes = cx("", {
    rounded: rounded,
    roundedModule: rounded,
  });

  return (
    <section data-aos="fade-up">
      <div className={cx("container container-custom")}>
        <div className={cx("px-2 py-5")}>
          <div data-aos="fade-right" data-aos-duration="1000">
            <h2 className={cx("title")}>Menu</h2>
            <h3 className={cx("title-stroke", "m-0")}>{title}</h3>
          </div>
        </div>
        <Slider {...settings} className={classes}>
          {data &&
            Object.values(data).map((item, index) => (
              <ItemList data={item} key={index} hvChange />
            ))}
        </Slider>
      </div>
    </section>
  );
}

export default ListItem;
