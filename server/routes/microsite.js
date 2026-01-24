import express from "express";
import multer from "multer";
import slugify from "slugify";
import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

const upload = multer({
  dest: path.join(__dirname, "..", "uploads", "logos"),
});

router.post("/build-microsite", upload.single("logo"), async (req, res) => {
  try {
    const { siteName, email, phone } = req.body;

    if (!siteName || !email || !phone) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const slug = slugify(siteName, { lower: true, strict: true });

    const micrositeDir = path.join(__dirname, "..", "microsites", slug);
    const templateDir = path.join(__dirname, "..", "templates", "microsite");

    // Copy template
    await fs.copy(templateDir, micrositeDir);

    // Replace placeholders
    const indexPath = path.join(micrositeDir, "index.html");
    let html = await fs.readFile(indexPath, "utf8");

    html = html
      .replace(/{{SITE_NAME}}/g, siteName)
      .replace(/{{EMAIL}}/g, email)
      .replace(/{{PHONE}}/g, phone);

    await fs.writeFile(indexPath, html);

    // Move logo if uploaded
    if (req.file) {
      await fs.move(
        req.file.path,
        path.join(micrositeDir, "logo.png"),
        { overwrite: true }
      );
    }

    res.json({
      success: true,
      url: `http://localhost:5000/microsites/${slug}`,
    });

  } catch (err) {
    console.error("❌ MICROSITE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
