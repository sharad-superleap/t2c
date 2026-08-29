// routes/admin.js
import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";
import { fetchPendingApprovalInspectors, fetchApprovedInspectors, approveRejectPendingInspectors } from "../controllers/admin/inspectors.js";

const router = express.Router();

// runs for ALL routes below, in order: authenticate, then check role
router.use(authMiddleware, authorizeRoles("admin"));

router.route("/pending-inspectors")
    .get(fetchPendingApprovalInspectors);

router.route("/pending-inspectors/:inspectorId")
    .patch(approveRejectPendingInspectors)

router.route("/approved-inspectors")
    .get(fetchApprovedInspectors);

// add more admin routes here — all are admin-gated automatically

export default router;