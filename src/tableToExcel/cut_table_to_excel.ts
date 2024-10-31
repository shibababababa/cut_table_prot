import * as ExcelJS from "exceljs";
import { CutTable } from "../pages/Capture";


const getExcelColumnLetter = (colIndex: number) => {
  let letter = '';
  while (colIndex > 0) {
    const remainder = (colIndex - 1) % 26;
    letter = String.fromCharCode(65 + remainder) + letter;
    colIndex = Math.floor((colIndex - 1) / 26);
  }
  return letter;
};

const edit_Workbook = (
  workbook: ExcelJS.Workbook,
  cut_table: CutTable,
  cut_num: number
) => {
  const PIXELS_TO_COLUMN_UNITS = 0.142;
  const PIXELS_TO_ROW_POINTS = 0.75;

  const worksheet = workbook.addWorksheet("カット表");

  const columns = [{ header: "", key: "empty", width: 10 }]; 

  for (let i = 1; i <= cut_num; i++) {
    columns.push({
      header: `${i}`, 
      key: `col${i}`,
      width: 15, 
    });
  }

  worksheet.columns = columns;

  const endColumnLetter = getExcelColumnLetter(cut_num+1);
  const mergeRange = `A1:${endColumnLetter}1`;
  worksheet.mergeCells(mergeRange);

  const titleCell = worksheet.getCell("A1");
  titleCell.value = `カット表(${cut_num}枚カット)`;
  titleCell.font = { bold: true, size: 16 };
  titleCell.alignment = { vertical: "middle", horizontal: "center" };

  worksheet.getRow(2).eachCell((cell, colNumber) => {
    if (colNumber > 1) {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "D9D9D9" },
      };
      cell.alignment = { horizontal: "center", vertical: "middle" };
      cell.font = { bold: true };
    }
  });

  const labels = ["image", "title", "narration", "startAt", "finishAt"];
  labels.forEach((label, index) => {
    const rowIndex = index + 3;
    const labelCell = worksheet.getCell(`A${rowIndex}`);
    labelCell.value = label;
    labelCell.alignment = { vertical: "middle", horizontal: "center" };
    labelCell.font = { bold: true };
  });

  worksheet.eachRow({ includeEmpty: true }, (row) => {
    row.eachCell({ includeEmpty: true }, (cell) => {
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });
  });

  for (let cut_i = 0; cut_i < cut_table.cuts.length; cut_i++) {
    const cut = cut_table.cuts[cut_i];
    const image = cut.image;

    const imageWidth = 128;
    const imageHeight = 128;

    const colWidth = imageWidth * PIXELS_TO_COLUMN_UNITS;
    const rowHeight = imageHeight * PIXELS_TO_ROW_POINTS;

    worksheet.getColumn(cut_i + 2).width = colWidth;
    worksheet.getRow(3).height = rowHeight;

    // 画像を貼る
    const imageId = workbook.addImage({
      base64: image,
      extension: "png",
    });
    worksheet.addImage(imageId, {
      tl: { col: cut_i + 1, row: 2 },
      ext: { width: imageWidth, height: imageHeight },
    });

    // 画像以外のフィールドを書き出す(getCellの入力はrow, columnの順)
    worksheet.getCell(4, cut_i + 2).value = cut.title;
    worksheet.getCell(5, cut_i + 2).value = cut.narration;
    worksheet.getCell(6, cut_i + 2).value = cut.startAt;
    worksheet.getCell(7, cut_i + 2).value = cut.finishAt;
  }

  return workbook;
};

const save_Workbook = async (workbook: ExcelJS.Workbook) => {
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "cut_table.xlsx";
  a.click();
  URL.revokeObjectURL(url);
};

export const cut_table_to_excel = async (
  cut_num: number,
  cut_table: CutTable
) => {
  // 新規エクセルファイルを作成
  const workbook = new ExcelJS.Workbook();

  // ワークシートを編集
  edit_Workbook(workbook, cut_table, cut_num);

  // 保存
  await save_Workbook(workbook);
};
