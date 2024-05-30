import axios from "axios";

export const listPermission = async () => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}/permission/get-all`
    );
    return res.data;
  } catch (error) {
    console.log("Lỗi lấy danh sách phân quyền", error);
    throw error;
  }
};
