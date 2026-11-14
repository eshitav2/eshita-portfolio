// Vercel serverless function: public view counter backed by Upstash Redis.
// Env vars are added automatically when you connect an Upstash Redis store to the project.
module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return res.status(200).json({ views: null });
  try {
    const cmd = req.query && req.query.hit === '1' ? 'incr' : 'get';
    const r = await fetch(`${url}/${cmd}/eshita-portfolio-views`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const j = await r.json();
    return res.status(200).json({ views: Number(j.result) || 0 });
  } catch (e) {
    return res.status(200).json({ views: null });
  }
};
