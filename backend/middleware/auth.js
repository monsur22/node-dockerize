import jwt from 'jsonwebtoken';
const protect = (req, res, next) => {
    let token = req.headers.authorization && req.headers.authorization.startsWith('Bearer')
    if (!token) {
        return res.status(403).send("A token is required for authentication");
    }
    try {
        token = req.headers.authorization.split(' ')[1]
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        // req.user = await User.findById(decoded.id).select('-password')
    } catch (err) {
        return res.status(401).send("Invalid Token");
    }
    return next();
};

export {
    protect
}