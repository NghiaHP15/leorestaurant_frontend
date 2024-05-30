import React, { useEffect, useRef, useState } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import images from "../../../../assets/images";
import * as TableService from "../../../../services/TableService";
import * as RecipeService from "../../../../services/RecipeService";
import * as BookingService from "../../../../services/BookingService";
import * as CustomerService from "../../../../services/CustomerService";
import { Calendar } from "primereact/calendar";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputTextarea } from "primereact/inputtextarea";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import config from "../../../../config";
import { userMutationHook } from "../../../../hooks/useMutationHook";
import { filter, isEqual } from "lodash";
import { Checkbox } from "primereact/checkbox";

const defaultValue = {
  customer_name: "",
  address: "",
  number_of_guest: "",
  date: "",
  time: "",
  table: "",
  note: "",
  priceSale: "",
  priceSell: "",
  priceOrigin: "",
  food: [],
};
const defaltError = {
  customer_name: "",
  phone: "",
  date: "",
  time: "",
};

export default function CreateTableSchedule() {
  const [dataBooking, setDataBooking] = useState(defaultValue);
  const [error, setError] = useState(defaltError);
  const [errorFood, setErrorFood] = useState([]);
  const [table, setTable] = useState(null);
  const [food, setFood] = useState(null);
  const [checkCustomer, setCheckCustomer] = useState(false);
  const navigator = useNavigate();

  const mutation = userMutationHook((data) =>
    BookingService.createBooking(data)
  );
  const { data, isSuccess, isPending } = mutation;

  const mutationCustomer = userMutationHook((data) =>
    CustomerService.createCustomer(data)
  );

  function generateUniqueCode(length = 5) {
    let key = uuidv4().substring(0, length);
    while (true) {
      const existing = dataBooking.food.find(
        // eslint-disable-next-line no-loop-func
        (item) => item.key === key
      );
      if (!existing) {
        break;
      }
      key = uuidv4().substring(0, length);
    }
    return key;
  }

  const getUpdateTable = async (id) => {
    const table = await TableService.getDetail(id);
    const _table = table.data;
    _table.status = true;
    await TableService.editTable(id, _table);
  };

  useEffect(() => {
    if (isSuccess && data?.data) {
      if (data.data.table) {
        getUpdateTable(data.data.table);
      }
      navigator(config.router.tableSchedule);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, isSuccess]);

  useEffect(() => {
    const fetchData = async () => {
      const [resultsTable, resultFood] = await Promise.all([
        TableService.listTable(),
        RecipeService.listRecipe(),
      ]);
      setTable(resultsTable.data);
      setFood(resultFood.data);
    };
    fetchData();
  }, []);

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
    const _errorFood = [...errorFood];
    const _dataBooking = { ...dataBooking };
    const { customer_name, phone, date, time, food } = _dataBooking;
    _error.customer_name = customer_name ? "" : "Vui lòng nhập tên khách hàng";
    _error.phone = phone ? "" : "Vui lòng nhập số điện thoại";
    _error.date = date ? "" : "Vui lòng nhập ngày nhận bàn";
    _error.time = time ? "" : "Vui lòng nhập khung giờ nhận bàn";
    const _food = food.filter((item) => item.item !== "");
    _food.forEach((item, index) => {
      if (!item.amount) {
        _errorFood[index].amount = "Vui lòng nhập số lượng";
      }
    });
    _dataBooking.food = _food;
    const checkItem = !_errorFood.some(
      (item) => item.amount !== "" || item.item !== ""
    );
    if (customer_name && phone && date && time && checkItem) {
      if (checkCustomer) {
        const customer = {
          name: _dataBooking.customer_name,
          phone: _dataBooking.phone,
          address: _dataBooking.address,
        };
        mutationCustomer.mutate(customer);
      }
      mutation.mutate(_dataBooking);
    }
    setError(_error);
    setErrorFood(_errorFood);
  };

  const accept = () => {
    setDataBooking(defaultValue);
    navigator(config.router.recipe);
  };

  const handleAddRowItem = () => {
    const _dataBooking = { ...dataBooking };
    _dataBooking.food = [
      ..._dataBooking.food,
      {
        key: generateUniqueCode(),
        item: "",
        amount: "",
        priceSell: "",
        priceSale: "",
      },
    ];
    setDataBooking(_dataBooking);
    setErrorFood([...errorFood, { item: "", amount: "" }]);
  };

  /// Change Input
  const handleChangeInputText = (event) => {
    const { value, name } = event.target;
    const _dataBooking = { ...dataBooking };
    const _error = { ...error };
    _dataBooking[name] = value;
    _error[name] = "";
    setDataBooking(_dataBooking);
    setError(_error);
  };

  const handleChangeInput = async (event, name) => {
    const { value } = event;
    const _dataBooking = { ...dataBooking };
    const _error = { ...error };
    _dataBooking[name] = value;
    _error[name] = "";
    setDataBooking(_dataBooking);
    setError(_error);
  };

  const handleChangeInputFood = (event, index, field) => {
    const { value } = event;
    const result = food.find((item) => item._id === value);
    const _dataBooking = { ...dataBooking };
    _dataBooking.food[index][field] = value;
    _dataBooking.food[index]["priceSale"] = result.priceSale;
    _dataBooking.food[index]["priceOrigin"] = result.priceOrigin;
    _dataBooking.food[index]["priceSell"] = result.priceSell
      ? result.priceSell
      : "0";
    setDataBooking(_dataBooking);
    checkDuplicates(_dataBooking.food, field);
  };

  const handleChangeInputRow = (event, index, field) => {
    const { value } = event;
    const _errorFood = [...errorFood];
    const _dataBooking = { ...dataBooking };
    _dataBooking.food[index][field] = value;
    _errorFood[index][field] = "";
    if (field === "amount") {
      _dataBooking.priceSale = _dataBooking.food.reduce(
        (prev, current) => prev + current[field] * current.priceSale,
        0
      );
      _dataBooking.priceOrigin = _dataBooking.food.reduce(
        (prev, current) => prev + current[field] * current.priceOrigin,
        0
      );
      _dataBooking.priceSell = _dataBooking.food.reduce(
        (prev, current) => prev + current[field] * current.priceSell,
        0
      );
      _dataBooking.total = _dataBooking.priceSale - _dataBooking.priceSell;
    }
    setDataBooking(_dataBooking);
    setErrorFood(_errorFood);
  };

  const checkDuplicates = (newData, field) => {
    console.log(newData);
    const _errorFood = [...errorFood];
    console.log(field);
    newData.map((x, i) => {
      const check = filter(newData, (item) => {
        return item[field] === x[field] && isEqual(item[field], x[field]);
      });
      if (check.length > 1) {
        _errorFood[i][field] = `Mặt hàng đã có`;
      } else {
        _errorFood[i][field] = "";
      }
    });
    setErrorFood(_errorFood);
  };

  const removeRow = (index, field) => {
    const _dataBooking = { ...dataBooking };
    _dataBooking.priceSale =
      _dataBooking.priceSale - _dataBooking[field][index].priceSale;
    _dataBooking.priceSell =
      _dataBooking.priceSell - _dataBooking[field][index].priceSell;
    _dataBooking[field].splice(index, 1);
    setDataBooking(_dataBooking);
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

  const renderError = (field, rowIndex) => {
    return (
      <span className="text-red-500 text-xs mt-1" style={{ height: 0 }}>
        {errorFood[rowIndex][field]}
      </span>
    );
  };

  const actionBodyTemplate = (value, row, field) => {
    return (
      <Button
        icon="pi pi-trash"
        rounded
        outlined
        severity="danger"
        aria-label="Cancel"
        onClick={() => removeRow(row.rowIndex, field)}
      />
    );
  };
  const emptyTemplate = () => {
    return (
      <div className="flex flex-column align-items-center">
        <img
          src={images.emptyFood}
          alt=""
          style={{ width: "150px" }}
          className="my-3"
        />
        <span className="font-light text-500 font-normal font-family">
          Thực đơn chưa có mặt hàng nào
        </span>
        <span className="font-light text-500 font-normal font-family mt-1">
          Bạn hãy thêm mới mặt hàng cho thưục đơn này
        </span>
      </div>
    );
  };

  return (
    <>
      <div className="grid">
        <div className="col-12">
          <div className="p-4 mt-4 shadow-2 bg-white border-round-xl">
            <div className="grid">
              <div className="col-12 p-3">
                <div className="grid">
                  <div className="col-4">
                    <span className="text-900 font-bold font-family text-color-secondary">
                      Tên khách hàng: <span className="text-red-500">(*)</span>
                    </span>
                    <InputText
                      placeholder="Tên khách hàng"
                      name="customer_name"
                      value={dataBooking.customer_name}
                      onChange={(e) => handleChangeInputText(e)}
                      pt={{
                        root: "font-family border-round-lg h-3rem mt-2 w-full",
                      }}
                    />
                    {getFormErrorMessage(error, "customer_name")}
                  </div>
                  <div className="col-4">
                    <span className="text-900 font-bold font-family text-color-secondary">
                      Số điện thoại: <span className="text-red-500">(*)</span>
                    </span>
                    <InputText
                      placeholder="Số điện thoại"
                      name="phone"
                      value={dataBooking.phone}
                      onChange={(e) => handleChangeInputText(e)}
                      pt={{
                        root: "font-family border-round-lg h-3rem mt-2 w-full",
                      }}
                    />
                    {getFormErrorMessage(error, "phone")}
                  </div>

                  <div className="col-4">
                    <span className="text-900 font-bold font-family text-color-secondary">
                      Địa chỉ:
                    </span>
                    <InputText
                      placeholder="Địa chỉ"
                      name="address"
                      value={dataBooking.address}
                      onChange={(e) => handleChangeInputText(e)}
                      pt={{
                        root: "font-family border-round-lg h-3rem mt-2 w-full",
                      }}
                    />
                    {getFormErrorMessage(error, "address")}
                  </div>
                  <div className="col-4">
                    <span className="text-900 font-bold font-family text-color-secondary">
                      Số lượng khách:
                    </span>
                    <InputNumber
                      value={dataBooking.number_of_guest}
                      onChange={(e) => handleChangeInput(e, "number_of_guest")}
                      placeholder="Số lượng khách"
                      suffix=" Người"
                      className={error.number_of_guest ? "p-invalid" : ""}
                      inputClassName="font-family mt-2 h-3rem border-round-md w-full"
                      pt={{
                        root: "w-full",
                      }}
                    />
                    {getFormErrorMessage(error, "number_of_guest")}
                  </div>
                  <div className="col-4">
                    <span className="text-900 font-bold font-family text-color-secondary">
                      Ngày nhận bàn: <span className="text-red-500">(*)</span>
                    </span>
                    <Calendar
                      value={dataBooking.date}
                      placeholder="Ngày nhận bàn"
                      onChange={(e) => handleChangeInput(e, "date")}
                      inputClassName={"border-round-lg font-family"}
                      pt={{
                        root: "font-family h-3rem mt-2 w-full",
                      }}
                    />
                    {getFormErrorMessage(error, "date")}
                  </div>

                  <div className="col-4">
                    <span className="text-900 font-bold font-family text-color-secondary">
                      Giờ nhận bàn: <span className="text-red-500">(*)</span>
                    </span>
                    <Calendar
                      value={dataBooking.time}
                      placeholder="Giờ nhận bàn"
                      onChange={(e) => handleChangeInput(e, "time")}
                      timeOnly
                      inputClassName="border-round-lg font-family"
                      pt={{
                        root: "font-family h-3rem mt-2 w-full",
                      }}
                    />
                    {getFormErrorMessage(error, "time")}
                  </div>

                  <div className="col-4">
                    <span className="text-900 font-bold font-family text-color-secondary">
                      Chọn bàn trước:
                    </span>
                    <Dropdown
                      placeholder="--- Chọn bàn ---"
                      name="status"
                      options={table}
                      value={dataBooking.table}
                      filter
                      optionLabel="name"
                      optionValue="_id"
                      onChange={(e) => handleChangeInput(e, "table")}
                      pt={{
                        root: "h-3rem w-full align-items-center border-round-lg mt-2",
                        input: "font-family",
                        item: "font-family hover:surface-100 px-4 py-3",
                        list: "p-0 ",
                      }}
                    />
                    {getFormErrorMessage(error, "table")}
                  </div>
                  <div className="col-4">
                    <span className="text-900 font-bold font-family text-color-secondary">
                      Ghi chú thêm:
                    </span>
                    <InputTextarea
                      placeholder="Chi chú"
                      name="note"
                      value={dataBooking.note}
                      onChange={(e) => handleChangeInputText(e, "note")}
                      pt={{
                        root: "font-family border-round-lg h-3rem mt-2 w-full",
                      }}
                    />
                  </div>
                  <div className="col-4 flex align-items-center">
                    <Checkbox
                      inputId="save_customer"
                      checked={checkCustomer}
                      onChange={(e) => setCheckCustomer(e.checked)}
                    />
                    <label
                      htmlFor="save_customer"
                      className="ml-2 font-family cursor-pointer"
                    >
                      Lưu thông tin khách hàng
                    </label>
                  </div>
                </div>
              </div>
              <div className="col-12 p-3">
                <div className="flex justify-content-between align-items-center w-full mb-3">
                  <span className="text-900 font-bold font-family text-color-secondary">
                    Chọn mặt hàng trước:
                  </span>
                  <Button
                    label="Thêm mặt hàng"
                    severity="info"
                    icon="pi pi-plus"
                    onClick={handleAddRowItem}
                  />
                </div>
                <DataTable
                  value={dataBooking.food}
                  className="font-family"
                  dataKey="key"
                  emptyMessage={emptyTemplate}
                >
                  <Column
                    header="Tên món ăn"
                    field="item"
                    body={(value, row) => {
                      return (
                        <div className="flex flex-column">
                          <Dropdown
                            placeholder="--- Chọn món ---"
                            options={food}
                            value={value.item}
                            optionLabel="name"
                            optionValue="_id"
                            onChange={(e) =>
                              handleChangeInputFood(e, row.rowIndex, row.field)
                            }
                            pt={{
                              root: "h-3rem w-full align-items-center border-round-lg",
                              input: "font-family",
                              item: "font-family hover:surface-100 px-4 py-3",
                              list: "p-0 ",
                            }}
                          />
                          {renderError(row.field, row.rowIndex)}
                        </div>
                      );
                    }}
                  ></Column>
                  <Column
                    field="amount"
                    header="Số lượng"
                    body={(value, row) => {
                      return (
                        <div className="flex flex-column">
                          <InputNumber
                            value={value.amount}
                            placeholder="Số lượng"
                            onChange={(e) =>
                              handleChangeInputRow(e, row.rowIndex, row.field)
                            }
                            inputClassName="font-family h-3rem border-round-md w-full"
                            pt={{
                              root: "w-full",
                            }}
                          />
                          {renderError(row.field, row.rowIndex)}
                        </div>
                      );
                    }}
                  ></Column>
                  <Column
                    field="priceSell"
                    header="Khuyến mãi"
                    body={(value, row) => {
                      return (
                        <div className="flex flex-column">
                          <InputText
                            className="h-3rem"
                            placeholder="Khuyến mãi"
                            value={value?.priceSell}
                            disabled
                          />
                          {renderError(row.field, row.rowIndex)}
                        </div>
                      );
                    }}
                  ></Column>
                  <Column
                    field="priceSale"
                    header="Giá bán"
                    body={(value, row) => {
                      return (
                        <div className="flex flex-column">
                          <InputText
                            className="h-3rem"
                            placeholder="Giá tiền"
                            value={value.priceSale}
                            disabled
                          />
                          {renderError(row.field, row.rowIndex)}
                        </div>
                      );
                    }}
                  ></Column>
                  <Column
                    exportable={false}
                    body={(value, row) =>
                      actionBodyTemplate(value, row, "food")
                    }
                  />
                </DataTable>
              </div>
              <div className="col-12 p-3 font-family flex justify-content-end ">
                <div>
                  <span>Giá mặt hàng: </span>
                  <span className="text-red-500">
                    {dataBooking.priceSale} VNĐ
                  </span>
                </div>
                <span className="mx-3">-</span>
                <div>
                  <span>Khuyến mãi: </span>
                  <span className="text-red-500">
                    {dataBooking.priceSell} VNĐ
                  </span>
                </div>
              </div>

              <div className="col-12 p-3 text-right">
                <ConfirmDialog
                  style={{ width: "35vw" }}
                  pt={{
                    headerTitle: "capitalize font-family",
                    content: "font-family",
                    root: "",
                  }}
                />
                <Button
                  label="Hủy"
                  icon="pi pi-times"
                  severity="danger"
                  className="ml-2 h-3rem px-5 border-round-md font-semibold font-family"
                  onClick={confirmDelete}
                />

                <Button
                  label="Lưu lại"
                  icon="pi pi-check"
                  severity="success"
                  loading={isPending}
                  className="ml-3 h-3rem px-5 border-round-md font-semibold font-family"
                  onClick={confirmSave}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
