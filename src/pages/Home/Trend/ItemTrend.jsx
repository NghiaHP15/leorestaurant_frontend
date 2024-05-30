import classNames from "classnames/bind";
import styles from "./Trend.module.scss";

const cx = classNames.bind(styles);

function ItemTrend({ data }) {
  return (
    <div className={cx("slider-item")}>
      <div
        className={cx("bg-thumb")}
        style={{ backgroundImage: `url(${data.image})` }}
      ></div>
    </div>
  );
}

export default ItemTrend;
