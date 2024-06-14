import Home from "../pages/Home";
import HomeAdmin from "../pages/Admin/HomeAdmin";
import config from "../config";
import AdminLayout from "../layouts/AdminLayout";
import ListProduct from "../pages/Admin/ListProduct";
import Order from "../pages/Admin/Order/Order";
import ListEmployee from "../pages/Admin/Employee/ListEmployee";
import ListIngredient from "../pages/Admin/Ingredient/ListIngredient/Ingredient";
import CatedoryIngredient from "../pages/Admin/Ingredient/CategoryIngredient/CategoryIngredient";
import SupplierIngredient from "../pages/Admin/Ingredient/SupplierIngredient/SupplierIngredient";
import Register from "../pages/Client/Register";
import CreateEmployee from "../pages/Admin/Employee/CreateEmployee";
import ListRole from "../pages/Admin/Role/ListRole";
import EditEmployee from "../pages/Admin/Employee/EditEmployee";
import ListUser from "../pages/Admin/User/listUser";
import PrifileEmployee from "../pages/Admin/Employee/ProfileEmployee";
import CategoryDish from "../pages/Admin/Food/CategoryDish";
import Recipe from "../pages/Admin/Food/Recipe";
import CreateRecipe from "../pages/Admin/Food/Recipe/CreateRecipe";
import EditRecipe from "../pages/Admin/Food/Recipe/EditRecipe";
import Menu from "../pages/Admin/Menu";
import CreateMenu from "../pages/Admin/Menu/CreateMenu";
import ViewMenu from "../pages/Admin/Menu/ViewMenu";
import Combo from "../pages/Admin/Combo";
import CreateCombo from "../pages/Admin/Combo/CreateCombo";
import ViewCombo from "../pages/Admin/Combo/ViewCombo";
import TableSchedule from "../pages/Admin/Table/TableShedule/TableShedule";
import TableDiagram from "../pages/Admin/Table/TableDiagram/TableDiagram";
import Overview from "../pages/Admin/Setting/Overview";
import AreaTable from "../pages/Admin/Setting/Area/AreaTable";
import CreateTableSchedule from "../pages/Admin/Table/TableShedule/CreateTableSchdule";
import ListTable from "../pages/Admin/Setting/Table/Table";
import CategoryTable from "../pages/Admin/Setting/Table/CategoryTable";
import SelectItem from "../pages/Admin/Table/TableShedule/SelectItem";
import SelectTable from "../pages/Admin/Table/TableShedule/SelectTable";
import ListBill from "../pages/Admin/Bill/ListBill";
import ListBillList from "../pages/Admin/Bill/ListBillList";
import Customer from "../pages/Admin/Customer";
import Detail from "../pages/Admin/Bill/Detail";
import SelectFood from "../pages/Admin/Bill/SelectFood";
import ListBookingList from "../pages/Admin/Table/TableList/TableList";
import DetailTableList from "../pages/Admin/Table/TableList/DetailTableList";
import ProfileUser from "../pages/Admin/User/ProfileUser";
import AboutsPage from "../pages/Client/AboutPage/AboutsPage";
import MenuPage from "../pages/Client/MenuPage/MenuPage";
import ContentLayout from "../layouts/ContentLayout";
import MenuItem from "../pages/Client/MenuPage/MenuItem";
import ImagePage from "../pages/Client/ImagePage/ImagePage";
import BlogPage from "../pages/Client/BlogPage/BlogPage";
import ContactPage from "../pages/Client/ContactPage/ContactPage";
import CategoryBanner from "../pages/Admin/Setting/Banner";
import Banner from "../pages/Admin/Web/Banner";
import Gallery from "../pages/Admin/Web/Gallery";
import CategoryGallery from "../pages/Admin/Setting/Gallery/Gallery";
import Blog from "../pages/Admin/Web/Blog/Blog";
import CreateBlog from "../pages/Admin/Web/Blog/CreateBlog";
import EditBlog from "../pages/Admin/Web/Blog/EditBlog";
import Infor from "../pages/Admin/Setting/Infor";
import MobiePage from "../pages/Client/MobiePage";
import Permission from "../pages/Admin/Permission";
import ListPermission from "../pages/Admin/Permission/ListPermission";

