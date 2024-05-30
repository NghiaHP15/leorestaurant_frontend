import React, { useEffect } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Trend from "../../Home/Trend/Trend";
import classNames from "classnames/bind";
import styles from "./About.module.scss";
import ResponsiveAbout from "./ResponsiveAbouts";
import * as GalleryService from "../../../services/GalleryService";
import * as StaffService from "../../../services/StaffService";
import * as InforService from "../../../services/InforService";
import { useState } from "react";

const cx = classNames.bind(styles);

function AboutsPage() {
  const [trend, setTrend] = useState([]);
  const [chef, setChef] = useState([]);
  const [about, setAbout] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const [resultTrend, resultChef, resultAboutUs] = await Promise.all([
        GalleryService.listSocalMedia(),
        StaffService.listStaffChef(),
        InforService.getInfor(),
      ]);
      setTrend(resultTrend.data);
      setChef(resultChef.data);
      setAbout(resultAboutUs.data[0]);
    };
    fetchData();
  }, []);

  return (
    <div className="mt-6">
      <div className="container container-custom">
        <div className="grid">
          <div className="col-6">
            <div className={cx("about-thmb")}>
              <div
                className={cx("item", "bg-no-repeat bg-cover bg-center")}
                style={{
                  background: `url("https://validthemes.net/site-template/restan/assets/img/about/2.jpg")`,
                }}
              ></div>
              <div
                className={cx("item", "bg-no-repeat bg-cover bg-center")}
                style={{
                  background: `url("https://validthemes.net/site-template/restan/assets/img/about/3.jpg")`,
                }}
              ></div>
            </div>
          </div>
          <div className="col-6 relative">
            <div className={cx("content", "absolute bg-white p-8")}>
              <div className={cx("about-style-one-info")}>
                <h4 className={cx("sub-heading")}>Giới thiệu</h4>
                <h2 className={cx("text-3xl font-family-3 ")}>
                  {about.about?.name_about}
                </h2>
                <p className="font-family">{about.about?.description_about}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ResponsiveAbout data={chef} />
      <Trend data={trend} />
    </div>
  );
}
export default AboutsPage;
