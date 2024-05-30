import { DataTable } from "primereact/datatable";
import {
  formatCurrency,
  formatDate,
  formatTime,
} from "../../../../hooks/useFormat";
import { Column } from "primereact/column";
import images from "../../../../assets/images";
import config from "../../../../config";
import * as BookingService from "../../../../services/BookingService";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Image } from "primereact/image";
import LoadingButton from "../../../../components/Loading/LoadingButton";
import LoadingText from "../../../../components/Loading/LoadingText";

const value = {
  customer_name: "",
  phone: "",
  address: "",
  number_of_guest: 0,
  date: "",
  time: "",
  reciveStatus: false,
  priceSale: 0,
  priceSell: 0,
  note: "",
};

function DetailTableList() {
  const [dataBooking, setDataBooking] = useState(value);
  const [loading, setLoading] = useState(false);
  const navigator = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.id) {
      const { id } = location.state;
      const fetchData = async () => {
        setLoading(true);
        const [billResult] = await Promise.all([BookingService.getDetail(id)]);
        setLoading(false);
        setDataBooking(billResult.data);
      };
      fetchData();
    } else {
      navigator(config.router.listBillList);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  console.log(dataBooking);

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

  const reciveTemplate = () => {
    let payment;
    let bg_payment;

    if (dataBooking.reciveStatus === true) {
      payment = "Đã nhận bàn";
      bg_payment = "bg-green-300";
    } else {
      payment = "Chưa nhận bàn";
      bg_payment = "bg-blue-300";
    }
    if (dataBooking.reciveStatus === false && dataBooking.cancel === true) {
      payment = "Đã hủy đặt";
      bg_payment = "bg-red-300";
    }

    return (
      <>
        <span className="mr-2">Trạng thái:</span>
        <span className={"border-round-xl text-white px-3 py-1 " + bg_payment}>
          {payment}
        </span>
      </>
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
    <div className="p-4 mt-4 shadow-2 bg-white border-round-xl">
      <div className="grid">
        <div className="col-12 flex justify-content-center">
          {loading ? (
            <LoadingText width={"180px"} height={"25px"} loading={loading} />
          ) : (
            <span className="text-2xl font-semibold font-family text-color-secondary">
              Chi tiết đặt bàn
            </span>
          )}
        </div>
        <div className="col-12">
          <div className="grid">
            <div className="col-4">
              {loading ? (
                <LoadingButton
                  width={"100%"}
                  height={"8rem"}
                  loading={loading}
                />
              ) : (
                <div className="border-1 surface-border border-round-sm font-family bg-bluegray-50 p-3 h-8rem">
                  <div className="mb-2">
                    <span className="font-medium">Thời gian đặt:</span>
                    <span className="">
                      {formatDate(dataBooking.date)} -{" "}
                      {formatTime(dataBooking.time)}
                    </span>
                  </div>
                  <div className="mb-2 flex">
                    <span className="mb-1">Tên bàn: </span>
                    <span>{dataBooking.table?.name}</span>
                  </div>

                  {reciveTemplate()}
                </div>
              )}
            </div>
            <div className="col-4">
              {loading ? (
                <LoadingButton
                  width={"100%"}
                  height={"8rem"}
                  loading={loading}
                />
              ) : (
                <div className="border-1 surface-border border-round-sm h-8rem">
                  <span className="text-900 font-bold font-family bg-bluegray-50 block border-bottom-1 surface-border p-3 text-color-secondary">
                    Khách hàng
                  </span>
                  <div className="p-3 flex flex-column font-family">
                    <span className="font-medium mb-2">
                      {dataBooking?.customer_name} - {dataBooking?.phone}
                    </span>
                    <span>{dataBooking?.address}</span>
                  </div>
                </div>
              )}
            </div>
            <div className="col-4">
              {loading ? (
                <LoadingButton
                  width={"100%"}
                  height={"8rem"}
                  loading={loading}
                />
              ) : (
                <div className="border-1 surface-border border-round-sm h-8rem">
                  <span className="text-900 font-bold font-family bg-bluegray-50 block border-bottom-1 surface-border p-3 text-color-secondary">
                    Đơn giá
                  </span>
                  <div className="p-3 flex flex-column font-family">
                    <div className="flex">
                      <span className="font-medium mb-2">Giá bán: </span>
                      <span>
                        {formatCurrency(dataBooking?.priceSale || 0)} VND
                      </span>
                    </div>
                    <div className="flex">
                      <span className="font-medium mb-2">Giá khuyến mãi: </span>
                      <span>
                        {formatCurrency(dataBooking?.priceSell || 0)} VND
                      </span>
                    </div>
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
                  value={dataBooking.food}
                  tableStyle={{ minWidth: "50rem" }}
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
      </div>
    </div>
  );
}

export default DetailTableList;
