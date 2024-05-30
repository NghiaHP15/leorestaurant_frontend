import axios from "axios";

export const apiGetProvincesCity = () =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        method: "get",
        url: `https://vapi.vnappmob.com/api/province/`,
      });
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });
export const apiGetProvincesDistrict = (provenceId) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        method: "get",
        url: `https://vapi.vnappmob.com/api/province/district/${provenceId}`,
      });
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });

export const apiGetProvincesWard = (districtId) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        method: "get",
        url: `https://vapi.vnappmob.com/api/province/ward/${districtId}`,
      });
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });
