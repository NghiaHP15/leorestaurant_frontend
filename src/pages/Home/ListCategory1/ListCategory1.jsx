import classNames from "classnames/bind";
import styles from "./ListCategory.module.scss";
import Slider from "react-slick";
import ItemCategory from "./ItemCategory1";

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

function ListCategory({ data }) {
  const settings = {
    dots: false,
    accessibility: true,
    autoplaySpeed: 5000,
    autoplay: true,
    arrows: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
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
    <section className={cx("bg-effect", "py-3")}>
      <div className={cx("container-custom container")}>
        <div
          className={cx("conten-area", "relative")}
          data-aos="fade-up"
          data-aos-duration="1000"
        >
          <Slider {...settings}>
            {data.map((item, index) => (
              <ItemCategory data={item} key={index} />
            ))}
          </Slider>
        </div>
      </div>
    </section>
  );
}

export default ListCategory;
