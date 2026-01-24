import express from "express";
import multer from "multer";
import sharp from "sharp";
import path from "path";
import fs from "fs";
import cors from "cors";

const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());

/* ================================
   FOLDERS
================================ */
const originalDir = "./uploads/original";
const watermarkedDir = "./uploads/watermarked";

if (!fs.existsSync(originalDir)) fs.mkdirSync(originalDir, { recursive: true });
if (!fs.existsSync(watermarkedDir)) fs.mkdirSync(watermarkedDir, { recursive: true });

/* ================================
   MULTER CONFIG
================================ */
const storage = multer.diskStorage({
  destination: originalDir,
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      cb(new Error("Only images allowed"));
    }
    cb(null, true);
  }
});

/* ================================
   WATERMARK FUNCTION
================================ */
async function addWatermark(inputPath, outputPath) {
  const image = sharp(inputPath);
  const meta = await image.metadata();

  const watermarkText = "FortuneFloors.com";
  const fontSize = Math.max(20, Math.round(meta.width / 18));

  // Create watermark with better visibility
  const svg = `
    <svg width="${meta.width}" height="${meta.height}">
      <defs>
        <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="1" dy="1" stdDeviation="1" flood-color="black" flood-opacity="0.5"/>
        </filter>
      </defs>
      <text
        x="98%"
        y="98%"
        font-size="${fontSize}"
        fill="white"
        stroke="black"
        stroke-width="1"
        opacity="0.6"
        text-anchor="end"
        dominant-baseline="ideographic"
        font-family="Arial, Helvetica, sans-serif"
        font-weight="bold"
        filter="url(#shadow)"
      >
        ${watermarkText}
      </text>
    </svg>
  `;

  await image
    .composite([{ input: Buffer.from(svg), gravity: 'southeast' }])
    .jpeg({ quality: 95 })
    .toFile(outputPath);
}

/* ================================
   UPLOAD API
================================ */
app.post("/api/upload", upload.single("image"), async (req, res) => {
  try {
    const originalPath = req.file.path;
    const outputFileName = "wm-" + req.file.filename;
    const watermarkedPath = path.join(watermarkedDir, outputFileName);

    await addWatermark(originalPath, watermarkedPath);

    // Remove original image (important)
    fs.unlinkSync(originalPath);

    res.json({
      success: true,
      imageUrl: `http://localhost:${PORT}/images/${outputFileName}` 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Upload failed" });
  }
});

/* ================================
   SERVE WATERMARKED IMAGES ONLY
================================ */
app.use("/images", express.static(watermarkedDir));

/* ================================
   START SERVER
================================ */
app.listen(PORT, () => {
  console.log(`✅ Fortune Floors server running on http://localhost:${PORT}`);
});
