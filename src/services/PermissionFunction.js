import axios from "axios";

export const listPermission = async () => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}/permission-function/get-all`
    );
    return res.data;
  } catch (error) {
    console.log("Lỗi lấy danh sách chức năng phân quyền", error);
    throw error;
  }
};

export const createPermission = async (data) => {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}/permission-function/create`,
      data
    );
    return res.data;
  } catch (error) {
    console.log("Lỗi thêm mới chức năng phân quyền", error);
    throw error;
  }
};

export const deletePermission = async (id, data) => {
  try {
    const res = await axios.delete(
      `${process.env.REACT_APP_API_URL}/permission-function/delete/${id}`,
      data
    );
    return res.data;
  } catch (error) {
    console.log("Lỗi xóa chức năng phân quyền", error);
    throw error;
  }
};
export const detailPermission = async (id) => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}/permission-function/get-details/${id}`
    );
    return res.data;
  } catch (error) {
    console.log("Lỗi lấy thông tin chức năng phân quyền", error);
    throw error;
  }
};

export const editPermission = async (id, data) => {
  try {
    const res = await axios.put(
      `${process.env.REACT_APP_API_URL}/permission-function/update/${id}`,
      data
    );
    return res.data;
  } catch (error) {
    console.log("Lỗi cập nhật thông tin chức năng phân quyền", error);
    throw error;
  }
};
