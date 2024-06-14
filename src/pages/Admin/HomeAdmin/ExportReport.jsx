import React, { useState, useEffect } from "react";
import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import PizZipUtils from "pizzip/utils/index.js";
import { saveAs } from "file-saver";
import expressionParser from "docxtemplater/expressions";
import { Button } from "primereact/button";
import * as ReportService from "../../../services/ReportService";

const Report = () => {
  const [reportData, setReportData] = useState(null);
  const [reportDataDay, setReportDataDay] = useState(null);

  useEffect(() => {
    const fectData = async () => {
      const [result, resultDay] = await Promise.all([
        ReportService.getReport(),
        ReportService.getReportDay(),
      ]);
      setReportData(result.data);
      setReportDataDay(resultDay.data);
    };
    fectData();
  }, []);
  console.log(reportDataDay);

  const generateDocument = (data) => {
    const loadFile = (url, callback) => {
      PizZipUtils.getBinaryContent(url, callback);
    };

    loadFile(
      `https://leorestaurant--ten.vercel.app/docs/baocao.docx`,
      (error, content) => {
        if (error) {
          throw error;
        }
        const zip = new PizZip(content);
        const doc = new Docxtemplater(zip, {
          paragraphLoop: true,
          linebreaks: true,
          parser: expressionParser,
        });

        // Render the document with the data
        doc.render({
          month_report: "6",
          year_report: "2024",
          tongdoanhthu: data?.overview?.tongdoanhthu,
          loinhuan: data?.overview?.loinhuan,
          loinhuantheophantram: data?.overview?.loinhuantheophantram,
          tongdonhangdacungcap: data?.overview?.tongdonhangdacungcap,
          dichvu: data?.dichvu?.data,
          doanhsobanhang: data?.doanhsobanhang?.data,
          nhansu: data?.nhansu?.data,
        });

        const out = doc.getZip().generate({
          type: "blob",
          mimeType:
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        });

        saveAs(out, "BaoCao.docx");
      }
    );
  };

  return (
    <>
      <Button
        text
        label="Xuất báo cáo theo tháng"
        className="text-blue-400 font-semibold p-0 m-0 mt-2 hover:bg-white"
        onClick={() => generateDocument(reportData)}
      />
      <span className="mx-4 text-blue-400">-</span>
      <Button
        text
        label="Xuất báo cáo theo ngày"
        className="text-blue-400 font-semibold p-0 m-0 mt-2 hover:bg-white"
        onClick={() => generateDocument(reportDataDay)}
      />
    </>
  );
};

export default Report;
