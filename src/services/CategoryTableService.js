import axios from "axios";

export const createCateroryTable = async (data) => {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}/category-table/create`,
      data
    );
    return res.data;
  } catch (error) {
    console.log("Lỗi thêm mới nhà loại bàn", error);
    throw error;
  }
};

export const editCateroryTable = async (id, data) => {
  try {
    const res = await axios.put(
      `${process.env.REACT_APP_API_URL}/category-table/update/${id}`,
      data
    );
    return res.data;
  } catch (error) {
    console.log("Lỗi sửa nhà loại bàn", error);
    throw error;
  }
};

export const deleteCateroryTable = async (data) => {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}/category-table/delete`,
      data
    );
    return res.data;
  } catch (error) {
    console.log("Lỗi xóa nhà loại bàn", error);
    throw error;
  }
};

export const getDetail = async (id, data) => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}/category-table/get-details/${id}`,
      data
    );
    return res.data;
  } catch (error) {
    console.log("Lỗi thêm mới nhà loại bàn", error);
    throw error;
  }
};

export const listCateroryTable = async () => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}/category-table/get-all`
    );
    return res.data;
  } catch (error) {
    console.log("Lỗi lấy danh sách nhà loại bàn", error);
    throw error;
  }
};
