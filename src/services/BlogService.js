import axios from "axios";

export const createBlog = async (data) => {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}/blog/create`,
      data
    );
    return res.data;
  } catch (error) {
    console.log("Lỗi thêm mới bài viết", error);
    throw error;
  }
};

export const editBlog = async (id, data) => {
  try {
    const res = await axios.put(
      `${process.env.REACT_APP_API_URL}/blog/update/${id}`,
      data
    );
    return res.data;
  } catch (error) {
    console.log("Lỗi sửa bài viết", error);
    throw error;
  }
};

export const deleteBlog = async (data) => {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}/blog/delete`,
      data
    );
    return res.data;
  } catch (error) {
    console.log("Lỗi xóa bài viết", error);
    throw error;
  }
};

export const getDetail = async (id) => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}/blog/get-details/${id}`
    );
    return res.data;
  } catch (error) {
    console.log("Lỗi thêm mới bài viết", error);
    throw error;
  }
};

export const listBlog = async () => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}/blog/get-all`
    );
    return res.data;
  } catch (error) {
    console.log("Lỗi lấy danh sách bài viết", error);
    throw error;
  }
};

export const listBlogShow = async () => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}/blog/get-all-blog`
    );
    return res.data;
  } catch (error) {
    console.log("Lỗi lấy danh sách bài viết", error);
    throw error;
  }
};

export const listBlogPopular = async () => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}/blog/get-all-blog-popular`
    );
    return res.data;
  } catch (error) {
    console.log("Lỗi lấy danh sách bài viết", error);
    throw error;
  }
};
