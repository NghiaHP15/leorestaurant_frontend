import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "primereact/button";
import { ConfirmPopup } from "primereact/confirmpopup";
import { OverlayPanel } from "primereact/overlaypanel";
import { useEffect, useRef, useState } from "react";
import { DataView } from "primereact/dataview";
import * as BillService from "../../../services/BillService";
import * as RecipeService from "../../../services/RecipeService";
import * as InforService from "../../../services/InforService";
import { useNavigate } from "react-router-dom";
import config from "../../../config";
import {
  faCircleCheck,
  faClock,
  faEllipsis,
  faMoneyBill1Wave,
  faQuestion,
  faUserGroup,
} from "@fortawesome/free-solid-svg-icons";
import { userMutationHook } from "../../../hooks/useMutationHook";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import {
  formatCurrency,
  formatInt,
  formatTime,
} from "../../../hooks/useFormat";
import { RadioButton } from "primereact/radiobutton";
import { InputTextarea } from "primereact/inputtextarea";
import { InputNumber } from "primereact/inputnumber";
import images from "../../../assets/images";
import { Image } from "primereact/image";

const ItemTemplate = ({ product, confirmDelete, handlePay, handleQR }) => {
  const menu = useRef(null);
  const pay = useRef(null);
  const navigator = useNavigate();

  const handleSelectItem = (id) => {
    navigator(config.router.billSelectItem, {
      state: {
        id: id,
      },
    });
  };

  const handleSelectTable = (id) => {
    navigator(config.router.billSelectTable, {
      state: {
        id: id,
      },
    });
  };

  return (
    <div className="col-4 ">
      <div className="shadow-1 border-round-md font-family p-3">
        <div className="px-4 bg-orange-300 border-round-top-md align-items-center flex justify-content-between h-3rem w-full">
          <span className="text-white font-medium">
            {product.booking.customer_name}
          </span>
          <div className="text-white flex align-items-center">
            <FontAwesomeIcon icon={faUserGroup} className="text-xs mr-1" />
            <span className=" font-medium">
              {product.booking.number_of_guest}
            </span>
          </div>
        </div>
        <div className="flex align-items-center">
          <div className="w-5 text-center ">
            {product.booking.table ? (
              <span className="text-3xl text-orange-500 font-semibold">
                {formatInt(product.booking.table.name)}
              </span>
            ) : (
              <FontAwesomeIcon
                icon={faQuestion}
                className="text-3xl text-orange-500"
              />
            )}
          </div>
          <div className="w-8 border-left-2 border-200 ">
            <div className="flex justify-content-center px-5 py-3 border-bottom-2 border-200">
              <span>
                <FontAwesomeIcon
                  icon={faClock}
                  className="text-orange-500 mr-2"
                />
                {formatTime(product.timeOn)}
              </span>
            </div>
            <div className="flex justify-content-center py-3">
              <span>
                <FontAwesomeIcon
                  icon={faMoneyBill1Wave}
                  className="text-orange-500 mr-2"
                />
                {formatCurrency(
                  product.booking.priceSale - (product.booking.priceSell || 0)
                ) + " "}
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
                  onClick={() => handleSelectTable(product.booking._id)}
                >
                  <span>
                    <i className="pi pi-arrow-right-arrow-left mr-2 text-green-400"></i>
                    Chuyển bàn
                  </span>
                </li>
                <li
                  className="py-2 px-3 hover:surface-100"
                  onClick={() => handleSelectItem(product.booking._id)}
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
                    <i className="pi pi-times mr-2 text-red-500"></i>Hủy đơn
                  </span>
                </li>
              </ul>
            </OverlayPanel>
          </div>
          <div className="w-8 align-items-center flex justify-content-center">
            <Button
              label="Thanh toán"
              text
              className="border-none shadow-none text-white font-family"
              onClick={(e) => pay.current.toggle(e)}
            />
            <OverlayPanel
              ref={pay}
              pt={{
                content: "p-2",
              }}
            >
              <ul className="list-none p-0 m-0 font-family">
                <li
                  className="py-2 px-3 hover:surface-100"
                  onClick={() => handlePay(product, "Tiền mặt")}
                >
                  <span>
                    <i className="pi pi-money-bill mr-2 text-green-400"></i>
                    Tiền mặt
                  </span>
                </li>
                <li
                  className="py-2 px-3 hover:surface-100"
                  onClick={() => handleQR(product, "Chuyển khoản")}
                >
                  <span>
                    <i className="pi pi-qrcode mr-2 text-blue-400"></i>Quét mã
                    QR
                  </span>
                </li>
              </ul>
            </OverlayPanel>
          </div>
        </div>
      </div>
    </div>
  );
};

const cancel = [
  {
    name: "Khách yêu cầu hủy",
    key: "customer",
  },
  {
    name: "Hết bàn",
    key: "table",
  },
  {
    name: "Lý do khác",
    key: "orther",
  },
];

