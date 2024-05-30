import axios from "axios";

export const createArea = async (data) => {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}/area/create`,
      data
    );
    return res.data;
  } catch (error) {
    console.log("Lỗi thêm mới khu vực", error);
    throw error;
  }
};

export const editArea = async (id, data) => {
  try {
    const res = await axios.put(
      `${process.env.REACT_APP_API_URL}/area/update/${id}`,
      data
    );
    return res.data;
  } catch (error) {
    console.log("Lỗi sửa khu vực", error);
    throw error;
  }
};

export const deleteArea = async (data) => {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}/area/delete`,
      data
    );
    return res.data;
  } catch (error) {
    console.log("Lỗi xóa khu vực", error);
    throw error;
  }
};

export const getDetail = async (id, data) => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}/area/get-details/${id}`,
      data
    );
    return res.data;
  } catch (error) {
    console.log("Lỗi thêm mới khu vực", error);
    throw error;
  }
};

export const listArea = async () => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}/area/get-all`
    );
    return res.data;
  } catch (error) {
    console.log("Lỗi lấy danh sách khu vực", error);
    throw error;
  }
};
