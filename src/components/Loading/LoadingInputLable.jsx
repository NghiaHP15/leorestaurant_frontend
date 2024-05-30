import { Skeleton } from "primereact/skeleton";

const LoadingInputLable = ({ loading, children }) =>
  loading ? (
    <>
      <Skeleton width="10rem" borderRadius="16px"></Skeleton>
      <Skeleton
        width="100%"
        height="3rem"
        borderRadius="0.5rem"
        className="mt-2"
      ></Skeleton>
    </>
  ) : (
    children
  );

export default LoadingInputLable;
