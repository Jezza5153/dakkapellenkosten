const fs = require("fs");
const path = require("path");

const root = process.cwd();
const siteUrl = "https://dakkapellenkosten.nl";
const authorId = `${siteUrl}/redactie/#j-arrascaeta`;
const authorUrl = `${siteUrl}/redactie/#j-arrascaeta`;
const authorName = "J. Arrascaeta";
const updatedHuman = "11 maart 2026";

function walkHtml(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkHtml(fullPath, files);
    } else if (entry.name.endsWith(".html")) {
      files.push(fullPath);
    }
  }
  return files;
}

function relDir(fromFile, targetDir) {
  const from = path.posix.dirname(fromFile.split(path.sep).join("/"));
  const to = targetDir.split(path.sep).join("/");
  const rel = path.posix.relative(from, to) || ".";
  return rel.endsWith("/") ? rel : `${rel}/`;
}

function getSourceSummary(html) {
  const badge = (html.match(/<span class="badge[^>]*>([^<]+)<\/span>/i) || [])[1] || "";
  if (/Vergunning/i.test(badge)) {
    return 'De uitleg is gebaseerd op het <a href="https://omgevingsloket.nl" rel="nofollow noopener" target="_blank">Omgevingsloket</a>, het <a href="https://wetten.overheid.nl/BWBR0045212" rel="nofollow noopener" target="_blank">Besluit bouwwerken leefomgeving (Bbl)</a> en gemeentelijke vergunninginformatie. Voor vergunningonderwerpen blijft de officiële check via het Omgevingsloket en je eigen gemeente altijd leidend.';
  }
  if (/Kosten/i.test(badge)) {
    return 'De prijsuitleg is gebaseerd op openbare prijsindicaties van Nederlandse vergelijkingssites, leveranciersinformatie en branchegegevens. Gebruik prijsranges altijd als indicatie en laat actuele offertes afstemmen op jouw woning, maatvoering en gewenste afwerking.';
  }
  if (/Plaatsing/i.test(badge)) {
    return "De planning en procesuitleg zijn gebaseerd op openbare leveranciersinformatie, branche-uitleg en veelvoorkomende montageschema's van Nederlandse dakkapelbedrijven.";
  }
  if (/Onderhoud/i.test(badge)) {
    return "De inhoud is gebaseerd op openbare onderhoudsadviezen van leveranciers, materiaaluitleg en veelvoorkomende praktijkproblemen rond lekkage, condens, tocht en levensduur.";
  }
  if (/Materialen/i.test(badge)) {
    return "De vergelijking is gebaseerd op openbare productinformatie van leveranciers, fabrikanten en brancheuitleg over materiaalkeuze, onderhoud en levensduur.";
  }
  return "De uitleg is gebaseerd op openbare marktinformatie, leveranciersinformatie en branche-uitleg. Gebruik prijs- en productinformatie altijd als indicatie en laat technische details afstemmen op jouw woning.";
}

function replaceEditorialNote(html, file) {
  if (!html.includes('<div class="editorial-note">')) return html;
  if (html.includes(authorName) && html.includes("hoofdredacteur")) return html;

  const redactieHref = `${relDir(file, "redactie")}#j-arrascaeta`;
  const werkwijzeHref = relDir(file, "werkwijze");
  const note = `            <div class="editorial-note">
              <strong>Redactionele noot:</strong> Dit artikel is bijgewerkt op ${updatedHuman} door <strong>${authorName}</strong>, hoofdredacteur van DakkapellenKosten.nl. ${getSourceSummary(html)} Lees meer over onze <a href="${redactieHref}">redactie</a> en <a href="${werkwijzeHref}">werkwijze</a>.
            </div>`;

  return html.replace(
    /<div class="editorial-note">[\s\S]*?<\/div>/,
    note
  );
}

function replaceArticleAuthor(html, file) {
  const redactieHref = `${relDir(file, "redactie")}#j-arrascaeta`;

  html = html.replace(
    /<meta name="author" content="[^"]*">/i,
    `<meta name="author" content="${authorName}">`
  );

  html = html.replace(
    /<span>✍️[\s\S]*?<\/span>/,
    `<span>✍️ <a href="${redactieHref}">${authorName}</a></span>`
  );

  html = html.replace(
    /"author": \{\s*"@type": "Organization",\s*"name": "Redactie DakkapellenKosten\.nl",\s*"url": "https:\/\/dakkapellenkosten\.nl\/redactie\/"\s*\}/,
    `"author": {
      "@type": "Person",
      "@id": "${authorId}",
      "name": "${authorName}",
      "url": "${authorUrl}",
      "jobTitle": "Hoofdredacteur"
    }`
  );

  return replaceEditorialNote(html, file);
}

function addNoSnippet(html) {
  html = html.replace(
    /<div class="([^"]*article-cta[^"]*)"(?![^>]*data-nosnippet)/g,
    '<div class="$1" data-nosnippet'
  );
  html = html.replace(
    /<div class="([^"]*sidebar-cta[^"]*)"(?![^>]*data-nosnippet)/g,
    '<div class="$1" data-nosnippet'
  );
  html = html.replace(
    /<section class="final-cta"(?![^>]*data-nosnippet)/g,
    '<section class="final-cta" data-nosnippet'
  );
  return html;
}

function fixRedirectCanonical(html) {
  const refreshMatch = html.match(/<meta http-equiv="refresh" content="0; url=([^"]+)">/i);
  if (!refreshMatch) return html;

  const relTarget = refreshMatch[1];
  const cleanTarget = relTarget.replace(/^\.\.\//, "");
  const canonical = `${siteUrl}/kenniscentrum/${cleanTarget.replace(/index\.html$/, "").replace(/\.html$/, "/")}`;

  return html.replace(
    /<link rel="canonical" href="[^"]+">/i,
    `<link rel="canonical" href="${canonical}">`
  );
}

function processFile(file) {
  let html = fs.readFileSync(file, "utf8");
  const original = html;

  html = addNoSnippet(html);

  if (/meta http-equiv="refresh"/i.test(html) && /noindex, follow/i.test(html)) {
    html = fixRedirectCanonical(html);
  } else if (file.includes(`${path.sep}kenniscentrum${path.sep}`) && /<article class="article-body"/.test(html)) {
    html = replaceArticleAuthor(html, file);
  }

  if (html !== original) {
    fs.writeFileSync(file, html);
    return true;
  }
  return false;
}

const files = walkHtml(root);
let changed = 0;
for (const file of files) {
  if (processFile(file)) changed += 1;
}

console.log(`Advanced SEO remediation updated ${changed} HTML files.`);
