import axios from "axios";

export const listCategoryGallery = async () => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}/category-gallery/get-all`
    );
    return res.data;
  } catch (error) {
    console.log("Lỗi lấy danh sách danh mục gallery", error);
    throw error;
  }
};
export const createCategoryGallery = async (data) => {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}/category-gallery/create`,
      data
    );
    return res.data;
  } catch (error) {
    console.log("Lỗi thêm mới danh mục gallery", error);
    throw error;
  }
};
export const editCategoryGallery = async (data, id) => {
  try {
    const res = await axios.put(
      `${process.env.REACT_APP_API_URL}/category-gallery/update/${id}`,
      data
    );
    return res.data;
  } catch (error) {
    console.log("Lỗi sửa danh mục gallery", error);
    throw error;
  }
};
export const deleteCategoryGallery = async (data) => {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}/category-gallery/delete`,
      data
    );
    return res.data;
  } catch (error) {
    console.log("Lỗi xóa danh mục gallery", error);
    throw error;
  }
};
