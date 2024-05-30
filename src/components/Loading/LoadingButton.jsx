import { Skeleton } from "primereact/skeleton";

const LoadingButton = ({ loading, width, height, children, className }) =>
  loading ? (
    <>
      <Skeleton
        height={height}
        width={width}
        borderRadius="10px"
        className={className}
      ></Skeleton>
    </>
  ) : (
    children
  );

export default LoadingButton;