const RoutesPath = [
  {
    name: "Mobie",
    component: MobiePage,
    path: config.router.mobiePage,
    layout: null,
    permission: "default",
  },
  {
    name: "Trang chủ",
    component: Home,
    path: config.router.home,
    permission: "default",
  },
  {
    name: "Trang giới thiệu",
    component: AboutsPage,
    path: config.router.aboutPage,
    layout: ContentLayout,
    permission: "default",
  },
  {
    name: "Trang thực đơn",
    component: MenuPage,
    path: config.router.menuPage,
    layout: ContentLayout,
    permission: "default",
  },
  {
    name: "Trang món ăn",
    component: MenuItem,
    path: config.router.menuItem,
    layout: ContentLayout,
    permission: "default",
  },
  {
    name: "Trang hình ảnh",
    component: ImagePage,
    path: config.router.imagePage,
    layout: ContentLayout,
    permission: "default",
  },
  {
    name: "Trang bài viết",
    component: BlogPage,
    path: config.router.blogPage,
    layout: ContentLayout,
    permission: "default",
  },
  {
    name: "Trang liên hệ",
    component: ContactPage,
    path: config.router.contactPage,
    layout: ContentLayout,
    permission: "default",
  },
  {
    name: "Danh sách slide",
    component: Banner,
    path: config.router.slider,
    layout: AdminLayout,
    isPrivate: true,
    permission: "666af7980a7446ecd60582ef",
  },
  {
    name: "Danh sách bộ sưu tập",
    component: Gallery,
    path: config.router.gallery,
    layout: AdminLayout,
    isPrivate: true,
    permission: "666af7980a7446ecd60582ef",
  },
  {
    name: "Danh sách bài viết",
    component: Blog,
    path: config.router.blog,
    layout: AdminLayout,
    isPrivate: true,
    permission: "666af7980a7446ecd60582ef",
  },
  {
    name: "Tạo bài viết",
    component: CreateBlog,
    path: config.router.createBlog,
    layout: AdminLayout,
    isPrivate: true,
    permission: "666af7980a7446ecd60582ef",
  },
  {
    name: "Sửa bài viết",
    component: EditBlog,
    path: config.router.editBlog,
    layout: AdminLayout,
    isPrivate: true,
    permission: "666af7980a7446ecd60582ef",
  },
  {
    name: "Admin",
    component: HomeAdmin,
    path: config.router.admin,
    layout: AdminLayout,
    isPrivate: true,
    permission: "admindefault",
  },
  {
    name: "Đơn hàng",
    component: Order,
    path: config.router.manageOrder,
    layout: AdminLayout,
    isPrivate: true,
    permission: "666af7230a7446ecd60582cc",
  },
  {
    name: "Danh sách đơn hàng",
    component: ListProduct,
    path: config.router.manageListOrder,
    layout: AdminLayout,
    isPrivate: true,
    permission: "666af7230a7446ecd60582cc",
  },
  {
    name: "Danh sách thực đơn",
    component: ListProduct,
    path: config.router.listProduct,
    layout: AdminLayout,
    isPrivate: true,
    permission: "666af7440a7446ecd60582d5",
  },
  {
    name: "Danh sách nhân viên",
    component: ListEmployee,
    path: config.router.listEmployee,
    layout: AdminLayout,
    isPrivate: true,
    permission: "666af7800a7446ecd60582e4",
  },
  {
    name: "Thêm mới nhân viên",
    component: CreateEmployee,
    path: config.router.createEmployee,
    layout: AdminLayout,
    isPrivate: true,
    permission: "666af7800a7446ecd60582e4",
  },
  {
    name: "Chỉnh sửa thông tin nhân viên",
    component: EditEmployee,
    path: config.router.editEmployee,
    layout: AdminLayout,
    isPrivate: true,
    permission: "666af7800a7446ecd60582e4",
  },
  {
    name: "Thông tin nhân viên",
    component: PrifileEmployee,
    path: config.router.profileEmployee,
    layout: AdminLayout,
    isPrivate: true,
    permission: "666af7800a7446ecd60582e4",
  },
  {
    name: "Thông tin người dùng",
    component: ProfileUser,
    path: config.router.profileUser,
    layout: AdminLayout,
    isPrivate: true,
    permission: "666af7800a7446ecd60582e4",
  },
  {
    name: "Danh sách chức vụ",
    component: ListRole,
    path: config.router.listRole,
    layout: AdminLayout,
    isPrivate: true,
    permission: "666af7800a7446ecd60582e4",
  },
  {
    name: "Danh sách User",
    component: ListUser,
    path: config.router.listUser,
    layout: AdminLayout,
    isPrivate: true,
    permission: "666af7800a7446ecd60582e4",
  },
  {
    name: "Nguyên liệu",
    component: ListIngredient,
    path: config.router.ingredient,
    layout: AdminLayout,
    isPrivate: true,
    permission: "666af68b0a7446ecd60582a7",
  },
  {
    name: "Danh mục nguyên liệu",
    component: CatedoryIngredient,
    path: config.router.categoryIngredient,
    layout: AdminLayout,
    isPrivate: true,
    permission: "666af68b0a7446ecd60582a7",
  },
  {
    name: "Quản lý nhà cung cấp",
    component: SupplierIngredient,
    path: config.router.supplierIngredient,
    layout: AdminLayout,
    isPrivate: true,
    permission: "666af68b0a7446ecd60582a7",
  },
  {
    name: "Danh sách công thức món",
    component: Recipe,
    path: config.router.recipe,
    layout: AdminLayout,
    isPrivate: true,
    permission: "666af7320a7446ecd60582d1",
  },
  {
    name: "Tạo công thức món",
    component: CreateRecipe,
    path: config.router.createRecipe,
    layout: AdminLayout,
    isPrivate: true,
    permission: "666af7320a7446ecd60582d1",
  },
  {
    name: "Sửa công thức món",
    component: EditRecipe,
    path: config.router.editRecipe,
    layout: AdminLayout,
    isPrivate: true,
    permission: "666af7320a7446ecd60582d1",
  },
  {
    name: "Danh mục món",
    component: CategoryDish,
    path: config.router.categoryFood,
    layout: AdminLayout,
    isPrivate: true,
    permission: "666af7320a7446ecd60582d1",
  },
  {
    name: "Danh sách thực đơn",
    component: Menu,
    path: config.router.menu,
    layout: AdminLayout,
    isPrivate: true,
    permission: "666af7440a7446ecd60582d5",
  },
  {
    name: "Tạo thực đơn",
    component: CreateMenu,
    path: config.router.createMenu,
    layout: AdminLayout,
    isPrivate: true,
    permission: "666af7440a7446ecd60582d5",
  },
  {
    name: "Xem thực đơn",
    component: ViewMenu,
    path: config.router.viewMenu,
    layout: AdminLayout,
    isPrivate: true,
    permission: "666af7440a7446ecd60582d5",
  },
  {
    name: "Danh sách combo",
    component: Combo,
    path: config.router.combo,
    layout: AdminLayout,
    isPrivate: true,
    permission: "666af7500a7446ecd60582da",
  },
  {
    name: "Tạo combo",
    component: CreateCombo,
    path: config.router.createCombo,
    layout: AdminLayout,
    isPrivate: true,
    permission: "666af7500a7446ecd60582da",
  },
  {
    name: "Xem combo",
    component: ViewCombo,
    path: config.router.viewCombo,
    layout: AdminLayout,
    isPrivate: true,
    permission: "666af7500a7446ecd60582da",
  },
  {
    name: "Sơ đồ bàn",
    component: TableDiagram,
    path: config.router.table,
    layout: AdminLayout,
    isPrivate: true,
    permission: "666af6dc0a7446ecd60582c7",
  },
  {
    name: "Lịch đặt bàn",
    component: TableSchedule,
    path: config.router.tableSchedule,
    layout: AdminLayout,
    isPrivate: true,
    permission: "666af6dc0a7446ecd60582c7",
  },
  {
    name: "Danh sách đặt bàn",
    component: ListBookingList,
    path: config.router.tableList,
    layout: AdminLayout,
    isPrivate: true,
    permission: "666af6dc0a7446ecd60582c7",
  },
  {
    name: "Chi tiết đặt bàn",
    component: DetailTableList,
    path: config.router.tableDetail,
    layout: AdminLayout,
    isPrivate: true,
    permission: "666af6dc0a7446ecd60582c7",
  },
  {
    name: "Thêm lịch đặt bàn",
    component: CreateTableSchedule,
    path: config.router.createTableSchedule,
    layout: AdminLayout,
    isPrivate: true,
    permission: "666af6dc0a7446ecd60582c7",
  },
  {
    name: "Chọn món",
    component: SelectItem,
    path: config.router.tableSelectItem,
    layout: AdminLayout,
    isPrivate: true,
    permission: "666af6dc0a7446ecd60582c7",
  },
  {
    name: "Chọn món",
    component: SelectFood,
    path: config.router.billSelectItem,
    layout: AdminLayout,
    isPrivate: true,
    permission: "666af7230a7446ecd60582cc",
  },
  {
    name: "Chọn bàn",
    component: SelectTable,
    path: config.router.tableSelectTable,
    layout: AdminLayout,
    isPrivate: true,
    permission: "666af6dc0a7446ecd60582c7",
  },
  {
    name: "Danh khách nhận bàn",
    component: ListBill,
    path: config.router.listBill,
    layout: AdminLayout,
    isPrivate: true,
    permission: "666af7230a7446ecd60582cc",
  },
  {
    name: "Danh sách đơn hàng",
    component: ListBillList,
    path: config.router.listBillList,
    layout: AdminLayout,
    isPrivate: true,
    permission: "666af7230a7446ecd60582cc",
  },
  {
    name: "Chi tiết đơn hàng",
    component: Detail,
    path: config.router.detailBill,
    layout: AdminLayout,
    isPrivate: true,
    permission: "666af7230a7446ecd60582cc",
  },
  // {
  //   name: "Chọn món",
  //   component: SelectItem,
  //   path: config.router.billSelectItem,
  //   layout: AdminLayout,
  //   isPrivate: true,
  //   permission: "666af7230a7446ecd60582cc",
  // },
  {
    name: "Chuyển bàn",
    component: SelectTable,
    path: config.router.billSelectTable,
    layout: AdminLayout,
    isPrivate: true,
    permission: "666af7230a7446ecd60582cc",
  },
  {
    name: "Cài đặt",
    path: config.router.setting,
    component: Overview,
    layout: AdminLayout,
    isPrivate: true,
    permission: "666af7a20a7446ecd60582f4",
  },
  {
    name: "Thiết thông tin nhà hàng",
    path: config.router.settingInfor,
    component: Infor,
    layout: AdminLayout,
    isPrivate: true,
    permission: "666af7a20a7446ecd60582f4",
  },
  {
    name: "Thiết lập loại bàn",
    path: config.router.settingCategoryTable,
    component: CategoryTable,
    layout: AdminLayout,
    isPrivate: true,
    permission: "666af7a20a7446ecd60582f4",
  },
  {
    name: "Thiết danh sách bàn",
    path: config.router.settingTable,
    component: ListTable,
    layout: AdminLayout,
    isPrivate: true,
    permission: "666af7a20a7446ecd60582f4",
  },
  {
    name: "Thiết lập khu vực",
    path: config.router.settingAreaTablr,
    component: AreaTable,
    layout: AdminLayout,
    isPrivate: true,
    permission: "666af7a20a7446ecd60582f4",
  },
  {
    name: "Thiết lập Banner",
    path: config.router.settingBanner,
    component: CategoryBanner,
    layout: AdminLayout,
    isPrivate: true,
    permission: "666af7a20a7446ecd60582f4",
  },
  {
    name: "Thiết lập bộ sưu tập",
    path: config.router.settingImage,
    component: CategoryGallery,
    layout: AdminLayout,
    isPrivate: true,
    permission: "666af7a20a7446ecd60582f4",
  },
  {
    name: "Khách hàng",
    path: config.router.customer,
    component: Customer,
    layout: AdminLayout,
    isPrivate: true,
    permission: "666af78a0a7446ecd60582ea",
  },
  {
    name: "Đăng ký và đăng nhập tài khoản",
    path: config.router.register,
    component: Register,
    layout: null,
    permission: "default",
  },
  {
    name: "Danh sách chức năng",
    path: config.router.permission,
    component: Permission,
    layout: AdminLayout,
    permission: "666af7800a7446ecd60582e4",
  },
  {
    name: "Danh sách quyền",
    path: config.router.listPermission,
    component: ListPermission,
    layout: AdminLayout,
    permission: "666af7800a7446ecd60582e4",
  },
];

export { RoutesPath };
