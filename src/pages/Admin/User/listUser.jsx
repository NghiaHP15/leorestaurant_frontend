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
import * as UserService from "../../../services/UserService";
import * as PermissionService from "../../../services/PermissionService";
import { Skeleton } from "primereact/skeleton";
import { userMutationHook } from "../../../hooks/useMutationHook";
import LoadingTable from "../../../components/Loading/LoadingTable";
import { Dropdown } from "primereact/dropdown";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { InputSwitch } from "primereact/inputswitch";
import classNames from "classnames/bind";
import { useSelector } from "react-redux";
const cx = classNames.bind();

const defaltvalue = {
  email: "",
  username: "",
  password: "",
  confirmPassword: "",
  permission: "",
  status: false,
};

const defaltError = {
  email: "",
  username: "",
  password: "",
  confirmPassword: "",
  permission: "",
};

const defaltShowPassword = {
  password: false,
  confirmPassword: false,
};

function ListUser() {
  const [nameFilterValue, setNameFilterValue] = useState("");
  const [value, setValue] = useState("");
  const [listData, setListData] = useState();
  const [dataUser, setDataUser] = useState(defaltvalue);
  const [show, setShow] = useState(defaltShowPassword);
  const [permission, setPermission] = useState(null);
  const [error, setError] = useState(defaltError);
  const [selectedValues, setSelectedValue] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [disableDeleteSelect, setDisableDeleteSelect] = useState(true);
  const [deleteSellectDialog, setDeleteSellectDialog] = useState(false);
  const [checkPermission, setCheckPermission] = useState({});
  const [loading, setLoading] = useState(false);
  const exportCSV = useRef(null);
  const toast = useRef(null);
  const [filters, setFilters] = useState({
    name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    code: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  });

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

  const mutationCreate = userMutationHook((data) =>
    UserService.createUser(data)
  );
  const mutationEdit = userMutationHook((data) =>
    UserService.updateUser(data._id, data)
  );
  const mutationDelete = userMutationHook((data) =>
    UserService.deletesUser(data)
  );
  const {
    data: dataCreate,
    isSuccess: isSuccessCreate,
    isPending: isPendingCreate,
  } = mutationCreate;
  const { data: dataEdit, isSuccess: isSuccessEdit } = mutationEdit;
  const { data: dataDelete } = mutationDelete;
  console.log(dataEdit);

  useEffect(() => {
    if (isSuccessCreate) {
      if (dataCreate?.data) {
        setDataUser(defaltvalue);
        setError(defaltError);
        toast.current.show({
          severity: "success",
          summary: "Thành công",
          detail: `Thêm User  ${dataUser.username} thành công `,
          icon: (
            <FontAwesomeIcon
              icon={faCircleCheck}
              className="text-green-500 h-2rem"
            />
          ),
          life: 3000,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataCreate, isSuccessCreate]);

  useEffect(() => {
    if (isSuccessEdit) {
      if (dataEdit) {
        toast.current.show({
          severity: "success",
          summary: "Thành công",
          detail: `Sửa User thành công `,
          icon: (
            <FontAwesomeIcon
              icon={faCircleCheck}
              className="text-green-500 h-2rem"
            />
          ),
          life: 3000,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataEdit, isSuccessEdit]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [userResult, permissionResult] = await Promise.all([
        UserService.getAllUser(),
        PermissionService.listPermission(),
      ]);
      setLoading(false);
      setListData(userResult.data);
      setPermission(permissionResult.data);
    };
    fetchData();
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
      detail: `Xóa dữ liệu ${value.username} thành công`,
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

  const onRowEditComplete = (e) => {
    let { newData } = e;
    console.log(newData);
    mutationEdit.mutate(newData);
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

  const validateEmail = (email) => {
    const expression =
      /^((?:[A-Za-z0-9!#$%&'*+\-\/=?^_`{|}~]|(?<=^|\.)"|"(?=$|\.|@)|(?<=".*)[ .](?=.*")|(?<!\.)\.){1,64})(@)((?:[A-Za-z0-9.\-])*(?:[A-Za-z0-9])\.(?:[A-Za-z0-9]){2,})$/i;
    return expression.test(String(email).toLowerCase());
  };

  const confirmSave = () => {
    const _error = { ...error };
    const { username, email, password, confirmPassword, permission } = dataUser;
    _error.email = email
      ? validateEmail(email)
        ? ""
        : "Định dạng email không đúng"
      : "Vui lòng nhập email";
    _error.username = username ? "" : "Vui lòng nhập tên tài khoản";
    _error.password = password ? "" : "Vui lòng nhập số điện thoại";
    _error.confirmPassword = confirmPassword
      ? password === confirmPassword
        ? ""
        : "Mật khẩu không hợp lệ"
      : "Vui lòng nhập mật khẩu";
    if (
      username &&
      validateEmail(email) &&
      password &&
      confirmPassword &&
      permission
    ) {
      mutationCreate.mutate(dataUser);
      console.log(dataUser);
    }
    setError(_error);
  };

  const confirmDelete = () => {
    const { username, email, password, confirmPassword, permission } = dataUser;
    if (username || email || password || confirmPassword || permission) {
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
    } else {
    }
  };

  const accept = () => {
    setDataUser(defaltvalue);
    setError(defaltError);
  };

  const handleChangeInputText = (event) => {
    const { value, name } = event.target;
    setDataUser((prevState) => ({ ...prevState, [name]: value }));
    setError((prevState) => ({ ...prevState, [name]: "" }));
  };

  const handleChangeInput = (event, name) => {
    const { value } = event;
    setDataUser((prevState) => ({ ...prevState, [name]: value }));
    setError((prevState) => ({ ...prevState, [name]: "" }));
  };

  const getFormErrorMessage = (errors, field) => {
    if (!errors[field]) {
      errors[field] = dataCreate?.error === field ? dataCreate?.message : "";
    }
    return errors[field] ? (
      <small className="p-error">{errors[field]}</small>
    ) : (
      <small className="p-error">&nbsp;</small>
    );
  };

  const usernameEditor = (options) => {
    return (
      <InputText
        placeholder="Username"
        name="username"
        id="username"
        type="text"
        disabled
        value={options.value}
        className={error.username ? "p-invalid" : ""}
        onChange={(e) => options.editorCallback(e.target.value)}
        pt={{
          root: "font-family border-round-lg h-3rem mt-2 w-full",
        }}
      />
    );
  };

  const emailEditor = (options) => {
    return (
      <InputText
        placeholder="Email"
        name="email"
        id="email"
        type="text"
        disabled
        value={options.value}
        className={error.password ? "p-invalid" : ""}
        onChange={(e) => options.editorCallback(e.target.value)}
        pt={{
          root: "font-family border-round-lg h-3rem mt-2 w-full",
        }}
      />
    );
  };

  const dropdownEditor = (options) => {
    return (
      <Dropdown
        placeholder="--- Phân quyền ---"
        name="permission"
        value={options.value}
        options={permission}
        optionLabel="name"
        optionValue="_id"
        className={error.permission ? "p-invalid" : ""}
        onChange={(e) => options.editorCallback(e.value)}
        pt={{
          root: "h-3rem w-full align-items-center border-round-lg mt-2",
          input: "font-family",
          item: "font-family hover:surface-100 px-4 py-3",
          list: "p-0",
        }}
      />
    );
  };

  const handlechangeShow = (field) => {
    const _show = { ...show };
    console.log(_show[field]);
    _show[field] = !_show[field];
    setShow(_show);
  };

  const statusEditor = (options) => {
    return (
      <InputSwitch
        checked={options.value}
        onChange={(e) => options.editorCallback(e.value)}
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

  const permissionBodyTemplate = (rowData) => {
    return <span>{rowData.permission?.name}</span>;
  };

  const statusBodyTemplate = (rowData) => {
    return (
      <InputSwitch
        checked={rowData.status}
        // onChange={(e) => handleChangeInput(e, "status")}
      />
    );
  };

  return (
    <div className="grid">
      <div className="col-8">
        <div className="p-4 mt-4 shadow-2 bg-white border-round-xl">
          <div className="p-4 surface-50 border-1 border-solid border-round-lg surface-border">
            <div className="flex justify-content-between">
              <div>
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
            <div className="">
              <DataTable
                ref={exportCSV}
                value={listData}
                tableStyle={{ width: "100%" }}
                selection={selectedValues}
                selectionMode={null}
                filters={filters}
                globalFilterFields={["name"]}
                onSelectionChange={handleSelectValues}
                dataKey="_id"
                className="font-family"
                checkIcon={<i className="pi pi-check text-white" />}
                paginator
                // scrollable
                rows={10}
                editMode="row"
                onRowEditComplete={onRowEditComplete}
                rowsPerPageOptions={[5, 10, 25, 50]}
              >
                <Column
                  selectionMode="multiple"
                  style={{ width: "3rem" }}
                ></Column>
                <Column
                  field="username"
                  header="Username"
                  sortable
                  editor={(options) => usernameEditor(options)}
                  body={loading && <Skeleton />}
                ></Column>
                <Column
                  field="email"
                  header="Email"
                  editor={(options) => emailEditor(options)}
                  body={loading && <Skeleton />}
                ></Column>
                <Column
                  field="permission"
                  header="Phân quyền"
                  editor={(options) => dropdownEditor(options)}
                  body={(loading && <Skeleton />) || permissionBodyTemplate}
                ></Column>
                <Column
                  field="status"
                  header="Trạng thái"
                  editor={(options) =>
                    checkPermission.edit && statusEditor(options)
                  }
                  body={(loading && <Skeleton />) || statusBodyTemplate}
                ></Column>
                <Column
                  rowEditor={allowEdit}
                  headerStyle={{ width: "7rem", minWidth: "1rem" }}
                  bodyStyle={{ textAlign: "end" }}
                  body={loading && <Skeleton />}
                ></Column>
                <Column
                  header="Hành Động"
                  style={{ width: "10rem" }}
                  body={(loading && <Skeleton />) || actionBodyTemplate}
                ></Column>
              </DataTable>
            </div>
            {!listData && (
              <div className="absolute top-0 bottom-0 right-0 left-0">
                <LoadingTable
                  count={2}
                  selection
                  data={["Tên Chức vụ", "Mô Tả", "Hành Động"]}
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
      </div>
      <div className="col-4">
        <div className="p-4 mt-4 shadow-2 bg-white border-round-xl">
          <div className="grid">
            <div className="col-12">
              <h3 className="text-orange-500">Tài khoản người dùng</h3>
            </div>
            <div className="col-12">
              <label htmlFor="email" className="font-family">
                Email<span className="text-red-500">(*)</span>
              </label>
              <InputText
                placeholder="Email"
                name="email"
                id="email"
                className={error.name ? "p-invalid" : ""}
                value={dataUser.email}
                onChange={(e) => handleChangeInputText(e)}
                pt={{
                  root: "font-family border-round-lg h-3rem mt-2 w-full",
                }}
              />
              {getFormErrorMessage(error, "email")}
            </div>
            <div className="col-12">
              <label htmlFor="name" className="font-family">
                Username<span className="text-red-500">(*)</span>
              </label>
              <InputText
                placeholder="Username"
                name="username"
                id="username"
                className={error.name ? "p-invalid" : ""}
                value={dataUser.username}
                onChange={(e) => handleChangeInputText(e)}
                pt={{
                  root: "font-family border-round-lg h-3rem mt-2 w-full",
                }}
              />
              {getFormErrorMessage(error, "username")}
            </div>
            <div className="col-6">
              <label htmlFor="password" className="font-family">
                Password<span className="text-red-500">(*)</span>
              </label>
              <span className="p-input-icon-right mt-2 w-full">
                <InputText
                  placeholder="Password"
                  name="password"
                  id="password"
                  className={error.name ? "p-invalid" : ""}
                  value={dataUser.password}
                  type={show.password ? "text" : "password"}
                  onChange={(e) => handleChangeInputText(e)}
                  pt={{
                    root: "font-family border-round-lg h-3rem w-full",
                  }}
                />
                <i
                  className={cx(
                    "absolute text-orange-500",
                    show.password ? "pi pi-eye" : "pi pi-eye-slash"
                  )}
                  onClick={() => handlechangeShow("password")}
                  style={{ right: "16px" }}
                />
              </span>
              {getFormErrorMessage(error, "password")}
            </div>
            <div className="col-6">
              <label htmlFor="confirmPassword" className="font-family">
                ConfirmPassword<span className="text-red-500">(*)</span>
              </label>
              <span className="p-input-icon-right mt-2 w-full">
                <InputText
                  placeholder="Confirm Password"
                  name="confirmPassword"
                  id="confirmPassword"
                  className={error.name ? "p-invalid" : ""}
                  type={show.confirmPassword ? "text" : "password"}
                  value={dataUser.confirmPassword}
                  onChange={(e) => handleChangeInputText(e)}
                  pt={{
                    root: "font-family border-round-lg h-3rem w-full",
                  }}
                />
                <i
                  className={cx(
                    "absolute text-orange-500",
                    show.confirmPassword ? "pi pi-eye" : "pi pi-eye-slash"
                  )}
                  onClick={() => handlechangeShow("confirmPassword")}
                  style={{ right: "16px" }}
                />
              </span>
              {getFormErrorMessage(error, "confirmPassword")}
            </div>
            <div className="col-12">
              <label htmlFor="permission" className="font-family">
                Phân quyền<span className="text-red-500">(*)</span>
              </label>
              <Dropdown
                value={dataUser.permission}
                options={permission}
                placeholder="--- Chọn phân quyền ---"
                optionLabel="name"
                optionValue="_id"
                className={error.name ? "p-invalid" : ""}
                onChange={(e) => handleChangeInput(e, "permission")}
                pt={{
                  root: "h-3rem w-full align-items-center border-round-lg mt-2",
                  input: "font-family",
                  item: "font-family hover:surface-100 px-4 py-3",
                  list: "p-0 ",
                }}
              />
              {getFormErrorMessage(error, "permission")}
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
              <Button
                label="Lưu lại"
                icon="pi pi-check"
                severity="success"
                loading={isPendingCreate}
                className="ml-3 h-3rem px-5 border-round-md font-semibold font-family"
                onClick={checkPermission.create && confirmSave}
              />
              <Button
                label="Hủy"
                icon="pi pi-times"
                severity="danger"
                className="ml-2 h-3rem px-5 border-round-md font-semibold font-family"
                onClick={confirmDelete}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ListUser;
