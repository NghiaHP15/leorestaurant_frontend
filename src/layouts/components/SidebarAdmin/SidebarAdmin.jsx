import React, { forwardRef } from "react";
import styles from "./SidebarAdmin.module.scss";
import classNames from "classnames/bind";
import SidebarAdminItem from "./SidebarAdminItem";
import config from "../../../config/";
import { faDropbox, faMagento } from "@fortawesome/free-brands-svg-icons";

const cx = classNames.bind(styles);

const itemMenu = [
  {
    label: "Dashboard",
    icon: "pi pi-home",
    path: config.router.admin,
  },
  {
    label: "Đơn hàng",
    icon: "pi pi-clone",

    items: [
      {
        label: "Khách nhận bàn",
        icon: "pi pi-list",
        path: config.router.listBill,
      },
      {
        label: "Danh sách đơn hàng",
        icon: "pi pi pi-list",
        path: config.router.listBillList,
      },
    ],
  },

  {
    label: "Đặt bàn",
    icon: "pi pi-cart-plus",

    items: [
      {
        label: "Sơ đồ bàn",
        icon: "pi pi-map",
        path: config.router.table,
      },
      {
        label: "Lịch đặt bàn",
        icon: "pi pi pi-calendar",
        path: config.router.tableSchedule,
      },
      {
        label: "Danh sách đặt bàn",
        icon: "pi pi pi-list",
        path: config.router.tableList,
      },
    ],
  },
  {
    label: "Nguyên liệu",
    icon: "pi pi-box",

    items: [
      {
        label: "Danh sách nguyên liêu",
        icon: "pi pi-image",
        path: config.router.ingredient,
      },
      {
        label: "Danh mục nguyên liệu",
        icon: "pi pi-list",
        path: config.router.categoryIngredient,
      },
      {
        label: "Quản lý nhà cung cấp",
        icon: "pi pi-chart-bar",
        path: config.router.supplierIngredient,
      },
    ],
  },
  {
    label: "Mặt hàng",
    iconfa: faMagento,
    items: [
      {
        label: "Danh sách mặt hàng",
        iconfa: faDropbox,
        path: config.router.recipe,
      },
      {
        label: "Danh mục mặt hàng",
        icon: "pi pi pi-list",
        path: config.router.categoryFood,
      },
    ],
  },
  {
    label: "Thực đơn",
    icon: "pi pi-image",
    path: config.router.menu,
  },
  {
    label: "Combo",
    icon: "pi pi-briefcase",
    path: config.router.combo,
  },
  {
    label: "Nhân viên",
    icon: "pi pi-server",

    items: [
      {
        label: "Danh sách nhân viên",
        icon: "pi pi-id-card",
        path: config.router.listEmployee,
      },
      {
        label: "Danh sách chức vụ",
        icon: "pi pi-book",
        path: config.router.listRole,
      },
      {
        label: "Danh sách User",
        icon: "pi pi-user-edit",
        path: config.router.listUser,
      },
    ],
  },
  {
    label: "Khách hàng",
    icon: "pi pi-users",
    items: [
      {
        label: "Danh sách khách hàng",
        icon: "pi pi-id-card",
        path: config.router.customer,
      },
    ],
  },
  {
    label: "Hệ thống Website",
    icon: "pi pi-globe",
    items: [
      {
        label: "Slide",
        icon: "pi pi-images",
        path: config.router.slider,
      },
      // {
      //   label: "Menu",
      //   icon: "pi pi-ellipsis-h",
      // },
      {
        label: "Bài viết",
        icon: "pi pi-inbox",
        path: config.router.blog,
      },
      {
        label: "Hình ảnh",
        icon: "pi pi-image",
        path: config.router.gallery,
      },
    ],
  },
  {
    label: "Thiết lập",
    icon: "pi pi-cog",
    path: config.router.setting,
  },
];

// eslint-disable-next-line no-undef
export default forwardRef(function HeadlessDemo(
  { visible = false, setShow },
  ref
) {
  return (
    <div
      onClick={setShow(true)}
      ref={ref}
      className={cx(visible && "active", "h-screen hidden lg:block z-1 ")}
    >
      <div className={cx("sidebar-style", "flex flex-column h-full")}>
        <div className="overflow-y-auto">
          <ul className="list-none py-5 px-0 m-0 overflow-hidden">
            {itemMenu.map((item, index) => {
              return (
                <SidebarAdminItem
                  data={item}
                  key={index}
                  visible={visible}
                  ref={ref}
                />
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
});
