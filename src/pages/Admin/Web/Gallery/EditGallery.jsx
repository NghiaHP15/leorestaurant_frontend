import React, { useEffect, useRef, useState } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { FileUpload } from "primereact/fileupload";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import images from "../../../../assets/images";
import * as UploadService from "../../../../services/UploadService";
import * as CategoryGallery from "../../../../services/CategoryGallery";
import * as GalleryService from "../../../../services/GalleryService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-regular-svg-icons";
import Loading from "../../../../components/Loading";
import { Avatar } from "primereact/avatar";
import { Dropdown } from "primereact/dropdown";

const defaultValue = {
  link: "",
  categoryGallery: null,
  image: "",
};

export default function EditGallery({ show, setShow, valueGallery, mutation }) {
  const toast = useRef(null);
  const [dataGallery, setDataGallery] = useState(defaultValue);
  const [categoryGallery, setCategoryGallery] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState();
  const [loadingUpload, setLoadingUpload] = useState(false);

  const { data, isSuccess, isPending } = mutation;

  useEffect(() => {
    if (isSuccess && data?.data) {
      onHideDialog();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, isSuccess]);

  useEffect(() => {
    const fetchData = async () => {
      const [resultCategory, resultGallery] = await Promise.all([
        CategoryGallery.listCategoryGallery(),
        GalleryService.getDetail(valueGallery._id),
      ]);
      setCategoryGallery(resultCategory.data);
      setUploadedImageUrl(resultGallery.data.image);
      setDataGallery(resultGallery.data);
    };
    fetchData();
  }, [valueGallery]);

  ///hide dialog form
  const onHideDialog = () => {
    setShow(false);
    setDataGallery(defaultValue);
    setUploadedImageUrl("");
  };

  /// Toast message save
  const accept = () => {
    onHideDialog();
  };

  const confirmDelete = () => {
    confirmDialog({
      message: "Bạn muốn hủy thông tin này?",
      header: "Xác nhận hủy thông tin",
      icon: <img src={images.warning} alt="warning" className="max-w-3rem" />,
      defaultFocus: "reject",
      acceptClassName: "p-button-danger px-4 ml-3 font-family",
      acceptLabel: "Đồng ý",
      rejectLabel: "Không",
      rejectClassName: "p-button-info px-4 font-family",
      accept,
    });
  };

  const confirmSave = () => {
    mutation.mutate(dataGallery);
  };

  /// Change Input
  const handleChangeInputText = (event) => {
    const { value, name } = event.target;
    const _data = { ...dataGallery };
    _data[name] = value;
    setDataGallery(_data);
  };

  const handleChangeInput = (event, name) => {
    const { value } = event;
    const _data = { ...dataGallery };
    _data[name] = value;
    setDataGallery(_data);
  };

  const handleSeletUpload = async (event) => {
    const file = event.files[0];
    if (file) {
      const formData = new FormData();
      const _dataGallery = { ...dataGallery };
      formData.append("image", file);
      setLoadingUpload(true);
      console.log(formData);
      const image = await UploadService.uploadImage(formData);
      _dataGallery.image = image.data.imagePath;
      setDataGallery(_dataGallery);
      setLoadingUpload(false);
      setUploadedImageUrl(image.data.imagePath);
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

  return (
    <>
      <Dialog
        header="Thêm nguyên liệu"
        visible={show}
        style={{ width: "40vw" }}
        onHide={() => setShow(false)}
        pt={{
          root: "p-6 border-round-2xl shadow-1 relative bg-white overflow-x-hidden",
          header: "hidden",
          content: "p-0",
        }}
      >
        <div className="overflow-hidden">
          <div className="absolute" style={{ right: "10px", top: "10px" }}>
            <Button
              text
              rounded
              severity="secondary"
              icon="pi pi-times text-lg"
              onClick={confirmDelete}
            />
          </div>
          <div className="grid p-2">
            <div className="col-12">
              <h3 className="font-family text-xl font-medium m-0">
                Thêm hình ảnh
              </h3>
            </div>
            <div className="col-12">
              <InputText
                placeholder="Đường dẫn"
                name="link"
                value={dataGallery.link}
                onChange={(e) => handleChangeInputText(e)}
                pt={{
                  root: "font-family border-round-lg h-3rem w-full ",
                }}
              />
            </div>
            <div className="col-12">
              <Dropdown
                placeholder="--- Chọn loại Gallery ---"
                options={categoryGallery}
                value={dataGallery.categoryGallery}
                optionLabel="name"
                optionValue="_id"
                onChange={(e) => handleChangeInput(e, "categoryGallery")}
                filter
                pt={{
                  root: "h-3rem w-full align-items-center border-round-lg mt-2",
                  input: "font-family",
                  item: "font-family hover:surface-100 px-4 py-3",
                  list: "p-0 ",
                }}
              />
            </div>
            <div className="col-12">
              <FileUpload
                mode="basic"
                name="image"
                url="#"
                accept="image/*"
                auto
                onSelect={handleSeletUpload}
                maxFileSize={1000000}
                chooseLabel="Chọn ảnh"
                className="text-white"
                pt={{
                  chooseButton: "bg-orange-500 ",
                  chooseButtonLabel: "text-white",
                }}
              />
              <div className="relative">
                {uploadedImageUrl ? (
                  <Avatar
                    image={uploadedImageUrl}
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

                {loadingUpload && <Loading />}
              </div>
            </div>
            <div className="col-12">
              <ConfirmDialog
                style={{ width: "35vw" }}
                pt={{
                  headerTitle: "capitalize font-family",
                  content: "font-family",
                  root: "",
                }}
              />
              <div className="text-right">
                <Button
                  label="Hủy"
                  icon="pi pi-times"
                  severity="danger"
                  className=" px-5 border-round-md font-semibold font-family"
                  onClick={confirmDelete}
                />

                <Button
                  label="Lưu lại"
                  icon="pi pi-check"
                  loading={isPending}
                  severity="info"
                  className="ml-3 px-5 border-round-md font-semibold font-family"
                  onClick={confirmSave}
                />
              </div>
            </div>
          </div>
        </div>
        <Toast ref={toast}></Toast>
      </Dialog>
    </>
  );
}
