const moderatorService = require("../services/moderatorService");
const { pool } = require("../config/db");

exports.checkModerator = async (req, res) => {

    try {

        const uid = req.user.uid;

        const [rows] = await pool.query(
            `
            SELECT
                account_type,
                approval_status
            FROM students
            WHERE uid = ?
            `,
            [uid]
        );

        if (rows.length === 0) {
            return res.json({
                success: false,
                message: "Account not found."
            });
        }

        const user = rows[0];

        if (
            user.account_type !== "moderator" ||
            user.approval_status !== "approved"
        ) {
            return res.json({
                success: false,
                message: "You do not have moderator access."
            });
        }

        return res.json({
            success: true,
            message: "Moderator access granted."
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server error."
        });

    }

};

exports.getAllModerators = async (req, res, next) => {

    try {

        const moderators = await moderatorService.getAllModerators();

        return res.json({
            success: true,
            data: moderators
        });

    } catch (error) {
        next(error);
    }

};

exports.getAcceptedModerators = async (req, res, next) => {

    try {

        const moderators = await moderatorService.getAcceptedModerators();

        return res.json({
            success: true,
            data: moderators
        });

    } catch (error) {
        next(error);
    }

};

exports.getRejectedModerators = async (req, res, next) => {

    try {

        const moderators = await moderatorService.getRejectedModerators();

        return res.json({
            success: true,
            data: moderators
        });

    } catch (error) {
        next(error);
    }

};

exports.getPendingModerators = async (req, res, next) => {

    try {

        const moderators = await moderatorService.getPendingModerators();

        return res.json({
            success: true,
            data: moderators
        });

    } catch (error) {
        next(error);
    }

};

exports.getModeratorStats = async (req, res, next) => {

    try {

        const stats = await moderatorService.getModeratorStats();

        return res.json({
            success: true,
            data: stats
        });

    } catch (error) {
        next(error);
    }

};

exports.approveModerator = async (req, res, next) => {

    try {

        const moderator = await moderatorService.approveModerator(
            req.params.uid,
            req.user.uid
        );

        if (!moderator) {
            return res.status(404).json({
                success: false,
                message: "Moderator not found."
            });
        }

        return res.json({
            success: true,
            message: "Moderator approved successfully.",
            data: moderator
        });

    } catch (error) {
        next(error);
    }

};

exports.rejectModerator = async (req, res, next) => {

    try {

        const moderator = await moderatorService.rejectModerator(
            req.params.uid,
            req.user.uid
        );

        if (!moderator) {
            return res.status(404).json({
                success: false,
                message: "Moderator not found."
            });
        }

        return res.json({
            success: true,
            message: "Moderator rejected successfully.",
            data: moderator
        });

    } catch (error) {
    next(error);
    }

};