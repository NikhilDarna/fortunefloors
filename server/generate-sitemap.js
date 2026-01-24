import fs from "fs";
import path from "path";
import sqlite3 from "sqlite3";
import slugify from "slugify";

const BASE_URL = "https://fortunefloors.com";
const PUBLIC_DIR = path.resolve("public");
const SITEMAP_PATH = path.join(PUBLIC_DIR, "sitemap.xml");

const db = new sqlite3.Database("fortune_realestate.db");

const staticPages = [
  "/",
  "/buy",
  "/rent",
  "/sell",
  "/commercial",
  "/pg",
  "/plots",
  "/properties",
  "/blogs",
  "/about",
  "/contact",
];

db.all(
  `SELECT title, location, updated_at FROM properties WHERE status = 'approved'`,
  [],
  (err, properties) => {
    if (err) {
      console.error("DB error", err);
      process.exit(1);
    }

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    // Static pages
    staticPages.forEach((p) => {
      xml += `
  <url>
    <loc>${BASE_URL}${p}</loc>
    <changefreq>weekly</changefreq>
    <priority>${p === "/" ? "1.0" : "0.8"}</priority>
  </url>`;
    });

    // Property pages
    properties.forEach((p) => {
      const slug = slugify(`${p.title}-${p.location}`, {
        lower: true,
        strict: true,
      });

      xml += `
  <url>
    <loc>${BASE_URL}/property/${slug}</loc>
    <lastmod>${new Date(p.updated_at).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`;
    });

    xml += `\n</urlset>`;

    fs.writeFileSync(SITEMAP_PATH, xml);
    console.log("✅ sitemap.xml generated successfully");
    db.close();
  }
);
