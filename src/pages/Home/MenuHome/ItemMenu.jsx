import classNames from "classnames/bind";
import styles from "./MenuHome.module.scss";
import { useNavigate } from "react-router-dom";
const cx = classNames.bind(styles);

function ItemCategory({ data }) {
  const navigator = useNavigate();

  const handleProfileClick = (data) => {
    navigator("menu/food", { state: { id: data._id } });
  };

  return (
    <div className={cx("relative px-5", "content-item")}>
      <div className={cx("border-circle overflow-hidden relative")}>
        <div onClick={() => handleProfileClick(data)}>
          <img
            className="w-full transition-all transition-duration-500"
            src={data.image}
            alt="Moren-Shop"
          />
        </div>
      </div>
      <div className={cx("text-center w-full")}>
        <h4 className={cx("text-2xl font-italic font-bold mt-2 mb-0")}>
          {data.name}
        </h4>
      </div>
    </div>
  );
}

export default ItemCategory;
