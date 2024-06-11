import { useState, useRef } from "react";
import HeaderAdmin from "../components/HeaderAdmin";
import SidebarAdmin from "../components/SidebarAdmin";
import { Button } from "primereact/button";
import { useClickOutside } from "primereact/hooks";
import BreadCrumbCustom from "../../components/Breadcrumb";
import { RoutesPath } from "../../routes/routes";
import { Link } from "react-router-dom";

function AdminLayout({ children }) {
  const [visible, setVisible] = useState(false);
  const overlayRef = useRef(null);

  // useEffect(() => {
  //   const { decoded } = handleDecoded();
  //   if (!decoded?.id) {
  //     navigate(config.router.register);
  //   }
  // });

  // const handleDecoded = () => {
  //   let storageData = localStorage.getItem("access_token");
  //   let decoded = {};
  //   if (storageData && isJsonString(storageData)) {
  //     storageData = JSON.parse(storageData);
  //     decoded = jwtDecode(storageData);
  //   }
  //   return { decoded, storageData };
  // };

  useClickOutside(overlayRef, () => {
    setVisible(false);
  });

  const home = {
    template: () => (
      <Link
        style={{ fontFamily: '"Roboto Condensed", sans-serif' }}
        className="no-underline capitalize text-color-secondary text-sm font-normal"
        to="/dashboard"
      >
        Admin
      </Link>
    ),
  };

  return (
    <div className="layout-container layout-slim p-ripple-disabled layout-lightr">
      <HeaderAdmin />

      <div className="layout-content-wrapper">
        <div className="flex">
          <SidebarAdmin
            visible={visible}
            ref={overlayRef}
            setShow={() => setVisible}
          />
          <div
            style={{
              borderTopLeftRadius: "30px",
              boxShadow: "inset 0 3px 4px rgba(0,0,0,.1)",
            }}
            className="w-screen h-screen overflow-auto p-5 surface-ground"
          >
            <div className="flex align-items-center">
              <Button
                text
                icon={"pi pi-fw pi-bars"}
                severity="warning"
                size="large"
                className="font-semibold text-orange-500 hover:text-orange-600 py-2"
                onClick={() => setVisible(!visible)}
              />
              <BreadCrumbCustom model={RoutesPath} home={home} />
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;
