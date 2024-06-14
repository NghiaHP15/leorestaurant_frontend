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
import { useEffect } from "react";
import * as PermissionFunction from "../../../services/PermissionFunction";
import * as PermissionService from "../../../services/PermissionService";
import LoadingTable from "../../../components/Loading/LoadingTable";
import { userMutationHook } from "../../../hooks/useMutationHook";
import { Skeleton } from "primereact/skeleton";
import { Checkbox } from "primereact/checkbox";
import { InputText } from "primereact/inputtext";
import { OverlayPanel } from "primereact/overlaypanel";
import CreateFunction from "./CreateFunction";
import { useLocation, useNavigate } from "react-router-dom";
import config from "../../../config";

function Permisson() {
  const [listData, setListData] = useState();
  const [permission, setPermission] = useState();
  const [value, setValue] = useState("");
  const [nameFilterValue, setNameFilterValue] = useState("");
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [loading, setLoading] = useState([]);
  const [filters, setFilters] = useState({
    name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  });
  const navigator = useNavigate();
  const location = useLocation();
  const exportCSV = useRef(null);
  const toast = useRef(null);
  const create = useRef(null);

  const mutationCreate = userMutationHook((data) =>
    PermissionFunction.createPermission(data)
  );
  const mutationEdit = userMutationHook((data) =>
    PermissionService.editPermission(data._id, data)
  );
  const mutationDelete = userMutationHook((data) =>
    PermissionFunction.deletePermission(data._id, data)
  );
  const { data: dataDelete } = mutationDelete;
  const { data: dataCreate } = mutationCreate;
  const { data: dataEdit } = mutationEdit;

  useEffect(() => {
    if (location.state?.id) {
      const { id } = location.state;
      const fetchData = async () => {
        const [resultPermission] = await Promise.all([
          PermissionService.detailPermission(id),
        ]);
        setPermission(resultPermission.data);
      };
      fetchData();
    } else {
      navigator(config.router.permission);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataDelete, dataCreate, dataEdit]);

  useEffect(() => {
    const getListMenu = async () => {
      setLoading(true);
      const resultBlog = await PermissionFunction.listPermission();
      setLoading(false);
      setListData(resultBlog.data);
    };
    getListMenu();
  }, [dataDelete, dataCreate, dataEdit]);

  const onNameFilterChange = (e) => {
    const { value } = e.target;
    let _filters = { ...filters };
    _filters["name"].value = value;
    setFilters(_filters);
    setNameFilterValue(value);
  };

  /// Delete value
  const deleteValue = () => {
    mutationDelete.mutate(value);
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

  /// show hide delete dialog
  const comfirmDelete = (product) => {
    setDeleteDialog(true);
    setValue(product);
  };
  const hideDeleteDialog = () => {
    setDeleteDialog(false);
  };

  const nameBodyTemplate = (rowData) => {
    return (
      <div>
        <span className="text-base font-normal">{rowData.name}</span>
      </div>
    );
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <div>
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

  const handleAddData = (data, event, name) => {
    const _permission = { ...permission };
    if (event.checked) {
      _permission.function.push({ [name]: data._id });
    } else {
      _permission.function = _permission.function.filter(
        (item) => item[name] !== data._id
      );
    }
    mutationEdit.mutate(_permission);
  };

  const handleSelectData = (data, event, name) => {
    const _permission = { ...permission };
    // eslint-disable-next-line array-callback-return
    _permission.function.map((item) => {
      if (item.function_id === data._id) {
        item[name] = event.checked;
      }
    });
    mutationEdit.mutate(_permission);
  };

  const addBobyTemplate = (rowData) => {
    return (
      <div>
        <Checkbox
          variant="filled"
          onChange={(e) => handleAddData(rowData, e, "function_id")}
          checked={permission?.function.some(
            (item) => item.function_id === rowData._id
          )}
          pt={{
            icon: "text-white",
          }}
        ></Checkbox>
      </div>
    );
  };
  const createBobyTemplate = (rowData) => {
    return (
      <div>
        <Checkbox
          variant="filled"
          onChange={(e) => handleSelectData(rowData, e, "create")}
          checked={permission?.function.some(
            (item) => item.function_id === rowData._id && item.create
          )}
          pt={{
            icon: "text-white",
          }}
        ></Checkbox>
      </div>
    );
  };
  const editBobyTemplate = (rowData) => {
    return (
      <div>
        <Checkbox
          variant="filled"
          onChange={(e) => handleSelectData(rowData, e, "edit")}
          checked={permission?.function.some(
            (item) => item.function_id === rowData._id && item.edit
          )}
          pt={{
            icon: "text-white",
          }}
        ></Checkbox>
      </div>
    );
  };
  const deleteBobyTemplate = (rowData) => {
    return (
      <div>
        <Checkbox
          variant="filled"
          onChange={(e) => handleSelectData(rowData, e, "delete")}
          checked={permission?.function.some(
            (item) => item.function_id === rowData._id && item.delete
          )}
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
                label="Thêm chức năng"
                icon="pi pi-plus"
                severity="success"
                className="mr-2 border-round-md font-semibold font-family"
                onClick={(e) => create.current.toggle(e)}
              />
            </div>
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
        </div>
        <div className="mt-4 relative">
          <DataTable
            ref={exportCSV}
            value={listData}
            tableStyle={{ minWidth: "50rem" }}
            selectionMode={"checkbox"}
            filters={filters}
            globalFilterFields={["name"]}
            dataKey="_id"
            className="font-family"
            checkIcon={<i className="pi pi-check text-white" />}
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25, 50]}
          >
            <Column
              header="Tên chức năng"
              sortable
              body={(loading && <Skeleton />) || nameBodyTemplate}
            ></Column>
            <Column
              style={{ width: "10rem" }}
              header="Chọn chức năng"
              body={(loading && <Skeleton />) || addBobyTemplate}
            ></Column>
            <Column
              style={{ width: "8rem" }}
              header="Thêm"
              body={(loading && <Skeleton />) || createBobyTemplate}
            ></Column>
            <Column
              style={{ width: "8rem" }}
              header="Sửa"
              body={(loading && <Skeleton />) || editBobyTemplate}
            ></Column>
            <Column
              style={{ width: "8rem" }}
              header="Xóa"
              body={(loading && <Skeleton />) || deleteBobyTemplate}
            ></Column>
          </DataTable>
          {!listData && (
            <div className="absolute top-0 bottom-0 right-0 left-0">
              <LoadingTable
                count={2}
                selection
                data={["Tên chức năng", "Thêm", "Sửa", "Xóa"]}
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
        <OverlayPanel ref={create}>
          <CreateFunction createRef={create} mutation={mutationCreate} />
        </OverlayPanel>
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

export default Permisson;
