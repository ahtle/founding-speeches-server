exports.DATABASE_URL = process.env.DATABASE_URL ||
                       global.DATABASE_URL ||
                       'mongodb://anhhtle:password1@ds137370.mlab.com:37370/founding-speeches';
exports.PORT = process.env.PORT || 8080;