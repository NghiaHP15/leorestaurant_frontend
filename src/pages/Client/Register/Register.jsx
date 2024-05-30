import ModalForm from "../../../components/Modal/ModalForm";
import Loading from "../../../components/Loading";
import images from "../../../assets/images";

function Register() {
  return (
    <div
      style={{
        background: `url(${images.bgRegister})`,
        height: "100vh",
        backgroundSize: "cover",
      }}
      className="max-h-screen"
    >
      <ModalForm disible />
    </div>
  );
}

export default Register;
