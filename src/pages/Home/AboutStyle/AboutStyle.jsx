import classNames from "classnames/bind";
import styles from "./AboutStyle.module.scss";

const cx = classNames.bind(styles);

function AboutStyle({ data }) {
  return (
    <section className={cx("about-style-area", "relative py-3")}>
      <div className={cx("container-custom container")}>
        <div className={cx("about-style-item")}>
          <div className="grid">
            <div className="md:col-5">
              <div
                className={cx("category-items-style")}
                data-aos="fade-right"
                data-aos-duration="1000"
              >
                <div
                  className={cx(
                    "category-item-1",
                    "hover-effect",
                    "hover",
                    "hover-content-1"
                  )}
                >
                  <div className={cx("thumb", "overflow-hidden")}>
                    <img
                      src="/image/style/style-1.jpg"
                      alt="Moren-Shop"
                      width={"100%"}
                    />
                    <div className={cx("effect-content")}></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="md:col-7">
              <div
                className={cx("relative")}
                data-aos="fade-left"
                data-aos-duration="1000"
              >
                <div
                  className={cx("title-area", "size-title-area")}
                  data-aos="fade-left"
                  data-aos-duration="800"
                >
                  <div className="flex">
                    <h2 className={cx("title-style")}>Restaurant</h2>
                    <h4 className={cx("sub-title")}>style</h4>
                  </div>
                  <h3 className={cx("title-stroke")}>Restaurant</h3>
                </div>
                <div className="grid">
                  <div className="md:col-6">
                    <div className={cx("relative")}>
                      <div
                        className={cx(
                          "category-item-2",
                          "hover-effect",
                          "default-hover",
                          "hover-content-2"
                        )}
                      >
                        <div className={cx("thumb", "overflow-hidden")}>
                          <img
                            src="/image/style/style-2.jpg"
                            alt="Moren-Shop"
                            className="w-full"
                          />
                          <div className={cx("effect-content")}></div>
                        </div>
                        <div className={cx("content")}></div>
                      </div>
                    </div>
                  </div>
                  <div className={cx("md:col-6", "mt-mb-30")}>
                    <div className={cx("category-items-style")}>
                      <div
                        className={cx(
                          "category-item-2",
                          "hover-effect",
                          "default-hover",
                          "hover-content-2"
                        )}
                      >
                        <div className={cx("thumb", "overflow-hidden")}>
                          <img
                            src="/image/style/style-3.jpg"
                            alt="Moren-Shop"
                            className="w-full"
                          />
                          <div className={cx("effect-content")}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={cx("content-area")}>
                  <p className="font-family">{data.about?.description_style}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutStyle;
