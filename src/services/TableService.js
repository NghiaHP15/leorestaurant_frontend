import axios from "axios";

export const createTable = async (data) => {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}/table/create`,
      data
    );
    return res.data;
  } catch (error) {
    console.log("Lỗi thêm mới nhà loại bàn", error);
    throw error;
  }
};

export const editTable = async (id, data) => {
  try {
    const res = await axios.put(
      `${process.env.REACT_APP_API_URL}/table/update/${id}`,
      data
    );
    return res.data;
  } catch (error) {
    console.log("Lỗi sửa nhà loại bàn", error);
    throw error;
  }
};

export const deleteTable = async (data) => {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}/table/delete`,
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
      `${process.env.REACT_APP_API_URL}/table/get-details/${id}`,
      data
    );
    return res.data;
  } catch (error) {
    console.log("Lỗi thêm mới nhà loại bàn", error);
    throw error;
  }
};

export const listTable = async () => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}/table/get-all`
    );
    return res.data;
  } catch (error) {
    console.log("Lỗi lấy danh sách nhà loại bàn", error);
    throw error;
  }
};

export const listTableFilter = async () => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}/table/get-all-filter`
    );
    return res.data;
  } catch (error) {
    console.log("Lỗi lấy danh sách nhà loại bàn", error);
    throw error;
  }
};

export const moveTable = async (currentId, newId) => {
  try {
    const res = await axios.put(
      `${process.env.REACT_APP_API_URL}/table/${currentId}/move/${newId}`
    );
    return res.data;
  } catch (error) {
    console.log("Lỗi chuyển bàn", error);
    throw error;
  }
};
