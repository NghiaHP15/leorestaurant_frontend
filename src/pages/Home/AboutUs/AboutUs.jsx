/* eslint-disable jsx-a11y/img-redundant-alt */
import classNames from "classnames/bind";
import styles from "./AboutUs.module.scss";

const cx = classNames.bind(styles);

function AboutUs({ data }) {
  return (
    <section className={cx("py-3 overflow-hidden")}>
      <div className={cx("container-custom container ")}>
        <div className="grid">
          <div className="md:col-8">
            <div className={cx("relative")}>
              <div data-aos="fade-right" className={cx("overflow-hidden w-6")}>
                <img
                  className={cx("hover-scale")}
                  src="https://res.cloudinary.com/dn1tmr9ya/image/upload/v1717127706/ImageRestaurant/about-us-1_ofteez.jpg"
                  alt="shop-Image"
                />
              </div>
              <div data-aos="fade-up" className={cx("category-item")}>
                <div className={cx("overflow-hidden")}>
                  <img
                    className={cx("hover-scale")}
                    src="https://res.cloudinary.com/dn1tmr9ya/image/upload/v1717127707/ImageRestaurant/about-us-2_p8bhbs.jpg"
                    alt="shop-Image"
                  />
                  <div className={cx("effect-content")}></div>
                </div>
              </div>
            </div>
          </div>
          <div className={cx("md:col-4", "flex align-items-center")}>
            <div data-aos="fade-left" className={cx("relative zIndex-5 pr-6")}>
              <div className={cx("zIndex-1 relative px-4")}>
                <h1 className={cx("title")}>{data.about?.name_home}</h1>
                <p className={cx("decription", " font-family")}>
                  {data.about?.description_home}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutUs;
