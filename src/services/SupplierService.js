import axios from "axios";

export const createSupplier = async (data) => {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}/supplier/create`,
      data
    );
    return res.data;
  } catch (error) {
    console.log("Lỗi thêm mới nhà cung cấp", error);
    throw error;
  }
};

export const editSupplier = async (id, data) => {
  try {
    const res = await axios.put(
      `${process.env.REACT_APP_API_URL}/supplier/update/${id}`,
      data
    );
    return res.data;
  } catch (error) {
    console.log("Lỗi sửa nhà cung cấp", error);
    throw error;
  }
};

export const deleteSupplier = async (data) => {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}/supplier/delete`,
      data
    );
    return res.data;
  } catch (error) {
    console.log("Lỗi xóa nhà cung cấp", error);
    throw error;
  }
};

export const getDetail = async (id, data) => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}/supplier/get-details/${id}`,
      data
    );
    return res.data;
  } catch (error) {
    console.log("Lỗi thêm mới nhà cung cấp", error);
    throw error;
  }
};

export const listSupplier = async () => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}/supplier/get-all`
    );
    return res.data;
  } catch (error) {
    console.log("Lỗi lấy danh sách nhà cung cấp", error);
    throw error;
  }
};
