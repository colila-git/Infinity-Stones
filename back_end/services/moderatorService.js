const { pool } = require("../config/db");

exports.getAllModerators = async () => {

    const [rows] = await pool.query(
        `
        SELECT
            uid,
            first_name,
            last_name,
            affiliation,
            email,
            approval_status
        FROM students
        WHERE account_type = ?
        `,
        [
            "moderator"
        ]
    );

    return rows;

};

exports.getPendingModerators = async () => {

    const [rows] = await pool.query(
        `
        SELECT
            uid,
            first_name,
            last_name,
            affiliation,
            email,
            approval_status
        FROM students
        WHERE account_type = ?
        AND approval_status = ?
        `,
        [
            "moderator",
            "pending"
        ]
    );

    return rows;
};

exports.getAcceptedModerators = async () => {

    const [rows] = await pool.query(
        `
        SELECT
            s.uid,
            s.first_name,
            s.last_name,
            s.affiliation,
            s.email,
            s.approval_status,
            s.approved_at,
            CONCAT(
                approver.first_name,
                ' ',
                approver.last_name
            ) AS approved_by_name
        FROM students s

        LEFT JOIN students approver
        ON s.approved_by = approver.uid

        WHERE s.account_type = ?
        AND s.approval_status = ?
        `,
        [
            "moderator",
            "approved"
        ]
    );

    return rows;

};

exports.getRejectedModerators = async () => {

    const [rows] = await pool.query(
        `
        SELECT
            s.uid,
            s.first_name,
            s.last_name,
            s.affiliation,
            s.email,
            s.approval_status,
            s.rejected_at,
            CONCAT(
                rejector.first_name,
                ' ',
                rejector.last_name
            ) AS rejected_by_name
        FROM students s

        LEFT JOIN students rejector
        ON s.rejected_by = rejector.uid

        WHERE s.account_type = ?
        AND s.approval_status = ?
        `,
        [
            "moderator",
            "rejected"
        ]
    );

    return rows;

};

exports.approveModerator = async (uid, approvedBy) => {

    const [result] = await pool.query(
        `
        UPDATE students
        SET
            approval_status = ?,
            approved_by = ?,
            approved_at = NOW()
        WHERE uid = ?
        AND account_type = ?
        `,
        ["approved", approvedBy, uid, "moderator"]
    );

    if (result.affectedRows === 0) {
        return null;
    }

    const [rows] = await pool.query(
        `
        SELECT
            uid,
            first_name,
            last_name,
            affiliation,
            email,
            approval_status
        FROM students
        WHERE uid = ?
        `,
        [uid]
    );

    return rows[0];

};

exports.rejectModerator = async (uid, rejectedBy) => {

    const [result] = await pool.query(
        `
        UPDATE students
        SET
            approval_status = ?,
            rejected_by = ?,
            rejected_at = NOW()
        WHERE uid = ?
        AND account_type = ?
        `,
        ["rejected", rejectedBy, uid, "moderator"]
    );

    if (result.affectedRows === 0) {
        return null;
    }

    const [rows] = await pool.query(
        `
        SELECT
            uid,
            first_name,
            last_name,
            affiliation,
            email,
            approval_status
        FROM students
        WHERE uid = ?
        `,
        [uid]
    );

    return rows[0];

};

exports.getModeratorStats = async () => {

    const [rows] = await pool.query(
        `
        SELECT
            COUNT(*) AS total,
            SUM(approval_status = 'pending') AS pending,
            SUM(approval_status = 'approved') AS accepted,
            SUM(approval_status = 'rejected') AS rejected
        FROM students
        WHERE account_type = 'moderator'
        `
    );

    return {
        total: Number(rows[0].total),
        pending: Number(rows[0].pending),
        accepted: Number(rows[0].accepted),
        rejected: Number(rows[0].rejected)
    };

};