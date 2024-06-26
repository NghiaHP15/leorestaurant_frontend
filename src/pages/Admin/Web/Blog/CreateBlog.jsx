/* eslint-disable no-useless-escape */
import React, { useEffect, useRef, useState } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { ConfirmDialog } from "primereact/confirmdialog";
import images from "../../../../assets/images";
import { userMutationHook } from "../../../../hooks/useMutationHook";
import * as UploadService from "../../../../services/UploadService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-regular-svg-icons";
import { Toast } from "primereact/toast";
import Loading from "../../../../components/Loading";
import * as CustomerService from "../../../../services/CustomerService";
import * as BlogService from "../../../../services/BlogService";
import { Dropdown } from "primereact/dropdown";
import { Avatar } from "primereact/avatar";
import { FileUpload } from "primereact/fileupload";
import { faCloudArrowUp } from "@fortawesome/free-solid-svg-icons";
import { InputTextarea } from "primereact/inputtextarea";
import { Editor } from "primereact/editor";

const defaultBlog = {
  name: "",
  customer: null,
  description: "",
};

const defaltError = {
  name: "",
};

export default function CreateBlog() {
  const [dataBlog, setDataBlog] = useState(defaultBlog);
  const [customer, setCustomer] = useState([]);
  const [error, setError] = useState(defaltError);
  const [content, setContent] = useState("");
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [loadingUpload, setLoadingUpload] = useState(false);
  const toast = useRef(null);

  const mutation = userMutationHook((data) => BlogService.createBlog(data));
  const { data, isPending, isSuccess } = mutation;

  useEffect(() => {
    if (isSuccess && data?.data) {
      toast.current.show({
        severity: "success",
        summary: "Thành công",
        detail: `Thêm bài blog ${data.data.name} thành công`,
        icon: (
          <FontAwesomeIcon
            icon={faCircleCheck}
            className="text-green-500 h-2rem"
          />
        ),
        life: 3000,
      });
      setDataBlog(defaultBlog);
      setError(defaltError);
      setUploadedImageUrl("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, isSuccess]);

  useEffect(() => {
    const fetchData = async () => {
      const [resultCustomer] = await Promise.all([
        CustomerService.listCustomer(),
      ]);
      setCustomer(resultCustomer.data);
    };
    fetchData();
  }, []);

  const confirmSave = () => {
    const _error = { ...error };
    const { name } = dataBlog;
    _error.name = name ? "" : "Vui lòng nhập tên tiêu đề";
    if (name) {
      const _dataBlog = { ...dataBlog };
      _dataBlog.content = content;
      console.log(_dataBlog);
      mutation.mutate(_dataBlog);
    }
    setError(_error);
  };

  const categoryBlog = [
    { name: "Bài viết cộng đồng" },
    { name: "Bài viết khuyến mãi" },
    { name: "Bài viết đánh giá" },
  ];

  /// Change Input
  const handleChangeInputText = (event) => {
    const { value, name } = event.target;
    const _dataBlog = { ...dataBlog };
    const _error = { ...error };
    _dataBlog[name] = value;
    _error[name] = "";
    setDataBlog(_dataBlog);
    setError(_error);
  };
  const handleChangeInput = (event, name) => {
    const { value } = event;
    console.log(value);
    const _dataBlog = { ...dataBlog };
    const _error = { ...error };
    _dataBlog[name] = value;
    _error[name] = "";
    setDataBlog(_dataBlog);
    setError(_error);
  };

  const handleSeletUpload = async (event) => {
    const file = event.files[0];
    if (file) {
      const formData = new FormData();
      const _dataBlog = { ...dataBlog };
      formData.append("image", file);
      setLoadingUpload(true);
      console.log(formData);
      const image = await UploadService.uploadImage(formData);
      _dataBlog.image = image.data.imagePath;
      setDataBlog(_dataBlog);
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
              <FileUpload
                mode="basic"
                name="image"
                url="#"
                accept="image/*"
                auto
                onSelect={handleSeletUpload}
                maxFileSize={1000000}
                chooseLabel="Chọn ảnh"
                chooseOptions={{
                  className:
                    "bg-blue-400 text-white border-none text-lg font-semibold font-family",
                  icon: (
                    <FontAwesomeIcon
                      icon={faCloudArrowUp}
                      className="text-white mr-2"
                    />
                  ),
                }}
                className="text-white"
                pt={{
                  chooseButton: "bg-orange-500 ",
                  chooseButtonLabel: "text-white",
                }}
              />
              <div className="relative">
                {uploadedImageUrl ? (
                  <Avatar
                    image={uploadedImageUrl}
                    style={{ height: "auto", width: "100%" }}
                    className="mt-3 p-4 border-2 border-300 border-dashed border-round-md"
                  />
                ) : (
                  <div className="mt-3 p-4 flex align-items-center justify-content-center border-2 border-300 border-dashed border-round-md">
                    <Avatar
                      image={images.uploadImage}
                      style={{ width: "200px", height: "auto" }}
                      className={`p-4 opacity-50`}
                    />
                  </div>
                )}

                {loadingUpload && <Loading />}
              </div>
            </div>
          </div>

          <div className="col-8">
            <div className="p-5 mt-4 shadow-2 bg-white border-round-xl">
              <div className="grid p-1">
                <div className="col-12">
                  <h3 className="m-0 text-orange-500 font-family">
                    Tạo bài viết mới
                  </h3>
                </div>
                <div className="col-6">
                  <label
                    htmlFor="name"
                    className="text-900 font-bold font-family text-color-secondary"
                  >
                    Tên tiêu đề bài viết
                    <span className="text-red-500">(*)</span>
                  </label>
                  <InputText
                    placeholder="Tên thực đơn"
                    name="name"
                    id="name"
                    value={dataBlog.name}
                    onChange={(e) => handleChangeInputText(e)}
                    className={error.name ? "p-invalid" : ""}
                    pt={{
                      root: "font-family border-round-lg h-3rem mt-2 w-full",
                    }}
                  />
                  {getFormErrorMessage(error, "name")}
                </div>
                <div className="col-6">
                  <label
                    htmlFor="customer"
                    className="text-900 font-bold font-family text-color-secondary"
                  >
                    Danh mục bài viết
                  </label>
                  <Dropdown
                    placeholder="Chọn danh mục"
                    options={categoryBlog}
                    value={dataBlog.categoryBlog}
                    optionValue="name"
                    optionLabel="name"
                    onChange={(e) => handleChangeInput(e, "categoryBlog")}
                    pt={{
                      root: "h-3rem w-full align-items-center border-round-lg ",
                      input: "font-family",
                      wrapper: "border-round-lg",
                      item: "font-family hover:surface-100 px-4 py-3",
                      list: "p-0 border-round-lg",
                    }}
                  />
                  {getFormErrorMessage(error, "category")}
                </div>
                <div className="col-12">
                  <label
                    htmlFor="description"
                    className="text-900 font-bold font-family text-color-secondary"
                  >
                    Danh mục bài viết
                  </label>
                  <Dropdown
                    placeholder="Mô tả"
                    name="description"
                    id="description"
                    value={dataBlog.description}
                    onChange={(e) => handleChangeInputText(e, "description")}
                    rows={5}
                    cols={30}
                    pt={{
                      root: "font-family border-round-lg mt-2 w-full",
                    }}
                  />
                  {getFormErrorMessage(error, "name")}
                </div>
                <div className="col-12">
                  <label
                    htmlFor="description"
                    className="text-900 font-bold font-family text-color-secondary"
                  >
                    Mô tả
                  </label>
                  <InputTextarea
                    placeholder="Mô tả"
                    name="description"
                    id="description"
                    value={dataBlog.description}
                    onChange={(e) => handleChangeInputText(e, "description")}
                    rows={5}
                    cols={30}
                    pt={{
                      root: "font-family border-round-lg mt-2 w-full",
                    }}
                  />
                  {getFormErrorMessage(error, "name")}
                </div>
                <div className="col-12">
                  <label
                    htmlFor="name"
                    className="text-900 font-bold font-family text-color-secondary"
                  >
                    Nội dung
                  </label>
                  <Editor
                    id="content"
                    value={content}
                    onTextChange={(e) => setContent(e.htmlValue)}
                    style={{ height: "320px" }}
                    className={"mt-2"}
                  />
                  {getFormErrorMessage(error, "name")}
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
                      label="Lưu lại"
                      icon="pi pi-check"
                      loading={isPending}
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
    </>
  );
}
