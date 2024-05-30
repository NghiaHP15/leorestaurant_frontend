import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DataView } from "primereact/dataview";
import * as AreaService from "../../../../services/AreaService";
import * as BookingService from "../../../../services/BookingService";
import * as TableService from "../../../../services/TableService";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { userMutationHook } from "../../../../hooks/useMutationHook";
import config from "../../../../config";
import { Toast } from "primereact/toast";
import Loading from "../../../../components/Loading/Loading";
import {
  faCircleCheck,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";

const ItemCatalog = ({ data, setListTable, active, onClick }) => {
  const handleActive = () => {
    setListTable(data.table);
    onClick();
  };
  return (
    <div
      className="p-3 border-round-md"
      style={{
        background: active
          ? " linear-gradient(90deg, rgba(24,99,172,1) 0%, rgba(12,111,207,0.9) 49%, rgb(15 108 198 / 77%) 84%, rgba(0,124,244,0.8) 100%)"
          : "",
      }}
      onClick={handleActive}
    >
      <span
        className={
          active ? "text-white mr-2 font-family" : "text-color mr-2 font-family"
        }
      >
        <FontAwesomeIcon
          icon={faLocationDot}
          className={active ? "text-white mr-2" : "text-color mr-2"}
        />
        {data?.name}
      </span>
    </div>
  );
};

const ItemTable = ({ product, handleSelectTable }) => {
  let bg_color = "";

  bg_color = product.receive
    ? "bg-red-200"
    : product.status
    ? "bg-blue-200"
    : "";

  return (
    <div className="col-3">
      <div
        className={`relative cursor-pointer shadow-1 border-round-md p-3 flex justify-content-center align-items-center h-7rem ${bg_color} `}
        onClick={handleSelectTable}
      >
        <span className="text-lg font-semibold">{product.name}</span>
      </div>
    </div>
  );
};

function SelectTable() {
  const [area, setArea] = useState([]);
  const [listTable, setListTable] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [dataBooking, setDataBooking] = useState({});
  const [table, setTable] = useState({ current: "", new: "" });
  const navigator = useNavigate();
  const location = useLocation();
  const toast = useRef(null);

  const mutation = userMutationHook((data) =>
    BookingService.editBooking(data._id, data)
  );
  const { data, isSuccess, isPending } = mutation;

  const mutationTable = userMutationHook((data) =>
    TableService.moveTable(data.current, data.new)
  );
  const { data: dataTable } = mutationTable;

  useEffect(() => {
    if (isSuccess && data?.data) {
      toast.current.show({
        severity: "success",
        summary: "Thành công",
        detail: `Chuyển bàn ${dataBooking.customer_name} thành công`,
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
    if (location.state?.id) {
      const { id } = location.state;
      const fetchData = async () => {
        const [resultBooking] = await Promise.all([
          BookingService.getDetail(id),
        ]);
        setDataBooking(resultBooking.data);
        setTable({ ...table, current: resultBooking.data.table._id });
      };
      fetchData();
    } else {
      navigator(config.router.tableSchedule);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, dataTable]);

  useEffect(() => {
    const fetchData = async () => {
      const [resultArea] = await Promise.all([AreaService.listArea()]);
      setArea(resultArea.data);
      setListTable(resultArea.data[activeTab].table);
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, dataTable]);

  const handleSelectTable = (data, index) => {
    if (data.status === false && data.receive === false) {
      const _dataBooking = { ...dataBooking };
      _dataBooking.table = data;
      const _table = { ...table };
      _table.new = _dataBooking.table._id;
      mutationTable.mutate(_table);
      mutation.mutate(_dataBooking);
    }
  };

  const listTemplate = (items) => {
    if (!items || items.length === 0) return null;

    let list = items.map((product, index) => {
      return (
        <ItemTable
          product={product}
          key={index}
          handleSelectTable={() => handleSelectTable(product, index)}
        />
      );
    });

    return <div className="grid">{list}</div>;
  };
  const header = () => {
    const table = area.flatMap((item) => item.table);
    const empty = table
      .map((item) => item.status === false)
      .filter((item) => item === true).length;
    const receive = table
      .map((item) => item.status === true && item.receive === false)
      .filter((item) => item === true).length;
    const action = table
      .map((item) => item.receive === true)
      .filter((item) => item === true).length;

    return (
      <div className="flex justify-content-end">
        <div className="flex align-items-center">
          <div className="shadow-2 h-1rem w-1rem border-circle mr-2 bg-red-200 "></div>
          <span>
            Đang có khách {action}/{table.length}
          </span>
        </div>
        <div className="flex align-items-center ml-3">
          <div className="shadow-2 h-1rem w-1rem border-circle mr-2 "></div>
          <span>
            Bàn trống {empty}/{table.length}
          </span>
        </div>
        <div className="flex align-items-center ml-3">
          <div className="shadow-2 h-1rem w-1rem border-circle mr-2  bg-blue-200"></div>
          <span>
            Bàn đã được đặt {receive}/{table.length}
          </span>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="grid relative">
        <div className="col-3 ">
          <div className=" p-2 shadow-2 bg-white border-round-xl">
            {area.map((item, index) => {
              const check = activeTab === index;
              return (
                <ItemCatalog
                  data={item}
                  key={index}
                  setListTable={setListTable}
                  active={check}
                  onClick={() => setActiveTab(index)}
                />
              );
            })}
          </div>
        </div>
        <div className="col-9 ">
          <div className="p-4 shadow-2 bg-white border-round-xl">
            <DataView
              value={listTable}
              dataKey="_id"
              header={header()}
              listTemplate={listTemplate}
              pt={{ header: "mb-4 border-none bg-transparent" }}
            />
          </div>
          <Toast
            ref={toast}
            pt={{
              content: "bg-white text-color align-items-center",
            }}
          />
        </div>
        {isPending && <Loading />}
      </div>
    </>
  );
}

export default SelectTable;
