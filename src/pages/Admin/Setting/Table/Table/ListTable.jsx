import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useEffect, useRef, useState } from "react";
import { FilterMatchMode } from "primereact/api";
import { InputText } from "primereact/inputtext";
import images from "../../../../../assets/images";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import * as TableService from "../../../../../services/TableService";
import * as CategoryTableService from "../../../../../services/CategoryTableService";
import { Skeleton } from "primereact/skeleton";
import { userMutationHook } from "../../../../../hooks/useMutationHook";
import LoadingTable from "../../../../../components/Loading/LoadingTable";
import CreateListTable from "./CreateListTable";
import { OverlayPanel } from "primereact/overlaypanel";
import { Link } from "react-router-dom";
import config from "../../../../../config";
import { Dropdown } from "primereact/dropdown";

function ListTable() {
  const [nameFilterValue, setNameFilterValue] = useState("");
  const [value, setValue] = useState("");
  const [listData, setListData] = useState();
  const [categoryTable, setCategoryTable] = useState();
  const [selectedValues, setSelectedValue] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [disableDeleteSelect, setDisableDeleteSelect] = useState(true);
  const [deleteSellectDialog, setDeleteSellectDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const exportCSV = useRef(null);
  const create = useRef(null);
  const toast = useRef(null);
  const [filters, setFilters] = useState({
    name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  });

  const mutationCreate = userMutationHook((data) =>
    TableService.createTable(data)
  );

  const mutationEdit = userMutationHook((data) =>
    TableService.editTable(data._id, data)
  );

  const mutationDelete = userMutationHook((data) =>
    TableService.deleteTable(data)
  );

  const { data: dataCreate, isSuccess: isSuccessCreate } = mutationCreate;
  const { data: dataEdit, isSuccess: isSuccessEdit } = mutationCreate;
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
      const [resutlTable, resultCategoryTable] = await Promise.all([
        TableService.listTable(),
        CategoryTableService.listCateroryTable(),
      ]);
      setLoading(false);
      setListData(resutlTable.data);
      setCategoryTable(resultCategoryTable.data);
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

  const allowEdit = (rowData) => {
    return rowData.name !== "Blue Band";
  };

  const nameEditor = (options) => {
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

  const categoryTableEditor = (options) => {
    return (
      <Dropdown
        value={options.value}
        onChange={(e) => options.editorCallback(e.value)}
        options={categoryTable}
        optionLabel="name"
        optionValue="_id"
        placeholder="Chọn danh mục"
        pt={{
          root: "border-round-lg h-3rem mt-2 w-full align-items-center ",
          input: "font-family ",
        }}
      />
    );
  };

  const onRowEditComplete = (e) => {
    let { newData } = e;
    mutationEdit.mutate(newData);
    toast.current.show({
      severity: "success",
      summary: "Thành công",
      detail: `Sửa danh mục ${newData.name} thành công `,
      icon: (
        <FontAwesomeIcon
          icon={faCircleCheck}
          className="text-green-500 h-2rem"
        />
      ),
      life: 3000,
    });
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
            onClick={() => comfirmDelete(rowData)}
          />
        </div>
      </>
    );
  };

  return (
    <div className="grid mt-4 ">
      <div className="col-3">
        <div className="flex flex-column font-family">
          <span className="font-medium ">Danh sách bàn</span>
          <span className="text-color-secondary mt-2">
            Quản lý các loại bàn của bạn trong nhà hàng
          </span>
          <Link
            to={config.router.settingCategoryTable}
            className="mt-2 no-underline text-cyan-500"
          >
            Thiết lập danh mục bàn
          </Link>
        </div>
      </div>
      <div className="col-9">
        <div className="p-4 shadow-2 bg-white border-round-xl">
          <div className="p-4 surface-50 border-1 border-solid border-round-lg surface-border">
            <div className="flex justify-content-between">
              <div>
                <Button
                  label="Thêm bàn"
                  icon="pi pi-plus"
                  severity="success"
                  className="mr-2 border-round-md font-semibold font-family"
                  onClick={(e) => create.current.toggle(e)}
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
              editMode="row"
              onRowEditComplete={onRowEditComplete}
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
                header="Tên bàn"
                style={{ width: "35%" }}
                sortable
                editor={(options) => nameEditor(options)}
                body={loading && <Skeleton />}
              ></Column>
              <Column
                field="categoryTable.name"
                header="Loại bàn"
                style={{ width: "40%" }}
                editor={(options) => categoryTableEditor(options)}
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
                style={{ width: "10%" }}
                body={(loading && <Skeleton />) || actionBodyTemplate}
              ></Column>
            </DataTable>
            {!listData && (
              <div className="absolute top-0 bottom-0 right-0 left-0">
                <LoadingTable
                  count={2}
                  selection
                  data={["Tên bàn", "Loại bàn", "Hành Động"]}
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
            <CreateListTable createRef={create} mutation={mutationCreate} />
          </OverlayPanel>
        </div>
      </div>
    </div>
  );
}

export default ListTable;
