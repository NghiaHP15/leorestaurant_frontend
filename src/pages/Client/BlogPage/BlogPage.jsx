/* eslint-disable array-callback-return */
import React, { useEffect } from "react";
import * as BlogService from "../../../services/BlogService";
import * as GalleryService from "../../../services/GalleryService";
import { formatDate } from "../../../hooks/useFormat";
import { useState } from "react";
import { DataView } from "primereact/dataview";
import SidebarImageGrid from "../../../components/SideBar/SidebarImageGrid";
import SidebarImageList from "../../../components/SideBar/SidebarImageList";

function BlogPage() {
  const [blog, setBlog] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [blogPopular, setBlogPopular] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const [resultBlog, resultGallery, resultPopular] = await Promise.all([
        BlogService.listBlogShow(),
        GalleryService.listGallerySub(),
        BlogService.listBlogPopular(),
      ]);
      setBlog(resultBlog.data);
      setGallery(resultGallery.data);
      setBlogPopular(resultPopular.data);
    };
    fetchData();
  }, []);

  const menuColor = "rgba(217,178,130,255)";

  const ItemTable = ({ product, index }) => {
    return (
      <div
        className={`flex flex-wrap h-25rem min-h-full ${
          index % 2 === 0 ? "flex-row-reverse" : "flex-row"
        }`}
      >
        <div
          data-aos="fade-left"
          className="flex align-items-center justify-content-center w-6 h-full"
        >
          <div
            className="bg-cover bg-center w-full h-full"
            style={{ background: `url(${product.image})` }}
          ></div>
        </div>
        <div
          data-aos="fade-left"
          className="flex align-items-center justify-content-center w-6 h-full"
        >
          <div className="w-10 h-auto flex flex-column flex-wrap">
            <div className="flex flex-row-reverse flex-wrap">
              <div className="flex align-items-center justify-content-center w-auto h-auto font-bold text-xl">
                {formatDate(product.createdAt).split("/")[0]}
              </div>
              <div className="flex align-items-center justify-content-center w-auto h-auto font-bold p-2 text-3xl">
                {formatDate(product.createdAt).split("/")[1]}
              </div>
              <div className="flex align-items-center justify-content-center w-auto h-auto font-bold text-xl">
                {formatDate(product.createdAt).split("/")[2]}
              </div>
            </div>
            <span
              data-aos="fade-right"
              className="font-italic text-xl p-1 text-overflow-ellipsis"
              style={{ color: menuColor }}
            >
              Món ăn
            </span>
            <div
              data-aos="fade-right"
              className="font-bold text-2xl font-family p-1 cursor-pointer text-overflow-ellipsis"
            >
              {product.name}
            </div>
            <div
              data-aos="fade-right"
              className="font-italic text-xl p-1 text-gray-500 text-overflow-ellipsis"
            >
              Tác giả: {product.customer?.name || "Leo Restaurant"}
            </div>
            <div
              data-aos="fade-right"
              className="text-lg font-family  m-5 pl-4 ml-0 border-left-3 overflow-hidden text-overflow-ellipsis"
              style={{
                wordWrap: "break-word",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: "3",
                display: "-webkit-box",
                overflow: "hidden",
              }}
            >
              {product.description}
            </div>
            <div
              data-aos="fade-right"
              className="font-bold font-italic text-xl p-2 border-bottom-2 w-max cursor-pointer"
              style={{ color: menuColor }}
            >
              Đọc thêm
            </div>
          </div>
        </div>
      </div>
    );
  };

  const listTemplate = (items) => {
    if (!items || items.length === 0) return null;

    let list = items.map((product, index) => {
      return <ItemTable product={product} index={index} key={index} />;
    });

    return (
      <div className="bg-white w-full flex flex-column shadow-2 p-5 border-round-md">
        {list}
      </div>
    );
  };

  return (
    <div className="container container-custom mt-6">
      <div className="grid">
        <div className="col-9 pr-3">
          <DataView
            value={blog}
            dataKey="_id"
            listTemplate={listTemplate}
            pt={{ header: "mb-4 border-none bg-transparent" }}
            paginator
            rows={8}
            paginatorClassName="border-none mt-4 paginator-custom"
          />
        </div>
        <div className="col-3">
          <SidebarImageGrid data={gallery} title={"Hình ảnh sưu tập"} />
          <SidebarImageList data={blogPopular} title={"Bài viết nổi bật"} />
        </div>
      </div>
    </div>
  );
}

export default BlogPage;
