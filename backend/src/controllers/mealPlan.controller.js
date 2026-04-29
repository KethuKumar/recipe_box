import mealPlanModel from "../models/mealplan.model.js";

export const getMealPlan = async (req, res) => {
  try {
    const plan = await mealPlanModel
      .findOne({ user: req.user.id })
      .populate(
        "days.monday",
        "days.tuesday",
        "days.wednesday",
        "days.thursday",
        "days.friday",
        "days.saturday",
        "days.sunday",
      );

    return res.json(plan);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// create and update

export const saveMealPlan = async (req, res) => {
  try {
    const { days } = req.body;

    let plan = await mealPlanModel.findOne({ user: req.user.id });

    if (!plan) {
      plan = new mealPlanModel({
        user: req.user.id,
        weekStart: new Date(),
        days,
      });
    } else {
      plan.days = days;
    }

    await plan.save();

    return res.json(plan);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
