const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;

let logs = [];

// Load logs from file if exist
try {
  logs = JSON.parse(fs.readFileSync("logs.json", "utf8"));
} catch (e) {
  logs = [];
}

// Tracking pixel endpoint
app.get("/track/:emailId", (req, res) => {
  const log = {
    emailId: req.params.emailId,
    ip: req.ip,
    userAgent: req.headers["user-agent"],
    time: new Date().toISOString()
  };
  logs.push(log);
  fs.writeFileSync("logs.json", JSON.stringify(logs, null, 2));

  // Return transparent 1x1 PNG
  const imgPath = path.join(__dirname, "pixel.png");
  res.set("Content-Type", "image/png");
  res.sendFile(imgPath);
});

// Frontend page to view logs
app.get("/", (req, res) => {
  const html = `
    <h2>📬 Email Open Logs</h2>
    <table border="1" cellpadding="5">
      <tr><th>Email ID</th><th>IP</th><th>User-Agent</th><th>Time</th></tr>
      ${logs.map(l => `<tr>
        <td>${l.emailId}</td>
        <td>${l.ip}</td>
        <td>${l.userAgent}</td>
        <td>${l.time}</td>
      </tr>`).join('')}
    </table>`;
  res.send(html);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
