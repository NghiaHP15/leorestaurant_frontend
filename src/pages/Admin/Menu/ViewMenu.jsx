/* eslint-disable no-useless-escape */
import React, { useEffect, useRef, useState } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { ConfirmDialog } from "primereact/confirmdialog";
import images from "../../../assets/images";
import { userMutationHook } from "../../../hooks/useMutationHook";
import * as UploadService from "../../../services/UploadService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-regular-svg-icons";
import { Toast } from "primereact/toast";
import Loading from "../../../components/Loading";
import * as CategoryFood from "../../../services/CategoryFood";
import * as RecipeService from "../../../services/RecipeService";
import * as MenuSevice from "../../../services/MenuSevice";
import { Dropdown } from "primereact/dropdown";
import { useLocation, useNavigate } from "react-router-dom";
import { Avatar } from "primereact/avatar";
import { FileUpload } from "primereact/fileupload";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Image } from "primereact/image";
import { Dialog } from "primereact/dialog";
import { FilterMatchMode } from "primereact/api";
import config from "../../../config";
import { Skeleton } from "primereact/skeleton";
import LoadingButton from "../../../components/Loading/LoadingButton";
import LoadingText from "../../../components/Loading/LoadingText";
import LoadingInputLable from "../../../components/Loading/LoadingInputLable";

const defaultMenu = {
  name: "",
  count: "",
  item: [],
};

const defaltError = {
  name: "",
};

