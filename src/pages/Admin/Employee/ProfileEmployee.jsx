/* eslint-disable no-useless-escape */
import React, { useEffect, useRef, useState } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import images from "../../../assets/images";
import { userMutationHook } from "../../../hooks/useMutationHook";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDays, faIdCard } from "@fortawesome/free-regular-svg-icons";
import { Toast } from "primereact/toast";
import * as Address from "../../../services/AdressService";
import * as UserService from "../../../services/UserService";
import * as StaffService from "../../../services/StaffService";
import * as PermissionService from "../../../services/PermissionService";
import { Dropdown } from "primereact/dropdown";
import { useLocation, useNavigate } from "react-router-dom";
import { Avatar } from "primereact/avatar";
import classNames from "classnames/bind";
import style from "./Employee.module.scss";
import { faVenusMars } from "@fortawesome/free-solid-svg-icons";
import LoadingInputLable from "../../../components/Loading/LoadingInputLable";
import { Skeleton } from "primereact/skeleton";
import LoadingButton from "../../../components/Loading/LoadingButton";
import LoadingText from "../../../components/Loading/LoadingText";

const cx = classNames.bind(style);

const defaultValue = {
  name: "",
  email: "",
  phone: "",
  date_birth: "",
  identification: "",
  gender: "",
  address: {
    city: "",
    district: "",
    ward: "",
    detail: "",
  },
  date_work: "",
  role: {
    _id: "",
    name: "",
  },
  discribe: "",
  content: "",
  account: {
    _id: "",
    username: "",
    email: "",
    permission: "",
  },
};

const defaltUser = {
  id: "",
  username: "",
  passwordCurent: "",
  passwordNew: "",
  permission: "",
};

const defaltShowPassword = {
  passwordCurent: false,
  passwordNew: false,
};

const defaltError = {
  passwordCurent: "",
  passwordNew: "",
};

const defaultAddress = {
  city: "",
  district: "",
  ward: "",
  detail: "",
};

const formatDate = (dateString) => {
  let date = new Date(dateString);
  let day = date.getDate();
  let month = date.getMonth() + 1; // Months are zero indexed
  let year = date.getFullYear(); // Get last two digits of the year

  // Add leading zero if day or month is less than 10
  day = day < 10 ? "0" + day : day;
  month = month < 10 ? "0" + month : month;

  return `${day}/${month}/${year}`;
};

