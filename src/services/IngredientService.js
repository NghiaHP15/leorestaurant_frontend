import axios from "axios";

export const createIngredient = async (data) => {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}/ingredient/create`,
      data
    );
    return res.data;
  } catch (error) {
    console.log("Lỗi thêm mới nguyên liệu", error);
    throw error;
  }
};

export const listIngredient = async () => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}/ingredient/get-all`
    );
    return res.data;
  } catch (error) {
    console.log("Lỗi lấy danh sách nguyên liệu", error);
    throw error;
  }
};
export const deleteIngredient = async (data) => {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}/ingredient/delete`,
      data
    );
    return res.data;
  } catch (error) {
    console.log("Lỗi xóa nguyên liệu", error);
    throw error;
  }
};
export const detailIngredient = async (id) => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}/ingredient/get-detail/${id}`
    );
    return res.data;
  } catch (error) {
    console.log("Lỗi lấy thông tin nguyên liệu", error);
    throw error;
  }
};

export const editIngredient = async (id, data) => {
  try {
    const res = await axios.put(
      `${process.env.REACT_APP_API_URL}/ingredient/update/${id}`,
      data
    );
    return res.data;
  } catch (error) {
    console.log("Lỗi cập nhật thông tin nguyên liệu", error);
    throw error;
  }
};