export default function ViewMenu() {
  const [dataMenu, setDataMenu] = useState(defaultMenu);
  const [error, setError] = useState(defaltError);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [selectedValues, setSelectedValue] = useState(null);
  const [recipe, setRecipe] = useState([]);
  const [nameFilterValue, setNameFilterValue] = useState("");
  const [categoryFood, setCategoryFood] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectCategoryFood, setSelectCategoryFood] = useState(null);
  const toast = useRef(null);
  const location = useLocation();
  const [filters, setFilters] = useState({
    name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    "categoryFood._id": { value: null, matchMode: FilterMatchMode.EQUALS },
  });

  const mutation = userMutationHook((data) =>
    MenuSevice.editMenu(data._id, data)
  );
  const { data, isPending, isSuccess } = mutation;

  useEffect(() => {
    if (location.state?.id) {
      const { id } = location.state;
      const fetchData = async () => {
        setLoading(true);
        const [menuResult] = await Promise.all([MenuSevice.detailMenu(id)]);
        setDataMenu(menuResult.data);
        setSelectedValue(menuResult.data.item);
        setUploadedImageUrl(menuResult.data.image);
        setLoading(false);
      };
      fetchData();
    } else {
      navigator(config.router.menu);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isSuccess && data?.data) {
      toast.current.show({
        severity: "success",
        summary: "Thành công",
        detail: `Sửa thực đơn ${data.data.name} thành công`,
        icon: (
          <FontAwesomeIcon
            icon={faCircleCheck}
            className="text-green-500 h-2rem"
          />
        ),
        life: 3000,
      });
      setError(defaltError);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, isSuccess]);

  useEffect(() => {
    const fetchData = async () => {
      const [resultFood, resultCategoryFood] = await Promise.all([
        RecipeService.listRecipe(),
        CategoryFood.listCategoryFood(),
      ]);
      setRecipe(resultFood.data);
      const dataCategoryFood = [
        { _id: "", name: "Mặc định" },
        ...resultCategoryFood.data,
      ];
      setCategoryFood(dataCategoryFood);
    };
    fetchData();
  }, []);

  const confirmSave = () => {
    const _error = { ...error };
    const { name, item } = dataMenu;
    _error.name = name ? "" : "Vui lòng nhập tên thưc đơn";
    item.length === 0 &&
      toast.current.show({
        severity: "error",
        summary: "Lỗi",
        detail: `Vui lòng chọn món`,
        icon: (
          <FontAwesomeIcon
            icon={faCircleCheck}
            className="text-red-500 h-2rem"
          />
        ),
        life: 3000,
      });
    if (name && item.length > 0) {
      const _dataMenu = { ...dataMenu };
      _dataMenu.count = _dataMenu.item.length;
      _dataMenu.item = _dataMenu.item.map((item) => item._id);
      console.log(_dataMenu);
      mutation.mutate(_dataMenu);
    }
    setError(_error);
  };

  /// Change Input
  const handleChangeInputText = (event) => {
    const { value, name } = event.target;
    const _dataMenu = { ...dataMenu };
    const _error = { ...error };
    _dataMenu[name] = value;
    _error[name] = "";
    setDataMenu(_dataMenu);
    setError(_error);
  };
  const handleSeletUpload = async (event) => {
    const file = event.files[0];
    if (file) {
      const formData = new FormData();
      const _dataMenu = { ...dataMenu };
      formData.append("image", file);
      setLoadingUpload(true);
      console.log(formData);
      const image = await UploadService.uploadImage(formData);
      _dataMenu.image = image.data.imagePath;
      setDataMenu(_dataMenu);
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

  const onNameFilterChange = (e) => {
    const { value } = e.target;
    let _filters = { ...filters };
    _filters["name"].value = value;
    setFilters(_filters);
    setNameFilterValue(value);
  };

  const onCategoryFilterChange = (e) => {
    const { value } = e;
    let _filters = { ...filters };
    _filters["categoryFood._id"].value = value;
    setFilters(_filters);
    setSelectCategoryFood(value);
  };

  const emptyTemplate = () => {
    return (
      <div className="flex flex-column align-items-center">
        <img
          src={images.emptyFood}
          alt=""
          style={{ width: "150px" }}
          className="my-3"
        />
        <span className="font-light text-500 font-normal font-family">
          Thực đơn chưa có mặt hàng nào
        </span>
        <span className="font-light text-500 font-normal font-family mt-1">
          Bạn hãy thêm mới mặt hàng cho thưục đơn này
        </span>
      </div>
    );
  };

  const priceBodyTemplate = (data) => {
    return <span>{data} VNĐ</span>;
  };
  const nameBodyTemplate = (rowData) => {
    return (
      <div className="flex align-items-center">
        <Image
          src={rowData.image[0]?.path || images.noImage}
          alt={rowData.name}
          width="70"
          height="50"
          preview
          pt={{
            root: "border-round-md overflow-hidden mr-3",
            image: "",
          }}
        />
        <span>{rowData.name}</span>
      </div>
    );
  };

  const imageBodyTemplate = (rowData) => {
    return (
      <Image
        src={rowData.image[0]?.path || images.noImage}
        alt={rowData.name}
        width="70"
        height="50"
        preview
        pt={{
          root: "border-round-md overflow-hidden",
          image: "",
        }}
      />
    );
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <Button
        icon="pi pi-trash"
        rounded
        severity="danger"
        aria-label="Cancel"
        // onClick={() => comfirmDelete(rowData)}
      />
    );
  };

  const handleSelectValues = (e) => {
    setSelectedValue(e.value);
  };

  const handleCancelItem = () => {
    setSelectedValue([]);
    setShowCreate(false);
  };
  const handleAddItem = () => {
    setShowCreate(false);
    const _dataMenu = { ...dataMenu };
    _dataMenu.item = selectedValues;
    setDataMenu(_dataMenu);
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
                      image={uploadedImageUrl || images.menuDefault}
                      shape="circle"
                      style={{ height: "auto", width: "200px" }}
                      className="p-2 shadow-2"
                    />
                  )}

                  {loadingUpload && <Loading />}
                </div>
                <div className="mt-4">
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
                      className=" text-white"
                      pt={{
                        chooseButton: "bg-orange-500 ",
                        chooseButtonLabel: "text-white",
                      }}
                    />
                  </LoadingButton>
                </div>

                <div className="mt-4 flex flex-column align-items-center">
                  <span className="font-light text-500 font-family">
                    <LoadingText
                      loading={loading}
                      width={"150px"}
                      height={"12px"}
                    >
                      Dung lượng tối đa 1MB
                    </LoadingText>
                  </span>
                  <span className="font-light text-500 font-family mt-1">
                    <LoadingText
                      loading={loading}
                      width={"130px"}
                      height={"12px"}
                    >
                      Định dạng :.JPG,.PNG
                    </LoadingText>
                  </span>
                  <span className="font-light text-500 font-family mt-1">
                    <LoadingText
                      loading={loading}
                      width={"200px"}
                      height={"12px"}
                    >
                      Nên sử dụng hình ảnh có tỷ lệ 1:1
                    </LoadingText>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="col-8">
            <div className="p-5 mt-4 shadow-2 bg-white border-round-xl">
              <div className="grid p-1">
                <div className="col-12">
                  <h3 className="m-0 text-orange-500 font-family">
                    <LoadingText
                      loading={loading}
                      width={"150px"}
                      height={"15px"}
                    >
                      Tạo thực đơn mới
                    </LoadingText>
                  </h3>
                </div>
                <div className="col-6">
                  <LoadingInputLable loading={loading}>
                    <label
                      htmlFor="name"
                      className="text-900 font-bold font-family text-color-secondary"
                    >
                      Tên thực đơn<span className="text-red-500">(*)</span>
                    </label>
                    <InputText
                      placeholder="Tên thực đơn"
                      name="name"
                      id="name"
                      value={dataMenu.name}
                      onChange={(e) => handleChangeInputText(e)}
                      className={error.name ? "p-invalid" : ""}
                      pt={{
                        root: "font-family border-round-lg h-3rem mt-2 w-full",
                      }}
                    />
                  </LoadingInputLable>

                  {getFormErrorMessage(error, "name")}
                </div>
                <div className="col-6">
                  <LoadingInputLable loading={loading}>
                    <label
                      htmlFor="email"
                      className="text-900 font-bold font-family text-color-secondary"
                    >
                      Số lượng món
                    </label>
                    <InputText
                      placeholder="Số lượng món"
                      name="count"
                      id="count"
                      value={dataMenu.item.length}
                      disabled
                      pt={{
                        root: "font-family border-round-lg h-3rem mt-2 w-full",
                      }}
                    />
                  </LoadingInputLable>
                  {getFormErrorMessage(error, "email")}
                </div>
                <div className="col-12">
                  <div className="flex justify-content-between align-items-center w-full mb-3">
                    <span className="text-900 font-bold font-family text-color-secondary">
                      <LoadingText
                        loading={loading}
                        width={"150px"}
                        height={"13px"}
                      >
                        Danh sách mặt hàng:
                      </LoadingText>
                    </span>
                    <LoadingButton
                      loading={loading}
                      width={"180px"}
                      height={"40px"}
                    >
                      <Button
                        label="Thêm mặt hàng"
                        severity="info"
                        icon="pi pi-plus"
                        onClick={() => setShowCreate(true)}
                      />
                    </LoadingButton>
                  </div>
                  {loading ? (
                    <Skeleton height="200px" width="100%"></Skeleton>
                  ) : (
                    <DataTable
                      value={dataMenu.item}
                      className="font-family"
                      dataKey="_id"
                      emptyMessage={emptyTemplate}
                    >
                      <Column header="Tên mặt hàng" field="name"></Column>
                      <Column
                        header="Hình ảnh"
                        field="image"
                        body={imageBodyTemplate}
                      ></Column>
                      <Column
                        field="priceSale"
                        header="Giá bán"
                        body={(rowData) => priceBodyTemplate(rowData.priceSale)}
                      ></Column>
                      <Column
                        field="categoryFood.name"
                        header="Danh mục"
                      ></Column>
                      <Column body={actionBodyTemplate} />
                    </DataTable>
                  )}
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
                  <div
                    className="flex justify-content-end"
                    style={{ marginTop: "7px" }}
                  >
                    <LoadingButton
                      loading={loading}
                      width={"140px"}
                      height={"40px"}
                    >
                      <Button
                        label="Lưu lại"
                        icon="pi pi-check"
                        loading={isPending}
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
      <Toast
        ref={toast}
        pt={{
          content: "bg-white text-color align-items-center",
        }}
      />
      <Dialog
        header="Thêm nguyên liệu"
        visible={showCreate}
        style={{ width: "60vw" }}
        onHide={() => setShowCreate(false)}
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
              onClick={() => setShowCreate(false)}
            />
          </div>
          <div className="p-3 surface-50 surface-border">
            <span className="p-input-icon-right mr-3">
              <InputText
                value={nameFilterValue}
                onChange={onNameFilterChange}
                placeholder="Tìm kiếm tên"
                className="font-family"
              />
              <i className="pi pi-search" />
            </span>
            <Dropdown
              value={selectCategoryFood}
              onChange={onCategoryFilterChange}
              options={categoryFood}
              optionLabel="name"
              optionValue="_id"
              placeholder="Chọn danh mục"
              pt={{
                root: "w-full md:w-14rem align-items-center font-family",
                input: "font-family",
              }}
            />
          </div>
          <div className="mt-4 relative">
            <DataTable
              value={recipe.length > 0 && recipe}
              className="font-family"
              selection={selectedValues}
              onSelectionChange={handleSelectValues}
              checkIcon={<i className="pi pi-check text-white" />}
              dataKey="_id"
              filters={filters}
              globalFilterFields={["name", "categoryFood._id"]}
              emptyMessage={emptyTemplate}
              paginator
              rows={6}
              rowsPerPageOptions={[6, 12, 18, 50]}
            >
              <Column
                selectionMode="multiple"
                style={{ width: "3rem" }}
              ></Column>
              <Column
                header="Tên mặt hàng"
                field="name"
                body={(rowData) => nameBodyTemplate(rowData)}
              ></Column>
              <Column
                header="Danh mục"
                field="categoryFood.name"
                filterField="categoryFood._id"
              ></Column>
              <Column
                field="priceSale"
                header="Giá bán"
                body={(rowData) => priceBodyTemplate(rowData.priceSale)}
              ></Column>
            </DataTable>
          </div>
          <div className="mt-3 mb-3 text-right">
            <Button
              label="Hủy"
              icon="pi pi-times"
              severity="danger"
              className="ml-2 px-5 border-round-md font-semibold font-family"
              onClick={handleCancelItem}
            />

            <Button
              label="Thêm"
              icon="pi pi-check"
              severity="info"
              className="ml-3 px-5 border-round-md font-semibold font-family"
              onClick={handleAddItem}
            />
          </div>
        </div>
      </Dialog>
      {/* {isPending && <Loading />} */}
    </>
  );
}