export default function CreateEmployee() {
  const [dataStaff, setDataStaff] = useState(defaultValue);
  const [address, setAddress] = useState(defaultAddress);
  const [user, setUser] = useState(defaltUser);
  const [permission, setPermission] = useState(null);
  const [error, setError] = useState(defaltError);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(defaltShowPassword);
  const navigator = useNavigate();
  const location = useLocation();

  const toast = useRef(null);

  const mutation = userMutationHook((data) =>
    UserService.changePasswordUser(data.id, data)
  );
  const { data, isSuccess, isPending } = mutation;
  useEffect(() => {
    if (isSuccess) {
      if (data?.data) {
        setError(defaltError);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    if (location.state?.id) {
      const { id } = location.state;
      const fetchData = async () => {
        setLoading(true);
        const [staffResult, permissionResult] = await Promise.all([
          StaffService.detailStaff(id),
          PermissionService.listPermission(),
        ]);
        setLoading(false);
        setDataStaff(staffResult.data);
        const _user = { ...user };
        _user.id = staffResult.data.account?._id;
        _user.username = staffResult.data.account?.username;
        _user.permission = staffResult.data.account?.permission;
        setUser(_user);
        setPermission(permissionResult.data);
      };
      fetchData();
    } else {
      navigator("/admin/employee");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const fetchAddress = async () => {
      const responseCity = await Address.apiGetProvincesCity();
      const responseDistrict = await Address.apiGetProvincesDistrict(
        dataStaff.address.city
      );
      const responseWard = await Address.apiGetProvincesWard(
        dataStaff.address.district
      );
      const city = responseCity.results.find(
        (item) => item.province_id === dataStaff.address.city
      );
      const district = responseDistrict.results.find(
        (item) => item.district_id === dataStaff.address.district
      );
      const ward = responseWard.results.find(
        (item) => item.ward_id === dataStaff.address.ward
      );
      const _address = { ...address };
      _address.city = city.province_name;
      _address.district = district.district_name;
      _address.ward = ward.ward_name;
      _address.detail = dataStaff.address.detail;
      setAddress(_address);
    };
    dataStaff.address.city && fetchAddress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataStaff]);

  /// Toast message save

  const confirmSave = () => {
    const _error = { ...error };
    const { passwordCurent, passwordNew } = user;
    _error.passwordCurent = passwordCurent ? "" : "Vui lòng mật khẩu hiện tại";
    _error.passwordNew = passwordNew
      ? passwordNew !== passwordCurent
        ? ""
        : "Vui lòng không nhập mật khẩu cũ"
      : "Vui lòng nhập mật khẩu mới";
    if (passwordNew && passwordNew && passwordCurent !== passwordNew) {
      console.log(user);
      mutation.mutate(user);
    }
    setError(_error);
  };

  /// Change Input
  const handleChangeInputText = (event) => {
    const { value, name } = event.target;
    const _user = { ...user };
    const _error = { ...error };
    _user[name] = value;
    _error[name] = "";
    setUser(_user);
    setError(_error);
  };

  const handleChangeInput = (event, name) => {
    const { value } = event;
    console.log(value);
    const _user = { ...user };
    const _error = { ...error };
    _user[name] = value;
    _error[name] = "";
    setUser(_user);
    setError(_error);
  };

  const handlechangeShow = (field) => {
    const _show = { ...show };
    console.log(_show[field]);
    _show[field] = !_show[field];
    setShow(_show);
  };

  const getFormErrorMessage = (errors, field) => {
    if (!errors[field]) {
      errors[field] = data?.error === field ? data?.message : "";
    }
    return errors[field] ? (
      <small className="p-error">{errors[field]}</small>
    ) : (
      <small className="p-error">&nbsp;</small>
    );
  };

  const LoadingInfor1 = ({ loading, children, width }) =>
    loading ? (
      <>
        <Skeleton shape="circle" size="2rem" className="mr-2"></Skeleton>
        <Skeleton width={width} borderRadius="10px"></Skeleton>
      </>
    ) : (
      children
    );

  const LoadingInfor2 = ({ loading, children }) =>
    loading ? (
      <>
        <Skeleton width={"60px"} height="20px" borderRadius="10px"></Skeleton>
        <Skeleton
          width={"140px"}
          className="mt-2"
          borderRadius="10px"
        ></Skeleton>
      </>
    ) : (
      children
    );

  return (
    <>
      <div className="relative">
        <div className="grid">
          <div className="col-4 ">
            <div
              className={cx(
                !loading && "information",
                "p-4 mt-4 shadow-2 bg-white border-round-xl relative"
              )}
            >
              <div className="flex flex-column align-items-center relative z-3">
                <LoadingText width={"180px"} height={"30px"} loading={loading}>
                  <h2 className="text-white font-family mb-0">
                    {dataStaff.name}
                  </h2>
                </LoadingText>
                <LoadingText
                  width={"60px"}
                  height={"16px"}
                  loading={loading}
                  className={"mt-2 mb-4"}
                >
                  <span className="text-white font-medium font-family mb-4 mt-1">
                    {dataStaff.role.name}
                  </span>
                </LoadingText>
                <div className="relative">
                  {loading ? (
                    <Skeleton shape="circle" size="200px"></Skeleton>
                  ) : (
                    <Avatar
                      image={dataStaff.image || images.avatarDefault}
                      shape="circle"
                      style={{ height: "auto", width: "200px" }}
                      className="p-2 shadow-2"
                    />
                  )}
                </div>
                <span
                  className="font-medium font-family text-center mt-4"
                  style={{ maxWidth: "230px" }}
                >
                  <LoadingText
                    loading={loading}
                    width={"200px"}
                    height={"40px"}
                  >
                    {`${address.detail || ""} ${address.ward || ""} ${
                      address.district || ""
                    } ${address.city || " "}`}
                  </LoadingText>
                </span>
                <div className="grid w-full mt-3">
                  <div className="col-4 text-center">
                    <div className="flex flex-column">
                      <LoadingInfor2 loading={loading}>
                        <span className="font-family text-color font-medium">
                          Mã NV
                        </span>
                        <span className="font-family text-orange-500 font-medium mt-3">
                          NV01
                        </span>
                      </LoadingInfor2>
                    </div>
                  </div>
                  <div className="col-4 font-medium text-center">
                    <div className="flex flex-column">
                      <LoadingInfor2 loading={loading}>
                        <span className="font-family text-color font-medium">
                          Trạng thái
                        </span>
                        <span className="font-family text-orange-500 font-medium mt-3">
                          {dataStaff.status || "Đang cập nhật..."}
                        </span>
                      </LoadingInfor2>
                    </div>
                  </div>
                  <div className="col-4  text-center">
                    <div className="flex flex-column">
                      <LoadingInfor2 loading={loading}>
                        <span className="font-family text-color font-medium">
                          Post
                        </span>
                        <span className="font-family text-orange-500 font-medium mt-3">
                          001
                        </span>
                      </LoadingInfor2>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4 mt-4 shadow-2 bg-white border-round-xl">
              <div className="grid font-family">
                <div className="col-12">
                  <LoadingText loading={loading} width={"170px"}>
                    <h3 className="m-0 text-orange-500">Thông tin cá nhân </h3>
                  </LoadingText>
                </div>
                <div className="col-12">
                  <div className="flex align-items-center mt-2">
                    <LoadingInfor1 loading={loading} width={"170px"}>
                      <Avatar
                        icon="pi pi-phone text-orange-500 text-lg"
                        className="bg-transparent mr-2 "
                        style={{ height: "25px", width: "25px" }}
                      />
                      <span>Số điện thoại: {dataStaff.phone}</span>
                    </LoadingInfor1>
                  </div>
                </div>
                <div className="col-12">
                  <div className="flex align-items-center mt-2">
                    <LoadingInfor1 loading={loading} width={"200px"}>
                      <Avatar
                        icon="pi pi-envelope text-orange-500 text-lg"
                        className="bg-transparent mr-2 "
                        style={{ height: "25px", width: "25px" }}
                      />
                      <span>Email: {dataStaff.email}</span>
                    </LoadingInfor1>
                  </div>
                </div>
                <div className="col-12">
                  <div className="flex align-items-center mt-2">
                    <LoadingInfor1 loading={loading} width={"100px"}>
                      <Avatar
                        icon={
                          <FontAwesomeIcon
                            icon={faVenusMars}
                            className="text-orange-500 text-lg"
                          />
                        }
                        className="bg-transparent mr-2 "
                        style={{ height: "25px", width: "25px" }}
                      />
                      <span>Giới tính: {dataStaff.gender}</span>
                    </LoadingInfor1>
                  </div>
                </div>
                <div className="col-12">
                  <div className="flex align-items-center mt-2">
                    <LoadingInfor1 loading={loading} width={"150px"}>
                      <Avatar
                        icon={
                          <FontAwesomeIcon
                            icon={faCalendarDays}
                            className="text-orange-500 text-lg"
                          />
                        }
                        className="bg-transparent mr-2 "
                        style={{ height: "25px", width: "25px" }}
                      />
                      <span>
                        Ngày sinh:{" "}
                        {formatDate(new Date(dataStaff.date_birth).toString())}
                      </span>
                    </LoadingInfor1>
                  </div>
                </div>
                <div className="col-12">
                  <div className="flex align-items-center mt-2">
                    <LoadingInfor1 loading={loading} width={"170px"}>
                      <Avatar
                        icon={
                          <FontAwesomeIcon
                            icon={faIdCard}
                            className="text-orange-500 text-lg"
                          />
                        }
                        className="bg-transparent mr-2 "
                        style={{ height: "25px", width: "25px" }}
                      />
                      <span>CMND: {dataStaff.identification}</span>
                    </LoadingInfor1>
                  </div>
                </div>
                <div className="col-12">
                  <div className="flex align-items-center mt-2">
                    <LoadingInfor1 loading={loading} width={"180px"}>
                      <Avatar
                        icon={
                          <FontAwesomeIcon
                            icon={faCalendarDays}
                            className="text-orange-500 text-lg"
                          />
                        }
                        className="bg-transparent mr-2 "
                        style={{ height: "25px", width: "25px" }}
                      />
                      <span>
                        Ngày bắt đầu làm:{" "}
                        {formatDate(new Date(dataStaff.date_work).toString())}
                      </span>
                    </LoadingInfor1>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-8">
            <div className="p-5 mt-4 shadow-2 bg-white border-round-xl">
              <div className="grid p-1">
                <div className="col-12">
                  <LoadingText loading={loading} width={"120px"}>
                    <h3 className="m-0 text-orange-500 font-family">
                      Giới thiệu
                    </h3>
                  </LoadingText>
                </div>
                <div className="col-12">
                  <div className="grid">
                    <div className="col-3">
                      <div className="flex flex-column">
                        <LoadingInfor2 loading={loading}>
                          <span className="font-family text-color font-bold">
                            Họ Tên
                          </span>
                          <span className="font-family font-normal mt-3">
                            {dataStaff.name}
                          </span>
                        </LoadingInfor2>
                      </div>
                    </div>
                    <div className="col-3">
                      <div className="flex flex-column">
                        <LoadingInfor2 loading={loading}>
                          <span className="font-family text-color font-bold">
                            Email
                          </span>
                          <span className="font-family font-normal mt-3">
                            {dataStaff.email}
                          </span>
                        </LoadingInfor2>
                      </div>
                    </div>
                    <div className="col-3">
                      <div className="flex flex-column">
                        <LoadingInfor2 loading={loading}>
                          <span className="font-family text-color font-bold">
                            Tài khoản
                          </span>
                          <span className="font-family font-normal mt-3">
                            {dataStaff.account?.username || "Đang cập nhât..."}
                          </span>
                        </LoadingInfor2>
                      </div>
                    </div>
                    <div className="col-3">
                      <div className="flex flex-column">
                        <LoadingInfor2 loading={loading}>
                          <span className="font-family text-color font-bold">
                            Chức vụ
                          </span>
                          <span className="font-family font-normal mt-3">
                            {dataStaff.role.name || "Đang cập nhât..."}
                          </span>
                        </LoadingInfor2>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <LoadingInputLable loading={loading}>
                    <h3 className="m-0 text-orange-500 font-family">Mô tả</h3>
                    <div>
                      <p className="font-family">
                        {dataStaff.discribe || "Đang cập nhât..."}
                      </p>
                    </div>
                  </LoadingInputLable>
                </div>
                <div className="col-12">
                  <LoadingInputLable loading={loading}>
                    <h3 className="m-0 text-orange-500 font-family">
                      Nội dung
                    </h3>
                    <div className="font-family mt-2">
                      {dataStaff.content || "Đang cập nhât..."}
                    </div>
                  </LoadingInputLable>
                </div>
                <div className="col-12">
                  <LoadingText loading={loading} width={"150px"}>
                    <h3 className="m-0 text-orange-500 font-family">
                      Tài khoản
                    </h3>
                  </LoadingText>
                  <div className="grid mt-2">
                    <div className="col-6">
                      <LoadingInputLable loading={loading}>
                        <label htmlFor="email" className="font-family">
                          Tên tài khoản
                        </label>
                        <InputText
                          placeholder="Tên tài khoản"
                          name="username"
                          id="username"
                          value={user.username}
                          disabled
                          onChange={(e) => handleChangeInputText(e)}
                          pt={{
                            root: "font-family border-round-lg h-3rem mt-2 w-full",
                          }}
                        />
                      </LoadingInputLable>
                    </div>
                    <div className="col-6">
                      <LoadingInputLable loading={loading}>
                        <label htmlFor="permission" className="font-family">
                          Phân quyền
                        </label>
                        <Dropdown
                          value={user.permission}
                          options={permission}
                          placeholder="--- Chọn phân quyền ---"
                          optionLabel="name"
                          optionValue="_id"
                          disabled={dataStaff.account === null ? true : false}
                          onChange={(e) => handleChangeInput(e, "permission")}
                          pt={{
                            root: "h-3rem w-full align-items-center border-round-lg mt-2",
                            input: "font-family",
                            item: "font-family hover:surface-100 px-4 py-3",
                            list: "p-0 ",
                          }}
                        />
                      </LoadingInputLable>
                    </div>
                    <div className="col-6">
                      <LoadingInputLable loading={isPending || loading}>
                        <label htmlFor="passwordCurent" className="font-family">
                          Mật khẩu hiện tại
                        </label>
                        <span className="p-input-icon-right mt-2 w-full">
                          <InputText
                            placeholder="Mật khẩu hiện tại"
                            name="passwordCurent"
                            id="passwordCurent"
                            disabled={dataStaff.account === null ? true : false}
                            className={error.passwordCurent ? "p-invalid" : ""}
                            value={user.passwordCurent}
                            type={show.passwordCurent ? "text" : "password"}
                            onChange={(e) => handleChangeInputText(e)}
                            pt={{
                              root: "font-family border-round-lg h-3rem w-full",
                            }}
                          />
                          <i
                            className={cx(
                              "absolute text-orange-500",
                              show.password ? "pi pi-eye" : "pi pi-eye-slash"
                            )}
                            onClick={() => handlechangeShow("passwordCurent")}
                            style={{ right: "16px" }}
                          />
                        </span>
                        {getFormErrorMessage(error, "passwordCurent")}
                      </LoadingInputLable>
                    </div>
                    <div className="col-6">
                      <LoadingInputLable loading={isPending || loading}>
                        <label htmlFor="passwordNew" className="font-family">
                          Mật khẩu mới
                        </label>
                        <span className="p-input-icon-right mt-2 w-full">
                          <InputText
                            placeholder="Mật khẩu mới"
                            name="passwordNew"
                            id="passwordNew"
                            disabled={dataStaff.account === null ? true : false}
                            type={show.passwordNew ? "text" : "password"}
                            value={user.passwordNew}
                            className={error.passwordNew ? "p-invalid" : ""}
                            onChange={(e) => handleChangeInputText(e)}
                            pt={{
                              root: "font-family border-round-lg h-3rem w-full",
                            }}
                          />
                          <i
                            className={cx(
                              "absolute text-orange-500",
                              show.confirmPassword
                                ? "pi pi-eye"
                                : "pi pi-eye-slash"
                            )}
                            onClick={() => handlechangeShow("passwordNew")}
                            style={{ right: "16px" }}
                          />
                        </span>
                        {getFormErrorMessage(error, "passwordNew")}
                      </LoadingInputLable>
                    </div>
                    <div className="col-12">
                      <LoadingButton
                        loading={loading}
                        width={"140px"}
                        height={"40px"}
                      >
                        <Button
                          label="Lưu lại"
                          icon="pi pi-plus"
                          severity="success"
                          className="mr-2 border-round-md font-semibold font-family"
                          onClick={confirmSave}
                        />
                      </LoadingButton>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Toast
        ref={toast}
        pt={{
          content: "bg-white text-color align-items-center",
        }}
      />
    </>
  );
}
