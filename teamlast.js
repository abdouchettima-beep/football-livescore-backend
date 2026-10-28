export default async function handler(req, res) {
res.setHeader("Access-Control-Allow-Origin", "*");
res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
res.setHeader("Access-Control-Allow-Headers", "Content-Type");

if (req.method === "OPTIONS") return res.status(200).end();

if (req.method !== "GET") {
return res.status(405).json({ error: "Method not allowed" });
}

const API_KEY = process.env.API_FOOTBALL_KEY;

if (!API_KEY) {
return res.status(500).json({ error: "API key is not configured" });
}

const home = String(req.query.home || "");
const away = String(req.query.away || "");
const season = String(req.query.season || "");

if (
!/^\d+$/.test(home) ||
!/^\d+$/.test(away) ||
home === away ||
!/^\d{4}$/.test(season)
) {
return res.status(400).json({
error: "Valid home, away, and season values are required."
});
}

async function getLastFive(teamId) {
const url =
"https://v3.football.api-sports.io/fixtures?last=5&season=" +
encodeURIComponent(season) +
"&team=" +
encodeURIComponent(teamId) +
"&timezone=Africa%2FLagos";

const response = await fetch(url, {
  headers: { "x-apisports-key": API_KEY }
});

if (!response.ok) {
  throw new Error("Football API request failed");
}

return await response.json();

}

try {
const [homeData, awayData] = await Promise.all([
getLastFive(home),
getLastFive(away)
]);

return res.status(200).json({
  home: homeData.response || [],
  away: awayData.response || []
});

} catch (error) {
return res.status(500).json({
error: "Could not retrieve recent team matches."
});
}
}
