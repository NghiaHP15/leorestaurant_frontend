import React, { useEffect, useRef, useState } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { FileUpload } from "primereact/fileupload";
import { ProgressBar } from "primereact/progressbar";
import { Tag } from "primereact/tag";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import images from "../../../../assets/images";
import * as SupplierService from "../../../../services/SupplierService";
import * as CategoryIngridient from "../../../../services/CategoryIngridient";
import * as UploadService from "../../../../services/UploadService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { Image } from "primereact/image";
import Loading from "../../../../components/Loading";

const defaultValue = {
  name: "",
  image: [],
  price: "",
  category: null,
  unit: "",
  supplier: null,
};
const defaltError = {
  name: "",
  price: "",
  category: "",
  unit: "",
};

export default function CreateIngredient({ show, setShow, mutation }) {
  const [totalSize, setTotalSize] = useState(0);
  const [dataIngredient, setDataIngredient] = useState(defaultValue);
  const [uploadedImageUrl, setUploadedImageUrl] = useState([]);
  const [error, setError] = useState(defaltError);
  const [supplier, setSupplier] = useState(null);
  const [category, setCategory] = useState(null);
  const [loadingUpload, setLoadingUpload] = useState(false);
  const toast = useRef(null);
  const fileUploadRef = useRef(null);

  const { data, isSuccess, isPending } = mutation;

  useEffect(() => {
    if (isSuccess && data?.data) {
      onHideDialog();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, isSuccess]);

  useEffect(() => {
    const fechData = async () => {
      const [categoryResult, supplierResult] = await Promise.all([
        CategoryIngridient.listCategoryIngredient(),
        SupplierService.listSupplier(),
      ]);
      setCategory(categoryResult.data);
      setSupplier(supplierResult.data);
    };
    fechData();
  }, []);

  ///hide dialog form
  const onHideDialog = () => {
    setShow(false);
    setDataIngredient(defaultValue);
    setError(defaltError);
  };

  /// Toast message save
  const accept = () => {
    onHideDialog();
  };

  const confirmDelete = () => {
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
  };

  const confirmSave = () => {
    const _error = { ...error };
    const { name, price, category, unit } = dataIngredient;
    _error.name = name ? "" : "Vui lòng nhập tên nguyên liệu";
    _error.price = price ? "" : "Vui lòng nhập giá";
    _error.category = category ? "" : "Vui lòng chọn danh mục";
    _error.unit = unit ? "" : "Vui lòng nhập đơn vị tính";
    if (name && price && category && unit) {
      mutation.mutate(dataIngredient);
      console.log(mutation);
      console.log(dataIngredient);
    }
    setError(_error);
  };

  /// Option change image

  const handleUpload = async (event) => {
    const uploadFiles = event.files;
    const formData = new FormData();
    const _dataIngredient = { ...dataIngredient };
    uploadFiles.forEach((item) => formData.append("image", item));
    if (totalSize < 2000000) {
      setLoadingUpload(true);
      const image = await UploadService.uploadImages(formData);
      setLoadingUpload(false);
      console.log(image);
      _dataIngredient.image = image.data.imagesPath;
      setDataIngredient(_dataIngredient);
      setUploadedImageUrl(image.data.imagesPath);
    } else {
      toast.current.show({
        severity: "error",
        summary: "Lỗi tải ảnh",
        detail: `Dung lượng ảnh quá lớn`,
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

  const onTemplateSelect = (e) => {
    let _totalSize = totalSize;
    let files = e.files;

    Object.keys(files).forEach((key) => {
      _totalSize += files[key].size || 0;
    });

    setTotalSize(_totalSize);
  };

  const onTemplateUpload = (event) => {
    let _totalSize = 0;
    const uploadFiles = event.files;
    const imageUrls = uploadFiles.map((file) => ({
      url: URL.createObjectURL(file),
      name: file.name,
    }));
    const _dataIngredient = { ...dataIngredient };
    _dataIngredient.image = imageUrls;
    console.log(imageUrls);
    setDataIngredient(_dataIngredient);

    event.files.forEach((file) => {
      _totalSize += file.size || 0;
    });

    setTotalSize(_totalSize);
    toast.current.show({
      severity: "info",
      summary: "Success",
      detail: "File Uploaded",
    });
  };

  const onTemplateRemove = (file, callback) => {
    setTotalSize(totalSize - file.size);
    callback();
  };

  const onTemplateClear = () => {
    setTotalSize(0);
  };

  const headerTemplate = (options) => {
    const { className, chooseButton, cancelButton, uploadButton } = options;
    const value = totalSize / 20000;
    const formatedValue =
      fileUploadRef && fileUploadRef.current
        ? fileUploadRef.current.formatSize(totalSize)
        : "0 B";

    return (
      <div
        className={className}
        style={{
          backgroundColor: "transparent",
          display: "flex",
          alignItems: "center",
        }}
      >
        {chooseButton}
        {uploadButton}
        {cancelButton}
        <div className="flex align-items-center gap-3 ml-auto">
          <span>{formatedValue} / 2 MB</span>
          <ProgressBar
            value={value}
            showValue={false}
            style={{ width: "10rem", height: "12px" }}
          ></ProgressBar>
        </div>
      </div>
    );
  };

  const itemTemplate = (file, props) => {
    return (
      <div className="flex align-items-center justify-content-between flex-wrap">
        <div className="flex align-items-center" style={{ width: "40%" }}>
          <img
            alt={file.name}
            role="presentation"
            src={file.objectURL}
            width={100}
          />
          <span className="flex flex-column text-left ml-3">
            {file.name}
            <small>{new Date().toLocaleDateString()}</small>
          </span>
        </div>
        <div>
          <Tag
            value={props.formatSize}
            severity="warning"
            className="px-3 py-2 mr-4 text-white bg-orange-400"
          />
          <Button
            type="button"
            icon="pi pi-times"
            className="p-button-outlined p-button-rounded p-button-danger ml-auto"
            onClick={() => onTemplateRemove(file, props.onRemove)}
          />
        </div>
      </div>
    );
  };

  const emptyTemplate = () => {
    return (
      <div className="flex align-items-center flex-column">
        <i
          className="pi pi-image mt-3 p-5"
          style={{
            fontSize: "5em",
            borderRadius: "50%",
            backgroundColor: "var(--surface-b)",
            color: "var(--surface-d)",
          }}
        ></i>
        <span
          style={{ fontSize: "1.2em", color: "var(--text-color-secondary)" }}
          className="my-5"
        >
          Drag and Drop Image Here
        </span>
      </div>
    );
  };

  const chooseOptions = {
    icon: "pi pi-fw pi-images",
    className: "custom-choose-bt p-button-info font-medium font-family py-2",
    style: { height: "40px" },
  };
  const cancelOptions = {
    icon: "pi pi-fw pi-times",
    className: "custom-cancel-btn p-button-danger font-medium font-family py-2",
    style: { height: "40px" },
  };
  const uploadOptions = {
    icon: "pi pi-fw pi-cloud-upload",
    className:
      "custom-upload-btn p-button-success font-medium font-family py-2",
    style: { height: "40px" },
  };

  /// Change Input
  const handleChangeInputText = (event) => {
    const { value, name } = event.target;
    const _dataIngredient = { ...dataIngredient };
    const _error = { ...error };
    _dataIngredient[name] = value;
    _error[name] = "";
    setDataIngredient(_dataIngredient);
    setError(_error);
  };

  const handleChangeInput = (event, name) => {
    const { value } = event;
    const _dataIngredient = { ...dataIngredient };
    const _error = { ...error };
    _dataIngredient[name] = value;
    _error[name] = "";
    setDataIngredient(_dataIngredient);
    setError(_error);
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
      <Dialog
        header="Thêm nguyên liệu"
        visible={show}
        style={{ width: "90vw" }}
        onHide={() => setShow(false)}
        pt={{
          root: "p-6 border-round-2xl shadow-1 relative bg-white overflow-x-hidden",
          header: "hidden",
          content: "p-0",
        }}
      >
        <div className="overflow-hidden">
          <div className="absolute" style={{ right: "10px", top: "10px" }}>
            <Button
              text
              rounded
              severity="secondary"
              icon="pi pi-times text-lg"
              onClick={confirmDelete}
            />
          </div>
          <div className="grid">
            <div className="col-12">
              <h2 className="m-0 px-2 capitalize">Thêm nguyên liệu</h2>
            </div>
            <div className="col-8">
              <div className="col-12">
                <InputText
                  placeholder="Tên nguyên liệu"
                  name="name"
                  value={dataIngredient.name}
                  onChange={(e) => handleChangeInputText(e)}
                  className={error.name ? "p-invalid" : ""}
                  pt={{
                    root: "font-family border-round-lg h-3rem  w-full",
                  }}
                />
                {getFormErrorMessage(error, "name")}
              </div>
              <div className="col-12">
                <Toast ref={toast}></Toast>
                <FileUpload
                  ref={fileUploadRef}
                  name="image"
                  url="#"
                  multiple
                  accept="image/*"
                  maxFileSize={2000000}
                  onUpload={onTemplateUpload}
                  onSelect={onTemplateSelect}
                  onError={onTemplateClear}
                  onClear={onTemplateClear}
                  headerTemplate={headerTemplate}
                  itemTemplate={itemTemplate}
                  emptyTemplate={emptyTemplate}
                  chooseOptions={chooseOptions}
                  cancelOptions={cancelOptions}
                  uploadOptions={uploadOptions}
                  customUpload
                  uploadHandler={handleUpload}
                />
              </div>
              <div className="col-12 " style={{ minHeight: "250px" }}>
                <div className="flex flex-wrap align-items-center justify-content-center relative border-300 border-1">
                  {uploadedImageUrl?.length > 0 ? (
                    uploadedImageUrl.map((item, index) => (
                      <div className="mx-2 mb-1 mt-2" key={index}>
                        <Image
                          src={item.path}
                          alt={item.filename}
                          height="200"
                        />
                      </div>
                    ))
                  ) : (
                    <div className="flex align-items-center ">
                      <i
                        className="pi pi-image my-3 p-5"
                        style={{
                          fontSize: "5em",
                          borderRadius: "50%",
                          backgroundColor: "var(--surface-b)",
                          color: "var(--surface-d)",
                        }}
                      ></i>
                    </div>
                  )}
                  {loadingUpload && <Loading />}
                </div>
              </div>
            </div>
            <div className="col-4">
              <div className="col-12">
                <div className="border-1 surface-border border-round-lg">
                  <span className="text-900 font-bold font-family block border-bottom-1 surface-border p-3 text-color-secondary">
                    Giá nguyên liệu
                  </span>
                  <div className="p-3">
                    <InputNumber
                      inputId="integeronly"
                      value={dataIngredient.price}
                      onChange={(e) => handleChangeInput(e, "price")}
                      placeholder="Giá nguyên liệu"
                      inputClassName="font-family h-3rem border-round-md w-full"
                      className={error.price ? "p-invalid" : ""}
                      pt={{
                        root: "w-full",
                      }}
                    />
                    {getFormErrorMessage(error, "price")}
                  </div>
                </div>
              </div>
              <div className="col-12">
                <div className="border-1 surface-border border-round-lg">
                  <span className="text-900 font-bold font-family block border-bottom-1 surface-border p-3 text-color-secondary">
                    Danh mục nguyên liệu
                  </span>
                  <div className="p-3">
                    <Dropdown
                      placeholder="Chọn danh mục"
                      options={category}
                      value={dataIngredient.category}
                      optionLabel="name"
                      optionValue="_id"
                      onChange={(e) => handleChangeInput(e, "category")}
                      className={error.category ? "p-invalid" : ""}
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
                </div>
              </div>
              <div className="col-12">
                <div className="border-1 surface-border border-round-lg">
                  <span className="text-900 font-bold font-family block border-bottom-1 surface-border p-3 text-color-secondary">
                    Đơn vị tính
                  </span>
                  <div className="p-3">
                    <InputText
                      placeholder="Nhập đơn vị"
                      name="unit"
                      value={dataIngredient.unit}
                      onChange={(e) => handleChangeInputText(e)}
                      className={error.name ? "p-invalid" : ""}
                      pt={{
                        root: "font-family border-round-lg h-3rem  w-full",
                      }}
                    />
                    {getFormErrorMessage(error, "unit")}
                  </div>
                </div>
              </div>
              <div className="col-12">
                <div className="border-1 surface-border border-round-lg">
                  <span className="text-900 font-bold font-family block border-bottom-1 surface-border p-3 text-color-secondary">
                    Chọn nhà cung cấp
                  </span>
                  <div className="p-3">
                    <Dropdown
                      placeholder="Chọn nhà cung cấp"
                      options={supplier}
                      value={dataIngredient.supplier}
                      optionLabel="name"
                      optionValue="_id"
                      onChange={(e) => handleChangeInput(e, "supplier")}
                      pt={{
                        root: "h-3rem w-full align-items-center border-round-lg ",
                        input: "font-family",
                        wrapper: "border-round-lg",
                        item: "font-family hover:surface-100 px-4 py-3",
                        list: "p-0 border-round-lg",
                      }}
                    />
                    {getFormErrorMessage(error, "supplier")}
                  </div>
                </div>
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
                <div className="flex justify-content-end mt-3">
                  <Button
                    label="Hủy"
                    icon="pi pi-times"
                    severity="danger"
                    className="ml-2 h-3rem px-5 border-round-md font-semibold font-family"
                    onClick={confirmDelete}
                  />

                  <Button
                    label="Lưu lại"
                    loading={isPending}
                    icon="pi pi-check"
                    severity="success"
                    className="ml-3 h-3rem px-5 border-round-md font-semibold font-family"
                    onClick={confirmSave}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
}
