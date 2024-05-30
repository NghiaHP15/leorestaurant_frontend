import { Avatar } from "primereact/avatar";
import { FileUpload } from "primereact/fileupload";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import * as UploadService from "../../../../services/UploadService";
import * as InforService from "../../../../services/InforService";
import { useEffect, useState } from "react";
import { useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import Loading from "../../../../components/Loading";
import images from "../../../../assets/images";
import { Button } from "primereact/button";
import { Editor } from "primereact/editor";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { v4 as uuidv4 } from "uuid";
import { userMutationHook } from "../../../../hooks/useMutationHook";
import { Toast } from "primereact/toast";

const dataDefault = {
  about: {
    name_home: "",
    description_home: "",
    name_about: "",
    description_about: "",
    name_style: "",
    description_style: "",
  },
  footer_log: "",
  footer_socail_media: [],
  phone: {
    name: "",
    path: "",
  },
  email: {
    name: "",
    path: "",
  },
  address: {
    name: "",
    path: "",
  },
  time_open: {
    name: "",
    path: "",
  },
  logo: {
    logo_footer: "",
    logo_header_light: "",
    logo_header_dark: "",
    logo_qr: "",
  },
};

const upload = {
  logo_footer: "",
  logo_header_light: "",
  logo_header_dark: "",
  logo_qr: "",
};
const loadingImage = {
  logo_footer: false,
  logo_header_light: false,
  logo_header_dark: false,
  logo_qr: false,
};

function Infor() {
  const toast = useRef(null);
  const [footerLog, setFoodterLog] = useState("");
  const [dataInfor, setDataInfor] = useState(dataDefault);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(upload);
  const [loadingUpload, setLoadingUpload] = useState(loadingImage);

  const mutation = userMutationHook((data) =>
    InforService.editInfor(data._id, data)
  );
  const { data, isSuccess, isPending } = mutation;

  useEffect(() => {
    const fetchData = async () => {
      const id = "6655fdf2d9379b1d214047df";
      const result = await InforService.getDetail(id);
      const _dataInfor = result.data;
      console.log(_dataInfor.footer_socail_media);
      setDataInfor(_dataInfor);
      setUploadedImageUrl(_dataInfor.logo);
    };
    fetchData();
  }, [data]);

  useEffect(() => {
    if (isSuccess && data.data) {
      toast.current.show({
        severity: "success",
        summary: "Thành công",
        detail: `Update dữ liệu thành công`,
        icon: (
          <FontAwesomeIcon
            icon={faCircleCheck}
            className="text-green-500 h-2rem"
          />
        ),
        life: 3000,
      });
    }
  }, [data, isSuccess]);

  function generateUniqueCode(length = 5) {
    let key = uuidv4().substring(0, length);
    while (true) {
      const existing = dataInfor.footer_socail_media.find(
        // eslint-disable-next-line no-loop-func
        (item) => item.key === key
      );
      if (!existing) {
        break;
      }
      key = uuidv4().substring(0, length);
    }
    return key;
  }

  const handleSeletUpload = async (event, field) => {
    const file = event.files[0];
    if (file) {
      const formData = new FormData();
      const _dataInfor = { ...dataInfor };
      const _uploadedImageUrl = { ...uploadedImageUrl };
      const _loadingUpload = { ...loadingUpload };
      formData.append("image", file);
      _loadingUpload[field] = true;
      setLoadingUpload(_loadingUpload);
      console.log(formData);
      const image = await UploadService.uploadImage(formData);
      _dataInfor.logo[field] = image.data.imagePath;
      setDataInfor(_dataInfor);
      _loadingUpload[field] = false;
      setLoadingUpload(_loadingUpload);
      _uploadedImageUrl[field] = image.data.imagePath;
      setUploadedImageUrl(_uploadedImageUrl);
    } else {
      toast.current.show({
        severity: "error",
        summary: "Lỗi tải ảnh",
        detail: `Dung lượng anh quá lớn`,
        icon: (
          <FontAwesomeIcon
            icon={faCircleCheck}
            className="text-red-500 h-2rem"
          />
        ),
        life: 3000,
      });
    }
  };

  const confirmSave = () => {
    const _dataInfor = { ...dataInfor };
    const data = _dataInfor.footer_socail_media.filter(
      (item) => item.icon !== ""
    );
    console.log(data);
    _dataInfor.footer_log = footerLog;
    console.log(_dataInfor);
    mutation.mutate(_dataInfor);
  };

  const handleChangeInputText = (event, name, field) => {
    const { value } = event.target;
    const _dataInfor = { ...dataInfor };
    if (field) {
      _dataInfor[field][name] = value;
    } else {
      _dataInfor[name] = value;
    }
    setDataInfor(_dataInfor);
  };

  const handleAddRow = (field) => {
    const _data = { ...dataInfor };
    _data[field] = [
      ...dataInfor[field],
      { key: generateUniqueCode(), name: "", path: "" },
    ];
    setDataInfor(_data);
  };

  const handleChangeInputRow = (event, index, field, name) => {
    const { value } = event.target;
    const _dataInfor = { ...dataInfor };
    _dataInfor[name][index][field] = value;
    setDataInfor(_dataInfor);
  };

  const removeRow = (index, field) => {
    const _dataInfor = { ...dataInfor };
    _dataInfor[field].splice(index, 1);
    setDataInfor(_dataInfor);
  };

  const actionBodyTemplate = (value, row, field) => {
    return (
      <Button
        icon="pi pi-trash"
        rounded
        outlined
        severity="danger"
        aria-label="Cancel"
        onClick={() => removeRow(row.rowIndex, field)}
      />
    );
  };

  return (
    <div className="p-5 mt-4 shadow-2 bg-white border-round-xl font-family">
      <h1 className="text-orange-500">Thông tin nhà hàng</h1>
      <div className="mt-5">
        <h2 className="text-xl border-left-3 border-orange-500 px-2">
          Giới thiệu về nhà hàng
        </h2>
        <div className="grid">
          <div className="col-4">
            <span className="font-medium text-lg">
              {"1) Thông tin trang chủ"}
            </span>
            <div className="mt-3">
              <span className="font-medium font-family">Tiêu đề:</span>
              <InputText
                placeholder="Tiêu đề"
                value={dataInfor.about.name_home}
                onChange={(e) => handleChangeInputText(e, "name_home", "about")}
                pt={{
                  root: "font-family border-round-lg h-3rem mt-2 w-full",
                }}
              />
            </div>
            <div className="mt-3">
              <span className="font-medium font-family">Mô tả:</span>
              <InputTextarea
                value={dataInfor.about.description_home}
                placeholder="Mô tả"
                rows={5}
                cols={30}
                onChange={(e) =>
                  handleChangeInputText(e, "description_home", "about")
                }
                pt={{
                  root: "font-family border-round-lg mt-2 w-full",
                }}
              />
            </div>
          </div>
          <div className="col-4">
            <span className="font-medium text-lg">
              {"2) Thông tin trang giới thiệu"}
            </span>
            <div className="mt-3">
              <span className="font-medium font-family">Tiêu đề:</span>
              <InputText
                placeholder="Tiêu đề"
                value={dataInfor.about.name_about}
                onChange={(e) =>
                  handleChangeInputText(e, "name_about", "about")
                }
                pt={{
                  root: "font-family border-round-lg h-3rem mt-2 w-full",
                }}
              />
            </div>
            <div className="mt-3">
              <span className="font-medium font-family">Mô tả:</span>
              <InputTextarea
                value={dataInfor.about.description_about}
                placeholder="Mô tả"
                rows={5}
                cols={30}
                onChange={(e) =>
                  handleChangeInputText(e, "description_about", "about")
                }
                pt={{
                  root: "font-family border-round-lg mt-2 w-full",
                }}
              />
            </div>
          </div>
          <div className="col-4">
            <span className="font-medium text-lg">
              {"3) Thông tin kiểu nhà hàng"}
            </span>
            <div className="mt-3">
              <span className="font-medium font-family">Tiêu đề:</span>
              <InputText
                placeholder="Tiêu đề"
                value={dataInfor.about.name_style}
                onChange={(e) =>
                  handleChangeInputText(e, "name_style", "about")
                }
                pt={{
                  root: "font-family border-round-lg h-3rem mt-2 w-full",
                }}
              />
            </div>
            <div className="mt-3">
              <span className="font-medium font-family">Mô tả:</span>
              <InputTextarea
                value={dataInfor.about.description_style}
                placeholder="Mô tả"
                rows={5}
                cols={30}
                onChange={(e) =>
                  handleChangeInputText(e, "description_style", "about")
                }
                pt={{
                  root: "font-family border-round-lg mt-2 w-full",
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-5">
        <div className="grid">
          <div className="col-12">
            <h2 className="text-xl border-left-3 border-orange-500 px-2">
              Thông tin Footer
            </h2>
            <span className="font-medium text-lg">
              {"4) Thông tin danh mục"}
            </span>
          </div>
          <div className="col-12">
            <Editor
              value={footerLog}
              onTextChange={(e) => setFoodterLog(e.htmlValue)}
              style={{ height: "320px" }}
              className="mt-2"
            />
          </div>
          <div className="col-12">
            <h2 className="text-xl border-left-3 border-orange-500 px-2">
              Thông tin liên lạc
            </h2>
          </div>
          <div className="col-12">
            <span className="font-medium text-lg">
              {"5) Thông tin số điện thoại"}
            </span>
          </div>
          <div className="col-6">
            <span className="font-medium font-family">Số điện thoại:</span>
            <InputText
              placeholder="Số điện thoại"
              value={dataInfor.phone.name}
              onChange={(e) => handleChangeInputText(e, "name", "phone")}
              pt={{
                root: "font-family border-round-lg h-3rem mt-2 w-full",
              }}
            />
          </div>
          <div className="col-6">
            <span className="font-medium font-family">Đường dẫn:</span>
            <InputText
              placeholder="Link"
              value={dataInfor.phone.path}
              onChange={(e) => handleChangeInputText(e, "path", "phone")}
              pt={{
                root: "font-family border-round-lg h-3rem mt-2 w-full",
              }}
            />
          </div>
          <div className="col-12">
            <span className="font-medium text-lg">{"6) Thông tin email"}</span>
          </div>
          <div className="col-6">
            <span className="font-medium font-family">Email:</span>
            <InputText
              placeholder="Email"
              value={dataInfor.email.name}
              onChange={(e) => handleChangeInputText(e, "name", "email")}
              pt={{
                root: "font-family border-round-lg h-3rem mt-2 w-full",
              }}
            />
          </div>
          <div className="col-6">
            <span className="font-medium font-family">Đường dẫn:</span>
            <InputText
              placeholder="Link"
              value={dataInfor.email.path}
              onChange={(e) => handleChangeInputText(e, "path", "email")}
              pt={{
                root: "font-family border-round-lg h-3rem mt-2 w-full",
              }}
            />
          </div>
          <div className="col-12">
            <span className="font-medium text-lg">
              {"7) Thông tin địa chỉ"}
            </span>
          </div>
          <div className="col-6">
            <span className="font-medium font-family">Địa chỉ:</span>
            <InputText
              placeholder="Địa chỉ"
              value={dataInfor.address.name}
              onChange={(e) => handleChangeInputText(e, "name", "address")}
              pt={{
                root: "font-family border-round-lg h-3rem mt-2 w-full",
              }}
            />
          </div>
          <div className="col-6">
            <span className="font-medium font-family">Đường dẫn:</span>
            <InputText
              placeholder="Link"
              value={dataInfor.address.path}
              onChange={(e) => handleChangeInputText(e, "path", "address")}
              pt={{
                root: "font-family border-round-lg h-3rem mt-2 w-full",
              }}
            />
          </div>
          <div className="col-12">
            <span className="font-medium text-lg">{"8) Thông tin mở cửa"}</span>
          </div>
          <div className="col-6">
            <span className="font-medium font-family">Thời gian mở cửa:</span>
            <InputText
              placeholder="Thời gian mở cửa"
              value={dataInfor.time_open.name}
              onChange={(e) => handleChangeInputText(e, "name", "time_open")}
              pt={{
                root: "font-family border-round-lg h-3rem mt-2 w-full",
              }}
            />
          </div>
          <div className="col-6">
            <span className="font-medium font-family">Đường dẫn:</span>
            <InputText
              placeholder="Link"
              name="path"
              value={dataInfor.time_open.path}
              onChange={(e) => handleChangeInputText(e, "path", "time_open")}
              pt={{
                root: "font-family border-round-lg h-3rem mt-2 w-full",
              }}
            />
          </div>
        </div>
      </div>
      <div className="mt-5">
        <h2 className="text-xl border-left-3 border-orange-500 px-2 my-1">
          Nhà hàng
        </h2>
        <div className="flex justify-content-between align-items-center w-full mb-3">
          <span className="font-medium font-family">Thêm thông tin:</span>
          <Button
            severity="info"
            rounded
            icon="pi pi-plus"
            onClick={() => handleAddRow("restaurant")}
          />
        </div>
        <DataTable
          value={dataInfor.restaurant}
          className="font-family"
          dataKey="key"
        >
          <Column
            field="name"
            header="Tên"
            body={(value, row) => {
              return (
                <div className="flex flex-column">
                  <InputText
                    value={value.name}
                    placeholder="Tên"
                    onChange={(e) =>
                      handleChangeInputRow(
                        e,
                        row.rowIndex,
                        row.field,
                        "restaurant"
                      )
                    }
                    pt={{
                      root: "font-family h-3rem border-round-md w-full",
                    }}
                  />
                </div>
              );
            }}
          ></Column>
          <Column
            field="path"
            header="Link"
            body={(value, row) => {
              return (
                <div className="flex flex-column">
                  <InputText
                    value={value.path}
                    placeholder="Link"
                    onChange={(e) =>
                      handleChangeInputRow(
                        e,
                        row.rowIndex,
                        row.field,
                        "restaurant"
                      )
                    }
                    pt={{
                      root: "font-family h-3rem border-round-md w-full",
                    }}
                  />
                </div>
              );
            }}
          ></Column>
          <Column
            exportable={false}
            body={(value, row) => actionBodyTemplate(value, row, "restaurant")}
          />
        </DataTable>
      </div>
      <div className="mt-5">
        <h2 className="text-xl border-left-3 border-orange-500 px-2 my-1">
          Danh mục
        </h2>
        <div className="flex justify-content-between align-items-center w-full mb-3">
          <span className="font-medium font-family">Thêm thông tin:</span>
          <Button
            severity="info"
            rounded
            icon="pi pi-plus"
            onClick={() => handleAddRow("catalog")}
          />
        </div>
        <DataTable
          value={dataInfor.catalog}
          className="font-family"
          dataKey="key"
        >
          <Column
            field="name"
            header="Tên"
            body={(value, row) => {
              return (
                <div className="flex flex-column">
                  <InputText
                    value={value.name}
                    placeholder="Tên"
                    onChange={(e) =>
                      handleChangeInputRow(
                        e,
                        row.rowIndex,
                        row.field,
                        "catalog"
                      )
                    }
                    pt={{
                      root: "font-family h-3rem border-round-md w-full",
                    }}
                  />
                </div>
              );
            }}
          ></Column>
          <Column
            field="path"
            header="Link"
            body={(value, row) => {
              return (
                <div className="flex flex-column">
                  <InputText
                    value={value.path}
                    placeholder="Link"
                    onChange={(e) =>
                      handleChangeInputRow(
                        e,
                        row.rowIndex,
                        row.field,
                        "catalog"
                      )
                    }
                    pt={{
                      root: "font-family h-3rem border-round-md w-full",
                    }}
                  />
                </div>
              );
            }}
          ></Column>
          <Column
            exportable={false}
            body={(value, row) => actionBodyTemplate(value, row, "catalog")}
          />
        </DataTable>
      </div>
      <div className="mt-5">
        <h2 className="text-xl border-left-3 border-orange-500 px-2 my-1">
          Trợ giúp
        </h2>
        <div className="flex justify-content-between align-items-center w-full mb-3">
          <span className="font-medium font-family">Thêm thông tin:</span>
          <Button
            severity="info"
            rounded
            icon="pi pi-plus"
            onClick={() => handleAddRow("help")}
          />
        </div>
        <DataTable value={dataInfor.help} className="font-family" dataKey="key">
          <Column
            field="name"
            header="Tên"
            body={(value, row) => {
              return (
                <div className="flex flex-column">
                  <InputText
                    value={value.name}
                    placeholder="Tên"
                    onChange={(e) =>
                      handleChangeInputRow(e, row.rowIndex, row.field, "help")
                    }
                    pt={{
                      root: "font-family h-3rem border-round-md w-full",
                    }}
                  />
                </div>
              );
            }}
          ></Column>
          <Column
            field="path"
            header="Link"
            body={(value, row) => {
              return (
                <div className="flex flex-column">
                  <InputText
                    value={value.path}
                    placeholder="Link"
                    onChange={(e) =>
                      handleChangeInputRow(e, row.rowIndex, row.field, "help")
                    }
                    pt={{
                      root: "font-family h-3rem border-round-md w-full",
                    }}
                  />
                </div>
              );
            }}
          ></Column>
          <Column
            exportable={false}
            body={(value, row) => actionBodyTemplate(value, row, "help")}
          />
        </DataTable>
      </div>
      <div className="mt-5">
        <h2 className="text-xl border-left-3 border-orange-500 px-2 my-1">
          HOT TAGS
        </h2>
        <div className="flex justify-content-between align-items-center w-full mb-3">
          <span className="font-medium font-family">Thêm thông tin:</span>
          <Button
            severity="info"
            rounded
            icon="pi pi-plus"
            onClick={() => handleAddRow("hot_tag")}
          />
        </div>
        <DataTable
          value={dataInfor.hot_tag}
          className="font-family"
          dataKey="key"
        >
          <Column
            field="name"
            header="Tên"
            body={(value, row) => {
              return (
                <div className="flex flex-column">
                  <InputText
                    value={value.name}
                    placeholder="Tên"
                    onChange={(e) =>
                      handleChangeInputRow(
                        e,
                        row.rowIndex,
                        row.field,
                        "hot_tag"
                      )
                    }
                    pt={{
                      root: "font-family h-3rem border-round-md w-full",
                    }}
                  />
                </div>
              );
            }}
          ></Column>
          <Column
            field="path"
            header="Link"
            body={(value, row) => {
              return (
                <div className="flex flex-column">
                  <InputText
                    value={value.path}
                    placeholder="Link"
                    onChange={(e) =>
                      handleChangeInputRow(
                        e,
                        row.rowIndex,
                        row.field,
                        "hot_tag"
                      )
                    }
                    pt={{
                      root: "font-family h-3rem border-round-md w-full",
                    }}
                  />
                </div>
              );
            }}
          ></Column>
          <Column
            exportable={false}
            body={(value, row) => actionBodyTemplate(value, row, "hot_tag")}
          />
        </DataTable>
      </div>
      <div className="mt-5">
        <h2 className="text-xl border-left-3 border-orange-500 px-2 my-1">
          Thông tin mạng xã hội
        </h2>
        <div className="flex justify-content-between align-items-center w-full mb-3">
          <span className="font-medium font-family">Thêm thông tin:</span>
          <Button
            severity="info"
            rounded
            icon="pi pi-plus"
            onClick={() => handleAddRow("footer_socail_media")}
          />
        </div>
        <DataTable
          value={dataInfor.footer_socail_media}
          className="font-family"
          dataKey="key"
        >
          <Column
            field="name"
            header="Tên"
            body={(value, row) => {
              return (
                <div className="flex flex-column">
                  <InputText
                    value={value.name}
                    placeholder="Tên"
                    onChange={(e) =>
                      handleChangeInputRow(
                        e,
                        row.rowIndex,
                        row.field,
                        "footer_socail_media"
                      )
                    }
                    pt={{
                      root: "font-family h-3rem border-round-md w-full",
                    }}
                  />
                </div>
              );
            }}
          ></Column>
          <Column
            field="path"
            header="Link"
            body={(value, row) => {
              return (
                <div className="flex flex-column">
                  <InputText
                    value={value.path}
                    placeholder="Link"
                    onChange={(e) =>
                      handleChangeInputRow(
                        e,
                        row.rowIndex,
                        row.field,
                        "footer_socail_media"
                      )
                    }
                    pt={{
                      root: "font-family h-3rem border-round-md w-full",
                    }}
                  />
                </div>
              );
            }}
          ></Column>
          <Column
            exportable={false}
            body={(value, row) =>
              actionBodyTemplate(value, row, "footer_socail_media")
            }
          />
        </DataTable>
      </div>
      <div className="mt-5">
        <div className="grid">
          <div className="col-12">
            <h2 className="text-xl border-left-3 border-orange-500 px-2 my-1">
              Thông tin Logo
            </h2>
          </div>
          <div className="col-3">
            <span className="font-medium font-family">
              Thông tin Logo Light:
            </span>
            <div className="mt-2">
              <FileUpload
                mode="basic"
                name="image"
                url="#"
                accept="image/*"
                auto
                onSelect={(e) => handleSeletUpload(e, "logo_header_light")}
                maxFileSize={1000000}
                chooseLabel="Chọn ảnh"
                chooseOptions={{
                  className:
                    "bg-blue-400 text-white border-none text-lg font-semibold font-family",
                }}
                className="text-white"
                pt={{
                  chooseButton: "bg-orange-500 ",
                  chooseButtonLabel: "text-white",
                }}
              />
              <div className="relative">
                {uploadedImageUrl.logo_header_light ? (
                  <Avatar
                    image={uploadedImageUrl.logo_header_light}
                    style={{ height: "auto", width: "100%" }}
                    className="mt-3 p-4 border-2 border-300 border-dashed border-round-md"
                  />
                ) : (
                  <div className="mt-3 p-4 flex align-items-center justify-content-center border-2 border-300 border-dashed border-round-md">
                    <Avatar
                      image={images.uploadImage}
                      style={{ width: "200px", height: "auto" }}
                      className={`p-4 opacity-50`}
                    />
                  </div>
                )}

                {loadingUpload.logo_header_light && <Loading />}
              </div>
            </div>
          </div>
          <div className="col-3">
            <span className="font-medium font-family">
              Thông tin Logo Dark:
            </span>
            <div className="mt-2">
              <FileUpload
                mode="basic"
                name="image"
                url="#"
                accept="image/*"
                auto
                onSelect={(e) => handleSeletUpload(e, "logo_header_dark")}
                maxFileSize={1000000}
                chooseLabel="Chọn ảnh"
                chooseOptions={{
                  className:
                    "bg-blue-400 text-white border-none text-lg font-semibold font-family",
                }}
                className="text-white"
                pt={{
                  chooseButton: "bg-orange-500 ",
                  chooseButtonLabel: "text-white",
                }}
              />
              <div className="relative">
                {uploadedImageUrl.logo_header_dark ? (
                  <Avatar
                    image={uploadedImageUrl.logo_header_dark}
                    style={{ height: "auto", width: "100%" }}
                    className="mt-3 p-4 border-2 border-300 border-dashed border-round-md"
                  />
                ) : (
                  <div className="mt-3 p-4 flex align-items-center justify-content-center border-2 border-300 border-dashed border-round-md">
                    <Avatar
                      image={images.uploadImage}
                      style={{ width: "200px", height: "auto" }}
                      className={`p-4 opacity-50`}
                    />
                  </div>
                )}

                {loadingUpload.logo_header_dark && <Loading />}
              </div>
            </div>
          </div>
          <div className="col-3">
            <span className="font-medium font-family">
              Thông tin Logo Footer:
            </span>
            <div className="mt-2">
              <FileUpload
                mode="basic"
                name="image"
                url="#"
                accept="image/*"
                auto
                onSelect={(e) => handleSeletUpload(e, "logo_footer")}
                maxFileSize={1000000}
                chooseLabel="Chọn ảnh"
                chooseOptions={{
                  className:
                    "bg-blue-400 text-white border-none text-lg font-semibold font-family",
                }}
                className="text-white"
                pt={{
                  chooseButton: "bg-orange-500 ",
                  chooseButtonLabel: "text-white",
                }}
              />
              <div className="relative">
                {uploadedImageUrl.logo_footer ? (
                  <Avatar
                    image={uploadedImageUrl.logo_footer}
                    style={{ height: "auto", width: "100%" }}
                    className="mt-3 p-4 border-2 border-300 border-dashed border-round-md"
                  />
                ) : (
                  <div className="mt-3 p-4 flex align-items-center justify-content-center border-2 border-300 border-dashed border-round-md">
                    <Avatar
                      image={images.uploadImage}
                      style={{ width: "200px", height: "auto" }}
                      className={`p-4 opacity-50`}
                    />
                  </div>
                )}

                {loadingUpload.logo_footer && <Loading />}
              </div>
            </div>
          </div>
          <div className="col-3">
            <span className="font-medium font-family">Thông tin Logo QR:</span>
            <div className="mt-2">
              <FileUpload
                mode="basic"
                name="image"
                url="#"
                accept="image/*"
                auto
                onSelect={(e) => handleSeletUpload(e, "logo_qr")}
                maxFileSize={1000000}
                chooseLabel="Chọn ảnh"
                chooseOptions={{
                  className:
                    "bg-blue-400 text-white border-none text-lg font-semibold font-family",
                }}
                className="text-white"
                pt={{
                  chooseButton: "bg-orange-500 ",
                  chooseButtonLabel: "text-white",
                }}
              />
              <div className="relative">
                {uploadedImageUrl.logo_qr ? (
                  <Avatar
                    image={uploadedImageUrl.logo_qr}
                    style={{ height: "auto", width: "100%" }}
                    className="mt-3 p-4 border-2 border-300 border-dashed border-round-md"
                  />
                ) : (
                  <div className="mt-3 p-4 flex align-items-center justify-content-center border-2 border-300 border-dashed border-round-md">
                    <Avatar
                      image={images.uploadImage}
                      style={{ width: "200px", height: "auto" }}
                      className={`p-4 opacity-50`}
                    />
                  </div>
                )}

                {loadingUpload.logo_qr && <Loading />}
              </div>
            </div>
          </div>
          <div className="col-12">
            <div className="text-right" style={{ marginTop: "7px" }}>
              <Button
                label="Lưu lại"
                icon="pi pi-check"
                loading={isPending}
                severity="success"
                className="ml-3 h-3rem px-5 border-round-md font-semibold font-family"
                onClick={confirmSave}
              />
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

export default Infor;
