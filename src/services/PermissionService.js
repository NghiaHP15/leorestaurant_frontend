import axios from "axios";

export const listPermission = async () => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}/permission/get-all`
    );
    return res.data;
  } catch (error) {
    console.log("Lỗi lấy danh sách phân quyền", error);
    throw error;
  }
};

export const createPermission = async (data) => {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}/permission/create`,
      data
    );
    return res.data;
  } catch (error) {
    console.log("Lỗi thêm mới phân quyền", error);
    throw error;
  }
};

export const deletePermission = async (id, data) => {
  try {
    const res = await axios.delete(
      `${process.env.REACT_APP_API_URL}/permission/delete/${id}`,
      data
    );
    return res.data;
  } catch (error) {
    console.log("Lỗi xóa phân quyền", error);
    throw error;
  }
};
export const detailPermission = async (id) => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}/permission/get-details/${id}`
    );
    return res.data;
  } catch (error) {
    console.log("Lỗi lấy thông tin phân quyền", error);
    throw error;
  }
};

export const editPermission = async (id, data) => {
  try {
    const res = await axios.put(
      `${process.env.REACT_APP_API_URL}/permission/update/${id}`,
      data
    );
    return res.data;
  } catch (error) {
    console.log("Lỗi cập nhật thông tin phân quyền", error);
    throw error;
  }
};
