import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useRef, useState } from "react";
import { FilterMatchMode } from "primereact/api";
import { Toast } from "primereact/toast";
import { InputText } from "primereact/inputtext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import * as BookingService from "../../../../services/BookingService";
import LoadingTable from "../../../../components/Loading/LoadingTable";
import { Skeleton } from "primereact/skeleton";
import {
  formatCurrency,
  formatDate,
  formatTime,
} from "../../../../hooks/useFormat";
import { TabPanel, TabView } from "primereact/tabview";

function ListBookingList() {
  const [listData, setListData] = useState();
  const [listDataRecive, setListDataRecive] = useState();
  const [listDataWait, setListDataWait] = useState();
  const [listDataCancel, setListDataCancel] = useState();
  const [nameFilterValue, setCodeFilterValue] = useState("");
  const [loading, setLoading] = useState([]);
  const navigator = useNavigate();
  const [filters, setFilters] = useState({
    customer_name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  });
  const exportCSV = useRef(null);
  const toast = useRef(null);

  const onExportCSV = () => {
    exportCSV.current.exportCSV();
  };

  useEffect(() => {
    const getListBooking = async () => {
      setLoading(true);
      const result = await BookingService.listBooking();
      setLoading(false);
      const _dataCancel = result.data.filter((item) => item.cancel === true);
      const _dataRecive = result.data.filter(
        (item) => item.reciveStatus === true
      );
      const _dataWait = result.data.filter(
        (item) => item.reciveStatus === false && item.cancel === false
      );
      setListDataCancel(_dataCancel);
      setListDataWait(_dataWait);
      setListDataRecive(_dataRecive);
      setListData(result.data);
    };
    getListBooking();
  }, []);

  const onCodeFilterChange = (e) => {
    const { value } = e.target;
    let _filters = { ...filters };
    _filters["customer_name"].value = value;
    setFilters(_filters);
    setCodeFilterValue(value);
  };

  /// show hide delete dialog

  const handleProfileClick = (rowData) => {
    navigator("detail", { state: { id: rowData._id } });
  };

  const templateDate = (rowData) => {
    const date = formatDate(rowData.date) + " : " + formatTime(rowData.time);
    return <span>{date}</span>;
  };
  const templateTotal = (rowData) => {
    return (
      <span>
        {formatCurrency(rowData.priceSale - (rowData.priceSell || 0) + " VND")}
      </span>
    );
  };

  const templateStatus = (rowData) => {
    let payment;
    let bg_payment;
    if (rowData.reciveStatus === true) {
      payment = "Đã nhận bàn";
      bg_payment = "bg-green-300";
    } else {
      payment = "Chưa nhận bàn";
      bg_payment = "bg-blue-300";
    }
    if (rowData.reciveStatus === false && rowData.cancel === true) {
      payment = "Đã hủy đặt";
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
                  placeholder="Tìm theo tên"
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
                  field="customer_name"
                  header="Tên khách hàng"
                  body={loading && <Skeleton />}
                ></Column>
                <Column
                  field="phone"
                  header="Số điện thoại"
                  body={loading && <Skeleton />}
                ></Column>
                <Column
                  field="table.name"
                  header="Bàn"
                  sortable
                  body={loading && <Skeleton />}
                ></Column>
                <Column
                  header="Ngày đặt"
                  sortable
                  body={(loading && <Skeleton />) || templateDate}
                ></Column>
                <Column
                  header="Tổng tiền"
                  body={(loading && <Skeleton />) || templateTotal}
                ></Column>
                <Column
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
                      "Tên khách hàng",
                      "Số điện thoại",
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
            <TabPanel header="Chưa nhận bàn">
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
                  field="customer_name"
                  header="Tên khách hàng"
                  body={loading && <Skeleton />}
                ></Column>
                <Column
                  field="phone"
                  header="Số điện thoại"
                  body={loading && <Skeleton />}
                ></Column>
                <Column
                  field="table.name"
                  header="Bàn"
                  sortable
                  body={loading && <Skeleton />}
                ></Column>
                <Column
                  header="Ngày đặt"
                  sortable
                  body={(loading && <Skeleton />) || templateDate}
                ></Column>
                <Column
                  header="Tổng tiền"
                  body={(loading && <Skeleton />) || templateTotal}
                ></Column>
                <Column
                  header="Trạng thái"
                  body={(loading && <Skeleton />) || templateStatus}
                ></Column>
                <Column
                  field="quantity"
                  header="Hành động"
                  body={(loading && <Skeleton />) || actionBodyTemplate}
                ></Column>
              </DataTable>
            </TabPanel>
            <TabPanel header="Đã nhận bàn">
              <DataTable
                ref={exportCSV}
                value={listDataRecive}
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
                  field="customer_name"
                  header="Tên khách hàng"
                  body={loading && <Skeleton />}
                ></Column>
                <Column
                  field="phone"
                  header="Số điện thoại"
                  body={loading && <Skeleton />}
                ></Column>
                <Column
                  field="table.name"
                  header="Bàn"
                  sortable
                  body={loading && <Skeleton />}
                ></Column>
                <Column
                  header="Ngày đặt"
                  sortable
                  body={(loading && <Skeleton />) || templateDate}
                ></Column>
                <Column
                  header="Tổng tiền"
                  body={(loading && <Skeleton />) || templateTotal}
                ></Column>
                <Column
                  header="Trạng thái"
                  body={(loading && <Skeleton />) || templateStatus}
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
                  field="customer_name"
                  header="Tên khách hàng"
                  body={loading && <Skeleton />}
                ></Column>
                <Column
                  field="phone"
                  header="Số điện thoại"
                  body={loading && <Skeleton />}
                ></Column>
                <Column
                  field="table.name"
                  header="Bàn"
                  sortable
                  body={loading && <Skeleton />}
                ></Column>
                <Column
                  header="Ngày đặt"
                  sortable
                  body={(loading && <Skeleton />) || templateDate}
                ></Column>
                <Column
                  header="Tổng tiền"
                  body={(loading && <Skeleton />) || templateTotal}
                ></Column>
                <Column
                  header="Trạng thái"
                  body={(loading && <Skeleton />) || templateStatus}
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

export default ListBookingList;
