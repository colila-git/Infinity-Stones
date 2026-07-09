const { getAuth } = require("firebase-admin/auth");

exports.registerUser = async (userData) => {

    const userRecord = await getAuth().createUser({
        email: userData.email,
        password: userData.password,
        displayName: `${userData.firstName} ${userData.lastName}`
    });

    const approvalStatus =
        userData.accountType === "moderator"
            ? "pending"
            : "approved";

    const message =
        userData.accountType === "moderator"
            ? "Moderator application submitted successfully."
            : "User account created successfully.";

    return {
        success: true,
        message,
        data: {
            uid: userRecord.uid,
            ...userData,
            approvalStatus
        }
    };

};

exports.loginUser = async (idToken) => {

    const decodedToken = await getAuth().verifyIdToken(idToken);

    return {
        success: true,
        message: "Login successful.",
        data: {
            uid: decodedToken.uid,
            email: decodedToken.email
        }
    };

};