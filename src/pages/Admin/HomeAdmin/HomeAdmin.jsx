/* eslint-disable array-callback-return */
import React, { useState, useEffect } from "react";
import { Chart } from "primereact/chart";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import * as ReportService from "../../../services/ReportService";
import images from "../../../assets/images";
import { formatCurrency } from "../../../hooks/useFormat";
import config from "../../../config";
import { useNavigate } from "react-router-dom";
import Report from "./ExportReport";

const ChartRevenue = ({ data }) => {
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});
  const titleData = [
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
  ];

  useEffect(() => {
    let monthDataSale = [];
    let monthDataOrigin = [];
    if (data) {
      const { sales, origin } = data;
      const year = new Date().getFullYear().toString();
      monthDataSale = titleData.map((item) => {
        const key = `${year}-${item}`;
        return sales[key] || 0;
      });
      monthDataOrigin = titleData.map((item) => {
        const key = `${year}-${item}`;
        return origin[key] || 0;
      });
    }
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue("--text-color");
    const textColorSecondary = documentStyle.getPropertyValue(
      "--text-color-secondary"
    );
    const surfaceBorder = documentStyle.getPropertyValue("--surface-border");
    const dataSale = {
      labels: titleData,
      datasets: [
        {
          label: "Doanh thu",
          backgroundColor: documentStyle.getPropertyValue("--orange-500"),
          borderColor: documentStyle.getPropertyValue("--orange-500"),
          data: monthDataSale,
        },
        {
          label: "Chi tiêu",
          backgroundColor: documentStyle.getPropertyValue("--bluegray-500"),
          borderColor: documentStyle.getPropertyValue("--bluegray-500"),
          data: monthDataOrigin,
        },
      ],
    };
    const options = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      barPercentage: 0.3,
      barBorderRadius: 10,
      categorySpacing: 0,
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            fontColor: textColor,
            usePointStyle: true,
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
            font: {
              weight: 500,
            },
          },
          grid: {
            display: false,
            drawBorder: false,
          },
        },
        y: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
      },
    };
    console.log(1);
    setChartData(dataSale);
    setChartOptions(options);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <div className="card p-5 border-round-2xl bg-white shadow-2">
      <div className="mb-5">
        <span className="text-900 text-xl font-semibold capitalize font-family">
          Tổng quan về doanh thu
        </span>
        <div>
          <Report />
        </div>
      </div>
      <div>
        <Chart type="bar" data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

const LastCustomer = ({ data, title, path }) => {
  const navigator = useNavigate();

  return (
    <div className="card px-4 py-5 border-round-2xl bg-white shadow-2">
      <h3 className="text-color font-family capitalize mt-0 mb-3">{title}</h3>
      <ul className="p-0 m-0">
        {data &&
          data.map((item, index) => (
            <li className="flex align-items-center py-2" key={index}>
              <Avatar
                image={item.image || images.avatarDefault}
                className="mr-3"
                size="xlarge"
                title={item.name}
                shape="circle"
              />
              <div className="">
                <span className="block font-family text-base text-color font-medium">
                  {item.name}
                </span>
                <span className="block font-family text-base text-color-secondary font-normal mt-1">
                  {item.role?.description}
                </span>
              </div>
            </li>
          ))}
      </ul>
      <Button
        severity="warning"
        icon={""}
        onClick={() => navigator(path)}
        className="bg-orange-500 block w-full text-lg text-white text-base font-medium font-family capitalize  border-round-lg mt-3 p-3"
      >
        Xem tất cả
      </Button>
    </div>
  );
};

