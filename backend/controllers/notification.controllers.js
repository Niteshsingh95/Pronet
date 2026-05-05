export const getNotification = async (req, res) => {
  try {
    let notification = await Notification.find({ receiver: req.userId })
      .populate("relatedUser", "firstName lastName profileImage")
      .populate("relatedPost", "image description")
      .sort({ createdAt: -1 }) // newest first
      .lean();

    return res.status(200).json(notification);
  } catch (error) {
    console.error("getNotification error:", error);
    return res.status(500).json({
      message: `get notification error ${error.message}`,
    });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    let { id } = req.params;

    const deleted = await Notification.findOneAndDelete({
      _id: id,
      receiver: req.userId,
    });

    if (!deleted) {
      return res.status(404).json({ message: "Notification not found" });
    }

    return res
      .status(200)
      .json({ message: "Notification deleted successfully" });
  } catch (error) {
    console.error("deleteNotification error:", error);
    return res.status(500).json({
      message: `delete notification error ${error.message}`,
    });
  }
};

export const clearAllNotification = async (req, res) => {
  try {
    await Notification.deleteMany({
      receiver: req.userId,
    });

    return res
      .status(200)
      .json({ message: "All notifications deleted successfully" });
  } catch (error) {
    console.error("clearAllNotification error:", error);
    return res.status(500).json({
      message: `delete all notification error ${error.message}`,
    });
  }
};