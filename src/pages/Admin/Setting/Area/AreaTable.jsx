import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useEffect, useRef, useState } from "react";
import { FilterMatchMode } from "primereact/api";
import { InputText } from "primereact/inputtext";
import images from "../../../../assets/images";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import * as AreaService from "../../../../services/AreaService";
import { Skeleton } from "primereact/skeleton";
import { userMutationHook } from "../../../../hooks/useMutationHook";
import LoadingTable from "../../../../components/Loading/LoadingTable";
import CreateArea from "./CreateAreaTable";
import EditArea from "./EditAreaTable";

function AreaTable() {
  const [nameFilterValue, setNameFilterValue] = useState("");
  const [value, setValue] = useState("");
  const [listData, setListData] = useState();
  const [selectedValues, setSelectedValue] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [disableDeleteSelect, setDisableDeleteSelect] = useState(true);
  const [deleteSellectDialog, setDeleteSellectDialog] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editValue, setEditValue] = useState("");
  const [loading, setLoading] = useState(false);
  const exportCSV = useRef(null);
  const toast = useRef(null);
  const [filters, setFilters] = useState({
    name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  });

  const mutationCreate = userMutationHook((data) =>
    AreaService.createArea(data)
  );

  const mutationEdit = userMutationHook((data) =>
    AreaService.editArea(data._id, data)
  );

  const mutationDelete = userMutationHook((data) =>
    AreaService.deleteArea(data)
  );
  const { data: dataCreate, isSuccess: isSuccessCreate } = mutationCreate;
  const { data: dataEdit, isSuccess: isSuccessEdit } = mutationEdit;
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
    if (isSuccessEdit && dataEdit?.data) {
      toast.current.show({
        severity: "success",
        summary: "Thành công",
        detail: `Sửa dữ liệu ${dataCreate.data.name} thành công`,
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
  }, [dataEdit, isSuccessEdit]);

  useEffect(() => {
    const getListData = async () => {
      setLoading(true);
      const data = await AreaService.listArea();
      setLoading(false);
      setListData(data.data);
    };
    getListData();
  }, [dataCreate, dataDelete, dataEdit]);

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
        detail: `Xóa dữ liệu thành công ${dataDelete.deletedCount} chức vụ`,
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

  const handleShowEdit = (data) => {
    setShowEdit(true);
    setEditValue(data);
  };

  /// Action datatable
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
            onClick={() => handleShowEdit(rowData)}
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

  const amountTemplateBody = (dataRow) => {
    return <span>{dataRow.table.length}</span>;
  };

  return (
    <div className="grid mt-4 ">
      <div className="col-3">
        <div className="flex flex-column font-family">
          <span className="font-medium ">Thiết lập khu vực</span>
          <span className="text-color-secondary mt-2">
            Quản lý các khu vực trong nhà hàng của bạn và các bàn nằm trong khu
            vực đó
          </span>
        </div>
      </div>
      <div className="col-9">
        <div className="p-4 shadow-2 bg-white border-round-xl">
          <div className="p-4 surface-50 border-1 border-solid border-round-lg surface-border">
            <div className="flex justify-content-between">
              <div>
                <Button
                  label="Thêm khu vực"
                  icon="pi pi-plus"
                  severity="success"
                  className="mr-2 border-round-md font-semibold font-family"
                  onClick={() => setShowCreate(true)}
                />
                <Button
                  label="Xóa"
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
              selectionMode={"checkbox"}
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
              <Column
                selectionMode="multiple"
                style={{ width: "3rem" }}
              ></Column>
              <Column
                field="name"
                header="Tên khu vực"
                style={{ width: "35%" }}
                sortable
                body={loading && <Skeleton />}
              ></Column>
              <Column
                field="amount"
                header="Số lượng bàn"
                style={{ width: "40%" }}
                body={(loading && <Skeleton />) || amountTemplateBody}
              ></Column>
              <Column
                headerStyle={{ width: "7rem", minWidth: "1rem" }}
                bodyStyle={{ textAlign: "end" }}
                body={loading && <Skeleton />}
              ></Column>
              <Column
                header="Hành Động"
                style={{ width: "15%" }}
                body={(loading && <Skeleton />) || actionBodyTemplate}
              ></Column>
            </DataTable>
            {!listData && (
              <div className="absolute top-0 bottom-0 right-0 left-0">
                <LoadingTable
                  count={2}
                  selection
                  data={["Tên loại bàn", "Số lượng ghế", "Hành Động"]}
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
          <CreateArea
            show={showCreate}
            setShow={setShowCreate}
            mutation={mutationCreate}
          />
          {editValue && (
            <EditArea
              show={showEdit}
              setShow={setShowEdit}
              mutation={mutationEdit}
              dataRow={editValue}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default AreaTable;
