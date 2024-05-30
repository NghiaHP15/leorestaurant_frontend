import { Button } from "primereact/button";
import { useEffect, useRef, useState } from "react";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { InputNumber } from "primereact/inputnumber";

const defaultValue = {
  name: "",
  amount: "",
};
const defaltError = {
  name: "",
  amount: "",
};

function CreateCategoryTable({ mutation, createRef }) {
  const [dataTable, setDataTable] = useState(defaultValue);
  const [error, setError] = useState(defaltError);
  const { data, isSuccess, isPending } = mutation;
  const toast = useRef(null);

  useEffect(() => {
    if (isSuccess) {
      setDataTable(defaultValue);
      setError(defaltError);
    }
  }, [isSuccess]);

  const accept = () => {
    const _error = { ...error };
    const { name, amount } = dataTable;
    _error.name = name ? "" : "Vui lòng nhập tên danh mục bàn";
    _error.amount = amount ? "" : "Vui lòng nhập số lượng ghế";
    if (name && amount) {
      mutation.mutate(dataTable);
      hide();
    }
    setError(_error);
  };

  const reject = () => {
    setDataTable(defaultValue);
    hide();
  };

  const hide = () => {
    createRef.current.hide();
  };

  const handleChangeInputText = (event) => {
    const { value, name } = event.target;
    const _dataTable = { ...dataTable };
    const _error = { ...error };
    _dataTable[name] = value;
    _error[name] = "";
    setDataTable(_dataTable);
    setError(_error);
  };

  const handleChangeInput = (event, name) => {
    const { value } = event;
    const _data = { ...dataTable };
    const _error = { ...error };
    _data[name] = value;
    _error[name] = "";
    setDataTable(_data);
    setError(_error);
  };

  return (
    <div className="grid px-2 py-1" style={{ minWidth: "800px" }}>
      <Toast
        ref={toast}
        pt={{
          content: "bg-white text-color align-items-center",
        }}
      />
      <div className="col-6">
        <label htmlFor="name" className="font-family text-color">
          Tên bàn<span className="text-red-500 ml-1">(*)</span>
        </label>
        <InputText
          placeholder="Tên bàn"
          name="name"
          id="name"
          value={dataTable.name}
          onChange={(e) => handleChangeInputText(e)}
          className={error.name ? "p-invalid" : ""}
          pt={{
            root: "font-family border-round-lg h-3rem mt-2 w-full",
          }}
        />
      </div>
      <div className="col-6">
        <label htmlFor="amount" className="font-family text-color">
          Số lượng ghế<span className="text-red-500 ml-1">(*)</span>
        </label>
        <InputNumber
          inputId="amount"
          name="amount"
          placeholder="Số lượng ghế"
          inputClassName="font-family h-3rem mt-2 border-round-md w-full"
          value={dataTable.amount}
          className={error.phone ? "p-invalid" : ""}
          onChange={(e) => handleChangeInput(e, "amount")}
          pt={{
            root: "w-full",
          }}
        />
      </div>
      <div className="col-12 ">
        <Button
          label="Lưu lại"
          icon="pi pi-check"
          className="mr-2 border-round-md font-semibold font-family text-white bg-orange-500"
          loading={isPending}
          onClick={accept}
        />
        <Button
          severity="danger"
          label="Hủy"
          icon="pi pi-times"
          className="mr-2 border-round-md font-semibold font-family"
          onClick={reject}
        />
      </div>
    </div>
  );
}

export default CreateCategoryTable;
