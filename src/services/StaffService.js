import axios from "axios";

export const createStaff = async (data) => {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}/staff/create`,
      data
    );
    return res.data;
  } catch (error) {
    console.log("Lỗi thêm mới nhân viên", error);
    throw error;
  }
};

export const listStaff = async () => {
  try {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/staff/list`);
    return res.data;
  } catch (error) {
    console.log("Lỗi lấy danh sách nhân viên", error);
    throw error;
  }
};
export const deleteStaff = async (data) => {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}/staff/delete`,
      data
    );
    return res.data;
  } catch (error) {
    console.log("Lỗi xóa nhân viên", error);
    throw error;
  }
};
export const detailStaff = async (id) => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}/staff/detail/${id}`
    );
    return res.data;
  } catch (error) {
    console.log("Lỗi lấy thông tin nhân viên", error);
    throw error;
  }
};

export const editStaff = async (id, data) => {
  try {
    const res = await axios.put(
      `${process.env.REACT_APP_API_URL}/staff/edit/${id}`,
      data
    );
    return res.data;
  } catch (error) {
    console.log("Lỗi cập nhật thông tin nhân viên", error);
    throw error;
  }
};

export const listStaffChef = async () => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}/staff/get-all-chef`
    );
    return res.data;
  } catch (error) {
    console.log("Lỗi lấy danh sách nhân viên", error);
    throw error;
  }
};
