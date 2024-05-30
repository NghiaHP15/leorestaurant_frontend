import classNames from "classnames/bind";
import styles from "./ListCategory.module.scss";
import { Link } from "react-router-dom";
const cx = classNames.bind(styles);

function ItemCategory({ data }) {
  return (
    <div className={cx("category-item", "relative px-4")}>
      <div className={cx("thumb", "border-circle overflow-hidden relative")}>
        <Link to={data.to}>
          <img
            className="w-full transition-all transition-duration-500"
            src={data.image}
            alt="Moren-Shop"
          />
        </Link>
      </div>
      <div className={cx("content", "text-center w-full")}>
        <h4 className={cx("title", "text-2xl font-italic font-bold mt-2 mb-0")}>
          {data.name}
        </h4>
        <h3
          className={cx(
            "title-shadow",
            "text-3xl font-italic font-bold mt-1 mb-0"
          )}
        >
          {data.name}
        </h3>
      </div>
    </div>
  );
}

export default ItemCategory;
