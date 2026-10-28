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

  const league = String(req.query.league || "");
  const season = String(req.query.season || "");
  if (!/^\d+$/.test(league) || !/^\d{4}$/.test(season)) {
    return res.status(400).json({
      error: "Valid league and season values are required."
    });
  }

  try {
    const url =
      "https://v3.football.api-sports.io/standings?league=" +
      encodeURIComponent(league) +
      "&season=" + encodeURIComponent(season);
    const response = await fetch(url, {
      headers: { "x-apisports-key": API_KEY }
    });
    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (error) {
    return res.status(500).json({
      error: "Could not retrieve full league standings."
    });
  }
}
