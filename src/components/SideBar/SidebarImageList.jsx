/* eslint-disable array-callback-return */
import { Image } from "primereact/image";

const SidebarImageList = ({ data, title }) => {
  return (
    <div className="grid mb-3">
      <div className="col-12">
        <div className="shadow-2 p-3 border-round-md">
          <span className="font-semibold px-2 border-left-3 border-orange-500 text-lg text-700 font-family">
            {title}
          </span>
          <div className="mt-3">
            {data.map((item, index) => {
              if (index < 7) {
                return (
                  <div className="grid align-items-center" key={index}>
                    <div className="col-3">
                      <Image
                        src={item.image}
                        alt="Image"
                        width="100%"
                        imageClassName="border-round-lg"
                      />
                    </div>
                    <div className="col-9">
                      <span
                        className="font-medium font-family"
                        style={{
                          wordWrap: "break-word",
                          WebkitBoxOrient: "vertical",
                          WebkitLineClamp: "2",
                          display: "-webkit-box",
                          overflow: "hidden",
                        }}
                      >
                        {item.name}
                      </span>
                    </div>
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

export default SidebarImageList;
