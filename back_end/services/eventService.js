const { pool } = require("../config/db");

exports.getSports = async () => {

    const [rows] = await pool.query(
        `
        SELECT
            events.id,
            events.name,
            events.category,
            events.max_slots,

            COUNT(
                CASE
                    WHEN registrations.status = 'approved'
                    THEN 1
                END
            ) AS approved_slots

        FROM events

        LEFT JOIN registrations
            ON events.id = registrations.event_id

        GROUP BY
            events.id,
            events.name,
            events.category,
            events.max_slots

        ORDER BY events.id
        `
    );

    return rows;

};

exports.getSportById = async (id) => {

    const [rows] = await pool.query(
        "SELECT * FROM events WHERE id = ?",
        [id]
    );

    return rows[0] || null;

};

exports.createSport = async (sportData) => {

    const [result] = await pool.query(
        "INSERT INTO events (name, category) VALUES (?, ?)",
        [
            sportData.name,
            sportData.category
        ]
    );

    return {
        id: result.insertId,
        name: sportData.name,
        category: sportData.category
    };

};

exports.updateSport = async (id, sportData) => {

    const [result] = await pool.query(
        "UPDATE events SET name = ?, category = ? WHERE id = ?",
        [
            sportData.name,
            sportData.category,
            id
        ]
    );

    if (result.affectedRows === 0) {
        return null;
    }

    return await exports.getSportById(id);

};

exports.deleteSport = async (id) => {

    const sport = await exports.getSportById(id);

    if (!sport) {
        return null;
    }

    await pool.query(
        "DELETE FROM events WHERE id = ?",
        [id]
    );

    return sport;

};