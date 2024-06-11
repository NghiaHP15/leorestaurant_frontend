import axios from "axios";

export const getAmountBill = async () => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}/report/get-amount-bill`
    );
    return res.data;
  } catch (error) {
    console.log("Lỗi lấy báo cáo số lượng hóa đơn", error);
    throw error;
  }
};

export const getAmountBooking = async () => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}/report/get-amount-booking`
    );
    return res.data;
  } catch (error) {
    console.log("Lỗi lấy báo cáo số đặt bàn", error);
    throw error;
  }
};

export const getSalesBill = async () => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}/report/get-sales-bill`
    );
    return res.data;
  } catch (error) {
    console.log("Lỗi lấy báo cáo tổng hóa đơn", error);
    throw error;
  }
};

export const getAmountCustomer = async () => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}/report/get-amount-customer`
    );
    return res.data;
  } catch (error) {
    console.log("Lỗi lấy số lượng khách hàng", error);
    throw error;
  }
};

export const getNewCustomer = async () => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}/report/get-new-customer`
    );
    return res.data;
  } catch (error) {
    console.log("Lỗi lấy số lượng khách hàng", error);
    throw error;
  }
};

export const getNewStaff = async () => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}/report/get-new-staff`
    );
    return res.data;
  } catch (error) {
    console.log("Lỗi lấy số lượng khách hàng", error);
    throw error;
  }
};

export const getSalesFigures = async () => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}/report/get-sales-figures`
    );
    return res.data;
  } catch (error) {
    console.log("Lỗi lấy số lượng doanh thu", error);
    throw error;
  }
};

export const getTopFoods = async () => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}/report/get-top-food`
    );
    return res.data;
  } catch (error) {
    console.log("Lỗi lấy số lượng top mặt hàng", error);
    throw error;
  }
};

export const getBookings = async () => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}/report/get-booking`
    );
    return res.data;
  } catch (error) {
    console.log("Lỗi lấy số lượng đặt hàng", error);
    throw error;
  }
};

export const getNotify = async () => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}/report/get-notify`
    );
    return res.data;
  } catch (error) {
    console.log("Lỗi lấy thông báo đặt bàn", error);
    throw error;
  }
};

export const getReport = async () => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}/report/get-report`
    );
    return res.data;
  } catch (error) {
    console.log("Lỗi lấy thông tin xuất báo cáo", error);
    throw error;
  }
};
