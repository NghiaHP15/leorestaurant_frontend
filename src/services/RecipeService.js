import axios from "axios";

export const createRecipe = async (data) => {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}/recipe/create`,
      data
    );
    return res.data;
  } catch (error) {
    console.log("Lỗi thêm mới công thức", error);
    throw error;
  }
};

export const listRecipe = async () => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}/recipe/get-all`
    );
    return res.data;
  } catch (error) {
    console.log("Lỗi lấy danh sách công thức", error);
    throw error;
  }
};
export const deleteRecipe = async (data) => {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}/recipe/delete`,
      data
    );
    return res.data;
  } catch (error) {
    console.log("Lỗi xóa công thức", error);
    throw error;
  }
};
export const detailRecipe = async (id) => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}/recipe/get-details/${id}`
    );
    return res.data;
  } catch (error) {
    console.log("Lỗi lấy thông tin công thức", error);
    throw error;
  }
};

export const editRecipe = async (id, data) => {
  try {
    const res = await axios.put(
      `${process.env.REACT_APP_API_URL}/recipe/update/${id}`,
      data
    );
    return res.data;
  } catch (error) {
    console.log("Lỗi cập nhật thông tin công thức", error);
    throw error;
  }
};

export const pointRecipe = async (data) => {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}/recipe/increate-point`,
      data
    );
    return res.data;
  } catch (error) {
    console.log("Lỗi cập nhật thông tin công thức", error);
    throw error;
  }
};

export const getBestNew = async () => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}/recipe/best-new`
    );
    return res.data;
  } catch (error) {
    console.log("Lỗi thông tin công thức", error);
    throw error;
  }
};

export const getBestSale = async () => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}/recipe/best-sale`
    );
    return res.data;
  } catch (error) {
    console.log("Lỗi thông tin công thức", error);
    throw error;
  }
};
