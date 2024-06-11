/* eslint-disable jsx-a11y/img-redundant-alt */
import images from "../../../assets/images";

function NotFound() {
  return (
    <div className=" h-full w-full flex align-items-center justify-content-center">
      <div className="border-round-3xl shadow-2 overflow-hidden mx-8">
        <img src={`${images.page_not_found}`} alt="image" className="w-full" />
      </div>
    </div>
  );
}

export default NotFound;
