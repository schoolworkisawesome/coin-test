// Vercel 서버리스 함수: 브라우저 -> /api/ticker -> 업비트 REST API
// 서버에서 호출하므로 CORS 문제가 없고, 짧게 캐시해 업비트 호출 횟수(IP당 초당 10회)를 아낍니다.
module.exports = async (req, res) => {
  const q = String((req.query && req.query.market) || "KRW-BTC").toUpperCase();
  const market = /^[A-Z0-9]{2,10}-[A-Z0-9]{2,10}(,[A-Z0-9]{2,10}-[A-Z0-9]{2,10}){0,19}$/.test(q) ? q : "KRW-BTC";

  try {
    const r = await fetch(`https://api.upbit.com/v1/ticker?markets=${market}`, {
      headers: { Accept: "application/json" },
    });
    const body = await r.text();
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.setHeader(
      "Cache-Control",
      r.ok ? "public, s-maxage=2, stale-while-revalidate=5" : "no-store"
    );
    res.status(r.status).send(body);
  } catch (e) {
    res.setHeader("Cache-Control", "no-store");
    res.status(502).json({ error: "upbit_unreachable" });
  }
};
