const escapeHtml = require('escape-html');

exports.helloGet = (req, res) => {
  res.send(`Hello ${escapeHtml(req.query.name || req.body.name || "World")}!`);
};