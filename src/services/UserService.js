import axios from "axios";

export const axiosJWT = axios.create();

export const loginUser = async (data) => {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}/user/login`,
      data
    );
    return res.data;
  } catch (error) {
    console.log("Lỗi khi đăng nhập", error);
    throw error;
  }
};

export const signupUser = async (data) => {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}/user/sign-up`,
      data
    );
    return res.data;
  } catch (error) {
    console.log("Lỗi khi đăng ký", error);
    throw error;
  }
};

export const logOutUser = async () => {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}/user/log-out`
    );
    return res.data;
  } catch (error) {
    console.log("Lỗi khi đăng xuất:", error);
    throw error;
  }
};

export const createUser = async (data) => {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}/user/create`,
      data
    );
    return res.data;
  } catch (error) {
    console.log("Lỗi khi thêm User", error);
    throw error;
  }
};

export const updateUser = async (id, data) => {
  try {
    const res = await axios.put(
      `${process.env.REACT_APP_API_URL}/user/update/${id}`,
      data
    );
    return res.data;
  } catch (error) {
    console.log("Lỗi khi sửa User", error);
    throw error;
  }
};

export const changePasswordUser = async (id, data) => {
  try {
    const res = await axios.put(
      `${process.env.REACT_APP_API_URL}/user/change-password//${id}`,
      data
    );
    return res.data;
  } catch (error) {
    console.log("Lỗi khi thay đổi User", error);
    throw error;
  }
};

export const deletesUser = async (data) => {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}/user/delete`,
      data
    );
    return res.data;
  } catch (error) {
    console.log("Lỗi khi xóa User", error);
    throw error;
  }
};

export const getDetailsUser = async (id, access_token) => {
  try {
    const res = await axiosJWT.get(
      `${process.env.REACT_APP_API_URL}/user/get-detail-user/${id}`,
      {
        headers: {
          token: `Baerer ${access_token}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    console.log("Lỗi getDetailsUser:", error);
    // throw error;
  }
};

export const getAllUser = async () => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}/user/get-all`
    );
    return res.data;
  } catch (error) {
    console.log("Lỗi lấy danh sách tài khoản người dùng:", error);
    throw error;
  }
};

export const refreshToken = async (refreshToken) => {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}/user/refresh-token`,
      {},
      {
        headers: {
          token: `Bearer ${refreshToken}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    console.log("Lỗi refresh token:", error);
    throw error;
  }
};

export const uploadImage = async (data) => {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}/user/upload-image`,
      data
    );
    return res.data;
  } catch (error) {
    console.log("Lỗi truy cap Image:", error);
    throw error;
  }
};
