import axios from "axios";

export const listGallery = async () => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}/gallery/get-all`
    );
    return res.data;
  } catch (error) {
    console.log("Lỗi lấy danh sách hình ảnh", error);
    throw error;
  }
};
export const createGallery = async (data) => {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}/gallery/create`,
      data
    );
    return res.data;
  } catch (error) {
    console.log("Lỗi thêm mới hình ảnh", error);
    throw error;
  }
};
export const editGallery = async (id, data) => {
  try {
    const res = await axios.put(
      `${process.env.REACT_APP_API_URL}/gallery/update/${id}`,
      data
    );
    return res.data;
  } catch (error) {
    console.log("Lỗi sửa hình ảnh", error);
    throw error;
  }
};
export const deleteGallery = async (data) => {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}/gallery/delete`,
      data
    );
    return res.data;
  } catch (error) {
    console.log("Lỗi xóa hình ảnh", error);
    throw error;
  }
};

export const getDetail = async (id, data) => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}/gallery/get-details/${id}`,
      data
    );
    return res.data;
  } catch (error) {
    console.log("Lỗi lấy dữ liệu hình ảnh", error);
    throw error;
  }
};

export const listGallerySub = async () => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}/gallery/get-all-gallery`
    );
    return res.data;
  } catch (error) {
    console.log("Lỗi lấy danh sách hình ảnh", error);
    throw error;
  }
};

export const listSocalMedia = async () => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}/gallery/get-all-socal-media`
    );
    return res.data;
  } catch (error) {
    console.log("Lỗi lấy danh sách hình ảnh", error);
    throw error;
  }
};
