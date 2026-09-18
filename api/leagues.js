export default async function handler(req, res) {

  // Allow DS GOAL frontend to access this backend
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const API_KEY = process.env.API_FOOTBALL_KEY;

  if (!API_KEY) {
    return res.status(500).json({
      error: "API key is not configured"
    });
  }

  try {

    const response = await fetch(
      "https://v3.football.api-sports.io/leagues",
      {
        headers: {
          "x-apisports-key": API_KEY
        }
      }
    );

    const data = await response.json();

    return res.status(response.status).json(data);

  } catch (error) {

    return res.status(500).json({
      error: "Football API request failed"
    });

  }
}
