// Vercel 서버리스 함수: /api/candles?market=KRW-BTC&unit=15&count=96
// unit: "days"(일봉) | "weeks"(주봉) | "months"(월봉) | 분봉(1,3,5,10,15,30,60,240)
const MINUTES = ["1", "3", "5", "10", "15", "30", "60", "240"];

module.exports = async (req, res) => {
  const q = req.query || {};
  const market = /^[A-Z0-9]{2,10}-[A-Z0-9]{2,10}$/.test(String(q.market).toUpperCase())
    ? String(q.market).toUpperCase() : "KRW-BTC";
  const unit = String(q.unit || "15");
  const count = Math.min(Math.max(parseInt(q.count, 10) || 60, 1), 200);

  let path;
  if (["days", "weeks", "months"].includes(unit)) path = unit;
  else if (MINUTES.includes(unit)) path = `minutes/${unit}`;
  else return res.status(400).json({ error: "invalid_unit" });

  try {
    const r = await fetch(`https://api.upbit.com/v1/candles/${path}?market=${market}&count=${count}`, {
      headers: { Accept: "application/json" },
    });
    const body = await r.text();
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.setHeader("Cache-Control", r.ok ? "public, s-maxage=10, stale-while-revalidate=30" : "no-store");
    res.status(r.status).send(body);
  } catch (e) {
    res.setHeader("Cache-Control", "no-store");
    res.status(502).json({ error: "upbit_unreachable" });
  }
};
