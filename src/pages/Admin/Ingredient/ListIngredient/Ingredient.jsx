import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Image } from "primereact/image";
import { useEffect, useRef, useState } from "react";
import { FilterMatchMode } from "primereact/api";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import CreateIngredient from "./CreateIngredient";
import images from "../../../../assets/images";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import EditIngredient from "./EditIngredient";
import classNames from "classnames/bind";
import { userMutationHook } from "../../../../hooks/useMutationHook";
import * as IngredientService from "../../../../services/IngredientService";
import * as SupplierService from "../../../../services/SupplierService";
import * as CategoryIngridient from "../../../../services/CategoryIngridient";
import LoadingTable from "../../../../components/Loading/LoadingTable";
import { Skeleton } from "primereact/skeleton";
import { useSelector } from "react-redux";

const cx = classNames.bind();

function ListIngredient() {
  const [nameFilterValue, setNameFilterValue] = useState("");
  const [selectedValues, setSelectedValue] = useState(null);
  const [supplier, setSupplier] = useState(null);
  const [category, setCategory] = useState(null);
  const [selectSupplier, setSelectSupplier] = useState(null);
  const [selectCategory, setSelectCategory] = useState(null);
  const [value, setValue] = useState("");
  const [listData, setListData] = useState("");
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [deleteSellectDialog, setDeleteSellectDialog] = useState(false);
  const [disableDeleteSelect, setDisableDeleteSelect] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editValue, setEditValue] = useState("");
  const [checkPermission, setCheckPermission] = useState({});
  const [filters, setFilters] = useState({
    name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    "category._id": { value: null, matchMode: FilterMatchMode.EQUALS },
    "supplier._id": { value: null, matchMode: FilterMatchMode.EQUALS },
  });
  const exportCSV = useRef(null);
  const toast = useRef(null);

  const user = useSelector((state) => state.user);
  const userPermission = user?.user?.permission?.function;

  useEffect(() => {
    if (userPermission) {
      const check = userPermission.find(
        (item) => item.function_id === "666af68b0a7446ecd60582a7"
      );
      setCheckPermission(check);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userPermission]);

  const mutationCreate = userMutationHook((data) =>
    IngredientService.createIngredient(data)
  );
  const mutationEdit = userMutationHook((data) =>
    IngredientService.editIngredient(data._id, data)
  );
  const mutationDelete = userMutationHook((data) =>
    IngredientService.deleteIngredient(data)
  );
  const { data: dataCreate, isSuccess: isSuccessCrete } = mutationCreate;
  const { data: dataEdit } = mutationEdit;
  const { data: dataDelete, isSuccess: isSuccesDelete } = mutationDelete;

  useEffect(() => {
    if (isSuccessCrete && dataCreate?.data) {
      toast.current.show({
        severity: "success",
        summary: "Thành công",
        detail: `Thêm dữ liệu ${dataCreate?.data.name} thành công`,
        icon: (
          <FontAwesomeIcon
            icon={faCircleCheck}
            className="text-green-500 h-2rem"
          />
        ),
        life: 3000,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataCreate]);

  useEffect(() => {
    const getListData = async () => {
      setLoading(true);
      const data = await IngredientService.listIngredient();
      setLoading(false);
      setListData(data.data);
    };
    getListData();
  }, [dataCreate, dataEdit, dataDelete]);

  useEffect(() => {
    const fechData = async () => {
      const [categoryResult, supplierResult] = await Promise.all([
        CategoryIngridient.listCategoryIngredient(),
        SupplierService.listSupplier(),
      ]);
      const dataCategory = [
        { _id: "", name: "Mặc định" },
        ...categoryResult.data,
      ];
      const dataSupplier = [
        { _id: "", name: "Mặc định" },
        ...supplierResult.data,
      ];
      setCategory(dataCategory);
      setSupplier(dataSupplier);
    };
    fechData();
  }, []);

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
    _filters["category._id"].value = value;
    setFilters(_filters);
    setSelectCategory(value);
  };

  const onSupplierFilterChange = (e) => {
    const { value } = e;
    let _filters = { ...filters };
    _filters["supplier._id"].value = value;
    setFilters(_filters);
    setSelectSupplier(value);
  };

  const onExportCSV = () => {
    exportCSV.current.exportCSV();
  };

  /// Delete value
  const deleteValue = () => {
    mutationDelete.mutate([value]);
    hideDeleteDialog();
    isSuccesDelete &&
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
    isSuccesDelete &&
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
    return <span>{rowData.price} VNĐ</span>;
  };
  const amountBodyTemplate = (rowData) => {
    return <span>{rowData.amount || 0} </span>;
  };

  const statusBodyTemplate = (rowData) => {
    const empty = rowData.amount !== 0 && rowData.amount;
    return (
      <span
        className={cx(
          `font-family text-sm text-white px-2 py-1 border-round-lg `,
          empty ? "bg-cyan-600" : "bg-red-500"
        )}
      >
        {empty ? "Còn hàng" : "Hết hàng"}
      </span>
    );
  };
  const handleShowEdit = (data) => {
    setShowEdit(true);
    setEditValue(data);
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
            onClick={() => checkPermission.edit && handleShowEdit(rowData)}
          />
          <Button
            icon="pi pi-trash"
            rounded
            severity="danger"
            aria-label="Cancel"
            onClick={() => checkPermission.delete && comfirmDelete(rowData)}
          />
        </div>
      </>
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
              onClick={() => checkPermission.create && setShowCreate(true)}
            />
            {/* <CreateIngredient categorys={categorys} /> */}
            <Button
              label="Delete"
              icon=" pi pi-trash"
              severity="danger"
              className="border-round-md font-semibold font-family"
              onClick={checkPermission.delete && comfirmDeleteSelect}
              disabled={disableDeleteSelect}
            />
          </div>
          <div className="flex">
            <>
              <div className="flex justify-content-end mr-2">
                <Dropdown
                  value={selectSupplier}
                  onChange={onSupplierFilterChange}
                  options={supplier}
                  optionLabel="name"
                  optionValue="_id"
                  placeholder="Chọn nhà cung cấp"
                  pt={{
                    root: "w-full md:w-14rem align-items-center",
                    input: "font-family",
                  }}
                />
              </div>
              <div className="flex justify-content-end mr-2 ">
                <Dropdown
                  value={selectCategory}
                  onChange={onCategoryFilterChange}
                  options={category}
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
          tableStyle={{ minWidth: "85rem" }}
          selection={selectedValues}
          selectionMode={null}
          filters={filters}
          globalFilterFields={["name", "category._id", "supplier._id"]}
          onSelectionChange={handleSelectValues}
          dataKey="_id"
          className="font-family"
          checkIcon={<i className="pi pi-check text-white" />}
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25, 50]}
        >
          <Column selectionMode="multiple" style={{ width: "3rem" }}></Column>
          <Column
            field="code"
            header="Code"
            sortable
            body={loading && <Skeleton />}
          ></Column>
          <Column field="name" header="Tên nguyên liệu" sortable>
            {" "}
            body={loading && <Skeleton />}
          </Column>
          <Column
            field="image"
            header="Hình ảnh"
            body={(loading && <Skeleton />) || imageBodyTemplate}
          ></Column>
          <Column
            field="price"
            header="Giá nguyên liệu"
            sortable
            body={(loading && <Skeleton />) || priceBodyTemplate}
          ></Column>
          <Column
            field="category.name"
            filterField="category._id"
            header="Danh mục"
            body={loading && <Skeleton />}
          ></Column>
          <Column
            field="supplier.name"
            header="Nhà nguyên liệu"
            body={loading && <Skeleton />}
          ></Column>
          <Column
            field="amount"
            header="Số lượng"
            body={(loading && <Skeleton />) || amountBodyTemplate}
            sortable
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
                "Code",
                "Tên nguyên liệu",
                "Hình ảnh",
                "Giá nguyên liệu",
                "Danh mục",
                "Nhà cung cấp",
                "số lượng",
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
      <CreateIngredient
        show={showCreate}
        setShow={setShowCreate}
        mutation={mutationCreate}
      />
      {editValue && (
        <EditIngredient
          show={showEdit}
          setShow={setShowEdit}
          mutation={mutationEdit}
          dataRow={editValue}
        />
      )}
    </div>
  );
}

export default ListIngredient;
