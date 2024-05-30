import React, { useState, useEffect } from "react";
import { BreadCrumb } from "primereact/breadcrumb";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { publicRoutes } from "../../routes/routes";
import classNames from "classnames/bind";

const cx = classNames.bind();

function BreadCrumbCustom({ home, className }) {
  const [breadcrumbs, setBreabCrumbs] = useState([]);
  const location = useLocation();

  const classes = cx({
    [className]: className,
  });

  useEffect(() => {
    const crumbs = location.pathname.split("/").filter((item) => item !== "");
    const breadcrumbsArray = crumbs.map((pathname, index) => {
      if (index > 0) {
        const url = `/${crumbs.slice(1, index + 1).join("/")}`;
        const name = publicRoutes.find(
          (item) => item.path === `/${crumbs[0] + url}`
        );
        return {
          template: () => (
            <>
              <span className="text-color-secondary text-base px-2 font-normal">
                /
              </span>
              <Link
                style={{ fontFamily: '"Roboto Condensed", sans-serif' }}
                className={
                  "no-underline capitalize text-color-secondary text-sm font-normal " +
                  classes
                }
                to={name.path}
              >
                {name.name}
              </Link>
            </>
          ),
        };
      }
    });
    breadcrumbsArray.splice(0, 1);
    setBreabCrumbs(breadcrumbsArray);
  }, [location]);

  return (
    <div>
      <BreadCrumb
        model={breadcrumbs}
        home={home}
        pt={{
          root: "border-none bg-transparent py-2",
          separator: "hidden",
        }}
      />
    </div>
  );
}
export default BreadCrumbCustom;
