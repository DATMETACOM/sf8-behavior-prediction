const rateLimitMap = new Map()

const DEFAULT_WINDOW_MS = 60 * 1000  // 1 minute
const DEFAULT_MAX_REQUESTS = 30

function getClientIp(req) {
  return req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown'
}

export function checkRateLimit(req, res, options = {}) {
  const windowMs = options.windowMs || DEFAULT_WINDOW_MS
  const maxRequests = options.maxRequests || DEFAULT_MAX_REQUESTS
  const key = `${getClientIp(req)}:${req.url}`

  const now = Date.now()
  const windowStart = now - windowMs

  if (!rateLimitMap.has(key)) {
    rateLimitMap.set(key, [])
  }

  const timestamps = rateLimitMap.get(key)
  const recentRequests = timestamps.filter((ts) => ts > windowStart)

  if (recentRequests.length >= maxRequests) {
    res.setHeader('X-RateLimit-Limit', maxRequests)
    res.setHeader('X-RateLimit-Remaining', 0)
    res.setHeader('Retry-After', Math.ceil(windowMs / 1000))
    return res.status(429).json({
      error: 'Too many requests',
      retryAfter: Math.ceil(windowMs / 1000)
    })
  }

  recentRequests.push(now)
  rateLimitMap.set(key, recentRequests)

  res.setHeader('X-RateLimit-Limit', maxRequests)
  res.setHeader('X-RateLimit-Remaining', Math.max(0, maxRequests - recentRequests.length - 1))

  return null
}
