import axios from "axios";

export const createCustomer = async (data) => {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}/customer/create`,
      data
    );
    return res.data;
  } catch (error) {
    console.log("Lỗi thêm mới khách hàng", error);
    throw error;
  }
};

export const editCustomer = async (id, data) => {
  try {
    const res = await axios.put(
      `${process.env.REACT_APP_API_URL}/customer/update/${id}`,
      data
    );
    return res.data;
  } catch (error) {
    console.log("Lỗi sửa khách hàng", error);
    throw error;
  }
};

export const deleteCustomer = async (data) => {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}/customer/delete`,
      data
    );
    return res.data;
  } catch (error) {
    console.log("Lỗi xóa khách hàng", error);
    throw error;
  }
};

export const getDetail = async (id, data) => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}/customer/get-details/${id}`,
      data
    );
    return res.data;
  } catch (error) {
    console.log("Lỗi thêm mới khách hàng", error);
    throw error;
  }
};

export const listCustomer = async () => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}/customer/get-all`
    );
    return res.data;
  } catch (error) {
    console.log("Lỗi lấy danh sách khách hàng", error);
    throw error;
  }
};
