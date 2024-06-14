import styles from "./ListItem.module.scss";
import classNames from "classnames/bind";
import { Link } from "react-router-dom";
import images from "../../../assets/images";
import { formatCurrency } from "../../../hooks/useFormat";

const cx = classNames.bind(styles);

function ItemList({ data }) {
  return (
    <div className={cx("product-item", "p-5 mb-0 relative zIndex1")}>
      <div className={cx("product-thumb", "overflow-hidden relative mb-3")}>
        <img
          src={data.image[0]?.path || images.noImage}
          alt="Moren-Shop"
          className="w-full"
        />
        <span className={cx("thumb-overlay")}></span>
      </div>
      <div
        className={cx(
          "product-info",
          "flex justify-content-between align-items-center"
        )}
      >
        <span
          className={cx("title", "text-xl font-semibold font-family text-700")}
          // style={{ fontFamily: '"Russo One", sans-serif' }}
        >
          {data.name}
        </span>
        <span
          className={cx(
            "text-lg font-semibold text-700 ",
            data.priceSell && "line-through"
          )}
        >
          {formatCurrency(data.priceSale) + "đ"}
        </span>
        {data.priceSell && (
          <span className={cx("text-lg font-semibold text-700 text-red-400")}>
            {formatCurrency(data.priceSell) + "đ"}
          </span>
        )}
      </div>
    </div>
  );
}

export default ItemList;
