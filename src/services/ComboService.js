import axios from "axios";

export const createCombo = async (data) => {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}/combo/create`,
      data
    );
    return res.data;
  } catch (error) {
    console.log("Lỗi thêm mới combo", error);
    throw error;
  }
};

export const listCombo = async () => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}/combo/get-all`
    );
    return res.data;
  } catch (error) {
    console.log("Lỗi lấy danh sách combo", error);
    throw error;
  }
};
export const deleteCombo = async (data) => {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}/combo/delete`,
      data
    );
    return res.data;
  } catch (error) {
    console.log("Lỗi xóa combo", error);
    throw error;
  }
};
export const detailCombo = async (id) => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}/combo/get-details/${id}`
    );
    return res.data;
  } catch (error) {
    console.log("Lỗi lấy thông tin combo", error);
    throw error;
  }
};

export const editCombo = async (id, data) => {
  try {
    const res = await axios.put(
      `${process.env.REACT_APP_API_URL}/combo/update/${id}`,
      data
    );
    return res.data;
  } catch (error) {
    console.log("Lỗi cập nhật thông tin combo", error);
    throw error;
  }
};
