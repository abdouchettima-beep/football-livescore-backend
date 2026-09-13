export default async function handler(req, res) {

  res.setHeader("Access-Control-Allow-Origin", "*");

  const API_KEY = process.env.API_FOOTBALL_KEY;

  if (!API_KEY) {
    return res.status(500).json({
      error: "API key is not configured"
    });
  }

  try {

    const response = await fetch(
      "https://v3.football.api-sports.io/fixtures?next=20",
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
