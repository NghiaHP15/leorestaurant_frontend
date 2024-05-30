import React from "react";
import Slider from "react-slick";
import images from "../../../../src/assets/images";
import { Avatar } from "primereact/avatar";
import classNames from "classnames/bind";
import styles from "./About.module.scss";

const cx = classNames.bind(styles);

function ResponsiveAbout({ data }) {
  const menuColor = "rgba(217,178,130,255)";

  var settings = {
    dots: false,
    autoplaySpeed: 3000,
    autoplay: true,
    arrows: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const items = [
    {
      name: "Dang Vu",
      position: "Phụ bếp",
      image: images.menu1,
    },
    {
      name: "Minh Nghia",
      position: "Bếp trưởng",
      image: images.menu2,
    },
    {
      name: "Long Bin",
      position: "Bếp phó",
      image: images.menu3,
    },
    {
      name: "Long Bin",
      position: "Bếp phó",
      image: images.menu4,
    },
  ];
  return (
    <div className="surface-100 py-6 my-6">
      <div className="container container-custom">
        <div className="flex flex-column align-items-center justify-content-center">
          <div className="flex flex-column align-items-center justify-content-center">
            <div
              className="text-2xl font-italic font-medium text-center h-auto  p-2"
              style={{ color: menuColor }}
            >
              Đầu bếp của chúng tôi
            </div>
            <div className="font-family font-bold text-4xl text-center h-auto p-1 capitalize">
              Những đầu bếp đẳng cấp nhất
            </div>
          </div>
          <div className="w-10 h-full mt-4">
            <Slider {...settings}>
              {data.map((item, index) => (
                <div key={index} className="relative">
                  <Avatar
                    image={item.image || images.avatarDefault}
                    shape="circle"
                    style={{ height: "23rem", width: "23rem" }}
                    className="p-4 border-400 border-3"
                  />
                  <div
                    className={cx(
                      "info",
                      "text-white flex flex-column align-items-center justify-content-center"
                    )}
                  >
                    <h4 className="m-0 text-2xl font-family">{item.name}</h4>
                    <span className="font-family">
                      {item.role?.name || "Đầu bếp"}
                    </span>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResponsiveAbout;
