import axios from "axios";

export const listRole = async () => {
  try {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/role/list`);
    return res.data;
  } catch (error) {
    console.log("Lỗi lấy danh sách chức vụ", error);
    throw error;
  }
};
export const createRole = async (data) => {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}/role/create`,
      data
    );
    return res.data;
  } catch (error) {
    console.log("Lỗi thêm mới chức vụ", error);
    throw error;
  }
};
export const editRole = async (data, id) => {
  try {
    const res = await axios.put(
      `${process.env.REACT_APP_API_URL}/role/update/${id}`,
      data
    );
    return res.data;
  } catch (error) {
    console.log("Lỗi sửa chức vụ", error);
    throw error;
  }
};
export const deleteRole = async (data) => {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}/role/delete`,
      data
    );
    return res.data;
  } catch (error) {
    console.log("Lỗi xóa chức vụ", error);
    throw error;
  }
};
