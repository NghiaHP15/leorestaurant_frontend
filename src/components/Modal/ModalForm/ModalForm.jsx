import styles from "./ModalForm.module.scss";
import classNames from "classnames/bind";
import { useEffect, useRef, useState } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Checkbox } from "primereact/checkbox";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";
import { Toast } from "primereact/toast";
import {
  EmailIcon,
  TwitterIcon,
  FacebookIcon,
  LinkedinIcon,
} from "../../Icons";
import * as UserService from "../../../services/UserService";
import { userMutationHook } from "../../../hooks/useMutationHook";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";
import { updateUser } from "../../../redux/slides/userSlice";
import router from "../../../config/router";
import Loading from "../../Loading";
import Cookie from "js-cookie";
import images from "../../../assets/images";

const cx = classNames.bind(styles);

let defaultLogin = {
  username: "",
  password: "",
};
window.onload = () => {
  const username = localStorage.getItem("username");
  const password = localStorage.getItem("password");
  if (username && password) {
    defaultLogin = {
      username: localStorage.getItem("username"),
      password: atob(localStorage.getItem("password")),
    };
  }
};
const defaultSignUp = {
  username: "",
  email: "",
  password: "",
};

const defaultErrorLogin = {
  username: "",
  password: "",
};
const defaultErrorSignUp = {
  username: "",
  email: "",
  password: "",
};

