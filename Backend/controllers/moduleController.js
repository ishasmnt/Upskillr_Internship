const Module = require('../models/Module');
const Course = require('../models/Course');

// Get all modules for a course
exports.getModules = async (req, res) => {
  try {
    const modules = await Module.find({ course: req.params.courseId });
    res.json(modules);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new module with video upload to Cloudinary
exports.createModule = async (req, res) => {
  const { title, description, duration, resources } = req.body;
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course || course.instructor.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: 'Course not found or unauthorized' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Video file is required' });
    }

    let parsedResources = [];
    if (resources) {
      try {
        parsedResources = typeof resources === 'string' ? JSON.parse(resources) : resources;
      } catch (e) {
        parsedResources = [];
      }
    }

    const module = await Module.create({
      course: req.params.courseId,
      title,
      description,
      videoFileName: req.file.originalname,
      videoPath: req.file.path, // Cloudinary URL
      videoSize: `${(req.file.size / (1024 * 1024)).toFixed(2)} MB`,
      duration,
      resources: parsedResources,
    });

    course.modules.push(module._id);
    await course.save();
    res.status(201).json(module);
  } catch (error) {
    console.error('Error creating module:', error);
    res.status(500).json({ message: error.message });
  }
};

// Update module
exports.updateModule = async (req, res) => {
  try {
    const module = await Module.findById(req.params.id);
    if (!module) return res.status(404).json({ message: 'Module not found' });

    // If new video file is uploaded
    if (req.file) {
      module.videoFileName = req.file.originalname;
      module.videoPath = req.file.path; // New Cloudinary URL
      module.videoSize = `${(req.file.size / (1024 * 1024)).toFixed(2)} MB`;
    }

    // Update other fields
    const { title, description, duration, resources } = req.body;
    if (title) module.title = title;
    if (description) module.description = description;
    if (duration) module.duration = duration;
    if (resources) {
      try {
        module.resources = typeof resources === 'string' ? JSON.parse(resources) : resources;
      } catch (e) {
        // Keep existing resources if parsing fails
      }
    }

    await module.save();
    res.json(module);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete module
exports.deleteModule = async (req, res) => {
  try {
    const module = await Module.findById(req.params.id);
    if (!module) return res.status(404).json({ message: 'Module not found' });

    // Note: Cloudinary files are not auto-deleted
    // You can add cloudinary.uploader.destroy() here if needed

    await Module.findByIdAndDelete(req.params.id);
    res.json({ message: 'Module deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Stream video - returns Cloudinary URL
exports.streamVideo = async (req, res) => {
  try {
    const module = await Module.findById(req.params.moduleId);
    
    if (!module || !module.videoPath) {
      return res.status(404).json({ message: 'Video not found' });
    }

    // Return Cloudinary URL (can be used directly in video player)
    res.json({ videoUrl: module.videoPath });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};