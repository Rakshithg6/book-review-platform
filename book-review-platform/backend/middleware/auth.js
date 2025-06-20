const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to verify JWT token
exports.authenticate = async (req, res, next) => {
    try {
        // Get token from header
        const token = req.header('Authorization')?.replace('Bearer ', '');
        console.log('[AUTH] Token received:', token);
        
        if (!token) {
            return res.status(401).json({ message: 'No token, authorization denied' });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('[AUTH] Decoded JWT:', decoded);
        
        // Find user and attach to request
        const user = await User.findById(decoded.id).select('-password');
        
        if (!user) {
            return res.status(401).json({ message: 'Token is not valid' });
        }

        req.user = user;
        next();
    } catch (err) {
        console.error('Authentication error:', err.message);
        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Token is not valid' });
        } else if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token has expired' });
        }
        res.status(500).json({ message: 'Server error' });
    }
};

// Middleware to check admin role
exports.authorizeAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized as admin' });
    }
};

// Middleware to check if user is the owner or admin
exports.checkOwnership = (model) => {
    return async (req, res, next) => {
        try {
            const document = await model.findById(req.params.id);
            
            if (!document) {
                return res.status(404).json({ message: 'Document not found' });
            }
            
            // Check if user is admin or the owner
            if ((document.user && document.user.toString() === req.user.id) || req.user.role === 'admin') {
                next();
            } else {
                res.status(403).json({ message: 'Not authorized to perform this action' });
            }
        } catch (error) {
            console.error('Ownership check error:', error);
            res.status(500).json({ message: 'Server error during ownership verification' });
        }
    };
};