import { Notification } from "../models/notification.js";

export async function getNotifications(req, res) {
    const items = await Notification.find({ recipient: req.user.userId })
        .sort({ createdAt: -1 })
        .limit(50)
        .populate('pickup')
        .lean()

    const unreadCount = await Notification.countDocuments({
        recipient: req.user._id,
        isRead: false,
    });

    res.json({ success: true, items, unreadCount });
}

export async function markRead(req, res) {
    const { ids } = req.body;
    const filter = { recipient: req.user.userId, isRead: false };
    if (ids?.length) filter._id = { $in: ids };

    await Notification.updateMany(filter, { $set: { isRead: true } });
    res.json({ success: true });
}