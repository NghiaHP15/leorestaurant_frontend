import classNames from "classnames/bind";
import styles from "./Loading.module.scss";
const cx = classNames.bind(styles);

function Loading() {
  return (
    <div
      className={cx(
        "content",
        "h-full w-full absolute flex justify-content-center align-items-center overflow-hidden top-0 bottom-0 right-0 left-0"
      )}
    >
      <div className={cx("relative h-2rem w-4rem")}>
        <div className={cx("ball", "red", "bg-orange-500")}></div>
        <div className={cx("ball", "blue", "surface-800	")}></div>
      </div>
    </div>
  );
}

export default Loading;
