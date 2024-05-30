import * as MenuSevice from "../../../services/MenuSevice";
import { useEffect } from "react";
import { useState } from "react";
import { DataView } from "primereact/dataview";
import { useNavigate } from "react-router-dom";

const ItemTable = ({ product }) => {
  const navigator = useNavigate();

  const handleProfileClick = (rowData) => {
    navigator("food", { state: { id: rowData._id } });
  };

  return (
    <div className="col-3">
      <div className="p-2 m-1 border-round-3xl shadow-3">
        <div onClick={() => handleProfileClick(product)}>
          <div
            className="relative border-round-2xl bg-repeat bg-cover bg-center "
            style={{
              background: `url(${product.image})`,
              height: "250px",
            }}
          >
            <div className="absolute flex flex-column align-items-center justify-content-center bottom-0 left-0 right-0 h-4rem border-round-bottom-2xl bg-black-alpha-70 font-family">
              <span className="text-white text-lg font-semibold ">
                {product.name}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function MenuPage() {
  const [menu, setMenu] = useState();

  useEffect(() => {
    const fetchData = async () => {
      const [resultArea] = await Promise.all([MenuSevice.listMenu()]);
      setMenu(resultArea.data);
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

  return (
    <div className="container container-custom mt-6">
      <DataView
        value={menu}
        dataKey="_id"
        listTemplate={listTemplate}
        pt={{ header: "mb-4 border-none bg-transparent" }}
      />
    </div>
  );
}
export default MenuPage;
