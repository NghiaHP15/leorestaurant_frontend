/* eslint-disable no-useless-escape */
import React, { useEffect, useRef, useState } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import images from "../../../assets/images";
import { userMutationHook } from "../../../hooks/useMutationHook";
import * as StaffService from "../../../services/StaffService";
import * as UploadService from "../../../services/UploadService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-regular-svg-icons";
import { Toast } from "primereact/toast";
import Loading from "../../../components/Loading";
import * as Address from "../../../services/AdressService";
import * as RoleService from "../../../services/RoleService";
import * as UserService from "../../../services/UserService";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { InputNumber } from "primereact/inputnumber";
import config from "../../../config";
import { useNavigate } from "react-router-dom";
import { Avatar } from "primereact/avatar";
import { FileUpload } from "primereact/fileupload";
import { InputTextarea } from "primereact/inputtextarea";
import { Editor } from "primereact/editor";

const defaultStaff = {
  name: "",
  email: "",
  phone: "",
  date_birth: "",
  identification: "",
  gender: null,
  status: null,
  address: {
    city: "",
    district: "",
    ward: "",
    more: "",
  },
  date_work: "",
  role: "",
  discribe: "",
  content: "",
  account: "",
};

const genders = ["Nam", "Nữ", "Khác"];

const status = ["Đang làm việc", "Nghỉ việc", "Nghỉ phép"];

const defaltError = {
  name: "",
  email: "",
  phone: "",
  identification: "",
  username: "",
  password: "",
  confirmPassword: "",
};

const defaultAddress = {
  city: [],
  district: [],
  ward: [],
};

