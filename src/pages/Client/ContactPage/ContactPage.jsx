/* eslint-disable jsx-a11y/iframe-has-title */
import React, { useState, useEffect } from "react";
import "primeicons/primeicons.css";
import { Avatar } from "primereact/avatar";
import images from "../../../assets/images";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "react-scroll";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import * as InforService from "../../../services/InforService";

const valueDf = {
  name: "",
  phone: "",
  email: "",
  note: "",
};
const errorDf = {
  name: "",
  phone: "",
  email: "",
};

const ContactPage = () => {
  const [feedback, setFeedback] = useState(valueDf);
  const [error, setError] = useState(errorDf);
  const [infor, setInfor] = useState({ phone: "", address: "", email: "" });

  useEffect(() => {
    const fetchData = async () => {
      const result = await InforService.getInfor();
      const data = result.data[0];
      const _infor = { ...infor };
      _infor.phone = data?.phone?.name;
      _infor.email = data?.email?.name;
      _infor.address = data?.address?.name;
      setInfor(_infor);
    };
    fetchData();
  }, []);

  const handleChangeInput = (event) => {
    const { value, name } = event.target;
    const _dataStaff = { ...feedback };
    const _error = { ...error };
    _dataStaff[name] = value;
    _error[name] = "";
    setFeedback(_dataStaff);
    setError(_error);
  };

  return (
    <>
      <div className="container container-custom relative">
        <div
          className="absolute bg-no-repeat bg-cover bg-center top-0 bottom-0 right-0 left-0 z-1"
          style={{ background: `url(${images.bgMap})` }}
        ></div>
        <div className="mt-6 relative z-2">
          <div className="content w-8 text-center m-auto">
            <div className="grid">
              <div className="col-4">
                <div className="flex flex-column justify-content-center align-items-center p-6 border-200 border-1 border-round-lg bg-white-alpha-70 mx-2">
                  <Avatar image={images.iconPhone} className="h-6rem w-6rem" />
                  <span className="font-family-2 mt-4 text-3xl font-medium">
                    Số điện thoại
                  </span>
                  <span className="mt-3 font-family text-xl text-color-secondary h-4rem">
                    {infor.phone}
                  </span>
                </div>
              </div>
              <div className="col-4">
                <div className="flex flex-column justify-content-center align-items-center p-6 border-200 border-1 border-round-lg bg-white-alpha-70 mx-2">
                  <Avatar
                    image={images.iconPlacehoder}
                    className="h-6rem w-6rem"
                  />
                  <span className="font-family-2 mt-4 text-3xl font-medium">
                    Địa chỉ
                  </span>
                  <span className="mt-3 font-family text-xl text-color-secondary h-4rem">
                    {infor.address}
                  </span>
                </div>
              </div>
              <div className="col-4">
                <div className="flex flex-column justify-content-center align-items-center p-6 border-200 border-1 border-round-lg bg-white-alpha-70 mx-2">
                  <Avatar image={images.iconEmail} className="h-6rem w-6rem" />
                  <span className="font-family-2 mt-4 text-3xl font-medium">
                    Email
                  </span>
                  <span className="mt-3 font-family text-xl text-color-secondary h-4rem">
                    {infor.email}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="form w-10 text-center m-auto p-6 shadow-1 bg-white mt-6 border-round-3xl">
            <div className="grid">
              <div className="col-6 pr-3">
                <div className="grid">
                  <div className="col-12">
                    <h2 className="font-family-3 text-4xl">
                      Gửi tin nhắn cho Leo Restaurant
                    </h2>
                  </div>
                  <div className="col-12">
                    <InputText
                      placeholder="Họ tên"
                      name="name"
                      value={feedback.name}
                      onChange={(e) => handleChangeInput(e)}
                      className={error.phone ? "p-invalid" : ""}
                      pt={{
                        root: "px-4 font-family border-none surface-200 h-3rem border-round-md fon w-full",
                      }}
                    />
                  </div>
                  <div className="col-6">
                    <InputText
                      placeholder="Số điện thoại"
                      name="phone"
                      value={feedback.phone}
                      onChange={(e) => handleChangeInput(e)}
                      className={error.phone ? "p-invalid" : ""}
                      pt={{
                        root: "px-4 font-family border-none surface-200 h-3rem border-round-md fon w-full",
                      }}
                    />
                  </div>
                  <div className="col-6">
                    <InputText
                      placeholder="Email"
                      name="email"
                      value={feedback.email}
                      onChange={(e) => handleChangeInput(e)}
                      className={error.phone ? "p-invalid" : ""}
                      pt={{
                        root: "px-4 font-family border-none surface-200 h-3rem border-round-md fon w-full",
                      }}
                    />
                  </div>
                  <div className="col-12">
                    <InputTextarea
                      placeholder="Ghi chú"
                      name="note"
                      value={feedback.note}
                      onChange={(e) => handleChangeInput(e)}
                      rows={5}
                      cols={30}
                      pt={{
                        root: "px-4 font-family border-none surface-200 border-round-md w-full",
                      }}
                    />
                  </div>
                  <div className="col-12 text-left">
                    <Button className="border-none px-5 py-3 border-round-lg surface-800 text-white font-family text-lg cursor-pointer">
                      {<FontAwesomeIcon icon={faPaperPlane} className="mr-2" />}{" "}
                      Gửi đi
                    </Button>
                  </div>
                </div>
              </div>
              <div className="col-6 pl-3">
                <iframe
                  className="h-full w-full"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3728.50693919223!2d106.70446587986612!3d20.85160773165151!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x314a7bb0afcff127%3A0x7440497c6ec8e3d3!2sTHE%20SHINE%20HOTEL!5e0!3m2!1svi!2s!4v1715753905413!5m2!1svi!2s"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactPage;
