import React, { useEffect, useState } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import images from "../../../assets/images";
import { userMutationHook } from "../../../hooks/useMutationHook";
import { Skeleton } from "primereact/skeleton";
import Loading from "../../../components/Loading";
import * as Address from "../../../services/AdressService";
import * as RoleService from "../../../services/RoleService";
import * as StaffService from "../../../services/StaffService";
import * as UploadService from "../../../services/UploadService";
import * as UserService from "../../../services/UserService";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { InputNumber } from "primereact/inputnumber";
import config from "../../../config";
import { useNavigate, useLocation } from "react-router-dom";
import { Avatar } from "primereact/avatar";
import { FileUpload } from "primereact/fileupload";
import { InputTextarea } from "primereact/inputtextarea";
import LoadingInputLable from "../../../components/Loading/LoadingInputLable";
import { Editor } from "primereact/editor";
import LoadingButton from "../../../components/Loading/LoadingButton";
import LoadingText from "../../../components/Loading/LoadingText";

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
    detail: "",
  },
  date_work: "",
  role: "",
  discribe: "",
  content: "",
  account: {
    _id: "",
  },
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

function ProfileEmployee() {
  const [dataStaff, setDataStaff] = useState(defaultStaff);
  const [city, setCity] = useState([]);
  const [district, setDistrict] = useState([]);
  const [ward, setWard] = useState([]);
  const [role, setRole] = useState();
  const [user, setUser] = useState();
  const [error, setError] = useState(defaltError);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const navigator = useNavigate();
  const location = useLocation();

  const mutation = userMutationHook((data) =>
    StaffService.editStaff(data._id, data)
  );
  const { data, isSuccess, isPending } = mutation;

  useEffect(() => {
    if (location.state.id) {
      const { id } = location.state;
      const fetchData = async () => {
        setLoading(true);
        const [staffResult, roleResult, userResult] = await Promise.all([
          StaffService.detailStaff(id),
          RoleService.listRole(),
          UserService.getAllUser(),
        ]);
        setLoading(false);
        setDataStaff(staffResult.data);
        setContent(staffResult.data.content);
        setUploadedImageUrl(staffResult.data.image);
        setRole(roleResult.data);
        setUser(userResult.data);
      };
      fetchData();
    } else {
      navigator("/admin/employee");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      setCity(response.results);
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
      setDistrict(response.results);
    };
    dataStaff.address.city && fetchPublicDistrict();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataStaff.address.city]);

  // ///Ward
  useEffect(() => {
    const fetchPublicWard = async () => {
      const response = await Address.apiGetProvincesWard(
        dataStaff.address.district
      );
      setWard(response.results);
    };
    dataStaff.address.district && fetchPublicWard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataStaff.address.district]);

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
      console.log(_dataStaff);
      mutation.mutate(_dataStaff);
    }
    setError(_error);
  };

  /// Change Input
  const handleChangeInputText = (event) => {
    const { value, name } = event.target;
    setDataStaff((prevState) => ({ ...prevState, [name]: value }));
    setError((prevState) => ({ ...prevState, [name]: "" }));
  };

  const handleChangeInput = (event, name) => {
    const { value } = event;
    setDataStaff((prevState) => ({ ...prevState, [name]: value }));
    setError((prevState) => ({ ...prevState, [name]: "" }));
  };

  const handleChangeAcount = (event, name) => {
    const { value } = event;
    const _dataStaff = { ...dataStaff };
    _dataStaff.account[name] = value;
    setDataStaff(_dataStaff);
  };

  const handleChangeAddress = (event, name) => {
    const { value } = event.target ? event.target : event;
    const _dataStaff = { ...dataStaff };
    _dataStaff.address[name] = value;
    setDataStaff(_dataStaff);
  };

  const handleSeletUpload = async (event) => {
    const file = event.files[0];
    const formData = new FormData();
    const _dataStaff = { ...dataStaff };
    formData.append("image", file);
    setLoadingUpload(true);
    const image = await UploadService.uploadImage(formData);
    _dataStaff.image = image.data.imagePath;
    setDataStaff(_dataStaff);
    setLoadingUpload(false);
    setUploadedImageUrl(image.data.imagePath);
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
                  {loading ? (
                    <Skeleton shape="circle" size="200px"></Skeleton>
                  ) : (
                    <Avatar
                      image={uploadedImageUrl || images.avatarDefault}
                      shape="circle"
                      style={{ height: "auto", width: "200px" }}
                      className="p-2 shadow-2"
                    />
                  )}
                  {loadingUpload && <Loading />}
                </div>
                <div className="flex align-items-center mt-4">
                  <LoadingButton
                    loading={loading}
                    width={"120px"}
                    height={"40px"}
                  >
                    <FileUpload
                      mode="basic"
                      name="image"
                      url="#"
                      accept="image/*"
                      auto
                      onSelect={handleSeletUpload}
                      maxFileSize={1000000}
                      chooseLabel="Chọn ảnh"
                      className="text-white"
                      pt={{
                        chooseButton: "bg-orange-500",
                        chooseButtonLabel: "text-white",
                      }}
                    />
                  </LoadingButton>
                </div>
                <div className="mt-4 flex flex-column align-items-center">
                  <LoadingText
                    loading={loading}
                    width={"150px"}
                    height={"1rem"}
                  >
                    <span className="font-light text-500 font-family">
                      Dung lượng tối đa 1MB
                    </span>
                  </LoadingText>
                  <LoadingText
                    loading={loading}
                    width={"130px"}
                    height={"1rem"}
                    className={"mt-2"}
                  >
                    <span className="font-light text-500 font-family mt-1">
                      Định dạng :.JPG,.PNG
                    </span>
                  </LoadingText>
                  <LoadingText
                    loading={loading}
                    width={"180px"}
                    height={"1rem"}
                    className={"mt-2"}
                  >
                    <span className="font-light text-500 font-family mt-1">
                      Nên sử dụng hình ảnh có tỷ lệ 1:1
                    </span>
                  </LoadingText>
                </div>
              </div>
              <div className="mt-5 font-family">
                <div className="grid align-items-center"></div>
              </div>
            </div>
            <div className="p-4 mt-4 shadow-2 bg-white border-round-xl">
              <div className="grid">
                <div className="col-12">
                  <LoadingText
                    loading={loading}
                    width={"100px"}
                    height={"20px"}
                  >
                    <h3 className="m-0 text-orange-500">Tài khoản </h3>
                  </LoadingText>
                </div>
                <div className="col-12">
                  <LoadingInputLable loading={loading}>
                    <label htmlFor="account" className="font-family">
                      Chọn tài khoản<span className="text-red-500">(*)</span>
                    </label>
                    <Dropdown
                      value={dataStaff.account?._id}
                      options={user}
                      optionLabel="email"
                      optionValue="_id"
                      placeholder="--- Chọn tài khoản ---"
                      filter
                      onChange={(e) => handleChangeAcount(e, "_id")}
                      className={error.account ? "p-invalid" : ""}
                      pt={{
                        root: "h-3rem w-full align-items-center border-round-lg mt-2",
                        input: "font-family",
                        item: "font-family hover:surface-100 px-4 py-3",
                        list: "p-0 ",
                      }}
                    />
                    {getFormErrorMessage(error, "account")}
                  </LoadingInputLable>
                </div>
              </div>
            </div>
          </div>
          <div className="col-8">
            <div className="p-6 mt-4 shadow-2 bg-white border-round-xl">
              <div className="grid p-1">
                <div className="col-12">
                  <LoadingText
                    loading={loading}
                    width={"200px"}
                    height={"20px"}
                  >
                    <h3 className="m-0 text-orange-500 font-family">
                      Thông tin người dùng
                    </h3>
                  </LoadingText>
                </div>
                <div className="col-6">
                  <LoadingInputLable loading={loading}>
                    <label htmlFor="name" className="font-family">
                      Họ và tên
                      <span className="text-red-500">(*)</span>
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
                  </LoadingInputLable>
                </div>
                <div className="col-6">
                  <LoadingInputLable loading={loading}>
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
                  </LoadingInputLable>
                </div>
                <div className="col-6">
                  <LoadingInputLable loading={loading}>
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
                  </LoadingInputLable>
                </div>
                <div className="col-6">
                  <LoadingInputLable loading={loading}>
                    <label htmlFor="datebirth" className="font-family">
                      Ngày sinh
                    </label>
                    <Calendar
                      showButtonBar
                      placeholder="dd/mm/yy"
                      name="date_birth"
                      id="datebirth"
                      dateFormat="dd/mm/yy"
                      value={new Date(dataStaff.date_birth)}
                      onChange={(e) => handleChangeInputText(e)}
                      pt={{
                        root: "font-family border-round-lg h-3rem mt-2 w-full",
                      }}
                    />
                  </LoadingInputLable>
                </div>
                <div className="col-6">
                  <LoadingInputLable loading={loading}>
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
                      className={error.identification ? "p-invalid" : ""}
                      pt={{
                        root: "font-family border-round-lg h-3rem mt-2 w-full",
                      }}
                    />
                    {getFormErrorMessage(error, "identification")}
                  </LoadingInputLable>
                </div>
                <div className="col-6">
                  <LoadingInputLable loading={loading}>
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
                      pt={{
                        root: "h-3rem w-full align-items-center border-round-lg mt-2",
                        input: "font-family",
                        item: "font-family hover:surface-100 px-4 py-3",
                        list: "p-0",
                      }}
                    />
                  </LoadingInputLable>
                </div>
                <div className="col-4">
                  <LoadingInputLable loading={loading}>
                    <label htmlFor="city" className="font-family">
                      Chọn Tỉnh/Thành Phố
                    </label>
                    <Dropdown
                      placeholder="--- Chọn Tỉnh/ Thành Phố ---"
                      options={city}
                      value={dataStaff.address.city}
                      optionLabel="province_name"
                      optionValue="province_id"
                      onChange={(e) => handleChangeAddress(e, "city")}
                      filter
                      pt={{
                        root: "h-3rem w-full align-items-center border-round-lg mt-2",
                        input: "font-family",
                        wrapper: "border-round-lg",
                        item: "font-family hover:surface-100 px-4 py-3",
                        list: "p-0 border-round-lg",
                      }}
                    />
                    <span>&nbsp;</span>
                  </LoadingInputLable>
                </div>
                <div className="col-4">
                  <LoadingInputLable loading={loading}>
                    <label htmlFor="district" className="font-family">
                      Chọn Quận/ Huyện
                    </label>
                    <Dropdown
                      placeholder="--- Chọn Quận/ Huyện ---"
                      options={district}
                      value={dataStaff.address.district}
                      optionLabel="district_name"
                      optionValue="district_id"
                      onChange={(e) => handleChangeAddress(e, "district")}
                      filter
                      pt={{
                        root: "h-3rem w-full align-items-center border-round-lg mt-2",
                        input: "font-family",
                        wrapper: "border-round-lg",
                        item: "font-family hover:surface-100 px-4 py-3",
                        list: "p-0 border-round-lg",
                      }}
                    />
                    <span>&nbsp;</span>
                  </LoadingInputLable>
                </div>
                <div className="col-4">
                  <LoadingInputLable loading={loading}>
                    <label htmlFor="ward" className="font-family">
                      Chọn Trị Trấn/ Xã
                    </label>
                    <Dropdown
                      placeholder="--- Chọn Trị Trấn/ Xã ---"
                      options={ward}
                      value={dataStaff.address.ward}
                      optionLabel="ward_name"
                      optionValue="ward_id"
                      onChange={(e) => handleChangeAddress(e, "ward")}
                      filter
                      pt={{
                        root: "h-3rem w-full align-items-center border-round-lg mt-2",
                        input: "font-family",
                        wrapper: "border-round-lg",
                        item: "font-family hover:surface-100 px-4 py-3",
                        list: "p-0 border-round-lg",
                      }}
                    />
                    <span>&nbsp;</span>
                  </LoadingInputLable>
                </div>
                <div className="col-6">
                  <LoadingInputLable loading={loading}>
                    <label htmlFor="detail" className="font-family">
                      Địa chỉ cụ thể
                    </label>
                    <InputText
                      placeholder="Địa chỉ cụ thể"
                      id="detail"
                      value={dataStaff.address.detail}
                      onChange={(e) => handleChangeAddress(e, "detail")}
                      pt={{
                        root: "font-family border-round-lg h-3rem mt-2 w-full",
                      }}
                    />
                    {getFormErrorMessage(error, "detail")}
                  </LoadingInputLable>
                </div>
                <div className="col-6">
                  <LoadingInputLable loading={loading}>
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
                  </LoadingInputLable>
                </div>
                <div className="col-6">
                  <LoadingInputLable loading={loading}>
                    <label htmlFor="datework" className="font-family">
                      Ngày làm việc
                    </label>
                    <Calendar
                      showButtonBar
                      placeholder="dd/mm/yy"
                      dateFormat={"dd/mm/yy"}
                      name="date_work"
                      id="datework"
                      value={new Date(dataStaff.date_work)}
                      onChange={(e) => handleChangeInputText(e)}
                      pt={{
                        root: "font-family border-round-lg h-3rem mt-2 w-full",
                      }}
                    />
                  </LoadingInputLable>
                </div>
                <div className="col-6">
                  <LoadingInputLable loading={loading}>
                    <label htmlFor="role" className="font-family">
                      Chức vụ<span className="text-red-500">(*)</span>
                    </label>
                    <Dropdown
                      value={dataStaff.role._id}
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
                  </LoadingInputLable>
                </div>
                <div className="col-12">
                  <LoadingInputLable loading={loading}>
                    <label htmlFor="describe" className="font-family">
                      Mô tả
                    </label>
                    <InputTextarea
                      placeholder="Mô tả"
                      name="discribe"
                      id="describe"
                      value={dataStaff.discribe}
                      onChange={(e) => handleChangeInputText(e)}
                      pt={{
                        root: "font-family border-round-lg mt-2 w-full",
                      }}
                    />
                  </LoadingInputLable>
                </div>
                <div className="col-12">
                  <LoadingInputLable loading={loading}>
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
                  </LoadingInputLable>
                </div>

                <div className="col-12 ">
                  <ConfirmDialog
                    style={{ width: "35vw" }}
                    pt={{
                      headerTitle: "capitalize font-family",
                      content: "font-family",
                      root: "",
                    }}
                  />
                  <div className="flex justify-content-end">
                    <LoadingButton
                      loading={loading}
                      width={"100px"}
                      height={"40px"}
                      className="mr-2"
                    >
                      <Button
                        label="Hủy"
                        icon="pi pi-times"
                        severity="danger"
                        className="ml-2 h-3rem px-5 border-round-md font-semibold font-family"
                        onClick={confirmDelete}
                      />
                    </LoadingButton>
                    <LoadingButton
                      loading={loading}
                      width={"100px"}
                      height={"40px"}
                    >
                      <Button
                        label="Lưu lại"
                        icon="pi pi-check"
                        severity="success"
                        className="ml-3 h-3rem px-5 border-round-md font-semibold font-family"
                        onClick={confirmSave}
                      />
                    </LoadingButton>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-5"></div>
          </div>
        </div>
      </div>
      {isPending && <Loading />}
    </>
  );
}

export default ProfileEmployee;
