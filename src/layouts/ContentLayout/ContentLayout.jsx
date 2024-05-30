import Header from "../components/Header";
import Footer from "../components/Footer";
import { publicRoutes } from "../../routes/routes";
import images from "../../assets/images";
import BreadCrumbSub from "../../components/Breadcrumb/BreacrumbSub";

const home = {
  lable: "Trang chủ",
  path: "/",
};

function ContentLayout({ children }) {
  return (
    <div className="wrapper relative">
      <Header />
      <div
        className="p-7 h-25rem flex align-items-end bg-no-repeat bg-cover bg-center"
        style={{
          background: `url(${images.bgContent}) `,
        }}
      >
        <div className="text-white">
          <BreadCrumbSub
            model={publicRoutes}
            home={home}
            className={"text-white"}
          />
        </div>
      </div>
      <div className="body">{children}</div>
      <Footer />
    </div>
  );
}

export default ContentLayout;
