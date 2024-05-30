import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useRef, useState } from "react";
import { FilterMatchMode } from "primereact/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-regular-svg-icons";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import images from "../../../../assets/images";
import { useEffect } from "react";
import * as GalleryService from "../../../../services/GalleryService";
import * as CategoryGallery from "../../../../services/CategoryGallery";
import LoadingTable from "../../../../components/Loading/LoadingTable";
import { userMutationHook } from "../../../../hooks/useMutationHook";
import { Skeleton } from "primereact/skeleton";
import { Image } from "primereact/image";
import { Checkbox } from "primereact/checkbox";
import CreateGallery from "./CreateGallery";
import EditGallery from "./EditGallery";
import { Dropdown } from "primereact/dropdown";

function Gallery() {
  const [listData, setListData] = useState();
  const [value, setValue] = useState("");
  const [selectCategory, setSelectCategory] = useState(null);
  const [selectedValues, setSelectedValue] = useState(null);
  const [categoryGallery, setCategoryGallery] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [deleteSellectDialog, setDeleteSellectDialog] = useState(false);
  const [disableDeleteSelect, setDisableDeleteSelect] = useState(true);
  const [loading, setLoading] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [valueEdit, setValueEdit] = useState("");
  const [filters, setFilters] = useState({
    "categoryGallery._id": { value: null, matchMode: FilterMatchMode.EQUALS },
  });
  const exportCSV = useRef(null);
  const toast = useRef(null);

  const onExportCSV = () => {
    exportCSV.current.exportCSV();
  };

  const mutationCreate = userMutationHook((data) =>
    GalleryService.createGallery(data)
  );
  const mutationEdit = userMutationHook((data) =>
    GalleryService.editGallery(data._id, data)
  );
  const mutationDelete = userMutationHook((data) =>
    GalleryService.deleteGallery(data)
  );
  const { data: dataDelete } = mutationDelete;
  const { data: dataCreate } = mutationCreate;
  const { data: dataEdit } = mutationEdit;

  useEffect(() => {
    const getListMenu = async () => {
      setLoading(true);
      const resultGallery = await GalleryService.listGallery();
      const resultCategory = await CategoryGallery.listCategoryGallery();
      setLoading(false);
      setListData(resultGallery.data);
      const dataCategory = [
        { _id: "", name: "Mặc định" },
        ...resultCategory.data,
      ];
      setCategoryGallery(dataCategory);
    };
    getListMenu();
  }, [dataDelete, dataCreate, dataEdit]);

  const onCategoryFilterChange = (e) => {
    const { value } = e;
    let _filters = { ...filters };
    _filters["categoryGallery._id"].value = value;
    setFilters(_filters);
    setSelectCategory(value);
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

  const handleShowEdit = (data) => {
    setShowEdit(true);
    setValueEdit(data);
  };

  const linkBodyTemplate = (rowData) => {
    return <span>{rowData.link || "Không có"}</span>;
  };

  const categoryBodyTemplate = (rowData) => {
    return <span>{rowData.categoryGallery?.name || "Không có"}</span>;
  };

  const imageBodyTemplate = (rowData) => {
    return (
      <Image
        src={rowData.image || images.noImage}
        alt={rowData.name}
        height="70"
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
    );
  };

  const handleShowData = (data) => {
    const _data = { ...data };
    const show = _data.show;
    _data.show = !show;
    mutationEdit.mutate(_data);
  };

  const showBodyTemplate = (rowData) => {
    return (
      <div>
        <Checkbox
          variant="filled"
          onChange={() => handleShowData(rowData)}
          checked={rowData.show}
          pt={{
            icon: "text-white",
          }}
        ></Checkbox>
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
                label="Thêm hình ảnh"
                icon="pi pi-plus"
                severity="success"
                className="mr-2 border-round-md font-semibold font-family"
                onClick={() => setShowCreate(true)}
              />
              <Button
                label="Delete"
                icon=" pi pi-trash"
                severity="danger"
                className=" border-round-md font-semibold font-family"
                disabled={disableDeleteSelect}
                onClick={comfirmDeleteSelect}
              />
            </div>
            <div>
              <Dropdown
                value={selectCategory}
                onChange={onCategoryFilterChange}
                options={categoryGallery}
                optionLabel="name"
                optionValue="_id"
                placeholder="Chọn danh mục"
                pt={{
                  root: "w-full md:w-14rem align-items-center",
                  input: "font-family",
                }}
              />
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
              header="Liên kết"
              body={(loading && <Skeleton />) || linkBodyTemplate}
            ></Column>
            <Column
              header="Danh mục"
              body={(loading && <Skeleton />) || categoryBodyTemplate}
            ></Column>
            <Column
              field="image"
              header="Hình ảnh"
              body={(loading && <Skeleton />) || imageBodyTemplate}
            ></Column>
            <Column
              style={{ width: "12rem" }}
              header="Hiển thị"
              body={(loading && <Skeleton />) || showBodyTemplate}
            ></Column>
            <Column
              style={{ width: "12rem" }}
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
                  "Liên kết",
                  "Danh mục",
                  "Hình ảnh",
                  "Hiển thị",
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
          header="Bạn muốn xóa dữ liệu"
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
        <CreateGallery
          show={showCreate}
          setShow={setShowCreate}
          mutation={mutationCreate}
        />
        {valueEdit && (
          <EditGallery
            show={showEdit}
            setShow={setShowEdit}
            valueGallery={valueEdit}
            mutation={mutationEdit}
          />
        )}
      </div>
    </div>
  );
}

export default Gallery;
