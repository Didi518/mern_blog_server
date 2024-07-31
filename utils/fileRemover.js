import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fileRemover = (filename) => {
  fs.unlink(path.join(__dirname, "../uploads", filename), function (err) {
    if (err && err.code == "ENOENT") {
      console.log(`Fichier ${filename} n'existe pas, suppression impossible`);
    } else if (err) {
      console.log(err.message);
      console.log(`Erreur lors de la suppression du fichier ${filename}`);
    } else {
      console.log(`Supression ${filename}`);
    }
  });
};

export { fileRemover };
