import * as XLSX from "xlsx";
import * as FileSaver from "file-saver";

export const emailRegex = /^([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+)\.([a-zA-Z]{2,})$/

export const exportToExcel = (csvData, fileName) => {
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";
    const formattedDate = new Date()
      .toISOString()
      .replace(/T/, " ")
      .replace(/\..+/, "");
    const newFileName = `${fileName}_${formattedDate}${fileExtension}`;
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, newFileName);
  };

function validate(input) {
  let errors = {};
  if (!input.name || /[^a-zA-Z, ]/g.test(input.name)) {
    errors.name = 'Name is not valid';
  } else if (!input.number || /^[0-9]+([,][0-9]+)?$/g.test(input.number)) {
    errors.number = 'ingresa un número válido';
  } else if (
    !input.email ||
    /^([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+)\.([a-zA-Z]{2,})$/g.test(input.email)
  ) {
    errors.email = 'email is required';
  } else if (!input.season) {
    errors.season = 'season is required';
  }
  return errors;
}

export default { validate };
