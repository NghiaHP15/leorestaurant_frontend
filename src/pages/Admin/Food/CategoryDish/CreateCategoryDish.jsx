import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { useEffect, useState } from "react";

const defaultValue = {
  name: "",
  description: "",
};
const defaltError = {
  name: "",
  description: "",
};

function CreateCategoryDish({ mutation, createRef }) {
  const [dataCategory, setDataCategory] = useState(defaultValue);
  const [error, setError] = useState(defaltError);
  const { data, isSuccess, isPending } = mutation;

  useEffect(() => {
    if (isSuccess && data?.data) {
      setDataCategory(defaultValue);
      setError(defaltError);
    }
  }, [isSuccess, data]);

  const accept = () => {
    const _error = { ...error };
    const { name, description } = dataCategory;
    _error.name = name ? "" : "Vui lòng nhập tên";
    _error.description = description ? "" : "Vui lòng nhập mô tả";
    if (name && description) {
      mutation.mutate(dataCategory);
    }
    setError(_error);
  };

  const reject = () => {
    hide();
  };

  const hide = () => {
    setError(defaltError);
    setDataCategory(defaultValue);
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
    return errors[field] ? (
      <small className="p-error">{errors[field]}</small>
    ) : (
      <small className="p-error">&nbsp;</small>
    );
  };

  return (
    <div className="grid px-3 py-2" style={{ minWidth: "1200px" }}>
      <div className="col-6">
        <label htmlFor="description" className="font-family text-color">
          Tên danh mục món<span className="text-red-500 ml-1">(*)</span>
        </label>
        <InputText
          placeholder="Nhập tên danh mục món"
          name="name"
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
          Mô tả danh mục<span className="text-red-500 ml-1">(*)</span>
        </label>
        <InputText
          placeholder="Nhập mô tả danh mục"
          name="description"
          value={dataCategory.description}
          onChange={(e) => handleChangeInputText(e)}
          className={error.description ? "p-invalid" : ""}
          pt={{
            root: "font-family border-round-lg h-3rem mt-2  w-full",
          }}
        />
        {getFormErrorMessage(error, "description")}
      </div>
      <div className="col-12">
        <div className="flex align-items-center gap-2">
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
            className="mr-2 border-round-md font-semibold font-family"
            onClick={reject}
            icon="pi pi-times"
          />
        </div>
      </div>
    </div>
  );
}

export default CreateCategoryDish;
