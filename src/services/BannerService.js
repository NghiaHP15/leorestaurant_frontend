import axios from "axios";

export const listBanner = async () => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}/banner/get-all`
    );
    return res.data;
  } catch (error) {
    console.log("Lỗi lấy danh sách banner", error);
    throw error;
  }
};
export const createBanner = async (data) => {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}/banner/create`,
      data
    );
    return res.data;
  } catch (error) {
    console.log("Lỗi thêm mới banner", error);
    throw error;
  }
};
export const editBanner = async (id, data) => {
  try {
    const res = await axios.put(
      `${process.env.REACT_APP_API_URL}/banner/update/${id}`,
      data
    );
    return res.data;
  } catch (error) {
    console.log("Lỗi sửa banner", error);
    throw error;
  }
};
export const deleteBanner = async (data) => {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}/banner/delete`,
      data
    );
    return res.data;
  } catch (error) {
    console.log("Lỗi xóa banner", error);
    throw error;
  }
};

export const getDetail = async (id, data) => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}/banner/get-details/${id}`,
      data
    );
    return res.data;
  } catch (error) {
    console.log("Lỗi lấy dữ liệu banner", error);
    throw error;
  }
};

export const listSlider = async () => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}/banner/get-all-slider`
    );
    return res.data;
  } catch (error) {
    console.log("Lỗi lấy danh sách slider", error);
    throw error;
  }
};
