import jwt from 'jsonwebtoken';

export function requireAuth(req, res, next) {
    const token = req.cookies?.token;
    if (!token) return res.redirect('/signIn');
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = payload.sub;
        req.userRoles = payload.roles || [];
        next();
    } catch {
        res.clearCookie('token');
        return res.redirect('/signIn');
    }
}

export function requireRole(roles = []) {
    return (req, res, next) => {
        if (roles.length === 0) return next();
        const has = req.userRoles?.some(r => roles.includes(r));
        if (!has) return res.status(403).render('403');
        next();
    };
}