function ListBill() {
  const [dataBill, setDataBill] = useState("");
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [payDialog, setPayDialog] = useState(false);
  const [qrDialog, setQRDialog] = useState(false);
  const [paidDialog, setPaidDialog] = useState(false);
  const [selectedCancel, setSelectedCancel] = useState(cancel[0]);
  const [reason, setReason] = useState("");
  const [value, setValue] = useState("");
  const [pay, setPay] = useState("");
  const [logoQR, setLogoQR] = useState("");
  const [paid, setPaid] = useState({
    pay: "",
    change: "",
  });
  const navigator = useNavigate();
  const toast = useRef(null);

  const mutation = userMutationHook((data) =>
    BillService.editBill(data._id, data)
  );

  const mutationRecipe = userMutationHook((data) =>
    RecipeService.pointRecipe(data)
  );

  const { data } = mutation;

  useEffect(() => {
    const fetchData = async () => {
      const [resultBill, resultQr] = await Promise.all([
        BillService.listBill(),
        InforService.getInfor(),
      ]);
      const _listData = resultBill.data.filter(
        (item) => item.isPaid === false && item.cancel.status === false
      );
      setDataBill(_listData);
      setLogoQR(resultQr.data[0]?.logo?.logo_qr);
    };
    fetchData();
  }, [data]);

  const comfirmDelete = (product) => {
    setDeleteDialog(true);
    setValue(product);
  };
  const hideDeleteDialog = () => {
    setDeleteDialog(false);
  };

  const handlePay = (product, paymentMethod) => {
    const _product = { ...product };
    _product.paymentMethod = paymentMethod;
    setPayDialog(true);
    setPay(_product);
  };
  const handleQR = (product, paymentMethod) => {
    const _product = { ...product };
    _product.paymentMethod = paymentMethod;
    setQRDialog(true);
    setPay(_product);
  };
  const hidePayDialog = () => {
    setPayDialog(false);
    setPaid({ pay: "", change: "" });
  };
  const hideQRDialog = () => {
    setQRDialog(false);
    setPaid({ pay: "", change: "" });
  };

  const confirmPay = () => {
    const _pay = { ...pay };
    const price = _pay.booking.priceSale - _pay.booking.priceSell;
    const date = new Date();
    if (price && paid.pay >= price) {
      _pay.isPaid = true;
      _pay.timeOut = date;
      _pay.total = price;
      mutation.mutate(_pay);
      mutationRecipe.mutate(_pay);
      setPay(_pay);
      setPaidDialog(true);
      hidePayDialog();
    }
  };

  const confirmPayQr = () => {
    const _pay = { ...pay };
    const price = _pay.booking.priceSale - _pay.booking.priceSell;
    const date = new Date();
    _pay.isPaid = true;
    _pay.timeOut = date;
    _pay.total = price;
    if (price > 0) {
      mutation.mutate(_pay);
      mutationRecipe.mutate(_pay);
      setPay(_pay);
      setPaidDialog(true);
      hideQRDialog();
    }
  };

  const deleteValue = () => {
    const _value = { ...value };
    _value.cancel.status = true;
    _value.cancel.reason = selectedCancel.name;
    if (selectedCancel.key === "orther") {
      _value.cancel.reason = reason;
    }
    console.log(_value);
    mutation.mutate(_value);
    hideDeleteDialog();
    data?.data &&
      toast.current.show({
        severity: "success",
        summary: "Thành công",
        detail: `Hủy đơn của ${value.customer_name} thành công`,
        icon: (
          <FontAwesomeIcon
            icon={faCircleCheck}
            className="text-green-500 h-2rem"
          />
        ),
        life: 3000,
      });
  };

  const handleRadio = (event) => {
    setSelectedCancel(event.value);
  };

  const handlePaidBill = (event) => {
    const money = pay.booking.priceSale - (pay.booking.priceSell || 0);
    const { value } = event;
    const _paid = { ...paid };
    _paid.pay = value;
    _paid.change =
      Number(_paid.pay) > Number(money) ? Number(_paid.pay) - Number(money) : 0;
    setPaid(_paid);
  };

  const handleProfileClick = (rowData) => {
    navigator("list/detail", { state: { id: rowData._id } });
  };

  const listTemplate = (items) => {
    if (!items || items.length === 0) return null;

    // eslint-disable-next-line array-callback-return
    let list = items.map((product, index) => {
      if (product.cancel.status === false) {
        return (
          <ItemTemplate
            product={product}
            key={index}
            confirmDelete={comfirmDelete}
            handlePay={handlePay}
            handleQR={handleQR}
          />
        );
      }
    });
    return <div className="grid">{list}</div>;
  };

  return (
    <>
      <div className="p-4 mt-4 shadow-2 bg-white border-round-xl text-center">
        {dataBill.length === 0 ? (
          <div>
            <img src={images.emptyList} alt="" />
          </div>
        ) : (
          <DataView
            value={dataBill}
            dataKey="_id"
            listTemplate={listTemplate}
            paginator
            rows={9}
            pt={{ header: "mb-4 boder-none" }}
          />
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
        header="Hủy đơn"
        modal
        footer={
          <>
            <Button
              label="Đóng"
              icon="pi pi-times"
              className="px-3 font-medium mr-2"
              severity="info"
              onClick={hideDeleteDialog}
            />
            <Button
              label="Xác nhận"
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
            <div>
              {cancel.map((item) => (
                <div key={item.key} className="flex align-items-center mb-2">
                  <RadioButton
                    inputId={item.key}
                    name="item"
                    value={item}
                    onChange={(e) => handleRadio(e)}
                    checked={selectedCancel.key === item.key}
                  />
                  <label htmlFor={item.key} className="ml-2 font-family">
                    {item.name}
                  </label>
                </div>
              ))}
              <div className="card flex justify-content-center">
                <InputTextarea
                  placeholder="Nhập lý do khác"
                  value={reason}
                  disabled={selectedCancel.key !== "orther"}
                  onChange={(e) => setReason(e.target.value)}
                  rows={5}
                  className="w-full mt-4 font-family"
                  cols={30}
                />
              </div>
            </div>
          )}
        </div>
      </Dialog>
      <Dialog
        visible={payDialog}
        style={{ width: "35rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header={`Thanh toán - ${pay?.booking?.table?.name || ""} - ${
          pay?.booking?.customer_name || ""
        }`}
        pt={{
          header: "font-family text-center font-medium",
        }}
        modal
        footer={
          <>
            <Button
              label="Đóng"
              icon="pi pi-times"
              className="px-3 font-medium mr-2"
              severity="info"
              onClick={hidePayDialog}
            />
            <Button
              label="Xác nhận"
              icon="pi pi-check"
              className="px-3 font-medium font-family"
              severity="danger"
              onClick={confirmPay}
            />
          </>
        }
        onHide={hidePayDialog}
      >
        <div className="confirmation-content font-family">
          <div>
            <div className="p-inputgroup flex-1 mb-3 h-3rem">
              <span className="p-inputgroup-addon surface-100 w-4">
                Cần thanh toán
              </span>
              <InputNumber
                placeholder="Tổng tiền khách thanh toán"
                inputClassName="font-family font-semibold"
                value={pay.booking?.priceSale - (pay.booking?.priceSell || 0)}
                disabled
                suffix=" VND"
                pt={{
                  root: "font-family",
                }}
              />
            </div>
            <div className="p-inputgroup flex-1 mb-3 h-3rem">
              <span className="p-inputgroup-addon surface-100 w-4">
                Khách trả
              </span>
              <InputNumber
                placeholder="Khách thanh toán"
                inputClassName="font-family font-semibold "
                value={paid.pay}
                onChange={(e) => handlePaidBill(e)}
                suffix=" VND"
              />
            </div>
            <div className="p-inputgroup flex-1 mb-3 h-3rem">
              <span className="p-inputgroup-addon surface-100 w-4">
                Tiền thừa
              </span>
              <InputNumber
                placeholder="Tiền thừa"
                value={paid.change}
                disabled
                suffix=" VND"
                inputClassName="font-family font-semibold"
              />
            </div>
          </div>
        </div>
      </Dialog>
      <Dialog
        visible={qrDialog}
        style={{ width: "35rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header={`Thanh toán - ${pay?.booking?.table?.name || ""} - ${
          pay?.booking?.customer_name || ""
        }`}
        pt={{
          header: "font-family text-center font-medium pb-0",
        }}
        modal
        footer={
          <>
            <Button
              label="Đóng"
              icon="pi pi-times"
              className="px-3 font-medium mr-2"
              severity="info"
              onClick={hideQRDialog}
            />
            <Button
              label="Xác nhận"
              icon="pi pi-check"
              className="px-3 font-medium font-family"
              severity="danger"
              onClick={confirmPayQr}
            />
          </>
        }
        onHide={hideQRDialog}
      >
        <div className="confirmation-content font-family">
          <div className="flex justify-content-center">
            <span className="font-medium mb-3 mt-2">
              {formatCurrency(
                (pay.booking?.priceSale || 0) - (pay.booking?.priceSell || 0)
              ) + " VND"}
            </span>
          </div>
          <div className="flex align-items-center justify-content-center">
            <Image src={logoQR} alt="Image" />
          </div>
        </div>
      </Dialog>
      {pay && (
        <Dialog
          visible={paidDialog}
          style={{ width: "35rem" }}
          breakpoints={{ "960px": "75vw", "641px": "90vw" }}
          closable={false}
          modal
          footer={
            <>
              <div className="flex">
                <Button
                  label="Đóng"
                  icon="pi pi-times"
                  className="px-3 font-medium mr-2 w-6"
                  severity="danger"
                  outlined
                  onClick={() => setPaidDialog(false)}
                />
                <Button
                  label="Xem hóa đơn"
                  icon="pi pi-print"
                  className="px-3 font-medium font-family w-6"
                  severity="info"
                  onClick={() => handleProfileClick(pay)}
                />
              </div>
            </>
          }
          onHide={() => setPaidDialog(false)}
        >
          <div className="confirmation-content font-family">
            <div className="flex flex-column align-items-center">
              <FontAwesomeIcon
                icon={faCircleCheck}
                className="text-green-400 h-5rem"
              />
              <span className="font-semibold text-lg mt-3">
                Thanh toán thành công
              </span>
            </div>
          </div>
        </Dialog>
      )}
    </>
  );
}

export default ListBill;
