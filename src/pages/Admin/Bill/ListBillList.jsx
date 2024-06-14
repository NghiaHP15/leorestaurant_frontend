import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useRef, useState } from "react";
import { FilterMatchMode } from "primereact/api";
import { Toast } from "primereact/toast";
import { InputText } from "primereact/inputtext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import * as BillService from "../../../services/BillService";
import LoadingTable from "../../../components/Loading/LoadingTable";
import { userMutationHook } from "../../../hooks/useMutationHook";
import { Skeleton } from "primereact/skeleton";
import {
  formatCurrency,
  formatDate,
  formatTime,
} from "../../../hooks/useFormat";
import { TabPanel, TabView } from "primereact/tabview";

function ListBillList() {
  const [listData, setListData] = useState();
  const [listDataPaid, setListDataPaid] = useState();
  const [listDataWait, setListDataWait] = useState();
  const [listDataCancel, setListDataCancel] = useState();
  const [nameFilterValue, setCodeFilterValue] = useState("");
  const [loading, setLoading] = useState([]);
  const navigator = useNavigate();
  const [filters, setFilters] = useState({
    code: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  });
  const exportCSV = useRef(null);
  const toast = useRef(null);

  const onExportCSV = () => {
    exportCSV.current.exportCSV();
  };

  const mutationDelete = userMutationHook((data) =>
    BillService.deleteBill(data._id)
  );
  const { data: dataDelete } = mutationDelete;

  useEffect(() => {
    const getListStaff = async () => {
      setLoading(true);
      const result = await BillService.listBill();
      setLoading(false);
      const _dataCancel = result.data.filter(
        (item) => item.cancel.status === true
      );
      const _dataPaid = result.data.filter((item) => item.isPaid === true);
      const _dataWait = result.data.filter(
        (item) => item.isPaid === false && item.cancel.status === false
      );
      setListDataCancel(_dataCancel);
      setListDataPaid(_dataPaid);
      setListDataWait(_dataWait);
      setListData(result.data);
    };
    getListStaff();
  }, [dataDelete]);

  const onCodeFilterChange = (e) => {
    const { value } = e.target;
    let _filters = { ...filters };
    _filters["code"].value = value;
    setFilters(_filters);
    setCodeFilterValue(value);
  };

  /// show hide delete dialog

  const handleProfileClick = (rowData) => {
    navigator("detail", { state: { id: rowData._id } });
  };

  const templateDate = (rowData) => {
    let date;
    if (rowData.isPaid === false) {
      date = formatDate(rowData.timeOn) + " : " + formatTime(rowData.timeOn);
    }
    if (rowData.isPaid === true) {
      date = formatDate(rowData.timeOut) + " : " + formatTime(rowData.timeOut);
    }
    if (rowData.isPaid === false && rowData.cancel.status === false) {
      date = formatDate(rowData.timeOn) + " : " + formatTime(rowData.timeOn);
    }
    if (rowData.cancel.status === true) {
      date =
        formatDate(rowData.updatedAt) + " : " + formatTime(rowData.updatedAt);
    }
    return <span>{date}</span>;
  };

  const templateReason = (rowData) => {
    return <span>{rowData.cancel.reason || "Lý do khác"}</span>;
  };
  const templateTotal = (rowData) => {
    return <span>{formatCurrency(rowData.total || 0) + " VND"}</span>;
  };

  const templateStatus = (rowData) => {
    let payment;
    let bg_payment;
    if (rowData.isPaid === true) {
      payment = "Đã thanh toán";
      bg_payment = "bg-green-300";
    }
    if (rowData.isPaid === false && rowData.cancel.status === false) {
      payment = "Chưa thanh toán";
      bg_payment = "bg-blue-300";
    }
    if (rowData.cancel.status === true) {
      payment = "Bị hủy";
      bg_payment = "bg-red-300";
    }

    return (
      <div className={"py-1  text-center border-round-xl " + bg_payment}>
        <span className="text-white text-sm">{payment}</span>
      </div>
    );
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <div>
        <Button
          icon="pi pi pi-eye"
          rounded
          severity="info"
          aria-label="Search"
          className="mr-2 font-family"
          onClick={() => handleProfileClick(rowData)}
        />
      </div>
    );
  };

  return (
    <div className="relative">
      <div className="p-4 mt-4 shadow-2 bg-white border-round-xl">
        <div className="p-4 surface-50 border-1 border-solid border-round-lg surface-border">
          <div className="flex justify-content-between">
            <div>
              <span className="p-input-icon-right">
                <InputText
                  value={nameFilterValue}
                  onChange={onCodeFilterChange}
                  placeholder="Tìm theo mã code"
                  className="font-family"
                />
                <i className="pi pi-search" />
              </span>
              <Button
                label="Export"
                icon="pi pi-upload"
                severity="info"
                className="border-round-md font-semibold font-family ml-3"
                onClick={onExportCSV}
              />
            </div>
          </div>
        </div>
        <div className="mt-4 relative">
          <TabView
            pt={{
              navContainer: "px-3 font-family mb-2",
            }}
          >
            <TabPanel header="Tất cả">
              <DataTable
                ref={exportCSV}
                value={listData}
                tableStyle={{ minWidth: "50rem" }}
                selectionMode={"checkbox"}
                filters={filters}
                globalFilterFields={["name"]}
                dataKey="_id"
                className="font-family"
                checkIcon={<i className="pi pi-check text-white" />}
                paginator
                rows={10}
                rowsPerPageOptions={[5, 10, 25, 50]}
              >
                <Column
                  field="code"
                  header="Mã hóa đơn"
                  body={loading && <Skeleton />}
                ></Column>
                <Column
                  field="booking.customer_name"
                  header="Tên khách hàng"
                  body={loading && <Skeleton />}
                ></Column>
                <Column
                  field="booking.table.name"
                  header="Bàn"
                  sortable
                  body={loading && <Skeleton />}
                ></Column>
                <Column
                  field="updatedAt"
                  header="Ngày đặt"
                  sortable
                  body={(loading && <Skeleton />) || templateDate}
                ></Column>
                <Column
                  field="updatedAt"
                  header="Tổng tiền"
                  body={(loading && <Skeleton />) || templateTotal}
                ></Column>
                <Column
                  field="updatedAt"
                  header="Trạng thái"
                  body={(loading && <Skeleton />) || templateStatus}
                ></Column>
                <Column
                  field="quantity"
                  header="Hành động"
                  body={(loading && <Skeleton />) || actionBodyTemplate}
                ></Column>
              </DataTable>
              {!listData && (
                <div className="absolute top-0 bottom-0 right-0 left-0">
                  <LoadingTable
                    count={2}
                    selection
                    data={[
                      "Mã hóa đơn",
                      "Tên khách hàng",
                      "Bàn",
                      "Ngày đặt",
                      "Tổng tiền",
                      "Trạng thái",
                      "Hành động",
                    ]}
                  />
                </div>
              )}
            </TabPanel>
            <TabPanel header="Chờ thanh toán">
              <DataTable
                ref={exportCSV}
                value={listDataWait}
                tableStyle={{ minWidth: "50rem" }}
                selectionMode={"checkbox"}
                filters={filters}
                globalFilterFields={["name"]}
                dataKey="_id"
                className="font-family"
                checkIcon={<i className="pi pi-check text-white" />}
                paginator
                rows={10}
                rowsPerPageOptions={[5, 10, 25, 50]}
              >
                <Column
                  field="code"
                  header="Mã hóa đơn"
                  body={loading && <Skeleton />}
                ></Column>
                <Column
                  field="booking.customer_name"
                  header="Tên khách hàng"
                  body={loading && <Skeleton />}
                ></Column>
                <Column
                  field="booking.table.name"
                  header="Bàn"
                  sortable
                  body={loading && <Skeleton />}
                ></Column>
                <Column
                  field="updatedAt"
                  header="Ngày giờ nhận bàn"
                  sortable
                  body={(loading && <Skeleton />) || templateDate}
                ></Column>
                <Column
                  field="total"
                  header="Tổng tiền"
                  sortable
                  body={(loading && <Skeleton />) || templateTotal}
                ></Column>
                <Column
                  field="quantity"
                  header="Hành động"
                  body={(loading && <Skeleton />) || actionBodyTemplate}
                ></Column>
              </DataTable>
            </TabPanel>
            <TabPanel header="Đã thanh toán">
              <DataTable
                ref={exportCSV}
                value={listDataPaid}
                tableStyle={{ minWidth: "50rem" }}
                selectionMode={"checkbox"}
                filters={filters}
                globalFilterFields={["name"]}
                dataKey="_id"
                className="font-family"
                checkIcon={<i className="pi pi-check text-white" />}
                paginator
                rows={10}
                rowsPerPageOptions={[5, 10, 25, 50]}
              >
                <Column
                  field="code"
                  header="Mã hóa đơn"
                  body={loading && <Skeleton />}
                ></Column>
                <Column
                  field="booking.customer_name"
                  header="Tên khách hàng"
                  body={loading && <Skeleton />}
                ></Column>
                <Column
                  field="booking.table.name"
                  header="Bàn"
                  sortable
                  body={loading && <Skeleton />}
                ></Column>
                <Column
                  field="timeOut"
                  header="Ngày giờ thanh toán"
                  sortable
                  body={(loading && <Skeleton />) || templateDate}
                ></Column>
                <Column
                  field="paymentMethod"
                  header="Thanh toán"
                  sortable
                  body={loading && <Skeleton />}
                ></Column>
                <Column
                  field="updatedAt"
                  header="Tổng tiền"
                  sortable
                  body={(loading && <Skeleton />) || templateTotal}
                ></Column>
                <Column
                  field="quantity"
                  header="Hành động"
                  body={(loading && <Skeleton />) || actionBodyTemplate}
                ></Column>
              </DataTable>
            </TabPanel>
            <TabPanel header="Đã hủy">
              <DataTable
                ref={exportCSV}
                value={listDataCancel}
                tableStyle={{ minWidth: "50rem" }}
                selectionMode={"checkbox"}
                filters={filters}
                globalFilterFields={["name"]}
                dataKey="_id"
                className="font-family"
                checkIcon={<i className="pi pi-check text-white" />}
                paginator
                rows={10}
                rowsPerPageOptions={[5, 10, 25, 50]}
              >
                <Column
                  field="code"
                  header="Mã hóa đơn"
                  body={loading && <Skeleton />}
                ></Column>
                <Column
                  field="booking.customer_name"
                  header="Tên khách hàng"
                  body={loading && <Skeleton />}
                ></Column>
                <Column
                  field="booking.table.name"
                  header="Bàn"
                  sortable
                  body={loading && <Skeleton />}
                ></Column>
                <Column
                  field="cancel.reason"
                  header="Lý do"
                  body={(loading && <Skeleton />) || templateReason}
                ></Column>
                <Column
                  field="updatedAt"
                  header="Ngày giờ hủy"
                  sortable
                  body={(loading && <Skeleton />) || templateDate}
                ></Column>
                <Column
                  field="updatedAt"
                  header="Tổng tiền"
                  sortable
                  body={(loading && <Skeleton />) || templateTotal}
                ></Column>
                <Column
                  field="quantity"
                  header="Hành động"
                  body={(loading && <Skeleton />) || actionBodyTemplate}
                ></Column>
              </DataTable>
            </TabPanel>
          </TabView>
        </div>
        <Toast
          ref={toast}
          pt={{
            content: "bg-white text-color align-items-center",
          }}
        />
      </div>
    </div>
  );
}

export default ListBillList;
