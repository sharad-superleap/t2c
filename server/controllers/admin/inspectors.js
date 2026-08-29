import { Inspector } from "../../models/inspector.js";

export const fetchPendingApprovalInspectors = async (req, res) => {
    try {
        // only fetch the inspectors who are not approved yet
        const pendingInspectors = await Inspector.find({ status: "pending" });


        if (pendingInspectors.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No inspector found pending for approval.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Pending approval inspectors fetched successfully.",
            inspectors: pendingInspectors,
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: `Error while fetching pending approval inspectors: ${err.message}`,
        });
    }
}

export const approveRejectPendingInspectors = async (req, res) => {
    try {
        const { inspectorId } = req.params;
        const { status } = req.body;

        const allowed = ["under_review", "approved", "rejected", "suspended"];

        if (!allowed.includes(status)) {
            return res.status(400).json({
                success: false,
                message: `Invalid status. Allowed: ${allowed.join(", ")}`,
            });
        }

        if (!inspectorId) {
            return res.status(400).json({
                success: false,
                message: 'Inspector ID is required.'
            })
        }

        // update the status if pending
        const updatedInspectorStatus = await Inspector.findByIdAndUpdate(
            { _id: inspectorId, status: "pending" },
            { $set: { status: status } },
            { new: true }
        )

        if (!updatedInspectorStatus) {
            return res.status(404).json({
                success: false, message: `Inspector not found.`
            }
            )
        }

        return res.status(200).json({
            success: true,
            message: `Inspector status updated to ${status} successfully.`,
            updatedInspectorStatus,
        });


    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Error while approving inspector: ${error.message}`,
        });
    }
}

export const fetchApprovedInspectors = async (req, res) => {
    try {
        // only fetch the inspectors who are not approved yet
        const approvedInspectors = await Inspector.find({ status: "approved" });


        if (approvedInspectors.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No approved inspector found.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Approved inspectors fetched successfully.",
            inspectors: approvedInspectors,
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: `Error while fetching approved inspectors: ${err.message}`,
        });
    }
}