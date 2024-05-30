import classNames from "classnames/bind";
import styles from "./MenuHome.module.scss";
import Slider from "react-slick";
import ItemMenu from "./ItemMenu";

const cx = classNames.bind(styles);

const category1 = [
  {
    title: "Món Việt",
    image_url: "image/category/mon-viet.jpg",
    to: "/",
  },
  {
    title: "Hải Sản",
    image_url: "image/category/hai-san.jpg",
    to: "/",
  },
  {
    title: "Rau Củ",
    image_url: "image/category/rau-cu.jpg",
    to: "/",
  },
  {
    title: "Đồ Uống",
    image_url: "image/category/do-uong.jpg",
    to: "/",
  },
  {
    title: "Đồng Quê",
    image_url: "image/category/dong-que.jpg",
    to: "/",
  },
  {
    title: "Đồ Tây",
    image_url: "image/category/mon-tay.jpg",
    to: "/",
  },
];

function MenuHome({ data }) {
  const settings = {
    dots: false,
    accessibility: true,
    autoplaySpeed: 5000,
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
          slidesToShow: 3,
          slidesToScroll: 3,
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
    <section className={cx("py-3")}>
      <div className={cx("container-custom container")}>
        <div
          className={cx("content-area", "relative")}
          data-aos="fade-up"
          data-aos-duration="1000"
        >
          <div className={cx("box-menu-home")}>
            <div className={cx("content-item")}>
              <h3 className="font-family m-0 text-center text-lg mb-3">
                Hãy cũng khám phá thực đơn tại nhà hàng KingLeo để được thưởng
                thức trọn hương vị ẩm thực
              </h3>
              <Slider {...settings}>
                {data.map((item, index) => (
                  <ItemMenu data={item} key={index} />
                ))}
              </Slider>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default MenuHome;
