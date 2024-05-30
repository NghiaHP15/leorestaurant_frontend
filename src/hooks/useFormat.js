const formatDate = (dateString) => {
  let date = new Date(dateString);
  let day = date.getDate();
  let month = date.getMonth() + 1; // Months are zero indexed
  let year = date.getFullYear(); // Get last two digits of the year

  // Add leading zero if day or month is less than 10
  day = day < 10 ? "0" + day : day;
  month = month < 10 ? "0" + month : month;

  return `${day}/${month}/${year}`;
};

const formatTime = (dateString) => {
  let date = new Date(dateString);
  let hour = date.getHours();
  let minute = date.getMinutes();

  // Add leading zero if day or month is less than 10
  hour = hour < 10 ? "0" + hour : hour;
  minute = minute < 10 ? "0" + minute : minute;
  return `${hour}:${minute}`;
};

const formatCurrency = (amount) => {
  // Sử dụng regular expression để thêm dấu ',' vào giữa mỗi 3 chữ số
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const formatInt = (string) => {
  return parseInt(string.match(/\d+/)[0], 10);
};

export { formatDate, formatTime, formatCurrency, formatInt };
