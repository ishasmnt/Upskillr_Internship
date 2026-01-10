const Module = require('../models/Module');
const Course = require('../models/Course');

exports.getModules = async (req, res) => {
  try {
    const modules = await Module.find({ course: req.params.courseId });
    res.json(modules);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createModule = async (req, res) => {
  const { title, description, videoUrl, duration, resources } = req.body;
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course || course.instructor.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: 'Course not found' });
    }
    const module = await Module.create({
      course: req.params.courseId, title, description, videoUrl, duration, resources,
    });
    course.modules.push(module._id);
    await course.save();
    res.status(201).json(module);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateModule = async (req, res) => {
  try {
    const module = await Module.findById(req.params.id);
    if (!module) return res.status(404).json({ message: 'Module not found' });
    Object.assign(module, req.body);
    await module.save();
    res.json(module);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteModule = async (req, res) => {
  try {
    await Module.findByIdAndDelete(req.params.id);
    res.json({ message: 'Module deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};