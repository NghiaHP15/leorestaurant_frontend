import axios from "axios";

export const createMenu = async (data) => {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}/menu/create`,
      data
    );
    return res.data;
  } catch (error) {
    console.log("Lỗi thêm mới thực đơn", error);
    throw error;
  }
};

export const listMenu = async () => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}/menu/get-all`
    );
    return res.data;
  } catch (error) {
    console.log("Lỗi lấy danh sách thực đơn", error);
    throw error;
  }
};
export const deleteMenu = async (data) => {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}/menu/delete`,
      data
    );
    return res.data;
  } catch (error) {
    console.log("Lỗi xóa thực đơn", error);
    throw error;
  }
};
export const detailMenu = async (id) => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}/menu/get-details/${id}`
    );
    return res.data;
  } catch (error) {
    console.log("Lỗi lấy thông tin thực đơn", error);
    throw error;
  }
};

export const editMenu = async (id, data) => {
  try {
    const res = await axios.put(
      `${process.env.REACT_APP_API_URL}/menu/update/${id}`,
      data
    );
    return res.data;
  } catch (error) {
    console.log("Lỗi cập nhật thông tin thực đơn", error);
    throw error;
  }
};
