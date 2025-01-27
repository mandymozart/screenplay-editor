import fs from "fs";
import path from "path";

export function readScreenplayFile(screenplayPath) {
  if (!fs.existsSync(screenplayPath)) {
    throw new Error(`File "${screenplayPath}" not found.`);
  }
  return fs.readFileSync(screenplayPath, "utf-8");
}

export function ensureOutputDirectory(screenplayPath, destinationFolderPath) {
  const inputDir = path.dirname(screenplayPath);
  const outputDir = destinationFolderPath
    ? path.resolve(inputDir, destinationFolderPath)
    : inputDir;

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  return outputDir;
}

export function savePDF(doc, outputDir, title) {
  const sanitizedTitle = title || "Untitled";
  const outputFile = path.join(outputDir, `${sanitizedTitle}.pdf`);
  doc.save(outputFile);
  console.log(`PDF saved at "${outputFile}".`);
}
