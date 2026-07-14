const { getAuth } = require("firebase-admin/auth");
require("../config/firebaseAdmin");

const { pool } = require("../config/db");

exports.verifyModerator = async (req, res, next) => {

    try {

        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: "No authorization token provided."
            });
        }

        const token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Invalid authorization format."
            });
        }

        const decodedToken = await getAuth().verifyIdToken(token);

        const uid = decodedToken.uid;

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
            return res.status(403).json({
                success: false,
                message: "User not found."
            });
        }

        const user = rows[0];

        if (
            user.account_type !== "moderator" ||
            user.approval_status !== "approved"
        ) {
            return res.status(403).json({
                success: false,
                message: "Moderator access denied."
            });
        }

        req.user = decodedToken;

        next();

    }   catch (error) {

            console.error("TOKEN ERROR:", error.message);

            return res.status(401).json({
                success: false,
                message: error.message
        });

}

};