import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Image } from "primereact/image";
import { useEffect, useRef, useState } from "react";
import { FilterMatchMode } from "primereact/api";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import images from "../../../../assets/images";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { userMutationHook } from "../../../../hooks/useMutationHook";
import * as CategoryFood from "../../../../services/CategoryFood";
import * as RecipeService from "../../../../services/RecipeService";
import LoadingTable from "../../../../components/Loading/LoadingTable";
import { Skeleton } from "primereact/skeleton";
import { useNavigate } from "react-router-dom";
import config from "../../../../config";
import { Rating } from "primereact/rating";
import { Tag } from "primereact/tag";
import { Checkbox } from "primereact/checkbox";

function Recipe() {
  const [nameFilterValue, setNameFilterValue] = useState("");
  const [selectedValues, setSelectedValue] = useState(null);
  const [categoryFood, setCategoryFood] = useState(null);
  const [selectCategory, setSelectCategory] = useState(null);
  const [value, setValue] = useState("");
  const [listData, setListData] = useState("");
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [deleteSellectDialog, setDeleteSellectDialog] = useState(false);
  const [disableDeleteSelect, setDisableDeleteSelect] = useState(true);
  const [loading, setLoading] = useState(false);
  const [expandedRows, setExpandedRows] = useState(null);
  const exportCSV = useRef(null);
  const toast = useRef(null);
  const navigator = useNavigate();
  const [filters, setFilters] = useState({
    name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    "categoryFood._id": { value: null, matchMode: FilterMatchMode.EQUALS },
  });

  const mutationDelete = userMutationHook((data) =>
    RecipeService.deleteRecipe(data)
  );

  const mutationEdit = userMutationHook((data) =>
    RecipeService.editRecipe(data._id, data)
  );

  const { data: dataDelete } = mutationDelete;
  const { data: dataEdit } = mutationEdit;

  useEffect(() => {
    const fechData = async () => {
      setLoading(true);
      const [recipeResult, categoryFoodResult] = await Promise.all([
        RecipeService.listRecipe(),
        CategoryFood.listCategoryFood(),
      ]);
      setLoading(false);
      const dataCategory = [
        { _id: "", name: "Mặc định" },
        ...categoryFoodResult.data,
      ];
      setCategoryFood(dataCategory);
      setListData(recipeResult.data);
    };
    fechData();
  }, [dataDelete, dataEdit]);

  const onNameFilterChange = (e) => {
    const { value } = e.target;
    let _filters = { ...filters };
    _filters["name"].value = value;
    setFilters(_filters);
    setNameFilterValue(value);
  };

  const onCategoryFilterChange = (e) => {
    const { value } = e;
    console.log(value);
    let _filters = { ...filters };
    _filters["categoryFood._id"].value = value;
    setFilters(_filters);
    setSelectCategory(value);
  };

  const handleShowData = (data, field) => {
    const _data = { ...data };
    const checked = _data[field];
    _data[field] = !checked;
    mutationEdit.mutate(_data);
  };

  const onExportCSV = () => {
    exportCSV.current.exportCSV();
  };

  /// Delete value
  const deleteValue = () => {
    mutationDelete.mutate([value]);
    hideDeleteDialog();
    toast.current.show({
      severity: "success",
      summary: "Thành công",
      detail: `Xóa dữ liệu ${value.name} thành công`,
      icon: (
        <FontAwesomeIcon
          icon={faCircleCheck}
          className="text-green-500 h-2rem"
        />
      ),
      life: 3000,
    });
  };
  /// Delete select value
  const deleteSelected = () => {
    mutationDelete.mutate(selectedValues);
    setDeleteSellectDialog(false);
    setSelectedValue(null);
    toast.current.show({
      severity: "success",
      summary: "Thành công",
      detail: "Xóa dữ liệu thành công",
      icon: (
        <FontAwesomeIcon
          icon={faCircleCheck}
          className="text-green-500 h-2rem"
        />
      ),
      life: 3000,
    });
  };

  /// show hide delete dialog
  const comfirmDelete = (product) => {
    setDeleteDialog(true);
    setValue(product);
  };
  const hideDeleteDialog = () => {
    setDeleteDialog(false);
  };

  /// handle Select Values
  const handleSelectValues = (e) => {
    setSelectedValue(e.value);
    e.value.length > 0
      ? setDisableDeleteSelect(false)
      : setDisableDeleteSelect(true);
  };

  /// show hide delete select dialog
  const comfirmDeleteSelect = () => {
    setDeleteSellectDialog(true);
  };

  const hideDeleteSellectDialog = () => {
    setDeleteSellectDialog(false);
  };

  const handleEditClick = (rowData) => {
    navigator("edit", { state: { id: rowData._id } });
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

  const priceBodyTemplate = (rowData) => {
    return <span>{rowData.priceSale || rowData.price} VNĐ</span>;
  };
  const priceBodyLevel = (rowData) => {
    return (
      <div className="flex">
        <Rating value={rowData.level} cancel={false} disabled />
      </div>
    );
  };

  const statusBodyTemplate = (rowData) => {
    let check = "";
    switch (rowData.status) {
      case "Hoàn thành":
        check = "Success";
        break;
      case "Đang tiến hành":
        check = "Secondary";
        break;
      case "Dự kiến":
        check = "Warning";
        break;
      default:
        break;
    }
    return (
      <Tag
        severity={check}
        value={rowData.status}
        className="font-family text-white border-round-lg"
      ></Tag>
    );
  };

  const showBodyTemplate = (rowData) => {
    return (
      <div>
        <Checkbox
          variant="filled"
          onChange={() => handleShowData(rowData, "show")}
          checked={rowData.show}
          pt={{
            icon: "text-white",
          }}
        ></Checkbox>
      </div>
    );
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <>
        <div>
          <Button
            icon="pi pi pi-pencil"
            rounded
            severity="info"
            aria-label="Search"
            className="mr-2"
            onClick={() => handleEditClick(rowData)}
          />
          <Button
            icon="pi pi-trash"
            rounded
            severity="danger"
            aria-label="Cancel"
            onClick={() => comfirmDelete(rowData)}
          />
        </div>
      </>
    );
  };

  const allowExpansion = (rowData) => {
    return rowData.ingredient.length > 0;
  };

  const rowExpansionTemplate = (data) => {
    return (
      <DataTable value={data.ingredient} className="font-family">
        <Column
          header="STT"
          body={(value, row) => <span>{row.rowIndex}</span>}
        ></Column>
        <Column field="_id.name" header="Tên nguyên liệu"></Column>
        <Column field="amount" header="Số lượng"></Column>
        <Column field="unit" header="Khẩu phần"></Column>
        <Column
          field="price"
          header="Giá nguyên liệu"
          body={priceBodyTemplate}
        ></Column>
      </DataTable>
    );
  };

  return (
    <div className="p-4 mt-4 shadow-2 bg-white border-round-xl">
      <div className="p-4 surface-50 border-1 border-solid border-round-lg surface-border">
        <div className="flex justify-content-between">
          <div>
            <Button
              label="New"
              icon="pi pi-plus"
              severity="success"
              className="mr-2 border-round-md font-semibold font-family"
              onClick={() => navigator(config.router.createRecipe)}
            />
            <Button
              label="Delete"
              icon=" pi pi-trash"
              severity="danger"
              className="border-round-md font-semibold font-family"
              onClick={comfirmDeleteSelect}
              disabled={disableDeleteSelect}
            />
          </div>
          <div className="flex">
            <>
              <div className="flex justify-content-end mr-2 ">
                <Dropdown
                  value={selectCategory}
                  onChange={onCategoryFilterChange}
                  options={categoryFood}
                  optionLabel="name"
                  optionValue="_id"
                  placeholder="Chọn danh mục"
                  pt={{
                    root: "w-full md:w-14rem align-items-center",
                    input: "font-family",
                  }}
                />
              </div>
              <div className="flex justify-content-end mr-2 ">
                <span className="p-input-icon-right">
                  <InputText
                    value={nameFilterValue}
                    onChange={onNameFilterChange}
                    placeholder="Tìm kiếm tên"
                    className="font-family"
                  />
                  <i className="pi pi-search" />
                </span>
              </div>
            </>
            <Button
              label="Export"
              icon="pi pi-upload"
              severity="info"
              onClick={onExportCSV}
              className="border-round-md font-semibold font-family"
            />
          </div>
        </div>
      </div>
      <div className="mt-4 relative">
        <DataTable
          ref={exportCSV}
          value={listData}
          tableStyle={{ minWidth: "1350px" }}
          selection={selectedValues}
          selectionMode={"checkbox"}
          filters={filters}
          globalFilterFields={["name", "category._id", "supplier._id"]}
          onSelectionChange={handleSelectValues}
          dataKey="_id"
          className="font-family"
          checkIcon={<i className="pi pi-check text-white" />}
          expandedRows={expandedRows}
          onRowToggle={(e) => setExpandedRows(e.data)}
          rowExpansionTemplate={rowExpansionTemplate}
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25, 50]}
        >
          <Column selectionMode="multiple" style={{ width: "3rem" }}></Column>
          <Column
            field="name"
            header="Tên mặt hàng"
            sortable
            body={loading && <Skeleton />}
          ></Column>
          <Column
            field="categoryFood.name"
            header="Danh mục món"
            sortable
            body={loading && <Skeleton />}
          ></Column>
          <Column
            field="image"
            header="Hình ảnh"
            body={(loading && <Skeleton />) || imageBodyTemplate}
          ></Column>
          <Column header="Nguyên liệu" expander={allowExpansion}></Column>
          <Column
            field="priceSale"
            header="Giá bán"
            sortable
            body={(loading && <Skeleton />) || priceBodyTemplate}
          ></Column>
          <Column
            field="unit"
            // filterField="category._id"
            header="Khẩu phần"
            body={loading && <Skeleton />}
          ></Column>
          <Column
            style={{ width: "8rem" }}
            header="Hiển thị"
            body={(loading && <Skeleton />) || showBodyTemplate}
          ></Column>
          <Column
            field="level"
            header="Độ khó"
            body={(loading && <Skeleton />) || priceBodyLevel}
          ></Column>
          <Column
            field="status"
            header="Trạng thái"
            body={(loading && <Skeleton />) || statusBodyTemplate}
          ></Column>
          <Column
            header="Hành động"
            body={(loading && <Skeleton />) || actionBodyTemplate}
          ></Column>
        </DataTable>
        {!listData && (
          <div className="absolute top-0 bottom-0 right-0 left-0">
            <LoadingTable
              count={2}
              selection
              data={[
                "Tên mặt hàng",
                "Danh mục món",
                "Hình ảnh",
                "Giá gốc",
                "Khẩu phần",
                "Hiển thị",
                "Độ khó",
                "Trạng thái",
                "Hành động",
              ]}
            />
          </div>
        )}
      </div>
      <Toast
        ref={toast}
        pt={{
          content: "bg-white text-color align-items-center",
        }}
      />
      <Dialog
        visible={deleteDialog}
        style={{ width: "40rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Bạn muốn xóa dữu liệu"
        modal
        footer={
          <>
            <Button
              label="Không"
              icon="pi pi-times"
              className="px-3 font-medium mr-2"
              severity="info"
              onClick={hideDeleteDialog}
            />
            <Button
              label="Đồng ý"
              icon="pi pi-check"
              className="px-3 font-medium font-family"
              severity="danger"
              onClick={deleteValue}
            />
          </>
        }
        onHide={hideDeleteDialog}
      >
        <div className="confirmation-content">
          {value && (
            <div className="flex align-items-center">
              <img
                src={images.warning}
                alt="warning"
                className="max-w-3rem mr-3"
              />
              <span>
                Bạn chắc chắn muốn xóa <b>{value.name}</b>?
              </span>
            </div>
          )}
        </div>
      </Dialog>
      <Dialog
        visible={deleteSellectDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Bạn muốn xóa dữu liệu"
        modal
        footer={
          <>
            <Button
              label="Không"
              icon="pi pi-times"
              className="px-3 font-medium mr-2"
              severity="info"
              onClick={hideDeleteSellectDialog}
            />
            <Button
              label="Đồng ý"
              icon="pi pi-check"
              className="px-3 font-medium font-family"
              severity="danger"
              onClick={deleteSelected}
            />
          </>
        }
        onHide={hideDeleteSellectDialog}
      >
        <div className="confirmation-content">
          <div className="flex align-items-center">
            <img
              src={images.warning}
              alt="warning"
              className="max-w-3rem mr-3"
            />
            <span>Bạn chắc chắn muốn xóa ?</span>
          </div>
        </div>
      </Dialog>
    </div>
  );
}

export default Recipe;
