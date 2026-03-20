const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..", "kenniscentrum");

function stripHtml(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function updateFile(filePath) {
  const html = fs.readFileSync(filePath, "utf8");
  if (/meta http-equiv="refresh"/i.test(html)) {
    return false;
  }

  const articleMatch = html.match(/<article class="article-body"[\s\S]*?<\/article>/);
  const jsonLdMatch = html.match(/<script type="application\/ld\+json">\s*([\s\S]*?)\s*<\/script>/);
  if (!articleMatch || !jsonLdMatch) {
    return false;
  }

  const structuredData = JSON.parse(jsonLdMatch[1]);
  const blogPosting = structuredData.find((item) => item["@type"] === "BlogPosting");
  if (!blogPosting) {
    return false;
  }

  const wordCount = stripHtml(articleMatch[0]).split(/\s+/).filter(Boolean).length;
  blogPosting.wordCount = wordCount;

  const updated = html.replace(
    jsonLdMatch[0],
    `<script type="application/ld+json">\n${JSON.stringify(structuredData, null, 2)}\n    </script>`
  );

  fs.writeFileSync(filePath, updated);
  return true;
}

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full);
    } else if (entry.isFile() && entry.name === "index.html") {
      if (updateFile(full)) {
        console.log(`Updated ${path.relative(path.resolve(__dirname, ".."), full)}`);
      }
    }
  }
}

walk(root);
