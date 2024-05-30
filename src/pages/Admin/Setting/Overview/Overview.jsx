import { Avatar } from "primereact/avatar";
import images from "../../../../assets/images";
import config from "../../../../config";
import { Link } from "react-router-dom";

const data = [
  {
    name: "Thông tin nhà hàng",
    discription: "Xem và điều chỉnh thông tin nhà hàng",
    image: images.infor,
    path: config.router.settingInfor,
  },
  {
    name: "Thiết lập cơ sở",
    discription: "Xem và điều chỉnh thông tin cơ sở",
    image: images.brand,
    path: config.router.settingBrand,
  },
  {
    name: "Khu vực và bàn",
    discription: "Xem và điều chỉnh thông tin khu vực bàn",
    image: images.areTable,
    path: config.router.settingAreaTablr,
  },
  {
    name: "Thiết lập loại bàn",
    discription: "Xem và điều chỉnh thông tin loại bàn",
    image: images.table,
    path: config.router.settingTable,
  },
  {
    name: "Thiết lập banner",
    discription: "Xem và điều chỉnh thông tin banner website",
    image: images.banner,
    path: config.router.settingBanner,
  },
  {
    name: "Thiết lập hình ảnh",
    discription: "Xem và điều chỉnh thông tin bộ sưu tập",
    image: images.image,
    path: config.router.settingImage,
  },
];

const ItemTemplate = ({ data }) => {
  return (
    <div className="col-4">
      <Link to={data.path} className="no-underline">
        <div className="p-4 border-300 border-1 border-round-md hover:surface-50">
          <div className="flex justify-content-between align-items-center">
            <div className="flex flex-column font-family ">
              <span className="text-md font-semibold mb-2 text-color">
                {data.name}
              </span>
              <span className="text-500 font-italic">{data.discription}</span>
            </div>
            <div>
              <Avatar
                image={data.image}
                style={{ height: "100px", width: "auto" }}
                shape="circle"
              />
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

function Overview() {
  return (
    <div className="grid mt-4 p-5 shadow-2 bg-white border-round-xl">
      {data.map((item, index) => (
        <ItemTemplate data={item} key={index} />
      ))}
    </div>
  );
}

export default Overview;
