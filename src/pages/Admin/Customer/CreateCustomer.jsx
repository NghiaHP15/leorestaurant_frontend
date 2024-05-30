import { Button } from "primereact/button";
import { useEffect, useRef, useState } from "react";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { InputNumber } from "primereact/inputnumber";

const defaultValue = {
  name: "",
  phone: "",
  address: "",
};
const defaltError = {
  name: "",
  phone: "",
};

function CreateCustomer({ mutation, createRef }) {
  const [dataCustomer, setDataCustomer] = useState(defaultValue);
  const [error, setError] = useState(defaltError);
  const toast = useRef(null);
  const { data, isSuccess, isPending } = mutation;

  useEffect(() => {
    if (isSuccess && data?.data) {
      setDataCustomer(defaultValue);
      setError(defaltError);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, isSuccess]);

  const accept = () => {
    const _error = { ...error };
    const { name, phone } = dataCustomer;
    _error.name = name ? "" : "Vui lòng nhập tên";
    _error.phone = phone ? "" : "Vui lòng nhập số điện thoại";
    if (name && phone) {
      mutation.mutate(dataCustomer);
      hide();
    }
    setError(_error);
  };

  const reject = () => {
    setDataCustomer(defaultValue);
    hide();
  };

  const hide = () => {
    createRef.current.hide();
  };

  const handleChangeInputText = (event) => {
    const { value, name } = event.target;
    const _dataCustomer = { ...dataCustomer };
    const _error = { ...error };
    _dataCustomer[name] = value;
    _error[name] = "";
    setDataCustomer(_dataCustomer);
    setError(_error);
  };

  const handleChangeInput = (event, name) => {
    const { value } = event;
    const _dataCustomer = { ...dataCustomer };
    const _error = { ...error };
    _dataCustomer[name] = value;
    _error[name] = "";
    setDataCustomer(_dataCustomer);
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
      <div className="col-4">
        <label htmlFor="name" className="font-family text-color">
          Tên khách hàng<span className="text-red-500 ml-1">(*)</span>
        </label>
        <InputText
          placeholder="Họ và tên"
          name="name"
          id="name"
          value={dataCustomer.name}
          onChange={(e) => handleChangeInputText(e)}
          className={error.name ? "p-invalid" : ""}
          pt={{
            root: "font-family border-round-lg h-3rem mt-2 w-full",
          }}
        />
      </div>
      <div className="col-3">
        <label htmlFor="phone" className="font-family text-color">
          Số điện thoại<span className="text-red-500 ml-1">(*)</span>
        </label>
        <InputNumber
          placeholder="số điện thoại"
          name="phone"
          id="phone"
          value={dataCustomer.phone}
          onChange={(e) => handleChangeInput(e, "phone")}
          inputClassName="font-family border-round-lg"
          className={error.phone ? "p-invalid" : ""}
          pt={{
            root: "font-family border-round-lg h-3rem mt-2 w-full",
          }}
        />
      </div>
      <div className="col-5">
        <label htmlFor="address" className="font-family text-color">
          Địa chỉ<span className="text-red-500 ml-1">(*)</span>
        </label>
        <InputText
          placeholder="Địa chỉ"
          name="address"
          id="address"
          value={dataCustomer.address}
          onChange={(e) => handleChangeInputText(e)}
          pt={{
            root: "font-family border-round-lg h-3rem mt-2 w-full",
          }}
        />
        {getFormErrorMessage(error, "address")}
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

export default CreateCustomer;
