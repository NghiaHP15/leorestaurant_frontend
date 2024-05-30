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
  description: "",
};

function CreateCategoryIngredient({ mutation, createRef }) {
  const [dataCategory, setDataCategory] = useState(defaultValue);
  const [error, setError] = useState(defaltError);
  const { data, isSuccess, isPending } = mutation;
  const toast = useRef(null);

  useEffect(() => {
    if (isSuccess) {
      setDataCategory(defaultValue);
      setError(defaltError);
    }
  }, [isSuccess]);

  const accept = () => {
    const _error = { ...error };
    const { name, description } = dataCategory;
    _error.name = name ? "" : "Vui lòng nhập tên";
    _error.description = description ? "" : "Vui lòng nhập mô tả";
    if (name && description) {
      mutation.mutate(dataCategory);
      hide();
    }
    setError(_error);
  };

  const reject = () => {
    setDataCategory(defaultValue);
    hide();
  };

  const hide = () => {
    createRef.current.hide();
  };

  const handleChangeInputText = (event) => {
    const { value, name } = event.target;
    const _dataCategory = { ...dataCategory };
    const _error = { ...error };
    _dataCategory[name] = value;
    _error[name] = "";
    setDataCategory(_dataCategory);
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
          value={dataCategory.name}
          onChange={(e) => handleChangeInputText(e)}
          className={error.name ? "p-invalid" : ""}
          pt={{
            root: "font-family border-round-lg h-3rem mt-2 w-full",
          }}
        />
        {getFormErrorMessage(error, "name")}
      </div>
      <div className="col-6">
        <label htmlFor="description" className="font-family text-color">
          Mô tả<span className="text-red-500 ml-1">(*)</span>
        </label>
        <InputText
          placeholder="Mô tả"
          name="description"
          id="description"
          value={dataCategory.description}
          onChange={(e) => handleChangeInputText(e)}
          className={error.description ? "p-invalid" : ""}
          pt={{
            root: "font-family border-round-lg h-3rem mt-2 w-full",
          }}
        />
        {getFormErrorMessage(error, "description")}
      </div>
      <div className="col-12">
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

export default CreateCategoryIngredient;
