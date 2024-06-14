import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useRef, useState } from "react";
import { FilterMatchMode } from "primereact/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-regular-svg-icons";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import images from "../../../assets/images";
import { InputText } from "primereact/inputtext";
import config from "../../../config";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import * as StaffService from "../../../services/StaffService";
import LoadingTable from "../../../components/Loading/LoadingTable";
import { userMutationHook } from "../../../hooks/useMutationHook";
import { Skeleton } from "primereact/skeleton";
import { useSelector } from "react-redux";

function ListEmployee() {
  const [listData, setListData] = useState();
  const [value, setValue] = useState("");
  const [nameFilterValue, setNameFilterValue] = useState("");
  const [selectedValues, setSelectedValue] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [deleteSellectDialog, setDeleteSellectDialog] = useState(false);
  const [disableDeleteSelect, setDisableDeleteSelect] = useState(true);
  const [expandedRows, setExpandedRows] = useState(null);
  const [checkPermission, setCheckPermission] = useState({});
  const [loading, setLoading] = useState([]);
  const navigator = useNavigate();
  const [filters, setFilters] = useState({
    name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    email: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    phone: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  });

  const exportCSV = useRef(null);
  const toast = useRef(null);
  const user = useSelector((state) => state.user);
  const userPermission = user?.user?.permission?.function;

  useEffect(() => {
    if (userPermission) {
      const check = userPermission.find(
        (item) => item.function_id === "666af7800a7446ecd60582e4"
      );
      setCheckPermission(check);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userPermission]);

  const onExportCSV = () => {
    exportCSV.current.exportCSV();
  };

  const mutationDelete = userMutationHook((data) =>
    StaffService.deleteStaff(data)
  );
  const { data: dataDelete } = mutationDelete;

  const formatDate = (dateString) => {
    let date = new Date(dateString);
    let day = date.getDate();
    let month = date.getMonth() + 1; // Months are zero indexed
    let year = date.getFullYear(); // Get last two digits of the year

    // Add leading zero if day or month is less than 10
    day = day < 10 ? "0" + day : day;
    month = month < 10 ? "0" + month : month;

    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    const getListStaff = async () => {
      setLoading(true);
      const result = await StaffService.listStaff();
      setLoading(false);
      setListData(result.data);
    };
    getListStaff();
  }, [dataDelete]);

  const onNameFilterChange = (e) => {
    const { value } = e.target;
    let _filters = { ...filters };
    _filters["name"].value = value;
    setFilters(_filters);
    setNameFilterValue(value);
  };

  /// Delete value
  const deleteValue = () => {
    mutationDelete.mutate([value]);
    hideDeleteDialog();
    dataDelete?.deletedCount &&
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
    dataDelete?.deletedCount &&
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

  const handleSelectValues = (e) => {
    setSelectedValue(e.value);
    e.value.length > 0
      ? setDisableDeleteSelect(false)
      : setDisableDeleteSelect(true);
  };

  /// show hide delete dialog
  const comfirmDelete = (product) => {
    setDeleteDialog(true);
    setValue(product);
  };
  const hideDeleteDialog = () => {
    setDeleteDialog(false);
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

  const handleProfileClick = (rowData) => {
    navigator("profile", { state: { id: rowData._id } });
  };

  const templateDateBirth = (rowData) => {
    return <span>{rowData.date_birth && formatDate(rowData.date_birth)}</span>;
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <div>
        <Button
          icon="pi pi pi-user-edit"
          rounded
          severity="success"
          aria-label="Search"
          className="mr-2"
          onClick={() => checkPermission.edit && handleProfileClick(rowData)}
        />
        <Button
          icon="pi pi pi-pencil"
          rounded
          severity="info"
          aria-label="Search"
          className="mr-2"
          onClick={() => checkPermission.edit && handleEditClick(rowData)}
        />
        <Button
          icon="pi pi-trash"
          rounded
          severity="danger"
          aria-label="Cancel"
          onClick={() => checkPermission.delete && comfirmDelete(rowData)}
        />
      </div>
    );
  };

  return (
    <div className="relative">
      <div className="p-4 mt-4 shadow-2 bg-white border-round-xl">
        <div className="p-4 surface-50 border-1 border-solid border-round-lg surface-border">
          <div className="flex justify-content-between">
            <div>
              <Button
                label="New"
                icon="pi pi-plus"
                severity="success"
                className="mr-2 border-round-md font-semibold font-family"
                onClick={() =>
                  checkPermission.create &&
                  navigator(config.router.createEmployee)
                }
              />
              <Button
                label="Delete"
                icon=" pi pi-trash"
                severity="danger"
                className=" border-round-md font-semibold font-family"
                disabled={disableDeleteSelect}
                onClick={checkPermission.delete && comfirmDeleteSelect}
              />
            </div>
            <div>
              <span className="p-input-icon-right">
                <InputText
                  value={nameFilterValue}
                  onChange={onNameFilterChange}
                  placeholder="Tìm kiếm tên"
                  className="font-family"
                />
                <i className="pi pi-search" />
              </span>
              <Button
                label="Export"
                icon="pi pi-upload"
                severity="info"
                className="border-round-md font-semibold font-family ml-3"
                onClick={onExportCSV}
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
            selectionMode={"checkbox"}
            filters={filters}
            globalFilterFields={["name"]}
            expandedRows={expandedRows}
            onRowToggle={(e) => setExpandedRows(e.data)}
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
              field="name"
              header="Tên nhân viên"
              sortable
              body={loading && <Skeleton />}
            ></Column>
            <Column
              field="gender"
              header="Giới tính"
              body={loading && <Skeleton />}
            ></Column>
            <Column
              field="date_birth"
              header="Ngày sinh"
              sortable
              body={(loading && <Skeleton />) || templateDateBirth}
            ></Column>
            <Column
              field="email"
              header="Email"
              body={loading && <Skeleton />}
            ></Column>
            <Column
              field="phone"
              header="Số điện thoại"
              body={loading && <Skeleton />}
            ></Column>
            <Column
              field="quantity"
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
                  "Tên nhân viên",
                  "Giới tính",
                  "Ngày sinh",
                  "Email",
                  "Số điện thoại",
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
      </div>
    </div>
  );
}

export default ListEmployee;
