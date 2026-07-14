const { pool } = require("../config/db");

exports.registerStudent = async (studentId, eventId) => {

    // Prevent duplicate registrations
    const [existing] = await pool.query(
        `
        SELECT id
        FROM registrations
        WHERE student_id = ?
        AND event_id = ?
        `,
        [studentId, eventId]
    );

    if (existing.length > 0) {
        return null;
    }

    // Maximum of 3 registrations per student
    const [countRows] = await pool.query(
        `
        SELECT COUNT(*) AS total
        FROM registrations
        WHERE student_id = ?
        `,
        [studentId]
    );

    if (countRows[0].total >= 3) {
        return "LIMIT_REACHED";
    }

    const [eventRows] = await pool.query(
        `
        SELECT
            max_slots,
            (
                SELECT COUNT(*)
                FROM registrations
                WHERE event_id = ?
                AND status = 'approved'
            ) AS approved_slots
        FROM events
        WHERE id = ?
        `,
        [eventId, eventId]
    );

    if (eventRows.length === 0) {
        return "EVENT_NOT_FOUND";
    }

    if (eventRows[0].approved_slots >= eventRows[0].max_slots) {
        return "FULL";
    }

    const [result] = await pool.query(
        `
        INSERT INTO registrations
        (
            student_id,
            event_id,
            status
        )
        VALUES (?, ?, ?)
        `,
        [
            studentId,
            eventId,
            "pending"
        ]
    );

    return result.insertId;

};

exports.getRegistrations = async () => {

    const [rows] = await pool.query(
        `
        SELECT
            registrations.id,
            students.first_name,
            students.last_name,
            students.email,
            events.name AS event_name,
            registrations.status,
            registrations.registered_at
        FROM registrations
        JOIN students
            ON registrations.student_id = students.id
        JOIN events
            ON registrations.event_id = events.id
        ORDER BY registrations.registered_at DESC
        `
    );

    return rows;

};

exports.getMyRegistrations = async (studentId) => {

    const [rows] = await pool.query(
        `
        SELECT
            registrations.id,
            events.name AS event_name,
            registrations.status,
            registrations.registered_at
        FROM registrations
        JOIN events
            ON registrations.event_id = events.id
        WHERE registrations.student_id = ?
        ORDER BY registrations.registered_at DESC
        `,
        [studentId]
    );

    return rows;

};

exports.updateRegistrationStatus = async (registrationId, status) => {

    if (status === "approved") {

        // Find the event for this registration
        const [registrationRows] = await pool.query(
            `
            SELECT event_id
            FROM registrations
            WHERE id = ?
            `,
            [registrationId]
        );

        if (registrationRows.length === 0) {
            throw new Error("Registration not found.");
        }

        const eventId = registrationRows[0].event_id;

        // Get the event capacity
        const [eventRows] = await pool.query(
            `
            SELECT max_slots
            FROM events
            WHERE id = ?
            `,
            [eventId]
        );

        const maxSlots = eventRows[0].max_slots;

        // Count approved registrations
        const [countRows] = await pool.query(
            `
            SELECT COUNT(*) AS total
            FROM registrations
            WHERE event_id = ?
            AND status = 'approved'
            `,
            [eventId]
        );

        if (countRows[0].total >= maxSlots) {
            return "FULL";
        }

    }

    await pool.query(
        `
        UPDATE registrations
        SET status = ?
        WHERE id = ?
        `,
        [
            status,
            registrationId
        ]
    );

    return "SUCCESS";

};