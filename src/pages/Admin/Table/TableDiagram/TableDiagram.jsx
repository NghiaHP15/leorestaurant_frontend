import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DataView } from "primereact/dataview";
import * as AreaService from "../../../../services/AreaService";
import { useEffect, useState } from "react";

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

const ItemTable = ({ product }) => {
  let bg_color = "";

  bg_color = product.receive
    ? "bg-red-200"
    : product.status === true
    ? "bg-blue-200"
    : "";

  return (
    <div className="col-3">
      <div
        className={`shadow-1 border-round-md p-3 flex justify-content-center align-items-center h-7rem ${bg_color}`}
      >
        <span className="text-lg font-semibold">{product.name}</span>
      </div>
    </div>
  );
};

function TableDiagram() {
  const [area, setArea] = useState([]);
  const [listTable, setListTable] = useState(null);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const [resultArea] = await Promise.all([AreaService.listArea()]);
      setArea(resultArea.data);
      setListTable(resultArea.data[activeTab].table);
    };
    fetchData();
  }, []);

  const listTemplate = (items) => {
    if (!items || items.length === 0) return null;

    let list = items.map((product, index) => {
      return <ItemTable product={product} key={index} />;
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
    <div className="grid">
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
      </div>
    </div>
  );
}

export default TableDiagram;
