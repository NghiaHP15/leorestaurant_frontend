import { Skeleton } from "primereact/skeleton";

const LoadingText = ({ loading, children, width, height, className }) =>
  loading ? (
    <>
      <Skeleton
        height={height || "1rem"}
        width={width}
        borderRadius="10px"
        className={className}
      ></Skeleton>
    </>
  ) : (
    children
  );
export default LoadingText;
