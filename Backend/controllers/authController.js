const register = (req, res) => {
  res.json({ message: "User registered" });
};

const login = (req, res) => {
  res.json({ message: "User logged in" });
};

module.exports = { register, login };
