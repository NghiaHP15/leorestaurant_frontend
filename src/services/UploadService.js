import axios from "axios";

export const uploadImage = async (data) => {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}/upload/image`,
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return res.data;
  } catch (error) {
    console.log("Lỗi thêm mới ảnh", error);
    throw error;
  }
};

export const uploadImages = async (data) => {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}/upload/images`,
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return res.data;
  } catch (error) {
    console.log("Lỗi thêm mới ảnh", error);
    throw error;
  }
};
