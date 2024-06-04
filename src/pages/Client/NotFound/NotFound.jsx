import images from "../../../assets/images";

function NotFound() {
  return (
    <div className="mx-auto py-6 w-9 h-screen ">
      <div
        className="w-full h-full bg-no-repeat bg-cover bg-center border-round-3xl shadow-2"
        style={{ background: `url(${images.page_not_found})` }}
      ></div>
    </div>
  );
}

export default NotFound;
