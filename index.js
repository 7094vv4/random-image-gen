const fs = require("fs");
const { PNG } = require("pngjs");

const generateRandomImage = (width, height, targetSizeKB, outputPath) => {
  // 最終的な出力画像のサイズは width x height にはならない
  // ランダムなピクセルデータを生成
  let png = new PNG({ width, height });
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let idx = (width * y + x) << 2;
      png.data[idx] = Math.floor(Math.random() * 256); // 赤
      png.data[idx + 1] = Math.floor(Math.random() * 256); // 緑
      png.data[idx + 2] = Math.floor(Math.random() * 256); // 青
      png.data[idx + 3] = 255; //アルファ
    }
  }

  // 一時ファイルに保存
  png
    .pack()
    .pipe(fs.createWriteStream(outputPath + ".tmp"))
    .on("finish", () => {
      // 一時ファイルのサイズを取得
      const stats = fs.statSync(outputPath + ".tmp");
      const currentSizeKB = stats.size / 1024;

      // スケーリング係数を計算
      const scaleFactor = Math.sqrt(targetSizeKB / currentSizeKB);
      const newWidth = Math.floor(width * scaleFactor);
      const newHeight = Math.floor(height * scaleFactor);

      // 新しいサイズで再生成
      let scaledPng = new PNG({ width: newWidth, height: newHeight });
      for (let y = 0; y < newHeight; y++) {
        for (let x = 0; x < newWidth; x++) {
          let idx = (newWidth * y + x) << 2;
          scaledPng.data[idx] = Math.floor(Math.random() * 256); // 赤
          scaledPng.data[idx + 1] = Math.floor(Math.random() * 256); // 緑
          scaledPng.data[idx + 2] = Math.floor(Math.random() * 256); // 青
          scaledPng.data[idx + 3] = 255; // アルファ
        }
      }

      // 出力ファイルに保存
      scaledPng
        .pack()
        .pipe(fs.createWriteStream(outputPath))
        .on("finish", () => {
          fs.unlinkSync(outputPath + ".tmp");
          console.log(
            `Image saved to ${outputPath} with size approximately ${targetSizeKB} KB.`
          );
        });
    });
};

generateRandomImage(512, 512, 11, "11KB.png");
