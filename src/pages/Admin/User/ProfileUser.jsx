import { useState } from "react";
import LoadingText from "../../../components/Loading/LoadingText";
import classNames from "classnames/bind";
import style from "./ProfileUser.module.scss";
import { Skeleton } from "primereact/skeleton";
import { Avatar } from "primereact/avatar";
import images from "../../../assets/images";
const cx = classNames.bind(style);

const defaultValue = {
  staff: {},
  user: {},
};

function ProfileUser() {
  const [dataUser, setDataUser] = useState(defaultValue);
  const [loading, setLoading] = useState(false);

  return (
    <>
      <div
        className="relative mt-4 border-round-xl bg-no-repeat bg-cover bg-center h-20rem"
        style={{ background: `url(${images.profileUser})` }}
      >
        <div className="absolute" style={{ bottom: "-80px", left: "80px" }}>
          <div className="flex align-items-end">
            <div className="surface-ground p-1 border-circle">
              <Avatar
                image={images.avatarDefault}
                shape="circle"
                style={{ height: "auto", width: "200px" }}
                className="p-2"
              />
            </div>
            <div className="flex flex-column py-3 font-family">
              <span className="text-3xl font-semibold">Bui Minh Nghia</span>
              <span>Nhân viên</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProfileUser;
