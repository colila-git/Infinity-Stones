const eventService = require("../services/eventService");

exports.getSports = async (req, res) => {

    const sports = await eventService.getSports();

    return res.json({
        success: true,
        data: sports
    });

};