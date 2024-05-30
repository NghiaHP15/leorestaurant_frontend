import { useState, useRef } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import isEqual from "lodash/isEqual";
import { cloneDeep, filter } from "lodash";

function Order() {
  const langaguesOption = [
    {
      name: "Vietnamese",
      code: "VI",
    },
    {
      name: "English",
      code: "ES",
    },
    {
      name: "Estonia",
      code: "VI",
    },
    {
      name: "Latvia",
      code: "ES",
    },
    {
      name: "Iceland",
      code: "IL",
    },
  ];

  function generateRandomString(length) {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(randomIndex);
    }

    return result;
  }

  const defaultData = {
    id: generateRandomString(10),
    name: "",
    langagues: null,
    code: "",
  };

  const defaultError = {
    name: "",
    langagues: null,
    code: "",
  };

  const [listData, setListData] = useState([defaultData]);
  const [showDialog, setShowDiaLog] = useState(false);
  const [selectedValues, setSelectedValue] = useState(null);
  const [errors, setErrors] = useState([defaultError]);

  const handleAddRow = () => {
    setListData([
      ...listData,
      { id: generateRandomString(10), name: "", langagues: null, code: "" },
    ]);
    setErrors([...errors, { name: "", langagues: "", code: "" }]);
  };

  const handleChangeInput = (event, index, field) => {
    const { value } = event.target;
    const _listData = [...listData];
    if (!value.startsWith(" ")) {
      _listData[index][field] = value;
      setListData(_listData);
      value.length > 0 && checkDuplicates(_listData, index, field, value);
    }
  };

  const handleChangeDropdown = (event, index, field) => {
    const { value } = event;
    const _listData = [...listData];
    _listData[index][field] = value;
    setListData(_listData);
    checkDuplicates(_listData, index, field, value);
  };

  const checkDuplicates = (newData, indexRow, field, value) => {
    const newErrors = cloneDeep(errors);
    newData.map((x, i) => {
      const check = filter(newData, (item) => {
        return item[field] === x[field] && isEqual(item[field], x[field]);
      });
      console.log(check);
      console.log(i);
      if (check.length > 1) {
        newErrors[i][field] = `${
          field.charAt(0).toUpperCase() + field.slice(1)
        } is already`;
      } else {
        newErrors[i][field] = "";
      }
    });
    setErrors(newErrors);
  };

  const handleHideDialog = () => {
    setShowDiaLog(false);
  };

  const handleShowDialog = () => {
    setShowDiaLog(true);
  };

  const renderError = (field, rowIndex) => {
    return (
      <span className="text-red-500 text-xs mt-1" style={{ height: 0 }}>
        {errors[rowIndex][field]}
      </span>
    );
  };

  const actionBodyTemplate = ({ rowData }) => {
    return (
      <Button
        icon="pi pi-trash"
        rounded
        outlined
        severity="danger"
        aria-label="Cancel"
      />
    );
  };

  return (
    <>
      <div className="grid mt-5">
        <Button
          label="Create"
          severity="info"
          onClick={() => handleShowDialog()}
        />
      </div>
      <Dialog
        visible={showDialog}
        onHide={handleHideDialog}
        pt={{
          root: "border-round-3xl",
          header: "hidden",
          content: "p-5 border-round-2xl shadow-1",
        }}
      >
        <div className="w-full text-right mb-3">
          <Button label="Create +" severity="info" onClick={handleAddRow} />
        </div>
        <DataTable
          value={listData}
          tableStyle={{ minWidth: "50rem" }}
          selection={selectedValues}
          selectionMode={null}
          onSelectionChange={(e) => setSelectedValue(e.value)}
          dataKey="id"
        >
          <Column selectionMode="multiple" style={{ width: "3rem" }}></Column>
          <Column
            header="Name"
            field="name"
            body={(value, row) => {
              return (
                <div className="flex flex-column">
                  <InputText
                    className="h-3rem"
                    value={value.name}
                    onChange={(e) =>
                      handleChangeInput(e, row.rowIndex, row.field)
                    }
                  />
                  {renderError(row.field, row.rowIndex)}
                </div>
              );
            }}
          ></Column>
          <Column
            header="Language"
            field="langagues"
            body={(value, row) => {
              return (
                <div className="flex flex-column">
                  <Dropdown
                    value={value.langagues}
                    onChange={(e) =>
                      handleChangeDropdown(e, row.rowIndex, row.field)
                    }
                    options={langaguesOption}
                    optionLabel="name"
                    placeholder="Choice language"
                    pt={{
                      root: "px-2 py-1 h-3rem w-full align-items-center",
                      input: "font-family text-base font-normal",
                    }}
                  />
                  {renderError(row.field, row.rowIndex)}
                </div>
              );
            }}
          ></Column>
          <Column
            field="code"
            header="Code"
            body={(value, row) => {
              return (
                <div className="flex flex-column">
                  <InputText
                    className="h-3rem"
                    value={value.code}
                    onChange={(e) =>
                      handleChangeInput(e, row.rowIndex, row.field)
                    }
                  />
                  {renderError(row.field, row.rowIndex)}
                </div>
              );
            }}
          ></Column>
          <Column
            header="Action"
            exportable={false}
            body={actionBodyTemplate}
          />
        </DataTable>
      </Dialog>
    </>
  );
}

export default Order;
