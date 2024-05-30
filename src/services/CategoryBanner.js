import axios from "axios";

export const listCategoryBanner = async () => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}/category-banner/get-all`
    );
    return res.data;
  } catch (error) {
    console.log("Lỗi lấy danh sách danh mục banner", error);
    throw error;
  }
};
export const createCategoryBanner = async (data) => {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}/category-banner/create`,
      data
    );
    return res.data;
  } catch (error) {
    console.log("Lỗi thêm mới danh mục banner", error);
    throw error;
  }
};
export const editCategoryBanner = async (data, id) => {
  try {
    const res = await axios.put(
      `${process.env.REACT_APP_API_URL}/category-banner/update/${id}`,
      data
    );
    return res.data;
  } catch (error) {
    console.log("Lỗi sửa danh mục banner", error);
    throw error;
  }
};
export const deleteCategoryBanner = async (data) => {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}/category-banner/delete`,
      data
    );
    return res.data;
  } catch (error) {
    console.log("Lỗi xóa danh mục banner", error);
    throw error;
  }
};
