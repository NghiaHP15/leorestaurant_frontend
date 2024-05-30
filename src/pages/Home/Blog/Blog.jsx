import classNames from "classnames/bind";
import styles from "./Blog.module.scss";
import ItemBlog from "./ItemBlog";
import Slider from "react-slick";

const cx = classNames.bind(styles);

function Blog({ data }) {
  const setting = {
    dots: false,
    accessibility: true,
    autoplaySpeed: 5000,
    autoplay: true,
    arrows: false,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    swipeToSlide: true,
    responsive: [
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
    <section className={cx("blog-area", "relative py-3")}>
      <div className={cx("container container-custom")}>
        <div>
          <div data-aos="fade-right" data-aos-duration="1000">
            <div className="flex justify-content-center align-items-baseline">
              <h2 className={cx("title")}>Blog on</h2>
              <h3 className={cx("title-stroke")}>Social Media</h3>
            </div>
            <h3
              className={cx(
                "text-center text-800 mt-1 mb-3 text-xl capitalize "
              )}
            >
              Bài viết trên mạng xã hội
            </h3>
          </div>
        </div>

        <div data-aos="fade-up">
          <Slider {...setting} className={cx("post-items")}>
            {Object.values(data).map((item, index) => (
              <ItemBlog key={index} data={item} />
            ))}
          </Slider>
        </div>
      </div>
    </section>
  );
}

export default Blog;
