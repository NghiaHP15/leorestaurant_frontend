import axios from "axios";

export const createInfor = async (data) => {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}/infor/create`,
      data
    );
    return res.data;
  } catch (error) {
    console.log("Lỗi thêm mới thong tin nha hang", error);
    throw error;
  }
};
export const editInfor = async (id, data) => {
  try {
    const res = await axios.put(
      `${process.env.REACT_APP_API_URL}/infor/update/${id}`,
      data
    );
    return res.data;
  } catch (error) {
    console.log("Lỗi sửa thong tin nha hang", error);
    throw error;
  }
};

export const getDetail = async (id) => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}/infor/get-details/${id}`
    );
    return res.data;
  } catch (error) {
    console.log("Lỗi lấy dữ liệu thong tin nha hang", error);
    throw error;
  }
};

export const getInfor = async () => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}/infor/get-infor`
    );
    return res.data;
  } catch (error) {
    console.log("Lỗi lấy dữ liệu thong tin nha hang", error);
    throw error;
  }
};
