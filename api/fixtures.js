export default async function handler(req, res) {

  // Allow DS GOAL frontend to access this backend
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle browser preflight request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Only allow GET
  if (req.method !== "GET") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  // Get API key from Vercel environment variable
  const API_KEY = process.env.API_FOOTBALL_KEY;

  if (!API_KEY) {
    return res.status(500).json({
      error: "API key is not configured"
    });
  }

  // Get requested date
  const date = req.query.date;

  if (!date) {
    return res.status(400).json({
      error: "Date is required. Use YYYY-MM-DD."
    });
  }

  // Basic date format check
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return res.status(400).json({
      error: "Invalid date format. Use YYYY-MM-DD."
    });
  }

  // Nigeria timezone
  const timezone = "Africa/Lagos";

  try {

    const url =
      "https://v3.football.api-sports.io/fixtures" +
      "?date=" + encodeURIComponent(date) +
      "&timezone=" + encodeURIComponent(timezone);

    const response = await fetch(url, {
      headers: {
        "x-apisports-key": API_KEY
      }
    });

    const data = await response.json();

    return res.status(response.status).json(data);

  } catch (error) {

    return res.status(500).json({
      error: "Football API request failed"
    });

  }
}