const TopFood = ({ data }) => {
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    let lable = [];
    let point = [];
    if (data) {
      lable = data.map((item) => item.name);
      point = data.map((item) => item.point);
    }
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue(
      "--text-color font-family"
    );
    const surfaceBorder = documentStyle.getPropertyValue("--surface-border");
    const dataOptions = {
      datasets: [
        {
          data: point,
          backgroundColor: [
            documentStyle.getPropertyValue("--red-500"),
            documentStyle.getPropertyValue("--green-400"),
            documentStyle.getPropertyValue("--yellow-500"),
            documentStyle.getPropertyValue("--bluegray-500"),
            documentStyle.getPropertyValue("--blue-400"),
          ],
          label: "Mặt hàng",
        },
      ],
      labels: lable,
    };
    const options = {
      plugins: {
        legend: {
          position: "right",
          labels: {
            color: textColor,
          },
        },
      },
      scales: {
        r: {
          grid: {
            color: surfaceBorder,
          },
        },
      },
    };

    setChartData(dataOptions);
    setChartOptions(options);
  }, [data]);

  return (
    <div className="card px-4 py-5 border-round-2xl bg-white shadow-2 h-30rem">
      <div className="flex justify-content-between mb-5">
        <span className="text-900 text-xl font-semibold capitalize font-family">
          Tổng quan về doanh thu
        </span>
      </div>
      <div className="card flex justify-content-center align-items-center">
        <Chart
          type="polarArea"
          data={chartData}
          options={chartOptions}
          style={{ position: "relative", width: "450px" }}
        />
      </div>
    </div>
  );
};

const BookingRate = ({ data }) => {
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});
  const titleData = [
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
  ];

  useEffect(() => {
    let dataBooking = [];
    let dataRecive = [];
    if (data) {
      const { booking, recive } = data;
      const year = new Date().getFullYear().toString();
      dataBooking = titleData.map((item) => {
        const key = `${year}-${item}`;
        return booking[key] || 0;
      });
      dataRecive = titleData.map((item) => {
        const key = `${year}-${item}`;
        return recive[key] || 0;
      });
    }

    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue("--text-color");
    const textColorSecondary = documentStyle.getPropertyValue(
      "--text-color-secondary"
    );
    const surfaceBorder = documentStyle.getPropertyValue("--surface-border");
    const dataOptions = {
      labels: titleData,
      datasets: [
        {
          label: "Khách đặt",
          data: dataBooking,
          fill: false,
          borderColor: documentStyle.getPropertyValue("--blue-500"),
          tension: 0.4,
        },
        {
          label: "Khách nhận bàn",
          data: dataRecive,
          fill: false,
          borderColor: documentStyle.getPropertyValue("--orange-500"),
          tension: 0.4,
        },
      ],
    };
    const options = {
      maintainAspectRatio: false,
      aspectRatio: 0.6,
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            color: textColor,
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
          },
        },
        y: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
          },
        },
      },
    };

    setChartData(dataOptions);
    setChartOptions(options);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <div className="card px-4 py-5 border-round-2xl bg-white shadow-2 h-30rem">
      <div className="flex justify-content-between mb-2">
        <span className="text-900 text-xl font-semibold capitalize font-family">
          Tổng quan về đặt bàn
        </span>
      </div>
      <div className="card">
        <Chart
          type="line"
          data={chartData}
          options={chartOptions}
          className="h-25rem"
        />
      </div>
    </div>
  );
};

