import axios from "axios";

export const createBill = async (data) => {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}/bill/create`,
      data
    );
    return res.data;
  } catch (error) {
    console.log("Lỗi thêm mới đơn bàn", error);
    throw error;
  }
};

export const editBill = async (id, data) => {
  try {
    const res = await axios.put(
      `${process.env.REACT_APP_API_URL}/bill/update/${id}`,
      data
    );
    return res.data;
  } catch (error) {
    console.log("Lỗi sửa đơn bàn", error);
    throw error;
  }
};

export const deleteBill = async (id) => {
  try {
    const res = await axios.delete(
      `${process.env.REACT_APP_API_URL}/bill/delete/${id}`
    );
    return res.data;
  } catch (error) {
    console.log("Lỗi xóa đơn bàn", error);
    throw error;
  }
};

export const getDetail = async (id, data) => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}/bill/get-details/${id}`
    );
    return res.data;
  } catch (error) {
    console.log("Lỗi thêm mới đơn bàn", error);
    throw error;
  }
};

export const listBill = async () => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}/bill/get-all`
    );
    return res.data;
  } catch (error) {
    console.log("Lỗi lấy danh sách đơn bàn", error);
    throw error;
  }
};
