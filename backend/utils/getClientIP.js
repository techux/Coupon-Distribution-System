const getClientIP = (req) => {
    return req.headers['x-forwarded-for'] || req.connection.remoteAddress;
};


module.exports = getClientIP