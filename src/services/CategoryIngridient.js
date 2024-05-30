import axios from "axios";

export const listCategoryIngredient = async () => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}/category-ingredient/get-all`
    );
    return res.data;
  } catch (error) {
    console.log("Lỗi lấy danh sách danh mục nguyên liệu", error);
    throw error;
  }
};
export const createCategoryIngredient = async (data) => {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}/category-ingredient/create`,
      data
    );
    return res.data;
  } catch (error) {
    console.log("Lỗi thêm mới danh mục nguyên liệu", error);
    throw error;
  }
};
export const editCategoryIngredient = async (data, id) => {
  try {
    const res = await axios.put(
      `${process.env.REACT_APP_API_URL}/category-ingredient/update/${id}`,
      data
    );
    return res.data;
  } catch (error) {
    console.log("Lỗi sửa danh mục nguyên liệu", error);
    throw error;
  }
};
export const deleteCategoryIngredient = async (data) => {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}/category-ingredient/delete`,
      data
    );
    return res.data;
  } catch (error) {
    console.log("Lỗi xóa danh mục nguyên liệu", error);
    throw error;
  }
};
