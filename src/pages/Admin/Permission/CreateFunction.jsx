import { Button } from "primereact/button";
import { useEffect, useRef, useState } from "react";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";

const defaultValue = {
  name: "",
};
const defaltError = {
  name: "",
};

function CreateFunction({ mutation, createRef }) {
  const [dataRole, setDataRole] = useState(defaultValue);
  const [error, setError] = useState(defaltError);
  const toast = useRef(null);
  const { data, isSuccess, isPending } = mutation;

  useEffect(() => {
    if (isSuccess && data?.data) {
      setDataRole(defaultValue);
      setError(defaltError);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, isSuccess]);

  const accept = () => {
    const _error = { ...error };
    const { name } = dataRole;
    _error.name = name ? "" : "Vui lòng nhập tên";
    if (name) {
      mutation.mutate(dataRole);
      hide();
    }
    setError(_error);
  };

  const reject = () => {
    setDataRole(defaultValue);
    hide();
  };

  const hide = () => {
    createRef.current.hide();
  };

  const handleChangeInputText = (event) => {
    const { value, name } = event.target;
    const _dataRole = { ...dataRole };
    const _error = { ...error };
    _dataRole[name] = value;
    _error[name] = "";
    setDataRole(_dataRole);
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
    <div className="grid px-3 py-2" style={{ minWidth: "700px" }}>
      <div className="col-12">
        <label htmlFor="name" className="font-family text-color">
          Tên chức năng<span className="text-red-500 ml-1">(*)</span>
        </label>
        <InputText
          placeholder="Tên chức năng"
          name="name"
          id="name"
          value={dataRole.name}
          onChange={(e) => handleChangeInputText(e)}
          className={error.name ? "p-invalid" : ""}
          pt={{
            root: "font-family border-round-lg h-3rem mt-2 w-full",
          }}
        />
        {getFormErrorMessage(error, "name")}
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

export default CreateFunction;
