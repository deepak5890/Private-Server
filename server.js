const http = require("http");
const fs = require("fs");
const path = require("path");
const url = require("url");

const PORT = 3000;
const SITES_DIR = path.join(__dirname, "sites");

const mimeTypes = {
    ".html": "text/html",
    ".css": "text/css",
    ".js": "application/javascript",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".svg": "image/svg+xml",
    ".mp3": "audio/mpeg",
    ".json": "application/json",
};

http.createServer((req, res) => {
    // Parse URL to get only pathname (ignore query)
    let parsedUrl = url.parse(req.url);
    let urlPath = decodeURIComponent(parsedUrl.pathname);

    // Show site list ONLY on root URL '/'
    if (urlPath === "/" || urlPath === "") {
        fs.readdir(SITES_DIR, { withFileTypes: true }, (err, files) => {
            if (err) {
                res.writeHead(500, { "Content-Type": "text/plain" });
                return res.end("Error reading sites directory");
            }

            const folders = files.filter(f => f.isDirectory()).map(f => f.name);

            res.writeHead(200, { "Content-Type": "text/html" });
            res.write("<h1>Available Sites</h1><ul>");
            folders.forEach(folder => {
                res.write(`<li><a href="/${folder}/">${folder}</a></li>`);
            });
            res.end("</ul>");
        });
        return;
    }

    // Redirect to add trailing slash if directory is accessed without slash
    if (!urlPath.endsWith("/")) {
        const dirPath = path.join(SITES_DIR, urlPath);
        if (fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory()) {
            res.writeHead(301, { Location: urlPath + "/" });
            return res.end();
        }
    }

    // If URL ends with slash, serve index.html inside that folder
    if (urlPath.endsWith("/")) {
        urlPath += "index.html";
    }

    // Remove leading slash for file system path
    if (urlPath.startsWith("/")) {
        urlPath = urlPath.slice(1);
    }

    const filePath = path.join(SITES_DIR, urlPath);

    fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
            res.writeHead(404, { "Content-Type": "text/plain" });
            return res.end("404 Not Found");
        }

        const ext = path.extname(filePath).toLowerCase();
        const contentType = mimeTypes[ext] || "application/octet-stream";

        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(500, { "Content-Type": "text/plain" });
                return res.end("Internal Server Error");
            }

            res.writeHead(200, { "Content-Type": contentType });
            res.end(data);
        });
    });
}).listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

