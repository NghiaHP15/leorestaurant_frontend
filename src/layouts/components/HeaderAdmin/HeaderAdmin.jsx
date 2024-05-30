import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./HeaderAdmin.module.scss";
import classNames from "classnames/bind";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Menu } from "primereact/menu";
import { Avatar } from "primereact/avatar";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as UserService from "../../../services/UserService";
import * as ReportService from "../../../services/ReportService";
import { resetUser } from "../../../redux/slides/userSlice";
import router from "../../../config/router";
import Loading from "../../../components/Loading";
import images from "../../../assets/images";
import { formatDistanceToNow } from "date-fns";
import config from "../../../config";

const cx = classNames.bind(styles);

function HeaderAdmin() {
  const refInput = useRef(null);
  const menuProfile = useRef(null);
  const menuMessage = useRef(null);
  const [show, setShow] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notify, setNotify] = useState([]);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigator = useNavigate();

  const imagesDefault = [
    "https://primefaces.org/cdn/primereact/images/avatar/onyamalimba.png",
    "https://primefaces.org/cdn/primereact/images/avatar/asiyajavayant.png",
    "https://primefaces.org/cdn/primereact/images/avatar/ionibowcher.png",
  ];

  const handleshowInput = () => {
    setShow(true);
    refInput.current.focus();
  };

  const handleLogout = async () => {
    setLoading(true);
    await UserService.logOutUser();
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    dispatch(resetUser());
    setLoading(false);
    navigator(router.register);
  };

  useEffect(() => {
    const fetchData = async () => {
      const [resultNotify] = await Promise.all([ReportService.getNotify()]);
      setNotify(resultNotify.data);
    };
    fetchData();
  }, []);

  const itemRenderer = (item) => (
    <div className={cx("menuitem-content", "p-2 hover:surface-200")}>
      <Link
        to={item.path}
        onClick={item.onClick}
        className="flex align-items-center no-underline text-sm"
      >
        <span className={item.icon} />
        <span>{item.label}</span>
      </Link>
    </div>
  );

  const itemsProfile = [
    {
      label: "Tài khoản của bạn",
      icon: "pi pi-user mr-3",
      path: config.router.profileUser,
      template: itemRenderer,
    },
    {
      label: "Cài đặt",
      icon: "pi pi-cog mr-3",
      path: config.router.setting,
      template: itemRenderer,
    },
    {
      label: "Đăng xuất",
      icon: "pi pi-power-off mr-3",
      template: itemRenderer,
      onClick: handleLogout,
    },
  ];

  const handleProfileClick = (id) => {
    navigator(config.router.tableDetail, { state: { id: id } });
  };

  const itemRendererMessage = (item) => (
    <div
      className={cx(
        "menuitem-content",
        "p-2  hover:surface-100 border-round-lg"
      )}
    >
      <div
        className="flex align-items-center no-underline text-sm"
        onClick={() => handleProfileClick(item.id)}
      >
        <Avatar
          image={item.image}
          size="xlarge"
          shape="circle"
          className="mr-3 h-3rem w-3rem"
        />
        <div className="block">
          <span>{item.label}</span>
          <div className="text-orange-500 mt-1 font-medium">{item.date}</div>
        </div>
      </div>
    </div>
  );

  const itemsMessage = [
    {
      items: notify.map((item) => {
        return {
          label: `Đơn đặt bàn #${item._id.slice(-6)} được đặt bởi khách hàng 
          ${item.customer_name}`,
          date: `${formatDistanceToNow(new Date(item.createdAt))} ago`,
          image: imagesDefault[Math.floor(Math.random() * 3) + 0],
          id: item._id,
          template: itemRendererMessage,
        };
      }),
    },
    {
      template: () => {
        return (
          <div className="p-2 text-center">
            <Link
              to={config.router.tableList}
              className="no-underline font-semibold text-orange-500 hover:text-orange-600 text-sm"
            >
              Xem tất cả
            </Link>
          </div>
        );
      },
    },
  ];

  return (
    <>
      <div
        className={cx(
          "topbar",
          "w-full h-5rem bg-white flex justify-content-end px-4"
        )}
      >
        <div className={cx("topbar-right flex align-items-center")}>
          <div
            className={cx(
              show && "active",
              "topbar-search",
              "flex align-items-center"
            )}
          >
            <Button
              rounded
              text
              onClick={handleshowInput}
              raised
              severity="warning"
              icon="pi pi-search font-semibold text-orange-400"
              className={cx(
                "btn-search",
                "p-0 h-3rem w-3rem flex justify-content-center text-orange-400 hover:text-orange-500"
              )}
            />
            <span className={cx("search", "p-input-icon-right h-3rem")}>
              <InputText
                placeholder="Tìm kiếm"
                type="text"
                ref={refInput}
                className={cx(
                  "input-search",
                  " h-full w-full border-round-3xl px-3"
                )}
              />
              <i
                onClick={() => setShow(false)}
                className={cx(
                  "pi pi-search font-semibold text-orange-400 mr-2"
                )}
              ></i>
            </span>
          </div>
          <div className={cx("topbar-message mx-3")}>
            <Button
              rounded
              text
              raised
              severity="warning"
              aria-label="Notification"
              onClick={(event) => menuMessage.current.toggle(event)}
              aria-controls="popup_message"
              aria-haspopup
              className={cx(
                "p-0 h-3rem w-3rem flex justify-content-center text-orange-400 hover:text-orange-500"
              )}
            >
              <FontAwesomeIcon className={cx("text-lg")} icon={faBell} />
            </Button>
            <Menu
              model={itemsMessage}
              popup
              ref={menuMessage}
              id="popup_message"
              popupAlignment="left"
              className={cx(
                "popup_message",
                "p-2 mt-3 border-round-xl shadow-2 w-24rem overflow-y-scroll"
              )}
              pt={{
                submenuHeader: "p-0",
                menu: "relative",
                menuitem: "relative overflow-hidden",
              }}
            />
          </div>
          <div
            className={cx(
              "topbar-infor flex align-items-center cursor-pointer text-color text-sm"
            )}
            onClick={(event) => menuProfile.current.toggle(event)}
            aria-controls="popup_menu_profile"
            aria-haspopup
          >
            <Avatar
              image={user.staff?.image || images.avatarDefault}
              size="large"
              shape="circle"
              className={cx("avatar-user")}
            />
            <span className={cx("profile-details flex flex-column mx-2 ")}>
              <span className={cx("profile-name font-semibold line-height-2")}>
                {user.staff?.name || "Người dùng"}
              </span>
              <span className={cx("profile-job line-height-2")}>
                {user.staff?.role_name || "Chức vụ"}
              </span>
            </span>
            <i
              className={cx(
                "pi pi-angle-down transition-all transition-duration-300",
                showMenu && "rotate-180 transition-all transition-duration-300"
              )}
            ></i>
          </div>
          <Menu
            model={itemsProfile}
            popup
            ref={menuProfile}
            id="popup_menu_profile"
            popupAlignment="right"
            className={cx("p-2 mt-3 shadow-2 ")}
            onShow={() => setShowMenu(true)}
            onHide={() => setShowMenu(false)}
          />
        </div>
      </div>
      {loading && <Loading />}
    </>
  );
}

export default HeaderAdmin;