function HomeAdmin() {
  const [dataNewSaff, setDataNewStaff] = useState();
  const [dataSalesFigures, setSalesFigures] = useState();
  const [dataTopFood, setDataTopFoods] = useState();
  const [dataBooking, setDataBooking] = useState();
  const [dataCart, setDataCart] = useState({
    total: "",
    amount: "",
    amount_customer: "",
    amount_booking: "",
  });

  const getInt = (data) => {
    if (data < 10) {
      data = "0" + data;
    }
    return data;
  };

  const getMoney = (data) => {
    data = formatCurrency(data) + "đ";
    return data;
  };

  useEffect(() => {
    const fetchData = async () => {
      const [
        resultAmountBill,
        resultSalesBill,
        resultCustomer,
        resultBooking,
        resultNewStaff,
        resultSalesFigures,
        resultTopFoods,
        resultBookingFigures,
      ] = await Promise.all([
        ReportService.getAmountBill(),
        ReportService.getSalesBill(),
        ReportService.getAmountCustomer(),
        ReportService.getAmountBooking(),
        ReportService.getNewStaff(),
        ReportService.getSalesFigures(),
        ReportService.getTopFoods(),
        ReportService.getBookings(),
        ReportService.getBookings(),
      ]);
      const _dataCart = { ...dataCart };
      const date = new Date().getFullYear();
      _dataCart.amount = resultAmountBill.data[date];
      _dataCart.total = resultSalesBill.data[date];
      _dataCart.amount_customer = resultCustomer.data[date];
      _dataCart.amount_booking = resultBooking.data[date];
      setDataCart(_dataCart);
      setDataNewStaff(resultNewStaff.data);
      setSalesFigures(resultSalesFigures.data);
      setDataTopFoods(resultTopFoods.data);
      setDataBooking(resultBookingFigures.data);
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="grid mt-4">
      <div className="col-6 md:col-3 ">
        <div className="shadow-2 border-round-2xl overflow-hidden flex flex-column h-10rem">
          <div className="flex align-items-center p-3">
            <Avatar
              image={images.amountBill}
              shape="circle"
              className="h-5rem w-5rem"
            />
            <div className="ml-3">
              <span className="text-blue-500 block white-space-nowrap text-xl font-medium font-family">
                Doanh thu
              </span>
              <span className="text-blue-500 block text-3xl font-bold">
                {getMoney(dataCart.total)}
              </span>
            </div>
          </div>
          <img
            src="https://verona.primereact.org/demo/images/dashboard/users.svg"
            alt="Doanh thu"
          />
        </div>
      </div>
      <div className="col-6 md:col-3 ">
        <div className="shadow-2 border-round-2xl overflow-hidden flex flex-column h-10rem">
          <div className="flex align-items-center p-3">
            <Avatar
              image={images.countBill}
              shape="circle"
              className="h-5rem w-5rem"
            />
            <div className="ml-3">
              <span className="text-orange-500 block white-space-nowrap text-xl font-medium font-family">
                Đơn hàng
              </span>
              <span className="text-orange-500 block text-3xl font-bold">
                {getInt(dataCart.amount)}
              </span>
            </div>
          </div>
          <img
            src="https://verona.primereact.org/demo/images/dashboard/locations.svg"
            alt="Đơn hàng"
          />
        </div>
      </div>
      <div className="col-6 md:col-3 ">
        <div className="shadow-2 border-round-2xl overflow-hidden flex flex-column h-10rem">
          <div className="flex align-items-center p-3">
            <Avatar
              image={images.countBooking}
              shape="circle"
              className="h-5rem w-5rem"
            />
            <div className="ml-3">
              <span className="text-indigo-500 block white-space-nowrap text-xl font-medium font-family">
                Đặt bàn
              </span>
              <span className="text-indigo-500 block text-3xl font-bold">
                {getInt(dataCart.amount_booking)}
              </span>
            </div>
          </div>
          <img
            src="https://verona.primereact.org/demo/images/dashboard/interactions.svg"
            alt="Doanh thu"
          />
        </div>
      </div>
      <div className="col-6 md:col-3 ">
        <div className="shadow-2 border-round-2xl overflow-hidden flex flex-column h-10rem">
          <div className="flex align-items-center p-3">
            <Avatar
              image={images.countCustomer}
              shape="circle"
              className="h-5rem w-5rem"
            />
            <div className="ml-3">
              <span className="text-green-500 block white-space-nowrap text-xl font-medium font-family">
                Lượng khách hàng
              </span>
              <span className="text-green-500 block text-3xl font-bold">
                {getInt(dataCart.amount_customer)}
              </span>
            </div>
          </div>
          <img
            src="https://verona.primereact.org/demo/images/dashboard/rate.svg"
            alt="Lượng khách hàng"
          />
        </div>
      </div>

      <div className="col-12 xl:col-9">
        <ChartRevenue data={dataSalesFigures} />
      </div>

      <div className="col-12 xl:col-3">
        <LastCustomer
          data={dataNewSaff}
          title={"Nhân viên mới nhất"}
          path={config.router.listEmployee}
        />
      </div>
      <div className="col-12 xl:col-4">
        <TopFood data={dataTopFood} />
      </div>
      <div className="col-12 xl:col-8">
        <BookingRate data={dataBooking} />
      </div>
    </div>
  );
}

export default HomeAdmin;
