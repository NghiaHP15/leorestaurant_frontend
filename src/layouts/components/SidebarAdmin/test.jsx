import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./SidebarAdmin.module.scss";
import classNames from "classnames/bind";
import { PanelMenu } from "primereact/panelmenu";
import { Link } from "react-router-dom";

const cx = classNames.bind(styles);

function SidebarAdmin() {
  const itemRenderer = (item, options) => (
    <Link
      className="flex align-items-center px-3 py-2 cursor-pointer"
      onClick={options.onClick}
    >
      <span className={`${item.icon} text-primary`} />
      <span className={`mx-2 ${item.items && "font-semibold"}`}>
        {item.label}
      </span>
    </Link>
  );

  const itemMenu = [
    {
      label: "E-Commerce",
      icon: "pi pi-fw pi-home",
      template: itemRenderer,
    },
    {
      label: "Banking",
      icon: "pi pi-fw pi-credit-card",
      template: itemRenderer,
    },
    {
      label: "Đơn hàng",
      icon: "pi pi-fw pi-list",
      template: itemRenderer,
      items: [
        {
          label: "Danh sách đơn hàng",
          icon: "pi pi-chart-line",
          template: itemRenderer,
        },
        {
          label: "Đơn hoàn tất",
          icon: "pi pi-list",
          template: itemRenderer,
        },
        {
          label: "Đơn chưa hoàn tất",
          icon: "pi pi-list",
          template: itemRenderer,
        },
      ],
    },
    {
      label: "Đặt bàn",
      icon: "pi pi-fw pi-credit-card",
      template: itemRenderer,
      items: [
        {
          label: "Sơ đồ bàn",
          icon: "pi pi-chart-line",
          template: itemRenderer,
        },
        {
          label: "Lịch đặt bàn",
          icon: "pi pi-list",
          template: itemRenderer,
        },
        {
          label: "Danh sách đặt bàn",
          icon: "pi pi-list",
          template: itemRenderer,
        },
      ],
    },
    {
      label: "Mặt hàng",
      icon: "pi pi-fw pi-credit-card",
      template: itemRenderer,
      items: [
        {
          label: "Danh sách mặt hàng",
          icon: "pi pi-chart-line",
          template: itemRenderer,
        },
        {
          label: "Danh mục mặt hàng",
          icon: "pi pi-list",
          template: itemRenderer,
        },
        {
          label: "Quản lý kho",
          icon: "pi pi-list",
          template: itemRenderer,
        },
      ],
    },
    {
      label: "Thực đơn",
      icon: "pi pi-fw pi-credit-card",
      template: itemRenderer,
      items: [
        {
          label: "Danh sách thực đơn",
          icon: "pi pi-chart-line",
          template: itemRenderer,
        },
        {
          label: "Danh mục thực đơn",
          icon: "pi pi-list",
          template: itemRenderer,
        },
      ],
    },
    {
      label: "Combo",
      icon: "pi pi-fw pi-credit-card",
      template: itemRenderer,
    },
    {
      label: "Nhân viên",
      icon: "pi pi-fw pi-credit-card",
      template: itemRenderer,
      items: [
        {
          label: "Danh sách nhân viên",
          icon: "pi pi-chart-line",
          template: itemRenderer,
        },
        {
          label: "Phân quyền người dùng",
          icon: "pi pi-list",
          template: itemRenderer,
        },
      ],
    },
    {
      label: "Khách hàng",
      icon: "pi pi-fw pi-credit-card",
      template: itemRenderer,
      items: [
        {
          label: "Danh sách khách hàng",
          icon: "pi pi-chart-line",
          template: itemRenderer,
        },
      ],
    },
    {
      label: "Hệ thống Website",
      icon: "pi pi-fw pi-credit-card",
      template: itemRenderer,
      items: [
        {
          label: "Slide",
          icon: "pi pi-chart-line",
          template: itemRenderer,
        },
        {
          label: "Menu",
          icon: "pi pi-list",
          template: itemRenderer,
        },
        {
          label: "Bài viết",
          icon: "pi pi-list",
          template: itemRenderer,
        },
        {
          label: "Hình ảnh",
          icon: "pi pi-list",
          template: itemRenderer,
        },
      ],
    },
    {
      label: "Thiết lập",
      icon: "pi pi-fw pi-credit-card",
      template: itemRenderer,
    },
  ];

  return (
    <div className={cx("layout-sidebar")}>
      <PanelMenu
        model={itemMenu}
        className="w-full md:w-20rem"
        unstyled={false}
        pt={{
          header: "nghia",
        }}
      />
    </div>
  );
}

export default SidebarAdmin;
<li>
  <StyleClass
    nodeRef={btnRef2}
    selector="@next"
    enterClassName="hidden"
    enterActiveClassName="slidedown"
    leaveToClassName="hidden"
    leaveActiveClassName="slideup"
  >
    <a
      ref={btnRef2}
      className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full"
    >
      <i className="pi pi-chart-line mr-2"></i>
      <span className="font-medium">Reports</span>
      <i className="pi pi-chevron-down ml-auto mr-1"></i>
      <Ripple />
    </a>
  </StyleClass>
  <ul className="list-none py-0 pl-3 pr-0 m-0 hidden overflow-y-hidden transition-all transition-duration-400 transition-ease-in-out">
    <li>
      <a className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full">
        <i className="pi pi-chart-line mr-2"></i>
        <span className="font-medium">Expenses</span>
        <Ripple />
      </a>
    </li>
  </ul>
</li>;
