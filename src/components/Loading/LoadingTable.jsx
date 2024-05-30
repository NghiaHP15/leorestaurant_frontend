import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Skeleton } from "primereact/skeleton";

function LoadingTable({ count, data, selection }) {
  return (
    <DataTable
      value={Array.from({ length: count }, (v, i) => i)}
      className="p-datatable-striped font-family"
    >
      {selection && (
        <Column selectionMode="multiple" style={{ width: "3rem" }}></Column>
      )}
      {data.map((item, index) => (
        <Column header={item} key={index} body={<Skeleton />}></Column>
      ))}
    </DataTable>
  );
}

export default LoadingTable;
