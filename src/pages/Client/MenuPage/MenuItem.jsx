import { useLocation, useNavigate } from "react-router-dom";
import * as MenuSevice from "../../../services/MenuSevice";
import { useEffect } from "react";
import { useState } from "react";
import { DataView } from "primereact/dataview";
import { formatCurrency } from "../../../hooks/useFormat";
import classNames from "classnames/bind";
import config from "../../../config";
const cx = classNames.bind();

const ItemTable = ({ product }) => {
  return (
    <div className="col-3">
      <div
        className={cx(
          "product-item",
          "p-4 mb-0 border-round-sm relative zIndex1 transition-all transition-duration-400 hover:shadow-2 hover"
        )}
      >
        <div className={cx("product-thumb", "overflow-hidden relative mb-3")}>
          <img
            src={
              product.image[0]?.path ||
              "http://localhost:3000/image/product/yen.jpg"
            }
            alt={product.image.filename}
            className="w-full border-round-sm h-20rem"
          />
          <span
            className="absolute px-3 py-1 border-round-sm bg-black-alpha-70 text-white flex align-items-center font-family"
            style={{ top: "15px", left: "15px" }}
          >
            Mới
          </span>
        </div>
        <div
          className={cx(
            "product-info",
            "flex justify-content-between align-items-center"
          )}
        >
          <h4
            className={cx(
              "title",
              "m-0 text-xl font-semibold font-family text-700"
            )}
          >
            {product.name}
          </h4>
          <span
            className={cx(
              "text-lg font-semibold font-italic text-700 font-family"
            )}
          >
            {formatCurrency(product.priceSale) + " VND" || "0 VND"}
          </span>
        </div>
      </div>
    </div>
  );
};

function Menu() {
  const [menu, setMenu] = useState([]);
  const navigator = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.id) {
      const { id } = location.state;
      const fetchData = async () => {
        const [menuResult] = await Promise.all([MenuSevice.detailMenu(id)]);
        setMenu(menuResult.data.item);
      };
      fetchData();
    } else {
      navigator(config.router.menuPage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log(menu);

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
        paginator
        rows={16}
        paginatorClassName="border-none mt-4 paginator-custom"
      />
    </div>
  );
}
export default Menu;
