import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "primereact/button";
import { ConfirmPopup } from "primereact/confirmpopup";
import { OverlayPanel } from "primereact/overlaypanel";
import { useEffect, useRef, useState } from "react";
import { DataView } from "primereact/dataview";
import * as BookingService from "../../../../services/BookingService";
import * as BillService from "../../../../services/BillService";
import { Dropdown } from "primereact/dropdown";
import { useNavigate } from "react-router-dom";
import config from "../../../../config";
import {
  faCircleCheck,
  faClock,
  faEllipsis,
  faMoneyBill1Wave,
  faQuestion,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { userMutationHook } from "../../../../hooks/useMutationHook";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import images from "../../../../assets/images";
import {
  formatCurrency,
  formatDate,
  formatInt,
  formatTime,
} from "../../../../hooks/useFormat";

const dataBill = {
  booking: "",
  timeOn: "",
  timeOut: "",
  name_staff: "",
};

const ItemTemplate = ({ product, confirmDelete }) => {
  const menu = useRef(null);
  const navigator = useNavigate();

  const mutationBill = userMutationHook((data) => BillService.createBill(data));

  const mutationBooking = userMutationHook((data) =>
    BookingService.editBooking(data._id, data)
  );

  const handleSelectItem = (id) => {
    navigator(config.router.tableSelectItem, {
      state: {
        id: id,
      },
    });
  };

  const handleSelectTable = (id) => {
    navigator(config.router.tableSelectTable, {
      state: {
        id: id,
      },
    });
  };

  const handleAddBill = (data) => {
    const time = new Date();
    const _data = { ...data };
    // const _table = { ..._data.table };
    const _dataBill = { ...dataBill };
    _data.reciveStatus = true;
    _dataBill.booking = _data._id;
    _dataBill.timeOn = time;
    // _table.receive = true;
    mutationBill.mutate(_dataBill);
    // mutationTable.mutate(_table);
    mutationBooking.mutate(_data);
    navigator(config.router.listBill);
  };

  return (
    <div className="col-4 ">
      <div className="shadow-1 border-round-md font-family p-3">
        <div className="bg-orange-300 border-round-top-md align-items-center flex justify-content-center h-3rem w-full">
          <span className="text-white font-medium">
            {product.customer_name} - {product.phone}
          </span>
        </div>
        <div className="flex align-items-center">
          <div className="w-5 text-center ">
            {product.table ? (
              <span className="text-3xl text-orange-500 font-semibold">
                {formatInt(product.table.name)}
              </span>
            ) : (
              <FontAwesomeIcon
                icon={faQuestion}
                className="text-3xl text-orange-500"
              />
            )}
          </div>
          <div className="w-8 border-left-2 border-200 ">
            <div className="flex justify-content-between px-5 py-3 border-bottom-2 border-200">
              <span>
                <FontAwesomeIcon
                  icon={faClock}
                  className="text-orange-500 mr-2"
                />
                {formatDate(product.date)}-{formatTime(product.time)}
              </span>
              <span>
                <FontAwesomeIcon
                  icon={faUser}
                  className="text-orange-500 mr-2"
                />
                {product.number_of_guest}
              </span>
            </div>
            <div className="flex justify-content-center py-3">
              <span>
                <FontAwesomeIcon
                  icon={faMoneyBill1Wave}
                  className="text-orange-500 mr-2"
                />
                {formatCurrency(product.priceSale - product.priceSell) + " "}
                VNĐ
              </span>
            </div>
          </div>
        </div>
        <div className="flex h-3rem bg-orange-300 border-round-bottom-md">
          <ConfirmPopup />
          <div className="w-5 align-items-center flex justify-content-center relative">
            <Button
              icon={
                <FontAwesomeIcon
                  icon={faEllipsis}
                  className="text-white text-2xl relative "
                />
              }
              text
              className="border-none shadow-none"
              onClick={(e) => menu.current.toggle(e)}
            />
            <OverlayPanel
              ref={menu}
              pt={{
                content: "p-2",
              }}
            >
              <ul className="list-none p-0 m-0 font-family">
                <li
                  className="py-2 px-3 hover:surface-100"
                  onClick={() => handleSelectTable(product._id)}
                >
                  <span>
                    <i className="pi pi-arrow-right-arrow-left mr-2 text-green-400"></i>
                    Chuyển bàn
                  </span>
                </li>
                <li
                  className="py-2 px-3 hover:surface-100"
                  onClick={() => handleSelectItem(product._id)}
                >
                  <span>
                    <i className="pi pi-plus mr-2 text-blue-400"></i>Chọn món
                  </span>
                </li>
                <li
                  className="py-2 px-3 hover:surface-100"
                  onClick={() => confirmDelete(product)}
                >
                  <span>
                    <i className="pi pi-times mr-2 text-red-500"></i>Hủy bàn
                  </span>
                </li>
              </ul>
            </OverlayPanel>
          </div>
          <div className="w-8 align-items-center flex justify-content-center">
            <span
              className="text-white cursor-pointer"
              onClick={() => handleAddBill(product)}
            >
              Khách nhận bàn
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

function TableSchedule() {
  const [booking, setBooking] = useState("");
  const [sortKey, setSortKey] = useState("");
  const [sortOrder, setSortOrder] = useState(0);
  const [sortField, setSortField] = useState("");
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [value, setValue] = useState("");
  const toast = useRef(null);
  const navigator = useNavigate();
  const sortOptions = [
    { label: "Sắp xếp tăng dần", value: "!table" },
    { label: "Sắp xếp giảm dần", value: "table" },
    { label: "Mặc định", value: "" },
  ];

  const mutationEdit = userMutationHook((data) =>
    BookingService.editBooking(data._id, data)
  );

  const { data: dataEdit } = mutationEdit;

  useEffect(() => {
    const fetchData = async () => {
      const [resultBooking] = await Promise.all([BookingService.listBooking()]);
      const _booking = resultBooking.data.filter(
        (item) => item.reciveStatus === false && item.cancel === false
      );
      setBooking(_booking);
    };
    fetchData();
  }, [dataEdit]);

  const onSortChange = (event) => {
    const value = event.value;

    if (value.indexOf("!") === 0) {
      setSortOrder(-1);
      setSortField(value.substring(1, value.length));
      setSortKey(value);
    } else {
      setSortOrder(1);
      setSortField(value);
      setSortKey(value);
    }
  };

  const comfirmDelete = (product) => {
    setDeleteDialog(true);
    setValue(product);
  };
  const hideDeleteDialog = () => {
    setDeleteDialog(false);
  };

  const deleteValue = () => {
    const _value = { ...value };
    _value.cancel = true;
    mutationEdit.mutate(_value);
    hideDeleteDialog();
    toast.current.show({
      severity: "success",
      summary: "Thành công",
      detail: `Xóa dữ liệu ${value.customer_name} thành công`,
      icon: (
        <FontAwesomeIcon
          icon={faCircleCheck}
          className="text-green-500 h-2rem"
        />
      ),
      life: 3000,
    });
  };

  const listTemplate = (items) => {
    if (!items || items.length === 0) return null;

    let list = items.map((product, index) => {
      return (
        <ItemTemplate
          product={product}
          key={index}
          confirmDelete={comfirmDelete}
          mutation={mutationEdit}
        />
      );
    });

    return <div className="grid">{list}</div>;
  };
  const header = () => {
    return (
      <div className="flex justify-content-between">
        <Button
          label="Thêm đặt bàn"
          severity="info"
          icon="pi pi-plus"
          onClick={() => navigator(config.router.createTableSchedule)}
        />
        <Dropdown
          options={sortOptions}
          value={sortKey}
          optionLabel="label"
          placeholder="Sắp xếp bàn"
          onChange={onSortChange}
          className="w-full sm:w-14rem font-family"
        />
      </div>
    );
  };

  return (
    <>
      <div className="p-4 mt-4 shadow-2 bg-white border-round-xl">
        <DataView
          value={booking}
          dataKey="_id"
          header={header()}
          listTemplate={listTemplate}
          paginator
          rows={9}
          sortField={sortField}
          sortOrder={sortOrder}
          pt={{ header: "mb-4 boder-none" }}
        />
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
                Bạn chắc chắn muốn hủy <b>{value.name}</b>?
              </span>
            </div>
          )}
        </div>
      </Dialog>
    </>
  );
}

export default TableSchedule;
