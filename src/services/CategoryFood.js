import axios from "axios";

export const listCategoryFood = async () => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}/category-food/get-all`
    );
    return res.data;
  } catch (error) {
    console.log("Lỗi lấy danh sách danh mục món ăn", error);
    throw error;
  }
};
export const createCategoryFood = async (data) => {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}/category-food/create`,
      data
    );
    return res.data;
  } catch (error) {
    console.log("Lỗi thêm mới danh mục món ăn", error);
    throw error;
  }
};
export const editCategoryFood = async (data, id) => {
  try {
    const res = await axios.put(
      `${process.env.REACT_APP_API_URL}/category-food/update/${id}`,
      data
    );
    return res.data;
  } catch (error) {
    console.log("Lỗi sửa danh mục món ăn", error);
    throw error;
  }
};
export const deleteCategoryFood = async (data) => {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}/category-food/delete`,
      data
    );
    return res.data;
  } catch (error) {
    console.log("Lỗi xóa danh mục món ăn", error);
    throw error;
  }
};
