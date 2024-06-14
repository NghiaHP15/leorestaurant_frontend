import React, { forwardRef, useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./SidebarAdmin.module.scss";
import classNames from "classnames/bind";
import { useClickOutside } from "primereact/hooks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSelector } from "react-redux";

const cx = classNames.bind(styles);

const MenuItem = ({ data, visible, submenu }, ref) => {
  const [show, setShow] = useState(false);
  const overlayRef = useRef(null);
  const overlayItemRef = useRef(null);
  const [check, setCheck] = useState(false);
  const user = useSelector((state) => state.user);
  const userPermission = user?.user?.permission?.function;

  useClickOutside(overlayRef, () => {
    setShow(false);
  });

  const handleMenuItem = () => {
    setShow(!show);
  };

  useEffect(() => {
    if (userPermission) {
      const check = userPermission.some(
        (item) =>
          item.function_id === data?.permission ||
          data?.permission === "default"
      );
      setCheck(check);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.permission]);

  return (
    <>
      {data.items && data.items.length !== 0 ? (
        <li ref={overlayRef} className={cx(show && `active-menuitem`)}>
          <Link
            onClick={(event) => handleMenuItem(event)}
            to={check && data.path}
            ref={overlayItemRef}
            className={cx(
              "border-round-lg p-ripple flex align-items-center cursor-pointer p-3 pl-4 text-700 hover:bg-orange-100 no-underline"
            )}
          >
            {data.iconfa && (
              <FontAwesomeIcon
                icon={data.iconfa}
                className={cx(
                  "icon-item-home text-xl text-orange-500",
                  !visible && "text-3xl font-medium"
                )}
              />
            )}
            {data.icon && (
              <i
                className={cx(
                  data.icon,
                  "icon-item-home text-xl text-orange-500",
                  !visible && "text-3xl font-medium"
                )}
              ></i>
            )}
            <div className={cx("item-content", "flex justify-content-between")}>
              <span className={cx("font-style", " font-medium pl-3")}>
                {data.label}
              </span>
              <i
                className={cx(
                  show && "rotate-90 transition-all transition-duration-300",
                  "pi pi-angle-right ml-auto mr-1 transition-all transition-duration-400"
                )}
              ></i>
            </div>
          </Link>
          <ul className={cx("list-menuitem", "list-none py-0  px-0 m-0 ")}>
            {data.items &&
              data.items.map((item, index) => {
                return (
                  <MenuItem data={item} key={index} visible={visible} submenu />
                );
              })}
          </ul>
        </li>
      ) : (
        <li>
          <Link
            onClick={(event) => handleMenuItem(event)}
            to={check && data.path}
            className={cx(
              submenu && "pl-6",
              "border-round-lg p-ripple flex align-items-center cursor-pointer p-3 pl-4 text-700 hover:bg-orange-100 transition-duration-150 transition-colors no-underline"
            )}
          >
            {data.iconfa && (
              <FontAwesomeIcon
                icon={data.iconfa}
                className={cx(
                  "icon-item-home text-xl text-orange-500",
                  !visible && "text-3xl font-medium"
                )}
              />
            )}
            {data.icon && (
              <i
                className={cx(
                  data.icon,
                  "icon-item-home text-xl text-orange-500",
                  !visible && "text-3xl font-medium"
                )}
              ></i>
            )}
            <div className={cx("item-content")}>
              <span className={cx("font-style", " font-medium pl-3")}>
                {data.label}
              </span>
            </div>
          </Link>
        </li>
      )}
    </>
  );
};
export default forwardRef(MenuItem);
