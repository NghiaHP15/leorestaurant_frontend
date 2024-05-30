import React, { useEffect, useState } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import images from "../../../../assets/images";
import * as TableService from "../../../../services/TableService";
import * as CategoryTableService from "../../../../services/CategoryTableService";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { FilterMatchMode } from "primereact/api";

const defaultValue = {
  name: "",
  table: [],
};
const defaltError = {
  name: "",
  table: [],
};

export default function CreateArea({ show, setShow, mutation }) {
  const [dataArea, setDataArea] = useState(defaultValue);
  const [error, setError] = useState(defaltError);
  const [showCreate, setShowCreate] = useState(false);
  const [selectedValues, setSelectedValue] = useState(null);
  const [selectCategoryTable, setSelectCategoryTable] = useState(null);
  const [table, setTable] = useState(null);
  const [categoryTable, setCategoryTable] = useState(null);
  const [filters, setFilters] = useState({
    name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    "categoryTable._id": { value: null, matchMode: FilterMatchMode.EQUALS },
  });

  const { data, isSuccess, isPending } = mutation;

  useEffect(() => {
    if (isSuccess && data?.data) {
      onHideDialog();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, isSuccess]);

  useEffect(() => {
    const fechData = async () => {
      const [tableResult, categoryTable] = await Promise.all([
        TableService.listTableFilter(),
        CategoryTableService.listCateroryTable(),
      ]);
      setTable(tableResult.data);
      const _categoryTable = [
        { _id: "", name: "Mặc định" },
        ...categoryTable.data,
      ];
      setCategoryTable(_categoryTable);
    };
    fechData();
  }, [show]);

  ///hide dialog form
  const onHideDialog = () => {
    setShow(false);
    setDataArea(defaultValue);
    setError(defaltError);
    setSelectedValue(null);
  };

  const handleSelectValues = (e) => {
    setSelectedValue(e.value);
  };
  /// Toast message save
  const accept = () => {
    onHideDialog();
  };

  const handleCancelItem = () => {
    setSelectedValue([]);
    setShowCreate(false);
  };
  const handleAddItem = () => {
    setShowCreate(false);
    const _dataMenu = { ...dataArea };
    _dataMenu.table = selectedValues;
    setDataArea(_dataMenu);
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
    const { name } = dataArea;
    _error.name = name ? "" : "Vui lòng nhập tên nguyên liệu";
    if (name) {
      mutation.mutate(dataArea);
      console.log(dataArea);
    }
    setError(_error);
  };

  /// Option change image

  /// Change Input
  const handleChangeInputText = (event) => {
    const { value, name } = event.target;
    const _dataArea = { ...dataArea };
    const _error = { ...error };
    _dataArea[name] = value;
    _error[name] = "";
    setDataArea(_dataArea);
    setError(_error);
  };

  const onCategoryFilterChange = (e) => {
    const { value } = e;
    let _filters = { ...filters };
    _filters["categoryTable._id"].value = value;
    setFilters(_filters);
    setSelectCategoryTable(value);
  };

  return (
    <>
      <Dialog
        header="Thêm nguyên liệu"
        visible={show}
        style={{ width: "50vw" }}
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
              <label htmlFor="name" className="font-family text-color">
                Tên khu vực<span className="text-red-500 ml-1">(*)</span>
              </label>
              <InputText
                placeholder="Tên bàn"
                name="name"
                id="name"
                value={dataArea.name}
                onChange={(e) => handleChangeInputText(e)}
                className={error.name ? "p-invalid" : ""}
                pt={{
                  root: "font-family border-round-lg mt-2 h-3rem w-full",
                }}
              />
            </div>
            <div className="col-12">
              <div className="flex justify-content-between align-items-center w-full mb-3">
                <span className="text-900 font-bold font-family text-color-secondary">
                  Danh sách bàn:
                </span>
                <Button
                  label="Thêm bàn"
                  severity="info"
                  icon="pi pi-plus"
                  onClick={() => setShowCreate(true)}
                />
              </div>
              <DataTable
                value={dataArea.table}
                className="font-family"
                dataKey="_id"
              >
                <Column header="Tên bàn" field="name"></Column>
                <Column field="categoryTable.name" header="Loại bàn"></Column>
                {/* <Column body={actionBodyTemplate} /> */}
              </DataTable>
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
      </Dialog>
      <Dialog
        header=""
        visible={showCreate}
        style={{ width: "40vw" }}
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
          <div className="p-3 surface-50 surface-border text-right">
            <Dropdown
              value={selectCategoryTable}
              onChange={onCategoryFilterChange}
              options={categoryTable}
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
              value={table?.length > 0 && table}
              className="font-family"
              selection={selectedValues}
              onSelectionChange={handleSelectValues}
              checkIcon={<i className="pi pi-check text-white" />}
              dataKey="_id"
              filters={filters}
              globalFilterFields={["categoryTable._id"]}
              paginator
              emptyMessage="Không còn bàn"
              rows={6}
              rowsPerPageOptions={[6, 12, 18, 50]}
            >
              <Column
                selectionMode="multiple"
                style={{ width: "3rem" }}
              ></Column>
              <Column header="Tên bàn" field="name"></Column>
              <Column
                header="Danh bàn"
                field="categoryTable.name"
                filterField="categoryTable._id"
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
    </>
  );
}
