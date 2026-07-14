const registrationService = require("../services/registrationService");
const { pool } = require("../config/db");

exports.registerStudent = async (req, res, next) => {

    try {

        const { eventId } = req.body;

        if (!eventId) {
            return res.status(400).json({
                success: false,
                message: "Event ID is required."
            });
        }

        // Find the logged-in student's database ID
        const [rows] = await pool.query(
            `
            SELECT id
            FROM students
            WHERE uid = ?
            `,
            [req.user.uid]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Student not found."
            });
        }

        const studentId = rows[0].id;

        const registrationId = await registrationService.registerStudent(
            studentId,
            eventId
        );

        if (registrationId === null) {
            return res.status(409).json({
                success: false,
                message: "You are already registered for this sport."
            });
        }

        if (registrationId === "LIMIT_REACHED") {
            return res.status(400).json({
                success: false,
                message: "You may only register for up to 3 events."
            });
        }

        if (registrationId === "FULL") {
            return res.status(400).json({
                success: false,
                message: "This event is already full."
            });
        }

        if (registrationId === "EVENT_NOT_FOUND") {
            return res.status(404).json({
                success: false,
                message: "Event not found."
            });
        }

        return res.status(201).json({
            success: true,
            message: "Successfully registered."
        });

    } catch (error) {

        next(error);

    }

};

exports.getRegistrations = async (req, res, next) => {

    try {

        const registrations =
            await registrationService.getRegistrations();

        return res.json({
            success: true,
            data: registrations
        });

    } catch (error) {

        next(error);

    }

};

exports.getMyRegistrations = async (req, res, next) => {

    try {

        const [rows] = await pool.query(
            `
            SELECT id
            FROM students
            WHERE uid = ?
            `,
            [req.user.uid]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Student not found."
            });
        }

        const registrations =
            await registrationService.getMyRegistrations(rows[0].id);

        return res.json({
            success: true,
            data: registrations
        });

    } catch (error) {

        next(error);

    }

};

exports.rejectRegistration = async (req, res, next) => {

    try {

        await registrationService.updateRegistrationStatus(
            req.params.id,
            "rejected"
        );

        res.json({
            success: true,
            message: "Registration rejected."
        });

    } catch (error) {

        next(error);

    }

};

exports.approveRegistration = async (req, res, next) => {

    try {

        const result = await registrationService.updateRegistrationStatus(
            req.params.id,
            "approved"
        );

        if (result === "FULL") {
            return res.status(400).json({
                success: false,
                message: "This event is already full."
            });
        }

        res.json({
            success: true,
            message: "Registration approved."
        });

    } catch (error) {

        next(error);

    }

};