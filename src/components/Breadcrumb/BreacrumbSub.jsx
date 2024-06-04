import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { RoutesPath } from "../../routes/routes";

function BreadCrumbSub({ home }) {
  const [breadcrumbs, setBreabCrumbs] = useState([]);
  const [title, setTitle] = useState("");
  const location = useLocation();

  useEffect(() => {
    const crumbs = location.pathname.split("/").filter((item) => item !== "");
    let name;
    const breadcrumbsArray = crumbs.map((pathname, index) => {
      if (index <= 0) {
        name = RoutesPath.find((item) => item.path === `/${pathname}`);
      } else {
        const url = `/${crumbs.slice(0, index + 1).join("/")}`;
        name = RoutesPath.find((item) => item.path === `${url}`);
      }
      return {
        lable: name.name,
        path: name.path,
      };
    });

    setBreabCrumbs(breadcrumbsArray);
    setTitle(breadcrumbsArray[breadcrumbsArray.length - 1]);
  }, [location]);

  return (
    <div>
      <div className="font-family ">
        <h1 className="my-2 text-3xl">{title.lable}</h1>
      </div>
      <div className="flex">
        <>
          <Link
            style={{ fontFamily: '"Roboto Condensed", sans-serif' }}
            className={
              "no-underline capitalize text-white text-base font-normal "
            }
            to={home.path}
          >
            {home.lable}
          </Link>
        </>
        {breadcrumbs.map((item, index) => (
          <div key={index}>
            <span className="text-white text-base px-2 font-normal">/</span>
            <Link
              style={{ fontFamily: '"Roboto Condensed", sans-serif' }}
              className={
                "no-underline capitalize text-white text-base font-normal "
              }
              to={item.path}
            >
              {item.lable}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
export default BreadCrumbSub;
