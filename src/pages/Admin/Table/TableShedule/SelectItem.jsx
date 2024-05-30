import { Button } from "primereact/button";
import { Image } from "primereact/image";
import * as BookingService from "../../../../services/BookingService";
import * as MenuSevice from "../../../../services/MenuSevice";
import images from "../../../../assets/images";
import { useEffect, useRef, useState } from "react";
import { DataView } from "primereact/dataview";
import { formatCurrency } from "../../../../hooks/useFormat";
import { useCounter } from "primereact/hooks";
import { useLocation, useNavigate } from "react-router-dom";
import config from "../../../../config";
import { Badge } from "primereact/badge";
import { userMutationHook } from "../../../../hooks/useMutationHook";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { Toast } from "primereact/toast";

const ItemTable = ({ product, handleOrder }) => {
  return (
    <div className="col-3">
      <div
        className="shadow-1 border-round-md overflow-hidden relative"
        onClick={handleOrder}
      >
        <Image
          src={product.image[0]?.path || images.noImage}
          alt="Image"
          width="100%"
          pt={{
            image: "block",
          }}
        />
        <div className=""></div>
        <div className="absolute bg-black-alpha-40 bottom-0 right-0 left-0 h-4rem flex justify-content-center align-items-center">
          <span className="font-family text-white">{product.name}</span>
        </div>
      </div>
    </div>
  );
};

