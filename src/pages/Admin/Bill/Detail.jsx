import { DataTable } from "primereact/datatable";
import {
  formatCurrency,
  formatDate,
  formatTime,
} from "../../../hooks/useFormat";
import { Column } from "primereact/column";
import images from "../../../assets/images";
import config from "../../../config";
import * as BillService from "../../../services/BillService";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Image } from "primereact/image";
import LoadingButton from "../../../components/Loading/LoadingButton";
import LoadingText from "../../../components/Loading/LoadingText";
import { Button } from "primereact/button";
import { useReactToPrint } from "react-to-print";
import { useSelector } from "react-redux";
import { Toast } from "primereact/toast";

const value = {
  code: "",
  booking: {
    food: [],
  },
  timeOn: "",
  timeOut: "",
  name_staff: "",
  isPaid: false,
  paymentMethod: "",
  cancel: {
    status: false,
    reason: "",
  },
};

function Detail() {
  const [dataBill, setDataBill] = useState(value);
  const [loading, setLoading] = useState(false);
  const navigator = useNavigate();
  const location = useLocation();
  const conponentPDF = useRef();
  const toast = useRef(null);
  const user = useSelector((state) => state.user);

  const generatePDF = useReactToPrint({
    content: () => conponentPDF.current,
    documentTitle: "Billdata",
  });

  useEffect(() => {
    if (location.state?.id) {
      const { id } = location.state;
      const fetchData = async () => {
        setLoading(true);
        const [billResult] = await Promise.all([BillService.getDetail(id)]);
        setLoading(false);
        setDataBill(billResult.data);
      };
      fetchData();
    } else {
      navigator(config.router.listBillList);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log(dataBill);

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
          Chưa có mặt hàng nào
        </span>
        <span className="font-light text-500 font-normal font-family mt-1">
          Bạn hãy thêm mới mặt hàng cho thưục đơn này
        </span>
      </div>
    );
  };

  const ispayTemplate = () => {
    let payment;
    let bg_payment;
    if (dataBill.isPaid === true) {
      payment = "Đã thanh toán";
      bg_payment = "bg-green-300";
    }
    if (dataBill.isPaid === false && dataBill.cancel.status === false) {
      payment = "Chưa thanh toán";
      bg_payment = "bg-blue-300";
    }
    if (dataBill.cancel.status === true) {
      payment = "Bị hủy";
      bg_payment = "bg-red-300";
    }
    return (
      <span className={"border-round-xl text-white px-3 py-1 " + bg_payment}>
        {payment}
      </span>
    );
  };

  const nameBodyTemplate = (rowData) => {
    return (
      <div className="flex align-items-center">
        <Image
          src={rowData.item?.image[0]?.path || images.noImage}
          alt={rowData.item?.name}
          width="70"
          height="50"
          preview
          pt={{
            root: "border-round-md overflow-hidden mr-3",
            image: "",
          }}
        />
        <span>{rowData.item?.name}</span>
      </div>
    );
  };

  const priceBodyTemplate = (rowData) => {
    return <span>{formatCurrency(rowData.item?.priceSale || 0)} VNĐ</span>;
  };

  const priceTotalBodyTemplate = (rowData) => {
    return (
      <span>
        {formatCurrency(
          (rowData.item?.priceSale - (rowData.item?.priceSell || 0)) *
            rowData.amount
        ) || 0}{" "}
        VNĐ
      </span>
    );
  };

  return (
    <div className="relative">
      {loading ? (
        <></>
      ) : (
        <Button
          label="In hóa đơn"
          className="absolute font-family font-semibold"
          icon="pi pi-print font-semibold"
          severity="info"
          text
          style={{ top: "20px", left: "25px" }}
          onClick={generatePDF}
        />
      )}
      <div ref={conponentPDF} style={{ width: "100%" }}>
        <div className="p-4 mt-4 shadow-2 bg-white border-round-xl ">
          <div className="grid">
            <div className="col-12 flex justify-content-center">
              {loading ? (
                <LoadingText
                  width={"180px"}
                  height={"25px"}
                  loading={loading}
                />
              ) : (
                <span className="text-2xl font-semibold font-family text-color-secondary">
                  Chi tiết đơn hàng
                </span>
              )}
            </div>
            <div className="col-8">
              <div className="grid">
                <div className="col-12">
                  {loading ? (
                    <LoadingButton
                      width={"100%"}
                      height={"8rem"}
                      loading={loading}
                    />
                  ) : (
                    <div className="border-1 surface-border border-round-sm">
                      <span className="text-900 font-bold font-family bg-bluegray-50 block border-bottom-1 surface-border p-3 text-color-secondary">
                        Thu ngân
                      </span>
                      <div className="p-3 flex flex-column font-family">
                        <span className="mb-2 font-family font-medium ">
                          Tên thu ngân: {user.staff?.name || "Người dùng"}
                        </span>
                        <span className="font-family">
                          Vai trò: {user.staff?.role_name || "Chức vụ"}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
                <div className="col-12">
                  {loading ? (
                    <LoadingButton
                      width={"100%"}
                      height={"8rem"}
                      loading={loading}
                    />
                  ) : (
                    <div className="border-1 surface-border border-round-sm h-9rem">
                      <span className="text-900 font-bold font-family bg-bluegray-50 block border-bottom-1 surface-border p-3 text-color-secondary">
                        Khách hàng
                      </span>
                      <div className="p-3 flex flex-column font-family">
                        <span className="font-medium mb-2">
                          Tên khách hàng: {dataBill.booking?.customer_name} -{" "}
                          {dataBill.booking?.phone}
                        </span>
                        <span>Địa chỉ: {dataBill.booking?.address}</span>
                      </div>
                    </div>
                  )}
                </div>
                <div className="col-12">
                  {loading ? (
                    <LoadingButton
                      width={"100%"}
                      height={"10rem"}
                      loading={loading}
                    />
                  ) : (
                    <DataTable
                      value={dataBill.booking.food}
                      tableStyle={{ minWidth: "30rem" }}
                      emptyMessage={emptyTemplate}
                      dataKey="_id"
                      className="font-family"
                    >
                      <Column
                        field=""
                        header="Tên mặt hàng"
                        body={nameBodyTemplate}
                      ></Column>
                      <Column field="amount" header="Số lượng"></Column>
                      <Column
                        field=""
                        header="Đơn giá"
                        body={priceBodyTemplate}
                      ></Column>
                      <Column
                        field=""
                        header="Tổng tiền"
                        body={priceTotalBodyTemplate}
                      ></Column>
                    </DataTable>
                  )}
                </div>
              </div>
            </div>
            <div className="col-4">
              {loading ? (
                <LoadingButton
                  width={"100%"}
                  height={"8rem"}
                  loading={loading}
                />
              ) : (
                <div className="mb-3 border-1 surface-border border-round-sm font-family bg-bluegray-50 p-3">
                  <div className="mb-2">
                    <span className="font-medium">Đơn hàng: </span>
                    <span className="text-orange-500">{dataBill.code}</span>
                  </div>
                  <div className="mb-3 flex flex-column ">
                    <span className="mb-1">
                      Nhận bàn: {formatDate(dataBill.timeOn)} -{" "}
                      {formatTime(dataBill.timeOn)}
                    </span>
                    <span>
                      Trả bàn: {formatDate(dataBill.timeOut)} -{" "}
                      {formatTime(dataBill.timeOut)}
                    </span>
                  </div>
                  {ispayTemplate()}
                </div>
              )}
              <div className="border-1 surface-border border-round-sm mb-3">
                {loading ? (
                  <LoadingButton
                    width={"100%"}
                    height={"10rem"}
                    loading={loading}
                  />
                ) : (
                  <>
                    <span className="text-900 font-bold font-family bg-bluegray-50 block border-bottom-1 surface-border p-3 text-color-secondary">
                      Thông tin đặt bàn
                    </span>
                    <div className="p-3 font-family">
                      <div className="flex justify-content-between mb-2">
                        <span className="text-color-secondary font-medium">
                          Ngày đặt bàn
                        </span>
                        <span className="">
                          {formatDate(dataBill.booking?.date)}
                        </span>
                      </div>
                      <div className="flex justify-content-between mb-2">
                        <span className="text-color-secondary font-medium">
                          Giờ đặt bàn
                        </span>
                        <span className="">
                          {formatTime(dataBill.booking?.time)}
                        </span>
                      </div>
                      <div className="flex justify-content-between mb-2">
                        <span className="text-color-secondary font-medium">
                          Số lượng người
                        </span>
                        <span className="">
                          {dataBill.booking?.number_of_guest}
                        </span>
                      </div>
                      <div className="flex justify-content-between mb-2">
                        <span className="text-color-secondary font-medium">
                          Tên bàn
                        </span>
                        <span className="">
                          {dataBill.booking?.table?.name}
                        </span>
                      </div>
                      <div className="flex justify-content-between mb-2">
                        <span className="text-color-secondary font-medium">
                          Loại bàn
                        </span>
                        <span className="">
                          {dataBill.booking?.table?.categoryTable?.name}
                        </span>
                      </div>
                      <div className="flex justify-content-between mb-2">
                        <span className="text-color-secondary font-medium">
                          Ghi chú
                        </span>
                        <span className="">{dataBill.booking?.note}</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
              {loading ? (
                <LoadingButton
                  width={"100%"}
                  height={"6rem"}
                  loading={loading}
                />
              ) : (
                <div className="border-1 surface-border border-round-sm mb-3">
                  <span className="text-900 font-bold font-family bg-bluegray-50 block border-bottom-1 surface-border p-3 text-color-secondary">
                    Phương thức thanh toán
                  </span>
                  <div className="p-3 font-family">
                    <div className="flex justify-content-between mb-2">
                      <span className="text-color-secondary font-medium">
                        Thanh toán
                      </span>
                      <span className="font-medium">
                        {dataBill.paymentMethod}
                      </span>
                    </div>
                  </div>
                </div>
              )}
              {loading ? (
                <LoadingButton
                  width={"100%"}
                  height={"6rem"}
                  loading={loading}
                />
              ) : (
                <div className="border-1 surface-border border-round-sm">
                  <div className="p-3 font-family">
                    <div className="flex justify-content-between mb-2">
                      <span className="text-color-secondary font-medium">
                        Tạm tính
                      </span>
                      <span className=" font-medium">
                        {formatCurrency(dataBill.booking?.priceSale || 0) +
                          " VND"}
                      </span>
                    </div>
                    <div className="flex justify-content-between mb-2">
                      <span className="text-color-secondary font-medium">
                        Khuyến mãi
                      </span>
                      <span className="font-medium">
                        {formatCurrency(dataBill.booking?.priceSell || 0) +
                          " VND"}
                      </span>
                    </div>
                    <div className="flex justify-content-between mb-2">
                      <span className="text-color-secondary font-medium">
                        Thành tiền
                      </span>
                      <span className=" font-medium">
                        {formatCurrency(
                          dataBill.booking?.priceSale -
                            dataBill.booking?.priceSell || 0
                        ) + " VND"}
                      </span>
                    </div>
                    <div className="flex justify-content-between flex-wrap border-top-2 border-200 pt-3">
                      <div className="flex flex-column">
                        <span className="font-medium">Cần thanh toán </span>
                        <span className="text-color-secondary">
                          ({dataBill.booking?.food?.length} mặt hàng)
                        </span>
                      </div>
                      <span className="text-red-500 text-xl font-medium">
                        {formatCurrency(
                          dataBill.booking?.priceSale -
                            dataBill.booking?.priceSell || 0
                        ) + " VND"}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
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

export default Detail;