function ModalForm({ disible }) {
  const [checked, setChecked] = useState(false);
  const [active, setActive] = useState(false);
  const [login, setLogin] = useState(defaultLogin);
  const [signUp, setSignUp] = useState(defaultSignUp);
  const [errorLogin, setErrorLogin] = useState(defaultErrorLogin);
  const [errorSignUp, setErrorSignUp] = useState(defaultErrorSignUp);
  const [showPassword, setShowPassword] = useState(false);
  const [showDialg, setShowDialog] = useState(disible ? disible : false);
  const toast = useRef(null);
  const loginMutation = userMutationHook((data) => UserService.loginUser(data));
  const signupMutation = userMutationHook((data) =>
    UserService.signupUser(data)
  );
  const {
    data: loginData,
    isPending: loginPendding,
    isSuccess: loginSuccess,
  } = loginMutation;
  const {
    data: signupData,
    isPending: signupPendding,
    isSuccess: signupSuccess,
  } = signupMutation;
  const navigator = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (loginSuccess) {
      navigator(router.admin);
      console.log(loginData);
      localStorage.setItem(
        "access_token",
        JSON.stringify(loginData?.access_token)
      );
      localStorage.setItem(
        "refresh_token",
        JSON.stringify(loginData?.refresh_token)
      );
      Cookie.set("refresh_token", loginData?.refresh_token);
      if (checked) {
        localStorage.setItem("username", login.username);
        localStorage.setItem("password", btoa(login.password));
      } else {
        localStorage.removeItem("username");
        localStorage.removeItem("password");
      }

      if (loginData?.access_token) {
        const decoded = jwtDecode(loginData?.access_token);
        if (decoded?.id) {
          handleGetDetailUser(
            decoded?.id,
            loginData?.access_token,
            loginData?.refresh_token
          );
        }
      }
    }
    if (signupSuccess) {
      toast.current.show({
        severity: "success",
        summary: "Thành công",
        detail: `Bạn đã đăng ký thành công`,
        icon: (
          <FontAwesomeIcon
            icon={faCircleCheck}
            className="text-green-500 h-2rem"
          />
        ),
        life: 3000,
      });
      setActive(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loginSuccess, signupSuccess]);

  const handleGetDetailUser = async (id, accessToken, resfreshToken) => {
    const res = await UserService.getDetailsUser(id, accessToken);
    dispatch(
      updateUser({
        ...res?.data,
        access_token: accessToken,
        refresh_token: resfreshToken,
      })
    );
  };

  const validateEmail = (email) => {
    const expression =
      /^((?:[A-Za-z0-9!#$%&'*+\-\/=?^_`{|}~]|(?<=^|\.)"|"(?=$|\.|@)|(?<=".*)[ .](?=.*")|(?<!\.)\.){1,64})(@)((?:[A-Za-z0-9.\-])*(?:[A-Za-z0-9])\.(?:[A-Za-z0-9]){2,})$/i;
    return expression.test(String(email).toLowerCase());
  };

  const handleChangeInput = (event, data, setData) => {
    const { value, name } = event.target;
    const _newValue = { ...data };
    _newValue[name] = value;
    if (!value.startsWith(" ")) {
      setData(_newValue);
    }
  };

  const handleSubmitLogin = () => {
    const _errorLogin = { ...errorLogin };
    _errorLogin.username = login.username ? "" : "Vui lòng nhập tài khoản";
    _errorLogin.password = login.password ? "" : "Vui lòng nhập mật khẩu";

    if (login.username.length > 0 && login.password.length > 0) {
      loginMutation.mutate(login);
    }
    setErrorLogin(_errorLogin);
  };

  const handleSubmitSignUp = () => {
    const _errorSignUp = { ...errorSignUp };
    const { username, email, password } = signUp;

    _errorSignUp.username = username ? "" : "Vui lòng nhập tài khoản";
    _errorSignUp.email = email
      ? validateEmail(email)
        ? ""
        : "Định dạng email không đúng"
      : "Vui lòng nhập email";
    _errorSignUp.password = password ? "" : "Vui lòng nhập mật khẩu";

    if (username && email && password) {
      signupMutation.mutate(signUp);
    }

    setErrorSignUp(_errorSignUp);
  };

  const handleKeyDownSignup = (event) => {
    if (event?.key === "Enter") {
      event.preventDefault();
      handleSubmitSignUp();
    }
  };

  const handleKeyDownLogin = (event) => {
    if (event?.key === "Enter") {
      event.preventDefault();
      handleSubmitLogin();
    }
  };

  const getFormErrorMessage = (errors, field) => {
    if (!errors[field]) {
      errors[field] =
        (loginData?.error || signupData?.error) === field
          ? loginData?.message || signupData?.message
          : "";
    }
    return errors[field] ? (
      <small className="p-error">{errors[field]}</small>
    ) : (
      <small className="p-error">&nbsp;</small>
    );
  };

  const handleHideDialog = () => {
    const _errorLogin = { ...errorLogin };
    const _errorSignUp = { ...errorSignUp };
    _errorLogin.username = "";
    _errorLogin.password = "";
    _errorSignUp.username = "";
    _errorSignUp.password = "";
    _errorSignUp.email = "";
    setErrorLogin(_errorLogin);
    setErrorSignUp(_errorSignUp);
    setShowDialog(false);
  };
  const handleShowLogin = () => {
    setShowDialog(true);
    setActive(false);
  };
  const handleShowSignUp = () => {
    setShowDialog(true);
    setActive(true);
  };

  const SocialMedia = () => {
    return (
      <div className={cx("social-icons")}>
        <ul className={cx("list-icon", "flex justify-content-center")}>
          <li className="list-none">
            <Button
              target="_blank"
              raised
              href="https://www.facebook.com/"
              className={cx("w-3rem h-3rem bg-blue-700 border-none")}
            >
              <FacebookIcon />
            </Button>
          </li>
          <li className="list-none">
            <Button
              target="_blank"
              raised
              href="https://www.facebook.com/"
              className={cx("w-3rem h-3rem bg-red-500 border-none")}
            >
              <EmailIcon />
            </Button>
          </li>
          <li className="list-none">
            <Button
              target="_blank"
              raised
              href="https://www.facebook.com/"
              className={cx("w-3rem h-3rem bg-blue-500 border-none")}
            >
              <LinkedinIcon />
            </Button>
          </li>
          <li className="list-none">
            <Button
              target="_blank"
              raised
              href="https://www.facebook.com/"
              className={cx("w-3rem h-3rem bg-blue-400 border-none")}
            >
              <TwitterIcon />
            </Button>
          </li>
        </ul>
      </div>
    );
  };

  return (
    <>
      {!disible && (
        <div className="h-full flex align-items-center">
          <Button
            label="Đăng ký"
            outlined
            className=" text-sm  font-medium uppercase font-family px-4 mr-3"
            onClick={handleShowSignUp}
          />
          <Button
            label="Đăng nhập"
            severity="warning"
            className="text-white text-sm bg-orange-500 font-medium uppercase font-family px-4 "
            onClick={handleShowLogin}
          />
        </div>
      )}
      <Dialog
        visible={showDialg}
        onHide={handleHideDialog}
        pt={{
          root: "border-round-3xl",
          header: "hidden",
          content: "p-0 border-round-3xl box shadow-2 ",
        }}
      >
        <div className={cx("container-area", active && "active")}>
          {!disible && (
            <div
              className="absolute"
              style={{ right: "10px", top: "10px", zIndex: "9999" }}
            >
              <Button
                text
                rounded
                severity="secondary"
                icon="pi pi-times text-lg"
                onClick={handleHideDialog}
              />
            </div>
          )}

          <div
            className={cx(
              "absolute top-0 h-full transition-all transition-duration-1000 transition-ease-in-out",
              "sign-up"
            )}
          >
            <div
              className={cx(
                "bg-white flex align-items-center flex-column px-7 h-full justify-content-center"
              )}
            >
              <h1
                className={cx(
                  "text-4xl mt-4 font-medium font-family-2 text-orange-500"
                )}
              >
                Đăng ký
              </h1>
              <div className="mb-1  w-full">
                <div className="p-float-label w-full">
                  <span className="p-input-icon-left w-full">
                    <i className="pi pi-fw pi-user text-orange-500" />
                    <InputText
                      placeholder="Username"
                      name="username"
                      value={signUp.username}
                      onKeyDown={handleKeyDownSignup}
                      onChange={(e) => handleChangeInput(e, signUp, setSignUp)}
                      pt={{
                        root: "font-family border-none surface-100 h-3rem fon w-full",
                      }}
                    />
                  </span>
                </div>
                {getFormErrorMessage(errorSignUp, "username")}
              </div>
              <div className="mb-1  w-full">
                <div className="p-float-label w-full">
                  <span className="p-input-icon-left w-full">
                    <FontAwesomeIcon
                      icon={faEnvelope}
                      className="text-orange-500 text-base"
                      style={{ marginLeft: "3px" }}
                    />
                    <InputText
                      placeholder="Email"
                      name="email"
                      value={signUp.email}
                      onKeyDown={handleKeyDownSignup}
                      onChange={(e) => handleChangeInput(e, signUp, setSignUp)}
                      pt={{
                        root: "font-family focus: border-none surface-100 h-3rem w-full",
                      }}
                    />
                  </span>
                </div>
                {getFormErrorMessage(errorSignUp, "email")}
              </div>
              <div className="mb-1  w-full">
                <div className="p-float-label w-full">
                  <span className="p-input-icon-left w-full">
                    <i className="pi pi-fw pi-lock text-orange-500" />
                    <InputText
                      placeholder="Password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={signUp.password}
                      onKeyDown={handleKeyDownSignup}
                      onChange={(e) => handleChangeInput(e, signUp, setSignUp)}
                      pt={{
                        root: "font-family focus: border-none surface-100 h-3rem w-full",
                      }}
                    />
                    <i
                      className={cx(
                        "absolute text-orange-500",
                        showPassword ? "pi pi-eye" : "pi pi-eye-slash"
                      )}
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ right: "16px" }}
                    />
                  </span>
                </div>
                {getFormErrorMessage(errorSignUp, "password")}
              </div>
              <Button
                label="Đăng ký"
                className="bg-orange-500 hover:bg-orange-700 border-none my-2 text-white w-full"
                loading={signupPendding}
                pt={{
                  label: "text-base",
                }}
                onClick={handleSubmitSignUp}
              />
              <span className="font-family">Hoặc tiếp tục với</span>
              <SocialMedia />
            </div>
          </div>
          <div
            className={cx(
              "absolute top-0 h-full transition-all transition-duration-1000 transition-ease-in-out",
              "sign-in"
            )}
          >
            <div
              className={cx(
                "bg-white flex align-items-center flex-column px-7 h-full justify-content-center"
              )}
            >
              <h1
                className={cx(
                  "text-4xl mt-4 font-medium font-family-2 text-orange-500"
                )}
              >
                Đăng nhập
              </h1>
              <div className="mb-1 w-full">
                <div className="p-float-label w-full">
                  <span className="p-input-icon-left w-full">
                    <i className="pi pi-fw pi-user text-orange-500" />
                    <InputText
                      placeholder="Username"
                      name="username"
                      value={login.username}
                      onKeyDown={handleKeyDownLogin}
                      onChange={(e) => handleChangeInput(e, login, setLogin)}
                      pt={{
                        root: "font-family border-none surface-100 h-3rem fon w-full",
                      }}
                    />
                  </span>
                </div>
                {getFormErrorMessage(errorLogin, "username")}
              </div>
              <div className="mb-1 w-full">
                <div className="p-float-label w-full">
                  <span className="p-input-icon-left w-full">
                    <i className="pi pi-fw pi-lock text-orange-500" />
                    <InputText
                      placeholder="Password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={login.password}
                      onKeyDown={handleKeyDownLogin}
                      onChange={(e) => handleChangeInput(e, login, setLogin)}
                      pt={{
                        root: "font-family focus: border-none surface-100 h-3rem w-full",
                      }}
                    />
                    <i
                      className={cx(
                        "absolute text-orange-500",
                        showPassword ? "pi pi-eye" : "pi pi-eye-slash"
                      )}
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ right: "16px" }}
                    />
                  </span>
                </div>
                {getFormErrorMessage(errorLogin, "password")}
              </div>
              <div
                className={
                  "flex justify-content-between align-items-center w-full mb-2"
                }
              >
                <div>
                  <Checkbox
                    inputId="memo"
                    checked={checked}
                    onChange={(e) => setChecked(e.checked)}
                    pt={{ icon: "text-white" }}
                  />
                  <label htmlFor="memo" className="ml-2 font-family text-sm">
                    Ghi nhớ mật khẩu
                  </label>
                </div>
                <Link
                  className={cx(
                    "m-0 text-blue-500 hover:text-blue-600 font-family text-sm no-underline"
                  )}
                >
                  Quên mật khẩu?
                </Link>
              </div>
              <Button
                label="Đăng nhập"
                className="bg-orange-500 hover:bg-orange-700 border-none my-2 text-white w-full justify-content-center	"
                pt={{
                  label: "text-base font-family",
                }}
                onClick={handleSubmitLogin}
              />
              <span className="font-family">Hoặc tiếp tục với</span>
              <SocialMedia />
            </div>
          </div>
          <div
            className={cx(
              "toggle-container",
              "absolute top-0 left-50 w-6 h-full overflow-hidden transition-all transition-duration-1000 transition-ease-in-out"
            )}
            style={{
              zIndex: "1000",
              borderRadius: active ? "0 150px 100px 0" : "150px 0 0 100px",
              transform: active && "translateX(-100%)",
            }}
          >
            <div
              className={cx(
                "h-full bg-white relative transition-all transition-duration-1000 transition-ease-in-out"
              )}
              style={{
                left: " -100%",
                width: "200%",
                background: `url(${images.bg_form_register})`,
                transform: active ? "translateX(50%)" : "translateX(0)",
              }}
            >
              <div
                className={cx(
                  "absolute w-6 h-full flex align-items-center justify-content-center flex-column px-5 text-center top-0 translate-x-0 transition-all transition-duration-1000 transition-ease-in-out"
                )}
                style={{
                  transform: active ? "translateX(0)" : "translateX(-200%)",
                }}
              >
                <h1
                  className={cx(
                    "text-4xl font-medium font-family-2 text-white"
                  )}
                >
                  Chào mừng, bạn!
                </h1>
                <p className={cx("text-base font-family mt-2 mb-4 text-white")}>
                  Đăng ký tài khoản để sử dụng ứng dụng
                </p>
                <Button
                  className={cx(
                    "hiddens my-2 text-white font-semibold bg-orange-600 font-family border-none"
                  )}
                  onClick={() => setActive(false)}
                >
                  Đăng nhập
                </Button>
              </div>
              <div
                className={cx(
                  "absolute right-0 w-6 h-full flex align-items-center justify-content-center flex-column px-5 text-center top-0 translate-x-0 transition-all transition-duration-1000 transition-ease-in-out"
                )}
                style={{
                  transform: active ? "translateX(200%)" : "translateX(0)",
                }}
              >
                <h1
                  className={cx(
                    "text-4xl font-medium font-family-2 text-white"
                  )}
                >
                  Chào mừng trở lại!
                </h1>
                <p className={cx("text-base font-family mt-2 mb-4 text-white")}>
                  Nhập thông tin tài khoản của bạn để sử dụng úng dụng
                </p>
                <Button
                  className={cx(
                    "hiddens my-2 text-white font-semibold bg-orange-600 font-family border-none"
                  )}
                  onClick={() => setActive(true)}
                >
                  Đăng ký
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Dialog>
      <Toast
        ref={toast}
        pt={{
          content: "bg-white text-color align-items-center",
        }}
      />
      {loginPendding && <Loading />}
    </>
  );
}

export default ModalForm;
