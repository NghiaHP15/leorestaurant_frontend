import React, { useEffect, useRef, useState } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { FileUpload } from "primereact/fileupload";
import { ProgressBar } from "primereact/progressbar";
import { Tag } from "primereact/tag";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import images from "../../../../assets/images";
import { Rating } from "primereact/rating";
import * as RecipeService from "../../../../services/RecipeService";
import * as CategoryFood from "../../../../services/CategoryFood";
import * as UploadService from "../../../../services/UploadService";
import * as IngredientService from "../../../../services/IngredientService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { Image } from "primereact/image";
import Loading from "../../../../components/Loading";
import { Calendar } from "primereact/calendar";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputTextarea } from "primereact/inputtextarea";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import config from "../../../../config";
import { userMutationHook } from "../../../../hooks/useMutationHook";

const defaultValue = {
  name: "",
  categoryFood: null,
  level: "",
  timeOn: "",
  unit: "",
  status: "",
  priceOrigin: "",
  priceSale: "",
  priceSell: "",
  note: "",
  image: [],
  ingredient: [],
  steps: [],
};
const defaltError = {
  name: "",
  categoryFood: "",
  unit: "",
  status: "",
};

const status = ["Hoàn thành", "Đang tiến hành", "Dự kiến"];

export default function CreateRecipe() {
  const [totalSize, setTotalSize] = useState(0);
  const [dataRecipe, setDataRecipe] = useState(defaultValue);
  const [uploadedImageUrl, setUploadedImageUrl] = useState([]);
  const [error, setError] = useState(defaltError);
  const [errorIngredient, setErrorIngredient] = useState([]);
  const [category, setCategory] = useState(null);
  const [ingredient, setIngredient] = useState(null);
  const [loadingUpload, setLoadingUpload] = useState(false);
  const navigator = useNavigate();
  const toast = useRef(null);
  const fileUploadRef = useRef(null);

  const mutation = userMutationHook((data) => RecipeService.createRecipe(data));
  const { data, isSuccess, isPending } = mutation;

  function generateUniqueCode(length = 5) {
    let key = uuidv4().substring(0, length);
    while (true) {
      const existing = dataRecipe.ingredient.find(
        // eslint-disable-next-line no-loop-func
        (item) => item.key === key
      );
      if (!existing) {
        break;
      }
      key = uuidv4().substring(0, length);
    }
    return key;
  }

  useEffect(() => {
    if (isSuccess && data?.data) {
      navigator(config.router.recipe);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, isSuccess]);

  useEffect(() => {
    const fetchData = async () => {
      const [resultsIngredient, resultsCategory] = await Promise.all([
        IngredientService.listIngredient(),
        CategoryFood.listCategoryFood(),
      ]);
      setIngredient(resultsIngredient.data);
      setCategory(resultsCategory.data);
    };
    fetchData();
  }, []);

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
    const _errorIngredient = [...errorIngredient];
    const _dataRecipe = { ...dataRecipe };
    const { name, categoryFood, unit, status, ingredient, steps } = _dataRecipe;
    _error.name = name ? "" : "Vui lòng nhập tên mặt hàng";
    _error.categoryFood = categoryFood ? "" : "Vui lòng chọn danh mục mặt hàng";
    _error.unit = unit ? "" : "Vui lòng đơn vị khẩu phần";
    _error.status = status ? "" : "Vui lòng nhập trạng thái";
    const _ingredient = ingredient.filter((item) => item._id !== "");
    const _steps = steps.filter((item) => item.description !== "");
    _ingredient.forEach((item, index) => {
      if (!item.amount) {
        _errorIngredient[index].amount = "Vui lòng nhập số lượng";
      }
    });
    _dataRecipe.ingredient = _ingredient;
    const checkIngredient = !_errorIngredient.some(
      (item) => item.amount !== "" || item._id !== ""
    );
    _dataRecipe.steps = _steps;
    if (name && status && categoryFood && unit && checkIngredient) {
      console.log(_dataRecipe);
      mutation.mutate(_dataRecipe);
    }
    setError(_error);
    setErrorIngredient(_errorIngredient);
  };

  const accept = () => {
    setDataRecipe(defaultValue);
    setUploadedImageUrl([]);
    navigator(config.router.recipe);
  };

  const handleAddRowIngredient = () => {
    const _dataRecipe = { ...dataRecipe };
    _dataRecipe.ingredient = [
      ..._dataRecipe.ingredient,
      { key: generateUniqueCode(), _id: "", amount: "", unit: "", price: "" },
    ];
    setDataRecipe(_dataRecipe);
    setErrorIngredient([...errorIngredient, { _id: "", amount: "" }]);
  };
  const handleAddRowSteps = () => {
    const _data = { ...dataRecipe };
    _data.steps = [
      ...dataRecipe.steps,
      { key: generateUniqueCode(), description: "" },
    ];
    setDataRecipe(_data);
  };
  /// Option change image

  const handleUpload = async (event) => {
    const uploadFiles = event.files;
    const formData = new FormData();
    const _dataRecipe = { ...dataRecipe };
    uploadFiles.forEach((item) => formData.append("image", item));
    if (totalSize < 2000000) {
      setLoadingUpload(true);
      const image = await UploadService.uploadImages(formData);
      setLoadingUpload(false);
      console.log(image);
      _dataRecipe.image = image.data.imagesPath;
      setDataRecipe(_dataRecipe);
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
    const _dataRecipe = { ...dataRecipe };
    _dataRecipe.image = imageUrls;
    console.log(imageUrls);
    setDataRecipe(_dataRecipe);

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
          marginTop: "8px",
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
    const _dataRecipe = { ...dataRecipe };
    const _error = { ...error };
    _dataRecipe[name] = value;
    _error[name] = "";
    setDataRecipe(_dataRecipe);
    setError(_error);
  };

  const handleChangeInput = (event, name) => {
    const { value } = event;
    const _dataRecipe = { ...dataRecipe };
    const _error = { ...error };
    _dataRecipe[name] = value;
    _error[name] = "";
    setDataRecipe(_dataRecipe);
    setError(_error);
  };

  const handleChangeInputIngredient = (event, index, field) => {
    const { value } = event;
    const result = ingredient.find((item) => item[field] === value);
    const _dataRecipe = { ...dataRecipe };
    _dataRecipe.ingredient[index][field] = value;
    _dataRecipe.ingredient[index]["unit"] = result.unit;
    _dataRecipe.ingredient[index]["price"] = result.price;
    setDataRecipe(_dataRecipe);
  };

  const handleChangeInputRow = (event, index, field) => {
    const { value } = event;
    const _errorIngredient = [...errorIngredient];
    const _dataRecipe = { ...dataRecipe };
    _dataRecipe.ingredient[index][field] = value;
    _errorIngredient[index][field] = "";
    if (field === "amount") {
      _dataRecipe.priceOrigin = _dataRecipe.ingredient.reduce(
        (prev, current) => prev + current[field] * current.price,
        0
      );
    }
    setDataRecipe(_dataRecipe);
    setErrorIngredient(_errorIngredient);
  };
  const handleChangeInputTextRow = (event, index, field) => {
    const { value } = event.target;
    const _dataRecipe = { ...dataRecipe };
    _dataRecipe.steps[index][field] = value;
    setDataRecipe(_dataRecipe);
  };

  const removeRow = (index, field) => {
    const _dataRecipe = { ...dataRecipe };
    _dataRecipe[field].splice(index, 1);
    setDataRecipe(_dataRecipe);
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

  const renderError = (field, rowIndex) => {
    return (
      <span className="text-red-500 text-xs mt-1" style={{ height: 0 }}>
        {errorIngredient[rowIndex][field]}
      </span>
    );
  };

  const actionBodyTemplate = (value, row, field) => {
    return (
      <Button
        icon="pi pi-trash"
        rounded
        outlined
        severity="danger"
        aria-label="Cancel"
        onClick={() => removeRow(row.rowIndex, field)}
      />
    );
  };

  return (
    <>
      <div className="grid">
        <div className="col-12">
          <div className="p-4 mt-4 shadow-2 bg-white border-round-xl">
            <div className="grid">
              <div className="col-12 p-3">
                <div className="grid">
                  <div className="col-4">
                    <span className="text-900 font-bold font-family text-color-secondary">
                      Tên mặt hàng:
                    </span>
                    <InputText
                      placeholder="Tên mặt hàng"
                      name="name"
                      value={dataRecipe.name}
                      onChange={(e) => handleChangeInputText(e)}
                      className={error.name ? "p-invalid" : ""}
                      pt={{
                        root: "font-family border-round-lg h-3rem mt-2 w-full",
                      }}
                    />
                    {getFormErrorMessage(error, "name")}
                  </div>
                  <div className="col-4">
                    <span className="text-900 font-bold font-family text-color-secondary">
                      Loại mặt hàng:
                    </span>
                    <Dropdown
                      placeholder="--- Chọn loại món ---"
                      name="categoryFood"
                      options={category}
                      optionLabel="name"
                      optionValue="_id"
                      value={dataRecipe.categoryFood}
                      onChange={(e) => handleChangeInput(e, "categoryFood")}
                      className={error.categoryFood ? "p-invalid" : ""}
                      pt={{
                        root: "h-3rem w-full align-items-center border-round-lg mt-2",
                        input: "font-family",
                        item: "font-family hover:surface-100 px-4 py-3",
                        list: "p-0 ",
                      }}
                    />
                    {getFormErrorMessage(error, "categoryFood")}
                  </div>

                  <div className="col-4">
                    <span className="text-900 font-bold font-family text-color-secondary">
                      Thời gian chuẩn bị:
                    </span>
                    <Calendar
                      value={dataRecipe.timeOn}
                      placeholder="Thời gian chuẩn bị"
                      onChange={(e) => handleChangeInput(e, "timeOn")}
                      timeOnly
                      inputClassName="border-round-lg font-family"
                      pt={{
                        root: "font-family h-3rem mt-2 w-full",
                      }}
                    />
                    {getFormErrorMessage(error, "timeOn")}
                  </div>

                  <div className="col-4">
                    <span className="text-900 font-bold font-family text-color-secondary">
                      Khẩu phần:
                    </span>
                    <InputText
                      placeholder="Đơn vị khẩu phần"
                      name="unit"
                      value={dataRecipe.unit}
                      onChange={(e) => handleChangeInputText(e)}
                      className={error.unit ? "p-invalid" : ""}
                      pt={{
                        root: "font-family border-round-lg h-3rem mt-2 w-full",
                      }}
                    />
                    {getFormErrorMessage(error, "unit")}
                  </div>
                  <div className="col-4">
                    <span className="text-900 font-bold font-family text-color-secondary">
                      Trạng thái:
                    </span>
                    <Dropdown
                      placeholder="--- Chọn trạng thái ---"
                      name="status"
                      options={status}
                      value={dataRecipe.status}
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
                  <div className="col-4">
                    <span className="text-900 font-bold font-family text-color-secondary">
                      Giá vốn:
                    </span>
                    <InputNumber
                      value={dataRecipe.priceOrigin}
                      onChange={(e) => handleChangeInput(e, "price")}
                      placeholder="Đơn giá vốn"
                      suffix="VND"
                      disabled
                      inputClassName="font-family mt-2 h-3rem border-round-md w-full"
                      pt={{
                        root: "w-full",
                      }}
                    />
                    {getFormErrorMessage(error, "price")}
                  </div>
                  <div className="col-4">
                    <span className="text-900 font-bold font-family text-color-secondary">
                      Giá bán
                    </span>
                    <InputNumber
                      value={dataRecipe.priceSale}
                      onChange={(e) => handleChangeInput(e, "priceSale")}
                      placeholder="Đơn giá bán"
                      suffix="VND"
                      inputClassName="font-family mt-2 h-3rem border-round-md w-full"
                      pt={{
                        root: "w-full",
                      }}
                    />
                    {getFormErrorMessage(error, "priceSale")}
                  </div>
                  <div className="col-4">
                    <span className="text-900 font-bold font-family text-color-secondary">
                      Giá khuyến mãi
                    </span>
                    <InputNumber
                      value={dataRecipe.priceSell}
                      placeholder="Đơn giá khuyến mãi"
                      suffix="VND"
                      onChange={(e) => handleChangeInput(e, "priceSell")}
                      inputClassName="font-family mt-2 h-3rem border-round-md w-full"
                      pt={{
                        root: "w-full",
                      }}
                    />
                    {getFormErrorMessage(error, "priceSell")}
                  </div>

                  <div className="col-4">
                    <span className="text-900 font-bold font-family text-color-secondary">
                      Mức độ khó:
                    </span>
                    <div className="card flex align-items-center h-3rem">
                      <Rating
                        value={dataRecipe.level}
                        onChange={(e) => handleChangeInput(e, "level")}
                        cancel={false}
                        className="mt-2"
                      />
                    </div>
                    {getFormErrorMessage(error, "price")}
                  </div>
                </div>
              </div>
              <div className="col-12 p-3">
                <div className="flex justify-content-between align-items-center w-full mb-3">
                  <span className="text-900 font-bold font-family text-color-secondary">
                    Nguyên liệu:
                  </span>
                  <Button
                    label="Thêm nguyên liệu"
                    severity="info"
                    icon="pi pi-plus"
                    onClick={handleAddRowIngredient}
                  />
                </div>
                <DataTable
                  value={dataRecipe.ingredient}
                  className="font-family"
                  dataKey="key"
                >
                  <Column
                    header="Tên nguyên liệu"
                    field="_id"
                    body={(value, row) => {
                      return (
                        <div className="flex flex-column">
                          <Dropdown
                            placeholder="--- Chọn nguyên liệu ---"
                            name="ingredient"
                            options={ingredient}
                            value={value._id}
                            filter
                            optionLabel="name"
                            optionValue="_id"
                            onChange={(e) =>
                              handleChangeInputIngredient(
                                e,
                                row.rowIndex,
                                row.field
                              )
                            }
                            pt={{
                              root: "h-3rem w-full align-items-center border-round-lg",
                              input: "font-family",
                              item: "font-family hover:surface-100 px-4 py-3",
                              list: "p-0 ",
                            }}
                          />
                          {renderError(row.field, row.rowIndex)}
                        </div>
                      );
                    }}
                  ></Column>
                  <Column
                    field="amount"
                    header="Số lượng"
                    body={(value, row) => {
                      return (
                        <div className="flex flex-column">
                          <InputNumber
                            value={value.amount}
                            placeholder="Số lượng"
                            onChange={(e) =>
                              handleChangeInputRow(e, row.rowIndex, row.field)
                            }
                            inputClassName="font-family h-3rem border-round-md w-full"
                            pt={{
                              root: "w-full",
                            }}
                          />
                          {renderError(row.field, row.rowIndex)}
                        </div>
                      );
                    }}
                  ></Column>
                  <Column
                    field="unit"
                    header="Đơn vị"
                    body={(value, row) => {
                      return (
                        <div className="flex flex-column">
                          <InputText
                            className="h-3rem"
                            placeholder="Đơn vị"
                            value={value.unit}
                            disabled
                          />
                          {renderError(row.field, row.rowIndex)}
                        </div>
                      );
                    }}
                  ></Column>
                  <Column
                    field="price"
                    header="Giá"
                    body={(value, row) => {
                      return (
                        <div className="flex flex-column">
                          <InputText
                            className="h-3rem"
                            placeholder="Giá tiền"
                            value={value.price}
                            disabled
                          />
                          {renderError(row.field, row.rowIndex)}
                        </div>
                      );
                    }}
                  ></Column>
                  <Column
                    exportable={false}
                    body={(value, row) =>
                      actionBodyTemplate(value, row, "ingredient")
                    }
                  />
                </DataTable>
              </div>
              <div className="col-6 p-3">
                <div className="flex justify-content-between align-items-center w-full mb-3">
                  <span className="text-900 font-bold font-family text-color-secondary">
                    Các bước:
                  </span>
                  <Button
                    severity="info"
                    rounded
                    icon="pi pi-plus"
                    onClick={handleAddRowSteps}
                  />
                </div>
                <DataTable
                  value={dataRecipe.steps}
                  className="font-family"
                  dataKey="key"
                >
                  <Column
                    header="Các bước"
                    body={(value, row) => {
                      return <span>Bước {row.rowIndex + 1}</span>;
                    }}
                  ></Column>
                  <Column
                    header="Mô tả"
                    field="description"
                    value={dataRecipe.steps}
                    body={(value, row) => {
                      return (
                        <div className="flex flex-column">
                          <InputTextarea
                            value={value.description}
                            rows={2}
                            cols={30}
                            onChange={(e) =>
                              handleChangeInputTextRow(
                                e,
                                row.rowIndex,
                                row.field
                              )
                            }
                            pt={{
                              root: "font-family border-round-lg mt-2 w-full",
                            }}
                          />
                        </div>
                      );
                    }}
                  ></Column>
                  <Column
                    exportable={false}
                    body={(value, row) =>
                      actionBodyTemplate(value, row, "steps")
                    }
                  />
                </DataTable>
              </div>
              <div className="col-6 p-3">
                <span className="text-900 font-bold font-family text-color-secondary">
                  Ghi chú thêm:
                </span>
                <InputTextarea
                  placeholder="Mô tả"
                  name="note"
                  rows={5}
                  cols={30}
                  value={dataRecipe.note}
                  onChange={(e) => handleChangeInputText(e, "note")}
                  pt={{
                    root: "font-family border-round-lg mt-2 w-full",
                  }}
                />
              </div>
              <div className="col-12 p-3">
                <span className="text-900 font-bold font-family text-color-secondary mb-3">
                  Hình ảnh minh họa:
                </span>
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
                <div className="flex flex-wrap align-items-center justify-content-center relative border-300 border-1 mt-2">
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
              <div className="col-12 p-3 text-right">
                <ConfirmDialog
                  style={{ width: "35vw" }}
                  pt={{
                    headerTitle: "capitalize font-family",
                    content: "font-family",
                    root: "",
                  }}
                />
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
                  loading={isPending}
                  className="ml-3 h-3rem px-5 border-round-md font-semibold font-family"
                  onClick={confirmSave}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
