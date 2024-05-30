import { Fragment, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, json } from "react-router-dom";
import { publicRoutes } from "./routes/routes";
import { DefaultLayout } from "./layouts";
import "./App.css";
import { isJsonString } from "./utils";
import { jwtDecode } from "jwt-decode";
import * as UserService from "./services/UserService";
import { useDispatch } from "react-redux";
import { resetUser, updateUser } from "./redux/slides/userSlice";

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    const { storageData, decoded } = handleDecoded("access_token");
    if (decoded?.id) {
      handleGetDetailToken(decoded?.id, storageData);
    }
  }, []);

  const handleDecoded = (token) => {
    let storageData = localStorage.getItem(token);
    let decoded = {};
    if (storageData && isJsonString(storageData)) {
      storageData = JSON.parse(storageData);
      decoded = jwtDecode(storageData);
    }
    return { decoded, storageData };
  };

  const handleGetDetailToken = async (id, token) => {
    let storeRefeshToken = localStorage.getItem("refresh_token");
    const refeshToken = JSON.parse(storeRefeshToken);
    const res = await UserService.getDetailsUser(id, token);
    dispatch(
      updateUser({
        ...res?.data,
        access_token: token,
        refresh_token: refeshToken,
      })
    );
  };

  UserService.axiosJWT.interceptors.request.use(
    async (config) => {
      const currentTiem = new Date();
      const { decoded: decodedAccess } = handleDecoded("access_token");
      console.log(decodedAccess);
      const { decoded: decodedRefresh, storageData: storageDataRefresh } =
        handleDecoded("refresh_token");
      if (decodedAccess?.exp < currentTiem.getTime() / 1000) {
        if (decodedRefresh?.exp > currentTiem.getTime() / 1000) {
          const data = await UserService.refreshToken(storageDataRefresh);
          config.headers["token"] = `Bearer ${data?.access_token}`;
          dispatch(updateUser(data?.access_token));
          localStorage.setItem(
            "access_token",
            JSON.stringify(data?.access_token)
          );
        } else {
          dispatch(resetUser());
        }
      }
      return config;
    },
    function (err) {
      return Promise.reject(err);
    }
  );

  return (
    <Router>
      <div className="app">
        <Routes>
          {publicRoutes.map((route, index) => {
            const Page = route.component;
            let Layout = DefaultLayout;

            if (route.layout) {
              Layout = route.layout;
            } else if (route.layout === null) {
              Layout = Fragment;
            }

            return (
              <Route
                path={route.path}
                key={index}
                element={
                  <Layout>
                    <Page />
                  </Layout>
                }
              />
            );
          })}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
