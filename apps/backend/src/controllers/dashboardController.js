const dashboardModel = require("../models/dashboardModel");

async function myDashboard(req, res) {
  try {
    const data = await dashboardModel.getUserDashboard(req.user.id);
    return res.json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to fetch user dashboard" });
  }
}

async function adminDashboard(_req, res) {
  try {
    const data = await dashboardModel.getAdminDashboard();
    return res.json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to fetch admin dashboard" });
  }
}

module.exports = {
  myDashboard,
  adminDashboard,
};
