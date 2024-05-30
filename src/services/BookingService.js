import axios from "axios";

export const createBooking = async (data) => {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}/booking/create`,
      data
    );
    return res.data;
  } catch (error) {
    console.log("Lỗi thêm mới đặt bàn", error);
    throw error;
  }
};

export const editBooking = async (id, data) => {
  try {
    const res = await axios.put(
      `${process.env.REACT_APP_API_URL}/booking/update/${id}`,
      data
    );
    return res.data;
  } catch (error) {
    console.log("Lỗi sửa đặt bàn", error);
    throw error;
  }
};

export const deleteBooking = async (id, data) => {
  try {
    const res = await axios.delete(
      `${process.env.REACT_APP_API_URL}/booking/delete/${id}`,
      data
    );
    return res.data;
  } catch (error) {
    console.log("Lỗi xóa đặt bàn", error);
    throw error;
  }
};

export const getDetail = async (id, data) => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}/booking/get-details/${id}`
    );
    return res.data;
  } catch (error) {
    console.log("Lỗi thêm mới đặt bàn", error);
    throw error;
  }
};

export const listBooking = async () => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}/booking/get-all`
    );
    return res.data;
  } catch (error) {
    console.log("Lỗi lấy danh sách đặt bàn", error);
    throw error;
  }
};
