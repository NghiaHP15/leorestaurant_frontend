import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import BreadCrumbCustom from "../../components/Breadcrumb/Breadcrumb";
import { publicRoutes } from "../../routes/routes";

const home = {
  template: () => (
    <Link
      style={{ fontFamily: '"Roboto Condensed", sans-serif' }}
      className="no-underline capitalize text-color-secondary text-sm font-normal"
      to="/home"
    >
      Trang chủ
    </Link>
  ),
};

function DefaultLayout({ children }) {
  return (
    <div className="wrapper relative">
      <Header />
      {/* <div className="p-4 h-15rem">
        <div className="flex align-items-center">
          <BreadCrumbCustom model={publicRoutes} home={home} />
        </div>
      </div> */}
      <div className="body overflow-hidden">{children}</div>
      <Footer />
    </div>
  );
}

export default DefaultLayout;
