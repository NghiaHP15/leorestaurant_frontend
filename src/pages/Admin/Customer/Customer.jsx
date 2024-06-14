import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useEffect, useRef, useState } from "react";
import { FilterMatchMode } from "primereact/api";
import { InputText } from "primereact/inputtext";
import images from "../../../assets/images";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import * as CustomerService from "../../../services/CustomerService";
import { Skeleton } from "primereact/skeleton";
import { userMutationHook } from "../../../hooks/useMutationHook";
import LoadingTable from "../../../components/Loading/LoadingTable";
import CreateCustomer from "./CreateCustomer";
import { OverlayPanel } from "primereact/overlaypanel";
import { useSelector } from "react-redux";

function ListCustomer() {
  const [nameFilterValue, setNameFilterValue] = useState("");
  const [value, setValue] = useState("");
  const [listData, setListData] = useState();
  const [selectedValues, setSelectedValue] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [disableDeleteSelect, setDisableDeleteSelect] = useState(true);
  const [deleteSellectDialog, setDeleteSellectDialog] = useState(false);
  const [checkPermission, setCheckPermission] = useState({});
  const [loading, setLoading] = useState(false);
  const exportCSV = useRef(null);
  const toast = useRef(null);
  const create = useRef(null);
  const [filters, setFilters] = useState({
    name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    code: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  });

  const user = useSelector((state) => state.user);
  const userPermission = user?.user?.permission?.function;

  useEffect(() => {
    if (userPermission) {
      const check = userPermission.find(
        (item) => item.function_id === "666af78a0a7446ecd60582ea"
      );
      setCheckPermission(check);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userPermission]);

  const mutationCreate = userMutationHook((data) =>
    CustomerService.createCustomer(data)
  );
  const mutationEdit = userMutationHook((data) =>
    CustomerService.editCustomer(data._id, data)
  );
  const mutationDelete = userMutationHook((data) =>
    CustomerService.deleteCustomer(data)
  );
  const { data: dataCreate, isSuccess: isSuccessCreate } = mutationCreate;
  const { data: dataEdit } = mutationEdit;
  const { data: dataDelete } = mutationDelete;

  useEffect(() => {
    if (isSuccessCreate && dataCreate?.data) {
      toast.current.show({
        severity: "success",
        summary: "Thành công",
        detail: `Thêm dữ liệu ${dataCreate.data.name} thành công`,
        icon: (
          <FontAwesomeIcon
            icon={faCircleCheck}
            className="text-green-500 h-2rem"
          />
        ),
        life: 3000,
      });
    }
  }, [dataCreate, isSuccessCreate]);

  useEffect(() => {
    const getListData = async () => {
      setLoading(true);
      const data = await CustomerService.listCustomer();
      setLoading(false);
      setListData(data.data);
    };
    getListData();
  }, [dataCreate, dataEdit, dataDelete]);

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

  const deleteSelected = () => {
    mutationDelete.mutate(selectedValues);
    setDeleteSellectDialog(false);
    setSelectedValue(null);
    dataDelete?.deletedCount &&
      toast.current.show({
        severity: "success",
        summary: "Thành công",
        detail: `Xóa dữ liệu thành công ${dataDelete.deletedCount} khách hàng`,
        icon: (
          <FontAwesomeIcon
            icon={faCircleCheck}
            className="text-green-500 h-2rem"
          />
        ),
        life: 3000,
      });
  };

  const onRowEditComplete = (e) => {
    let { newData } = e;
    mutationEdit.mutate(newData);
    toast.current.show({
      severity: "success",
      summary: "Thành công",
      detail: `Sửa khách hàng ${newData.name} thành công `,
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

  const allowEdit = (rowData) => {
    return rowData.name !== "Blue Band";
  };

  const textEditor = (options) => {
    return (
      <InputText
        placeholder="Mô tả"
        name="description"
        id="description"
        onChange={(e) => options.editorCallback(e.target.value)}
        pt={{
          root: "font-family border-round-lg h-3rem mt-2 w-full",
        }}
        type="text"
        value={options.value}
      />
    );
  };

  /// Action datatable
  const actionBodyTemplate = (rowData) => {
    return (
      <>
        <div>
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
              onClick={(e) =>
                checkPermission.create && create.current.toggle(e)
              }
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
          tableStyle={{ minWidth: "50rem" }}
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
          editMode="row"
          onRowEditComplete={onRowEditComplete}
          rowsPerPageOptions={[5, 10, 25, 50]}
        >
          <Column selectionMode="multiple" style={{ width: "3rem" }}></Column>
          <Column
            field="name"
            header="Tên khách hàng"
            sortable
            editor={(options) => textEditor(options)}
            body={loading && <Skeleton />}
          ></Column>
          <Column
            field="phone"
            header="Số điện thoại"
            editor={(options) => textEditor(options)}
            body={loading && <Skeleton />}
          ></Column>
          <Column
            field="address"
            header="Số điện thoại"
            editor={(options) => checkPermission.edit && textEditor(options)}
            body={loading && <Skeleton />}
          ></Column>
          <Column
            rowEditor={allowEdit}
            headerStyle={{ width: "7rem", minWidth: "1rem" }}
            bodyStyle={{ textAlign: "end" }}
            body={loading && <Skeleton />}
          ></Column>
          <Column
            header="Hành Động"
            body={(loading && <Skeleton />) || actionBodyTemplate}
          ></Column>
        </DataTable>
        {!listData && (
          <div className="absolute top-0 bottom-0 right-0 left-0">
            <LoadingTable
              count={2}
              selection
              data={["Tên khách hàng", "Mô Tả", "Hành Động"]}
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
      <OverlayPanel ref={create}>
        <CreateCustomer createRef={create} mutation={mutationCreate} />
      </OverlayPanel>
    </div>
  );
}

export default ListCustomer;
