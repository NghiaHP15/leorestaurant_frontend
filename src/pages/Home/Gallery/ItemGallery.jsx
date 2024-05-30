import classNames from "classnames/bind";
import styles from "./Gallery.module.scss";

const cx = classNames.bind(styles);

function ItemGallery({ data }) {
  return (
    <div className={cx("p-1")}>
      <div className={cx("relative overflow-hidden ")}>
        <img
          src={data.image}
          alt={"Images"}
          className={cx(
            "w-full transition-all transition-duration-300 transition-ease-in",
            "img-gallery"
          )}
        />
      </div>
    </div>
  );
}

export default ItemGallery;
