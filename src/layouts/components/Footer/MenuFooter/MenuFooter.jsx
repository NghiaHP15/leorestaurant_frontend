/* eslint-disable array-callback-return */
import classNames from "classnames/bind";
import styles from "./MenuFooter.module.scss";
import ItemFooter from "./ItemFooter";
import { Avatar } from "primereact/avatar";

const cx = classNames.bind(styles);

function MenuFooter({ data, count, href = false, title, column, social }) {
  if (!column) {
    if (social) {
      return (
        <div className={cx("mb-6")}>
          <h4 className="text-white text-base font-semibold mb-3 uppercase">
            {title}
          </h4>
          <div className={cx("mt-2 mb-3")}>
            {Object.values(data).map((item, index) => {
              if (index < count) {
                return (
                  <a
                    href={item.path}
                    key={index}
                    className={cx("icon-area mx-1")}
                  >
                    <Avatar
                      icon={item.icon}
                      size="large"
                      style={{ backgroundColor: "#00000080" }}
                    />
                  </a>
                );
              }
            })}
          </div>
        </div>
      );
    } else {
      return (
        <div className={cx("mb-6")}>
          <h4 className="text-white text-base font-semibold mb-3 uppercase">
            {title}
          </h4>
          <ul className={cx("menu-wrap", "w-full")}>
            {Object.values(data).map((item, index) => {
              if (index < count) {
                return <ItemFooter key={index} data={item} href={href} />;
              }
            })}
          </ul>
        </div>
      );
    }
  }
  if (column) {
    return (
      <div className={cx("mb-6")}>
        <h4 className="text-white text-base font-semibold mb-3 uppercase">
          {title}
        </h4>
        <div className={cx("flex")}>
          <ul className={cx("menu-wrap")}>
            {Object.values(data).map((item, index) => {
              if (index < count && index % 2 === 0) {
                return <ItemFooter key={index} data={item} href={href} />;
              }
            })}
          </ul>
          <ul className={cx("menu-wrap")}>
            {Object.values(data).map((item, index) => {
              if (index < count && index % 2 !== 0) {
                return <ItemFooter key={index} data={item} href={href} />;
              }
            })}
          </ul>
        </div>
      </div>
    );
  }
}

export default MenuFooter;
