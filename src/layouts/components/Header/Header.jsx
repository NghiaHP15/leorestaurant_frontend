/* eslint-disable jsx-a11y/img-redundant-alt */
import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import styles from "./Header.module.scss";
import classNames from "classnames/bind";
import config from "../../../config";
import { Link } from "react-router-dom";
import * as InforService from "../../../services/InforService";

const cx = classNames.bind(styles);

function Header() {
  AOS.init();

  //////Sticky
  const [position, setPosition] = useState(window.scrollY);
  const [visible, setVisible] = useState(true);
  const [logo, setLogo] = useState({
    logo_header_light: "",
    logo_header_dark: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      const result = await InforService.getInfor();
      const data = result.data[0];
      const _logo = { ...logo };
      _logo.logo_header_light = data?.logo?.logo_header_light;
      _logo.logo_header_dark = data?.logo?.logo_header_dark;
      setLogo(_logo);
    };
    fetchData();
  }, []);

  let classes = "";
  if (window.scrollY > 250) {
    classes = "sticking ";
  }

  useEffect(() => {
    const handleScroll = () => {
      let moving = window.scrollY;

      setVisible(position > moving);
      setPosition(moving);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [position]);

  const cls = visible ? "visible" : "hidden";
  const CustomMenubar = ({ items, start }) => {
    return (
      <nav className={cx("custom-menubar")}>
        <div className={cx("custom-logo")}>{start}</div>
        <ul className={cx("custom-menu")}>
          {items.map((item, index) => (
            <li key={index} className={cx("custom-menu-item")}>
              <Link to={item.path} className="no-underline">
                <span
                  className={cx(
                    "font-family text-xl font-medium",
                    classes ? "text-color" : "text-white"
                  )}
                >
                  {item.label}
                </span>
                <i className={`pi ${item.icon}`}></i>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    );
  };

  const items = [
    {
      label: "Trang chủ",
      path: config.router.home,
    },
    {
      label: "Giới Thiệu",
      path: config.router.aboutPage,
    },
    {
      label: "Thực Đơn",
      path: config.router.menuPage,
    },
    {
      label: "Hình Ảnh",
      path: config.router.imagePage,
    },
    {
      label: "Bài Viết",
      path: config.router.blogPage,
    },
    {
      label: "Liên Hệ",
      path: config.router.contactPage,
    },
  ];
  const start = (
    <div style={{ width: "200px" }}>
      <img
        alt="logo"
        src={classes ? logo.logo_header_dark : logo.logo_header_light}
        height="60"
        className="mr-2"
      />
    </div>
  );

  return (
    <>
      <div className={cx("header")} style={{ zIndex: "9999" }}>
        <div
          className={cx(
            cls,
            "is-sticky",
            classes ? "bg-white shadow-2" : "bg-transparent"
          )}
        >
          <CustomMenubar items={items} start={start} />
        </div>
      </div>
    </>
  );
}

export default Header;
