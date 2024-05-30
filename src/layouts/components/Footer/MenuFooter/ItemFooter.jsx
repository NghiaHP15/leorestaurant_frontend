import classNames from "classnames/bind";
import styles from "./MenuFooter.module.scss";
import { Link } from "react-router-dom";

const cx = classNames.bind(styles);
let styeHieght = "";

function ItemFooter({ data, href }) {
  if (data.name.length > 48) {
    styeHieght = "item-height";
  }
  return (
    <li className={cx("nav-item", styeHieght, "list-none w-full")}>
      {href ? (
        <a href={data.path}>{data.name}</a>
      ) : (
        <Link to={data.path}>{data.name}</Link>
      )}
    </li>
  );
}

export default ItemFooter;
