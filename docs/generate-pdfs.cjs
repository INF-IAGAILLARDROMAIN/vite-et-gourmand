const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  const files = [
    { html: 'manuel-utilisation.html', pdf: 'manuel-utilisation.pdf' },
    { html: 'documentation-technique.html', pdf: 'documentation-technique.pdf' },
    { html: 'gestion-projet.html', pdf: 'gestion-projet.pdf' },
    { html: 'charte-graphique.html', pdf: 'charte-graphique.pdf' },
  ];

  for (const f of files) {
    const absHtml = path.resolve(__dirname, f.html);
    const fileUrl = 'file:///' + absHtml.split(path.sep).join('/');
    console.log('Converting ' + f.html + '...');
    await page.goto(fileUrl, { waitUntil: 'networkidle0' });
    await page.pdf({
      path: path.resolve(__dirname, f.pdf),
      format: 'A4',
      margin: { top: '2cm', bottom: '2cm', left: '2cm', right: '2cm' },
      printBackground: true,
    });
    const size = fs.statSync(path.resolve(__dirname, f.pdf)).size;
    console.log('  -> ' + f.pdf + ' (' + size + ' bytes)');
  }

  await browser.close();
  console.log('All 4 PDFs generated!');
})();
