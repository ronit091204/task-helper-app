import Task from '../models/Task';

exports.createTask = async (req, res) => {
  try {
    const { title, description, price, location } = req.body;
    const task = new Task({
      title,
      description,
      price,
      location: {
        type: 'Point',
        coordinates: location
      },
      creator: req.user._id
    });
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getNearbyTasks = async (req, res) => {
  try {
    const { longitude, latitude, maxDistance = 10000 } = req.query;
    const tasks = await Task.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: parseInt(maxDistance)
        }
      },
      status: 'pending'
    }).populate('creator', 'username');
    res.json(tasks);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};