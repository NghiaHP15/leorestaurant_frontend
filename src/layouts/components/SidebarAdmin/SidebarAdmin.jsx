import React, { forwardRef } from "react";
import styles from "./SidebarAdmin.module.scss";
import classNames from "classnames/bind";
import SidebarAdminItem from "./SidebarAdminItem";
import config from "../../../config/";
import { faDropbox, faMagento } from "@fortawesome/free-brands-svg-icons";

const cx = classNames.bind(styles);

// eslint-disable-next-line no-undef
export default forwardRef(function HeadlessDemo(
  { visible = false, setShow },
  ref
) {
  const itemMenu = [
    {
      label: "Dashboard",
      icon: "pi pi-home",
      path: config.router.admin,
      permission: "default",
    },
    {
      label: "Đơn hàng",
      icon: "pi pi-clone",
      permission: "666af7230a7446ecd60582cc",
      items: [
        {
          label: "Khách nhận bàn",
          icon: "pi pi-list",
          path: config.router.listBill,
          permission: "666af7230a7446ecd60582cc",
        },
        {
          label: "Danh sách đơn hàng",
          icon: "pi pi pi-list",
          path: config.router.listBillList,
          permission: "666af7230a7446ecd60582cc",
        },
      ],
    },

    {
      label: "Đặt bàn",
      icon: "pi pi-cart-plus",
      permission: "666af6dc0a7446ecd60582c7",
      items: [
        {
          label: "Sơ đồ bàn",
          icon: "pi pi-map",
          path: config.router.table,
          permission: "666af6dc0a7446ecd60582c7",
        },
        {
          label: "Lịch đặt bàn",
          icon: "pi pi pi-calendar",
          path: config.router.tableSchedule,
          permission: "666af6dc0a7446ecd60582c7",
        },
        {
          label: "Danh sách đặt bàn",
          icon: "pi pi pi-list",
          path: config.router.tableList,
          permission: "666af6dc0a7446ecd60582c7",
        },
      ],
    },
    {
      label: "Nguyên liệu",
      icon: "pi pi-box",
      permission: "666af68b0a7446ecd60582a7",
      items: [
        {
          label: "Danh sách nguyên liêu",
          icon: "pi pi-image",
          path: config.router.ingredient,
          permission: "666af68b0a7446ecd60582a7",
        },
        {
          label: "Danh mục nguyên liệu",
          icon: "pi pi-list",
          path: config.router.categoryIngredient,
          permission: "666af68b0a7446ecd60582a7",
        },
        {
          label: "Quản lý nhà cung cấp",
          icon: "pi pi-chart-bar",
          path: config.router.supplierIngredient,
          permission: "666af68b0a7446ecd60582a7",
        },
      ],
    },
    {
      label: "Mặt hàng",
      iconfa: faMagento,
      permission: "666af7320a7446ecd60582d1",
      items: [
        {
          label: "Danh sách mặt hàng",
          iconfa: faDropbox,
          path: config.router.recipe,
          permission: "666af7320a7446ecd60582d1",
        },
        {
          label: "Danh mục mặt hàng",
          icon: "pi pi pi-list",
          path: config.router.categoryFood,
          permission: "666af7320a7446ecd60582d1",
        },
      ],
    },
    {
      label: "Thực đơn",
      permission: "666af7440a7446ecd60582d5",
      icon: "pi pi-image",
      path: config.router.menu,
    },
    {
      label: "Combo",
      permission: "666af7500a7446ecd60582da",
      icon: "pi pi-briefcase",
      path: config.router.combo,
    },
    {
      label: "Nhân viên",
      icon: "pi pi-server",
      permission: "666af7800a7446ecd60582e4",
      items: [
        {
          label: "Danh sách nhân viên",
          icon: "pi pi-id-card",
          path: config.router.listEmployee,
          permission: "666af7800a7446ecd60582e4",
        },
        {
          label: "Danh sách chức vụ",
          icon: "pi pi-book",
          path: config.router.listRole,
          permission: "666af7800a7446ecd60582e4",
        },
        {
          label: "Danh sách User",
          icon: "pi pi-user-edit",
          path: config.router.listUser,
          permission: "666af7800a7446ecd60582e4",
        },
        {
          label: "Danh sách quyền",
          icon: "pi pi-tags",
          path: config.router.listPermission,
          permission: "666af7800a7446ecd60582e4",
        },
      ],
    },
    {
      label: "Khách hàng",
      icon: "pi pi-users",
      permission: "666af78a0a7446ecd60582ea",
      items: [
        {
          label: "Danh sách khách hàng",
          icon: "pi pi-id-card",
          path: config.router.customer,
          permission: "666af78a0a7446ecd60582ea",
        },
      ],
    },
    {
      label: "Hệ thống Website",
      icon: "pi pi-globe",
      permission: "666af7980a7446ecd60582ef",
      items: [
        {
          label: "Slide",
          icon: "pi pi-images",
          path: config.router.slider,
          permission: "666af7980a7446ecd60582ef",
        },
        {
          label: "Bài viết",
          icon: "pi pi-inbox",
          path: config.router.blog,
          permission: "666af7980a7446ecd60582ef",
        },
        {
          label: "Hình ảnh",
          icon: "pi pi-image",
          path: config.router.gallery,
          permission: "666af7980a7446ecd60582ef",
        },
      ],
    },
    {
      label: "Thiết lập",
      permission: "666af7a20a7446ecd60582f4",
      icon: "pi pi-cog",
      path: config.router.setting,
    },
  ];

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
