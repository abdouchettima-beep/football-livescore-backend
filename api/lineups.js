export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const apiKey = process.env.API_FOOTBALL_KEY;
  if (!apiKey) return res.status(500).json({ error: "API key is not configured" });
  const fixture = String(req.query.fixture || "");
  if (!/^\d+$/.test(fixture)) return res.status(400).json({ error: "A valid fixture ID is required" });

  try {
    const upstream = await fetch("https://v3.football.api-sports.io/fixtures/lineups?fixture=" + encodeURIComponent(fixture), {
      headers: { "x-apisports-key": apiKey }
    });
    const data = await upstream.json();
    return res.status(upstream.status).json(data);
  } catch (error) {
    return res.status(500).json({ error: "Unable to fetch fixture lineups" });
  }
}
