const protect = (req, res, next) => {
  req.user = { role: "instructor" }; // TEMP
  next();
};

module.exports = { protect };
