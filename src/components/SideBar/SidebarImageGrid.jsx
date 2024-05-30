/* eslint-disable array-callback-return */
import { Image } from "primereact/image";

const SidebarImageGrid = ({ data, title }) => {
  return (
    <div className="grid mb-3">
      <div className="col-12">
        <div className="shadow-2 p-3 border-round-md">
          <div className="grid">
            <div className="col-12 px-1 mt-2">
              <span className="font-semibold px-2 border-left-3 border-orange-500 text-lg text-700 font-family">
                {title}
              </span>
            </div>
            {data.map((item, index) => {
              if (index < 9) {
                return (
                  <div className="col-4 p-1" key={index}>
                    <Image src={item.image} alt="Image" width="100%" />
                  </div>
                );
              }
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidebarImageGrid;
