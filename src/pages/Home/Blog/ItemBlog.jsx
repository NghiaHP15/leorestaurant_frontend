/* eslint-disable jsx-a11y/img-redundant-alt */
import classNames from "classnames/bind";
import styles from "./Blog.module.scss";
import { Avatar } from "primereact/avatar";
import images from "../../../assets/images";

const cx = classNames.bind(styles);

function ItemBlog({ data }) {
  return (
    <div className={cx("mt-4 flex relative")}>
      <div className={cx("thumb", "mr-3 overflow-hidden relative")}>
        <img src={data.image} alt={data.name} className={cx("image-blog")} />
      </div>
      <div className={cx("content")}>
        <div className={cx("post-meta", "mb-0 flex align-items-center")}>
          <Avatar
            image={data.customer?.image || images.avatarDefault}
            size="large"
            shape="circle"
          />
          <span className="ml-2 font-semibold uppercase font-family">
            {data.customer?.name || "Khách hàng"}
          </span>
        </div>
        <div>
          <h4 className={cx("text-xl font-bold uppercase mt-3 mb-2")}>
            {data.name}
          </h4>
          <p className="text-lg font-family">{data.description}</p>
        </div>
      </div>
    </div>
  );
}

export default ItemBlog;
