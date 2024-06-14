import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Image } from "primereact/image";
import { useEffect, useRef, useState } from "react";
import { FilterMatchMode } from "primereact/api";
import { InputText } from "primereact/inputtext";
import images from "../../../../assets/images";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import CreateSupplierIngredient from "./CreateSupplierIngredient";
import EditSupplierIngredient from "./EditSupplierIngredient";
import * as SupplierService from "../../../../services/SupplierService";
import { userMutationHook } from "../../../../hooks/useMutationHook";
import LoadingTable from "../../../../components/Loading/LoadingTable";
import { Skeleton } from "primereact/skeleton";
import { useSelector } from "react-redux";

function SupplierIngredient() {
  const [nameFilterValue, setNameFilterValue] = useState("");
  const [selectedValues, setSelectedValue] = useState(null);
  const [value, setValue] = useState("");
  const [listData, setListData] = useState();
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [deleteSellectDialog, setDeleteSellectDialog] = useState(false);
  const [disableDeleteSelect, setDisableDeleteSelect] = useState(true);
  const [loading, setLoading] = useState(false);
  const [valueEdit, setValueEdit] = useState("");
  const [showEdit, setShowEdit] = useState(false);
  const [checkPermission, setCheckPermission] = useState({});
  const [showCreate, setShowCreate] = useState(false);
  const [filters, setFilters] = useState({
    name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  });
  const exportCSV = useRef(null);
  const toast = useRef(null);

  const user = useSelector((state) => state.user);
  const userPermission = user?.user?.permission?.function;

  useEffect(() => {
    if (userPermission) {
      const check = userPermission.find(
        (item) => item.function_id === "666af6dc0a7446ecd60582c7"
      );
      setCheckPermission(check);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userPermission]);

  const mutationCreate = userMutationHook((data) =>
    SupplierService.createSupplier(data)
  );
  const mutationEdit = userMutationHook((data) =>
    SupplierService.editSupplier(data._id, data)
  );
  const mutationDelete = userMutationHook((data) =>
    SupplierService.deleteSupplier(data)
  );
  const { data: dataCrete, isSuccess: isSuccessCrete } = mutationCreate;
  const { data: dataEdit } = mutationEdit;
  const { data: dataDelete, isSuccess: isSuccesDelete } = mutationDelete;

  useEffect(() => {
    if (isSuccessCrete && dataCrete?.data) {
      toast.current.show({
        severity: "success",
        summary: "Thành công",
        detail: `Thêm dữ liệu ${dataCrete?.data.name} thành công`,
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
  }, [dataCrete]);

  useEffect(() => {
    const getListStaff = async () => {
      setLoading(true);
      const result = await SupplierService.listSupplier();
      setLoading(false);
      setListData(result.data);
    };
    getListStaff();
  }, [dataCrete, dataEdit, dataDelete]);

  const onNameFilterChange = (e) => {
    const { value } = e.target;
    let _filters = { ...filters };
    _filters["name"].value = value;
    setFilters(_filters);
    setNameFilterValue(value);
  };

  const onExportCSV = () => {
    exportCSV.current.exportCSV();
  };

  /// show hide delete dialog
  const comfirmDelete = (product) => {
    setDeleteDialog(true);
    setValue(product);
  };
  const hideDeleteDialog = () => {
    setDeleteDialog(false);
  };

  const handleSelectValues = (e) => {
    setSelectedValue(e.value);
    e.value.length > 0
      ? setDisableDeleteSelect(false)
      : setDisableDeleteSelect(true);
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

  const handleShowEdit = (data) => {
    setShowEdit(true);
    setValueEdit(data);
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
          globalFilterFields={["name"]}
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
          <Column
            field="name"
            header="Tên nhà cung cấp"
            sortable
            body={loading && <Skeleton />}
          ></Column>
          <Column
            field="image"
            header="Hình ảnh"
            body={(loading && <Skeleton />) || imageBodyTemplate}
          ></Column>
          <Column
            field="address"
            header="Địa chỉ"
            sortable
            body={loading && <Skeleton />}
          ></Column>
          <Column
            field="phone"
            header="Số điện thoại"
            body={loading && <Skeleton />}
          ></Column>
          <Column
            field="email"
            header="Email"
            sortable
            body={loading && <Skeleton />}
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
                "Tên nhà cung cấp",
                "Hình ảnh",
                "Địa chỉ",
                "Địa chỉ",
                "Số địa thoại",
                "Email",
                "Hành động",
              ]}
            />
          </div>
        )}
      </div>
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
      <Toast
        ref={toast}
        pt={{
          content: "bg-white text-color align-items-center",
        }}
      />
      <CreateSupplierIngredient
        show={showCreate}
        setShow={setShowCreate}
        mutation={mutationCreate}
      />
      {valueEdit && (
        <EditSupplierIngredient
          show={showEdit}
          setShow={setShowEdit}
          valueSupplier={valueEdit}
          mutation={mutationEdit}
        />
      )}
    </div>
  );
}

export default SupplierIngredient;
