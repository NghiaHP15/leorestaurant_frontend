import classNames from "classnames/bind";
import styles from "./Slider.module.scss";
import images from "../../../assets/images";
const cx = classNames.bind(styles);

function ItemSlider({ data }) {
  return (
    <div className={cx("relative")}>
      <div className={cx("home-slider-item", "w-full")}>
        <div className={cx("thumd", "h-full")}>
          <img
            className={cx("bg-thumd", "bg-overlay", "w-full")}
            alt="bg"
            src={data?.image || images.silderDf}
          />
        </div>
      </div>
    </div>
  );
}

export default ItemSlider;
