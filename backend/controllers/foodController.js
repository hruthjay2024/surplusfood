const Food = require("../models/Food");



exports.addFood = async (req, res) => {
  try {
    const { foodName, quantity, pickupLocation, contact } = req.body;

    const food = new Food({
      foodName,
      quantity,
      pickupLocation,
      contact
    });

    await food.save();

    res.status(201).json({ message: "Donation saved" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error saving donation" });
  }
};

// 🔥 Update tracking status
exports.updateStatus = async (req, res) => {
  try {
    const { status, destination } = req.body;

    const food = await Food.findByIdAndUpdate(
      req.params.id,
      { status, destination },
      { new: true }
    );

    res.json(food);
  } catch (error) {
    res.status(500).json({ message: "Update failed" });
  }
};

// Get all donations
exports.getAllFood = async (req, res) => {
  const foods = await Food.find();
  res.json(foods);
};
