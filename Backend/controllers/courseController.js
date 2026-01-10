const getCourses = (req, res) => {
  res.json({ message: "Courses fetched" });
};

const createCourse = (req, res) => {
  res.json({ message: "Course created" });
};

module.exports = { getCourses, createCourse };
