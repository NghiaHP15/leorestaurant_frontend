import classNames from "classnames/bind";
import styles from "./Footer.module.scss";
import MenuFooter from "./MenuFooter";
import * as InforService from "../../../services/InforService";
import {
  FacebookIcon,
  InstagramIcon,
  TwitterIcon,
  PinterestIcon,
} from "../../../components/Icons/Icons";
import { useEffect, useState } from "react";

const cx = classNames.bind(styles);

let dataContact = [
  {
    name: "Số điện thoại: +54.8638.8583.43",
    path: "tel:+4733378901",
  },
  {
    name: "Email: info@la-studioweb.com",
    path: "mailto:info@la-studioweb.com",
  },
  {
    name: "Thời gian mở: 9:00-19:00, Monday-Saturday",
    path: "/",
  },
  {
    name: "Địa chỉ: 121 King Street, Melbourne Victoria  3000 Australia",
    path: "/",
  },
];

let dataNetWorks = [
  {
    icon: "",
    path: "",
  },
  {
    icon: "",
    path: "",
  },
  {
    icon: "",
    path: "",
  },
  {
    icon: "",
    path: "",
  },
];

function Footer() {
  const [data, setData] = useState();
  const [restaurant, setRestaurant] = useState([]);
  const [catalog, setCatalog] = useState([]);
  const [help, setHelp] = useState([]);
  const [hotTag, setHotTag] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await InforService.getInfor();
      setData(result.data[0]);
      setRestaurant(result.data[0].restaurant);
      setCatalog(result.data[0].catalog);
      setHelp(result.data[0].help);
      setHotTag(result.data[0].hot_tag);
    };
    fetchData();
  }, []);

  dataNetWorks = [
    {
      icon: <FacebookIcon className={"fill-white"} />,
      path: data?.footer_socail_media.find((item) => item.name === "facebook")
        ?.path,
    },
    {
      icon: <InstagramIcon className={"fill-white"} />,
      path: data?.footer_socail_media.find((item) => item.name === "instagram")
        ?.path,
    },
    {
      icon: <TwitterIcon className={"fill-white"} />,
      path: data?.footer_socail_media.find((item) => item.name === "twitter")
        ?.path,
    },
    {
      icon: <PinterestIcon className={"fill-white"} />,
      path: data?.footer_socail_media.find((item) => item.name === "pinterest")
        ?.path,
    },
  ];

  dataContact = [
    {
      name: `Số điện thoại: ${data?.phone?.name}`,
      path: data?.phone?.path,
    },
    {
      name: `Email: ${data?.email?.name}`,
      path: data?.email?.path,
    },
    {
      name: `Thời gian mở: ${data?.time_open?.name}`,
      path: data?.time_open?.path,
    },
    {
      name: `Địa chỉ: ${data?.address?.name}`,
      path: data?.address?.path,
    },
  ];

  return (
    <div className={cx("footer-main")}>
      <div className={cx("container container-custom")}>
        <div className="grid">
          <div className="col-4">
            <div className={cx("footer-logo-area")}>
              <img
                className={cx("logo-main")}
                src={data?.logo?.logo_footer}
                alt="Logo"
              />
            </div>
          </div>
          <div className="col-2">
            <MenuFooter data={restaurant} count={3} title={"Nhà Hàng"} />
            <MenuFooter data={help} count={4} title={"Trợ Giúp"} />
          </div>
          <div className="col-3">
            <MenuFooter
              data={catalog}
              count={6}
              title={"Danh Mục"}
              column={2}
            />
            <MenuFooter data={hotTag} count={8} title={"Hot Tags"} column={2} />
          </div>
          <div className="col-3">
            <MenuFooter
              data={dataNetWorks}
              title={"Liên kết mạng xã hội"}
              count={4}
              social
            />
            <MenuFooter
              data={dataContact}
              href
              count={4}
              title={"Thông tin liên lạc"}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
