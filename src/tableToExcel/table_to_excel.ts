import * as ExcelJS from "exceljs";

async function main() {
  const template_filename = "table/template/cut_table.xlsx";
  const output_file = "table/output.xlsx";

  // カット表のテンプレートを開く
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(template_filename);

  // 最初のシートを取り出す
  const worksheet = workbook.worksheets[0];

  const cut_num = 10;
  const titles = ["導入", "商品紹介", "売り上げグラフ", "顧客の感想", "将来", "これまで", "他者との比較", "会社紹介", "自然", "最後に"]
  const nalations = ["おはよう", "こんにちは", "こんばんわ", "ありがとう", "どういたしまして", "大丈夫です", "売り上げが伸びました", "アットホームな会社です", "SDGsを目指しています", "よろしくお願いします"]
  for (let cut_i = 0; cut_i < cut_num; cut_i++) {
    const photo_filename = `img/icons/kkrn_icon_user_${cut_i+1}.png`;
    const photo_range = {
      tl: { col: cut_i+1, row: 2, nativeColOff: 0, nativeRowOff: 0 },
      ext: { width: 128, height: 128 },
    };
    // 画像を貼る
    const imageId = workbook.addImage({
      filename: photo_filename,
      extension: "png",
    });
    worksheet.addImage(imageId, photo_range);

    // 画像以外のフィールドを書き出す
    worksheet.getCell(4, cut_i+2).value = titles[cut_i];
    worksheet.getCell(5, cut_i+2).value = nalations[cut_i];
    worksheet.getCell(6, cut_i+2).value = 1.25 * cut_i;
    worksheet.getCell(7, cut_i+2).value = 1.25 * (cut_i+1);
  }

  // 保存
  await workbook.xlsx.writeFile(output_file);
}

main();
