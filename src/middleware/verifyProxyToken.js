import crypto from 'crypto';
// Gatekeeper that checks for the correct request's proxy token
export function verifyProxyToken(req, res, next) {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Missing or malformed Authorization header' });
    }
    const incomingToken = header.slice(7)
    const expectedToken = process.env.PROXY_AUTH_TOKEN
    // Check if both strings aren't the same byte length or either is missing
    if (!incomingToken || !expectedToken || Buffer.byteLength(incomingToken) !== Buffer.byteLength(expectedToken)) {
        return res.status(401).json({ error: 'Unauthorized' })
    }
    // Safeguard against === comparison: use time-based approach
    const bufIncoming = Buffer.from(incomingToken)
    const bufExpected = Buffer.from(expectedToken)
    if (!crypto.timingSafeEqual(bufIncoming, bufExpected)) {
        return res.status(401).json({ error: 'Unauthorized' })
    }
    // token is valid, continue to next middleware
    next();
}
