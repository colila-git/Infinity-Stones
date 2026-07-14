const { pool } = require("../config/db");

module.exports = async (req, res, next) => {

    try {

        const [rows] = await pool.query(
            `
            SELECT account_type, approval_status
            FROM students
            WHERE uid = ?
            `,
            [req.user.uid]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        const user = rows[0];

        if (user.account_type !== "moderator") {
            return res.status(403).json({
                success: false,
                message: "Moderator access required."
            });
        }

        if (user.approval_status !== "approved") {
            return res.status(403).json({
                success: false,
                message: "Moderator account is not approved."
            });
        }

        next();

    } catch (error) {
        next(error);
    }

};