const ItemList = ({ product, handleRemoveItem, setDataOrder, dataOrder }) => {
  const { count, increment, decrement } = useCounter(product.amount, {
    step: 1,
    min: 0,
  });

  useEffect(() => {
    product.amount = count;
    const _dataOrder = [...dataOrder];
    // eslint-disable-next-line array-callback-return
    _dataOrder.map((item) => {
      if (item.item._id === product.item._id) {
        item = product;
      }
    });
    setDataOrder(_dataOrder);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);

  return (
    <div className="col-12">
      <div className="flex justify-content-between align-items-center">
        <div className="flex align-items-center">
          <Image
            src={product.item?.image[0]?.path || images.noImage}
            alt="Image"
            height="50"
            width="70"
            pt={{
              image: "block mr-2",
            }}
          />
          <span
            className="font-family font-medium white-space-nowrap overflow-hidden text-overflow-ellipsis"
            style={{ width: "100px" }}
          >
            {product.item?.name}
          </span>
        </div>
        <div className="flex flex-wrap align-items-center gap-3 mr-2">
          <Button
            icon="pi pi-plus text-xs text-green-500"
            severity="success"
            className="p-0 bg-white border-300"
            style={{ height: "25px", width: "25px" }}
            onClick={increment}
          ></Button>
          <span>{count}</span>
          <Button
            icon="pi pi-minus text-xs text-red-500"
            severity="danger"
            className="p-0 bg-white border-300"
            style={{ height: "25px", width: "25px" }}
            onClick={decrement}
          ></Button>
        </div>
        <div className="flex align-items-center justify-content-end">
          <span
            className="font-family text-sm text-right mt-1"
            style={{ width: "100px" }}
          >
            {formatCurrency(product.item?.priceSale) + " VNĐ"}
          </span>
          <Button
            icon="pi pi-times "
            text
            severity="danger"
            onClick={handleRemoveItem}
            style={{ height: "25px", width: "25px" }}
            className="ml-1"
          ></Button>
        </div>
      </div>
    </div>
  );
};

function SelectItem() {
  const [dataFood, setDataFood] = useState([]);
  const [dataMenu, setDataMenu] = useState([]);
  const [dataOrder, setDataOrder] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [total, setTotal] = useState({
    priceSale: 0,
    priceSell: 0,
    priceOrigin: 0,
  });
  const [dataBooking, setDataBooking] = useState({});
  const navigator = useNavigate();
  const location = useLocation();
  const toast = useRef(null);

  const mutation = userMutationHook((data) =>
    BookingService.editBooking(data._id, data)
  );
  const { data, isSuccess, isPending } = mutation;

  useEffect(() => {
    if (location.state.id) {
      const { id } = location.state;
      const fetchData = async () => {
        const [resultMenu, resultBooking] = await Promise.all([
          MenuSevice.listMenu(),
          BookingService.getDetail(id),
        ]);
        setDataMenu(resultMenu.data);
        setDataFood(resultMenu.data[0].item);
        setDataBooking(resultBooking.data);
        setDataOrder(resultBooking.data.food);
      };
      fetchData();
    } else {
      navigator(config.router.tableSelectItem);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isSuccess && data?.data) {
      toast.current.show({
        severity: "success",
        summary: "Thành công",
        detail: `Sửa đơn đặt bàn ${dataBooking.customer_name} thành công`,
        icon: (
          <FontAwesomeIcon
            icon={faCircleCheck}
            className="text-green-500 h-2rem"
          />
        ),
        life: 3000,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, data]);

  useEffect(() => {
    const _total = { ...total };
    _total.priceSale = dataOrder.reduce(
      (prev, current) => prev + current.item.priceSale * current.amount,
      0
    );
    _total.priceOrigin = dataOrder.reduce(
      (prev, current) => prev + current.item.priceOrigin * current.amount,
      0
    );
    _total.priceSell = dataOrder.reduce(
      (prev, current) => prev + (current.item.priceSell || 0) * current.amount,
      0
    );
    setTotal(_total);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataOrder]);

  const handleSubmit = () => {
    const _dataBooking = { ...dataBooking };
    _dataBooking.food = dataOrder;
    _dataBooking.priceSale = total.priceSale;
    _dataBooking.priceSell = total.priceSell;
    _dataBooking.priceOrigin = total.priceOrigin;
    mutation.mutate(_dataBooking);
  };

  const handleOrder = (data) => {
    let _dataOrder = [...dataOrder];
    const isCheck = _dataOrder.find((item) => item.item._id === data._id);
    if (!isCheck) {
      _dataOrder = [..._dataOrder, { item: data, amount: 1 }];
      setDataOrder(_dataOrder);
    }
  };

  const handleRemoveItem = (id) => {
    const _dataOrder = [...dataOrder];
    console.log(id);
    console.log(_dataOrder);
    const _data = _dataOrder.filter((item) => item.item._id !== id);
    setDataOrder(_data);
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

  const listTemplate = (items) => {
    if (!items || items.length === 0) return null;

    let list = items.map((product, index) => {
      return (
        <ItemTable
          product={product}
          key={index}
          handleOrder={() => handleOrder(product)}
        />
      );
    });

    return <div className="grid">{list}</div>;
  };

  const listSubTemplate = (items) => {
    if (!items || items.length === 0) return null;

    let list = items.map((product, index) => {
      return (
        <ItemList
          product={product}
          key={index}
          dataOrder={dataOrder}
          setDataOrder={setDataOrder}
          handleRemoveItem={() => handleRemoveItem(product.item._id)}
        />
      );
    });

    return (
      <div>
        <div className="grid">{list}</div>
      </div>
    );
  };

  const ItemCatalog = ({ data, setDataFood, active, onClick }) => {
    const handleActive = () => {
      setDataFood(data.item);
      onClick();
    };

    return (
      <div
        className={
          (active ? "bg-orange-500 " : " ") +
          "border-round-md p-2 shadow-1 text-orange-500 px-4 py-2 mr-2 mb-2"
        }
        onClick={handleActive}
      >
        <span className={(active ? "text-white " : " ") + "font-family "}>
          {data.name}
        </span>
      </div>
    );
  };

  const header = () => {
    return (
      <div className="flex flex-wrap">
        {dataMenu.map((item, index) => {
          const check = activeTab === index;
          return (
            <ItemCatalog
              data={item}
              key={index}
              setDataFood={setDataFood}
              active={check}
              onClick={() => setActiveTab(index)}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div className="mt-4">
      <div className="grid">
        <div className="col-8">
          <div className="shadow-2 bg-white border-round-xl p-4">
            <DataView
              value={dataFood}
              dataKey="_id"
              header={header()}
              listTemplate={listTemplate}
              pt={{ header: "mb-4 p-0 border-none bg-transparent" }}
            />
          </div>
        </div>
        <div className="col-4">
          <div className="shadow-2 bg-white border-round-xl p-4">
            <div className="flex justify-content-start align-items-center border-bottom-2 border-200 font-family pb-3">
              <Badge
                value={dataOrder.length}
                severity="danger"
                className="mr-2"
              ></Badge>
              <span>{dataBooking.customer_name}</span>
              <span className="mx-2">-</span>
              <span>{dataBooking.table?.name || "Chưa có"}</span>
            </div>
            {dataOrder.length > 0 ? (
              <DataView
                value={dataOrder}
                dataKey="_id"
                listTemplate={listSubTemplate}
                pt={{ header: "mb-4 p-0 border-none bg-transparent" }}
              />
            ) : (
              emptyTemplate()
            )}
            <div className="border-top-2 border-200 mt-3">
              <div className="mt-4 flex justify-content-between font-family">
                <span className="font-medium">Tổng tiền:</span>
                <span>
                  {formatCurrency(total.priceSale - total.priceSell) + " VNĐ"}{" "}
                </span>
              </div>
              <div className="mt-4 flex justify-content-start">
                <Button
                  label="Quay lại"
                  severity="info"
                  icon="pi pi-arrow-circle-left"
                  onClick={() => navigator(config.router.tableSchedule)}
                  raised
                  className="font-family p-3 m-2"
                />
                <Button
                  label="Lưu lại"
                  severity="success"
                  onClick={handleSubmit}
                  loading={isPending}
                  raised
                  icon="pi pi-check-circle"
                  className="font-family p-3 m-2"
                />
                <Button
                  label="Hủy bỏ"
                  icon="pi pi-times-circle "
                  severity="danger"
                  onClick={() => setDataOrder([])}
                  raised
                  className="font-family p-3 m-2"
                />
              </div>
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

export default SelectItem;
