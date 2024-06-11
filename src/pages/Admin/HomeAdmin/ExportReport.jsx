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

  useEffect(() => {
    const fectData = async () => {
      const result = await ReportService.getReport();
      setReportData(result.data);
    };
    fectData();
  }, []);

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
          tongdoanhthu: data.overview.tongdoanhthu,
          loinhuan: data.overview.loinhuan,
          loinhuantheophantram: data.overview.loinhuantheophantram,
          tongdonhangdacungcap: data.overview.tongdonhangdacungcap,
          dichvu: data.dichvu.data,
          doanhsobanhang: data.doanhsobanhang.data,
          nhansu: data.nhansu.data,
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
    <Button
      text
      label="Xuất báo cáo"
      className="text-blue-400 font-semibold p-0 m-0 mt-2 hover:bg-white"
      onClick={() => generateDocument(reportData)}
    />
  );
};

export default Report;
