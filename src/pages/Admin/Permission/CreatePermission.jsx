import { Button } from "primereact/button";
import { useEffect, useRef, useState } from "react";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";

const defaultValue = {
  name: "",
  description: "",
};
const defaltError = {
  name: "",
};

function CreatePermission({ mutation, createRef }) {
  const [dataPermission, setDataPermission] = useState(defaultValue);
  const [error, setError] = useState(defaltError);
  const toast = useRef(null);
  const { data, isSuccess, isPending } = mutation;

  useEffect(() => {
    if (isSuccess && data?.data) {
      setDataPermission(defaultValue);
      setError(defaltError);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, isSuccess]);

  const accept = () => {
    const _error = { ...error };
    const { name } = dataPermission;
    _error.name = name ? "" : "Vui lòng nhập tên";
    if (name) {
      mutation.mutate(dataPermission);
      hide();
    }
    setError(_error);
  };

  const reject = () => {
    setDataPermission(defaultValue);
    hide();
  };

  const hide = () => {
    createRef.current.hide();
  };

  const handleChangeInputText = (event) => {
    const { value, name } = event.target;
    const _dataPermission = { ...dataPermission };
    const _error = { ...error };
    _dataPermission[name] = value;
    _error[name] = "";
    setDataPermission(_dataPermission);
    setError(_error);
  };

  const getFormErrorMessage = (errors, field) => {
    if (!errors[field]) {
      errors[field] = data?.error === field ? data?.message : "";
    }
    return errors[field] ? (
      <small className="p-error">{errors[field]}</small>
    ) : (
      <small className="p-error">&nbsp;</small>
    );
  };

  return (
    <div className="grid px-3 py-2" style={{ minWidth: "1200px" }}>
      <div className="col-5">
        <label htmlFor="name" className="font-family text-color">
          Tên quyền<span className="text-red-500 ml-1">(*)</span>
        </label>
        <InputText
          placeholder="Tên quyền"
          name="name"
          id="name"
          value={dataPermission.name}
          onChange={(e) => handleChangeInputText(e)}
          className={error.name ? "p-invalid" : ""}
          pt={{
            root: "font-family border-round-lg h-3rem mt-2 w-full",
          }}
        />
        {getFormErrorMessage(error, "name")}
      </div>
      <div className="col-7">
        <label htmlFor="description" className="font-family text-color">
          Mô tả quyền
        </label>
        <InputText
          placeholder="Mô tả quyền"
          name="description"
          id="description"
          value={dataPermission.description}
          onChange={(e) => handleChangeInputText(e)}
          pt={{
            root: "font-family border-round-lg h-3rem mt-2 w-full",
          }}
        />
        {/* {getFormErrorMessage(error, "name")} */}
      </div>

      <div className="col-12">
        <Button
          className="mr-2 border-round-md font-semibold font-family text-white bg-orange-500"
          label="Lưu lại"
          icon="pi pi-check"
          loading={isPending}
          onClick={accept}
        />
        <Button
          severity="danger"
          label="Hủy"
          icon="pi pi-times"
          onClick={reject}
          className="mr-2 border-round-md font-semibold font-family"
        />
      </div>
      <Toast
        ref={toast}
        pt={{
          content: "bg-white text-color align-items-center",
        }}
      />
    </div>
  );
}

export default CreatePermission;