export default function CreateEmployee() {
  const [dataStaff, setDataStaff] = useState(defaultStaff);
  const [address, setAddress] = useState(defaultAddress);
  const [role, setRole] = useState();
  const [user, setUser] = useState();
  const [error, setError] = useState(defaltError);
  const [content, setContent] = useState("");
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [loadingUpload, setLoadingUpload] = useState(false);

  const navigator = useNavigate();

  const toast = useRef(null);

  const mutation = userMutationHook((data) => StaffService.createStaff(data));
  const { data, isPending, isSuccess } = mutation;
  useEffect(() => {
    if (isSuccess) {
      if (data?.data) {
        navigator(config.router.listEmployee);
        setDataStaff(defaultStaff);
        setError(defaltError);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, isSuccess]);

  ///City
  useEffect(() => {
    const fetchPublicProvince = async () => {
      const response = await Address.apiGetProvincesCity();
      const _address = { ...address };
      _address.city = response.results;
      setAddress(_address);
    };
    fetchPublicProvince();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  ///District
  useEffect(() => {
    const fetchPublicDistrict = async () => {
      const response = await Address.apiGetProvincesDistrict(
        dataStaff.address.city
      );
      const _address = { ...address };
      _address.district = response.results;
      setAddress(_address);
    };
    dataStaff.address.city && fetchPublicDistrict();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataStaff.address.city]);

  ///Ward
  useEffect(() => {
    const fetchPublicWard = async () => {
      const response = await Address.apiGetProvincesWard(
        dataStaff.address.district
      );
      const _address = { ...address };
      _address.ward = response.results;
      setAddress(_address);
    };
    dataStaff.address.district && fetchPublicWard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataStaff.address.district]);

  useEffect(() => {
    const getListData = async () => {
      const data = await RoleService.listRole();
      setRole(data.data);
    };
    getListData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const [roleResult, userResult] = await Promise.all([
        RoleService.listRole(),
        UserService.getAllUser(),
      ]);
      setRole(roleResult.data);
      setUser(userResult.data);
    };
    fetchData();
  }, []);

  /// Toast message save
  const accept = () => {
    setDataStaff(defaultStaff);
  };

  const confirmDelete = () => {
    const { name, email, phone, identification } = dataStaff;
    if (name || email || phone || identification) {
      confirmDialog({
        message: "Bạn muốn hủy thông tin này?",
        header: "Xác nhận hủy thông tin",
        icon: <img src={images.warning} alt="warning" className="max-w-3rem" />,
        defaultFocus: "reject",
        acceptClassName: "p-button-danger px-4 ml-3 font-family",
        acceptLabel: "Đồng ý",
        rejectLabel: "Không",
        rejectClassName: "p-button-info px-4 font-family",
        accept,
      });
    } else {
    }
  };
  const validateEmail = (email) => {
    const expression =
      /^((?:[A-Za-z0-9!#$%&'*+\-\/=?^_`{|}~]|(?<=^|\.)"|"(?=$|\.|@)|(?<=".*)[ .](?=.*")|(?<!\.)\.){1,64})(@)((?:[A-Za-z0-9.\-])*(?:[A-Za-z0-9])\.(?:[A-Za-z0-9]){2,})$/i;
    return expression.test(String(email).toLowerCase());
  };

  const confirmSave = () => {
    const _error = { ...error };
    const { name, email, phone, identification } = dataStaff;
    _error.email = email;
    _error.email = email
      ? validateEmail(email)
        ? ""
        : "Định dạng email không đúng"
      : "Vui lòng nhập email";
    _error.name = name ? "" : "Vui lòng nhập tên";
    _error.phone = phone ? "" : "Vui lòng nhập số điện thoại";
    _error.identification = identification ? "" : "Vui lòng nhập CMND";
    if (name && validateEmail(email) && phone && identification) {
      const _dataStaff = { ...dataStaff };
      _dataStaff.content = content;
      mutation.mutate(_dataStaff);
    }
    setError(_error);
  };

  /// Change Input
  const handleChangeInputText = (event) => {
    const { value, name } = event.target;
    const _dataStaff = { ...dataStaff };
    const _error = { ...error };
    _dataStaff[name] = value;
    _error[name] = "";
    setDataStaff(_dataStaff);
    setError(_error);
  };

  const handleChangeInput = (event, name) => {
    const { value } = event;
    console.log(value);
    const _dataStaff = { ...dataStaff };
    const _error = { ...error };
    _dataStaff[name] = value;
    _error[name] = "";
    setDataStaff(_dataStaff);
    setError(_error);
  };

  const handleChangeAddress = (event, field) => {
    const { value } = event;
    const _dataStaff = { ...dataStaff };
    _dataStaff.address[field] = value;
    if (event.target) {
      const { value } = event.target;
      _dataStaff.address[field] = value;
    }
    setDataStaff(_dataStaff);
  };

  const handleSeletUpload = async (event) => {
    const file = event.files[0];
    if (file) {
      const formData = new FormData();
      const _dataStaff = { ...dataStaff };
      formData.append("image", file);
      setLoadingUpload(true);
      console.log(formData);
      const image = await UploadService.uploadImage(formData);
      _dataStaff.image = image.data.imagePath;
      setDataStaff(_dataStaff);
      setLoadingUpload(false);
      setUploadedImageUrl(image.data.imagePath);
    } else {
      toast.current.show({
        severity: "error",
        summary: "Lỗi tải ảnh",
        detail: `Dung lượng anh quá lớn`,
        icon: (
          <FontAwesomeIcon
            icon={faCircleCheck}
            className="text-red-500 h-2rem"
          />
        ),
        life: 3000,
      });
    }
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
  return (
    <>
      <div className="relative">
        <div className="grid">
          <div className="col-4">
            <div className="p-4 mt-4 shadow-2 bg-white border-round-xl">
              <div className="flex flex-column align-items-center">
                <div className="relative">
                  <Avatar
                    image={uploadedImageUrl || images.avatarDefault}
                    shape="circle"
                    style={{ height: "auto", width: "200px" }}
                    className="p-2 shadow-2"
                  />
                  {loadingUpload && <Loading />}
                </div>
                <FileUpload
                  mode="basic"
                  name="image"
                  url="#"
                  accept="image/*"
                  auto
                  onSelect={handleSeletUpload}
                  maxFileSize={1000000}
                  chooseLabel="Chọn ảnh"
                  className="mt-4 text-white"
                  pt={{
                    chooseButton: "bg-orange-500 ",
                    chooseButtonLabel: "text-white",
                  }}
                />
                <div className="mt-4 flex flex-column align-items-center">
                  <span className="font-light text-500 font-family">
                    Dung lượng tối đa 1MB
                  </span>
                  <span className="font-light text-500 font-family mt-1">
                    Định dạng :.JPG,.PNG
                  </span>
                  <span className="font-light text-500 font-family mt-1">
                    Nên sử dụng hình ảnh có tỷ lệ 1:1
                  </span>
                </div>
              </div>
            </div>
            <div className="p-4 mt-4 shadow-2 bg-white border-round-xl">
              <div className="grid">
                <div className="col-12">
                  <h3 className="m-0 text-orange-500">Tài khoản </h3>
                </div>
                <div className="col-12">
                  <label htmlFor="account" className="font-family">
                    Chọn tài khoản<span className="text-red-500">(*)</span>
                  </label>
                  <Dropdown
                    value={dataStaff.account}
                    options={user}
                    optionLabel="email"
                    optionValue="_id"
                    placeholder="--- Chọn tài khoản ---"
                    filter
                    onChange={(e) => handleChangeInput(e, "account")}
                    className={error.account ? "p-invalid" : ""}
                    pt={{
                      root: "h-3rem w-full align-items-center border-round-lg mt-2",
                      input: "font-family",
                      item: "font-family hover:surface-100 px-4 py-3",
                      list: "p-0 ",
                    }}
                  />
                  {getFormErrorMessage(error, "account")}
                </div>
              </div>
            </div>
          </div>

          <div className="col-8">
            <div className="p-5 mt-4 shadow-2 bg-white border-round-xl">
              <div className="grid p-1">
                <div className="col-12">
                  <h3 className="m-0 text-orange-500 font-family">
                    Thông tin người dùng
                  </h3>
                </div>
                <div className="col-6">
                  <label htmlFor="name" className="font-family">
                    Họ và tên<span className="text-red-500">(*)</span>
                  </label>
                  <InputText
                    placeholder="Họ và tên"
                    name="name"
                    id="name"
                    value={dataStaff.name}
                    onChange={(e) => handleChangeInputText(e)}
                    className={error.name ? "p-invalid" : ""}
                    pt={{
                      root: "font-family border-round-lg h-3rem mt-2 w-full",
                    }}
                  />
                  {getFormErrorMessage(error, "name")}
                </div>
                <div className="col-6">
                  <label htmlFor="email" className="font-family">
                    Email <span className="text-red-500">(*)</span>
                  </label>
                  <InputText
                    placeholder="Email"
                    name="email"
                    id="email"
                    value={dataStaff.email}
                    onChange={(e) => handleChangeInputText(e)}
                    className={error.email ? "p-invalid" : ""}
                    pt={{
                      root: "font-family border-round-lg h-3rem mt-2 w-full",
                    }}
                  />
                  {getFormErrorMessage(error, "email")}
                </div>
                <div className="col-6">
                  <label htmlFor="lastname" className="font-family">
                    Số điện thoại<span className="text-red-500">(*)</span>
                  </label>
                  <InputText
                    placeholder="Số điện thoại"
                    name="phone"
                    id="phone"
                    value={dataStaff.phone}
                    onChange={(e) => handleChangeInputText(e)}
                    className={error.phone ? "p-invalid" : ""}
                    pt={{
                      root: "font-family border-round-lg h-3rem mt-2 w-full",
                    }}
                  />
                  {getFormErrorMessage(error, "phone")}
                </div>
                <div className="col-6">
                  <label htmlFor="datebirth" className="font-family">
                    Ngày sinh
                  </label>
                  <Calendar
                    showButtonBar
                    placeholder="MM/dd/yy"
                    name="date_birth"
                    id="datebirth"
                    value={dataStaff.date_birth}
                    onChange={(e) => handleChangeInputText(e)}
                    className={error.date_birth ? "p-invalid" : ""}
                    inputClassName="font-family border-round-lg"
                    pt={{
                      root: "font-family border-round-lg h-3rem mt-2 w-full",
                    }}
                  />
                  {getFormErrorMessage(error, "date_birth")}
                </div>
                <div className="col-6">
                  <label htmlFor="identification" className="font-family">
                    CMND<span className="text-red-500">(*)</span>
                  </label>
                  <InputNumber
                    placeholder="Số CMND"
                    name="identification"
                    id="identification"
                    useGrouping={false}
                    value={dataStaff.identification}
                    onChange={(e) => handleChangeInput(e, "identification")}
                    inputClassName="font-family border-round-lg"
                    className={error.identification ? "p-invalid" : ""}
                    pt={{
                      root: "font-family border-round-lg h-3rem mt-2 w-full",
                    }}
                  />
                  {getFormErrorMessage(error, "identification")}
                </div>
                <div className="col-6">
                  <label htmlFor="lastname" className="font-family">
                    Giới tính
                  </label>
                  <Dropdown
                    placeholder="--- Chọn giới tính ---"
                    name="gender"
                    id="gender"
                    options={genders}
                    value={dataStaff.gender}
                    onChange={(e) => handleChangeInput(e, "gender")}
                    className={error.gender ? "p-invalid" : ""}
                    pt={{
                      root: "h-3rem w-full align-items-center border-round-lg mt-2",
                      input: "font-family",
                      item: "font-family hover:surface-100 px-4 py-3",
                      list: "p-0 ",
                    }}
                  />
                  {getFormErrorMessage(error, "gender")}
                </div>
                <div className="col-4">
                  <label htmlFor="city" className="font-family">
                    Chọn Tỉnh/Thành Phố
                  </label>
                  <Dropdown
                    placeholder="--- Chọn Tỉnh/ Thành Phố ---"
                    options={address.city}
                    value={dataStaff.address.city}
                    optionLabel="province_name"
                    optionValue="province_id"
                    onChange={(e) => handleChangeAddress(e, "city")}
                    filter
                    className={error.catogory ? "p-invalid" : ""}
                    pt={{
                      root: "h-3rem w-full align-items-center border-round-lg mt-2",
                      input: "font-family",
                      item: "font-family hover:surface-100 px-4 py-3",
                      list: "p-0 ",
                    }}
                  />
                  <span>&nbsp;</span>
                </div>
                <div className="col-4">
                  <label htmlFor="district" className="font-family">
                    Chọn Quận/ Huyện
                  </label>
                  <Dropdown
                    placeholder="--- Chọn Quận/ Huyện ---"
                    options={address.district}
                    value={dataStaff.address.district}
                    optionLabel="district_name"
                    optionValue="district_id"
                    onChange={(e) => handleChangeAddress(e, "district")}
                    filter
                    className={error.catogory ? "p-invalid" : ""}
                    pt={{
                      root: "h-3rem w-full align-items-center border-round-lg mt-2",
                      input: "font-family",
                      item: "font-family hover:surface-100 px-4 py-3",
                      list: "p-0 ",
                    }}
                  />
                  <span>&nbsp;</span>
                </div>
                <div className="col-4">
                  <label htmlFor="ward" className="font-family">
                    Chọn Trị Trấn/ Xã
                  </label>
                  <Dropdown
                    placeholder="--- Chọn Trị Trấn/ Xã ---"
                    options={address.ward}
                    value={dataStaff.address.ward}
                    optionLabel="ward_name"
                    optionValue="ward_id"
                    onChange={(e) => handleChangeAddress(e, "ward")}
                    filter
                    className={error.catogory ? "p-invalid" : ""}
                    pt={{
                      root: "h-3rem w-full align-items-center border-round-lg mt-2",
                      input: "font-family",
                      item: "font-family hover:surface-100 px-4 py-3",
                      list: "p-0 ",
                    }}
                  />
                  <span>&nbsp;</span>
                </div>
                <div className="col-6">
                  <label htmlFor="more" className="font-family">
                    Địa chỉ cụ thể
                  </label>
                  <InputText
                    placeholder="Địa chỉ cụ thể"
                    name="more"
                    id="more"
                    value={dataStaff.address.more}
                    onChange={(e) => handleChangeAddress(e, "more")}
                    pt={{
                      root: "font-family border-round-lg h-3rem mt-2 w-full",
                    }}
                  />
                  {getFormErrorMessage(error, "more")}
                </div>
                <div className="col-6">
                  <label htmlFor="status" className="font-family">
                    Trạng thái
                  </label>
                  <Dropdown
                    placeholder="--- Chọn trạng thái ---"
                    name="status"
                    id="status"
                    options={status}
                    value={dataStaff.status}
                    onChange={(e) => handleChangeInput(e, "status")}
                    className={error.status ? "p-invalid" : ""}
                    pt={{
                      root: "h-3rem w-full align-items-center border-round-lg mt-2",
                      input: "font-family",
                      item: "font-family hover:surface-100 px-4 py-3",
                      list: "p-0 ",
                    }}
                  />
                  {getFormErrorMessage(error, "status")}
                </div>
                <div className="col-6">
                  <label htmlFor="datework" className="font-family">
                    Ngày làm việc
                  </label>
                  <Calendar
                    showButtonBar
                    placeholder="MM/dd/yy"
                    name="date_work"
                    id="datework"
                    value={dataStaff.date_work}
                    onChange={(e) => handleChangeInputText(e)}
                    className={error.date_work ? "p-invalid" : ""}
                    inputClassName="font-family border-round-lg"
                    pt={{
                      root: "font-family border-round-lg h-3rem mt-2 w-full",
                    }}
                  />
                  {getFormErrorMessage(error, "date_work")}
                </div>
                <div className="col-6">
                  <label htmlFor="role" className="font-family">
                    Chức vụ<span className="text-red-500">(*)</span>
                  </label>
                  <Dropdown
                    value={dataStaff.role}
                    options={role}
                    optionLabel="name"
                    optionValue="_id"
                    placeholder="--- Chọn chức vụ ---"
                    filter
                    onChange={(e) => handleChangeInput(e, "role")}
                    className={error.role ? "p-invalid" : ""}
                    pt={{
                      root: "h-3rem w-full align-items-center border-round-lg mt-2",
                      input: "font-family",
                      item: "font-family hover:surface-100 px-4 py-3",
                      list: "p-0 ",
                    }}
                  />
                  {getFormErrorMessage(error, "role")}
                </div>
                <div className="col-12">
                  <label htmlFor="describe" className="font-family">
                    Mô tả
                  </label>
                  <InputTextarea
                    placeholder="Mô tả"
                    name="discribe"
                    id="discribe"
                    value={dataStaff.discribe}
                    onChange={(e) => handleChangeInputText(e, "discribe")}
                    pt={{
                      root: "font-family border-round-lg mt-2 w-full",
                    }}
                  />
                </div>
                <div className="col-12">
                  <label htmlFor="content" className="font-family">
                    Nội dung
                  </label>
                  <Editor
                    id="content"
                    value={content}
                    onTextChange={(e) => setContent(e.htmlValue)}
                    style={{ height: "320px" }}
                    className={"mt-2"}
                    pt={{}}
                  />
                </div>
                <div className="col-12">
                  <ConfirmDialog
                    style={{ width: "35vw" }}
                    pt={{
                      headerTitle: "capitalize font-family",
                      content: "font-family",
                      root: "",
                    }}
                  />
                  <div className="text-right" style={{ marginTop: "7px" }}>
                    <Button
                      label="Hủy"
                      icon="pi pi-times"
                      severity="danger"
                      className="ml-2 h-3rem px-5 border-round-md font-semibold font-family"
                      onClick={confirmDelete}
                    />

                    <Button
                      label="Lưu lại"
                      icon="pi pi-check"
                      severity="success"
                      className="ml-3 h-3rem px-5 border-round-md font-semibold font-family"
                      onClick={confirmSave}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-5"></div>
          </div>
        </div>
      </div>
      <Toast
        ref={toast}
        pt={{
          content: "bg-white text-color align-items-center",
        }}
      />
      {isPending && <Loading />}
    </>
  );
}
