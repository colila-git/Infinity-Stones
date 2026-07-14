    const { pool } = require("../config/db");
    const { getAuth } = require("firebase-admin/auth");

    exports.registerUser = async (userData) => {

        console.log(userData);

        const approvalStatus =
            userData.accountType === "moderator"
                ? "pending"
                : "approved";

        let userRecord;

        try {

            userRecord = await getAuth().createUser({
                email: userData.email,
                password: userData.password,
                displayName: `${userData.firstName} ${userData.lastName}`
            });


            console.log("About to insert into MySQL...");
            console.log(userRecord.uid, userData.email);


            await pool.query(
                `
                INSERT INTO students (
                    uid,
                    id_number,
                    affiliation,
                    first_name,
                    last_name,
                    email,
                    account_type,
                    approval_status
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                `,
                [
                    userRecord.uid,
                    userData.idNumber,
                    userData.affiliation,
                    userData.firstName,
                    userData.lastName,
                    userData.email,
                    userData.accountType,
                    approvalStatus
                ]
            );


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


        } catch (error) {


            if(userRecord){
                await getAuth().deleteUser(userRecord.uid);
            }


            throw error;
        }

    };

    exports.loginUser = async(idToken)=>{

        const decodedToken = await getAuth().verifyIdToken(idToken);

        const [rows] = await pool.query(
        `
            SELECT *
            FROM students
            WHERE uid = ?
            `,
            [decodedToken.uid]
        );


        if(rows.length === 0){
            throw new Error("User record not found.");
        }


        const user = rows[0];


        if(user.account_type === "moderator" &&
            user.approval_status !== "approved")
        {
            return {
                success:false,
                message:"Moderator account is still pending approval."
            };
        }


        return {
            success:true,
            message:"Login successful.",
            data:user
        };

    };  

    exports.modLoginUser = async (idToken) => {

        const decodedToken = await getAuth().verifyIdToken(idToken);

        const [rows] = await pool.query(
            `
            SELECT *
            FROM students
            WHERE uid = ?
            `,
            [decodedToken.uid]
        );

        if (rows.length === 0) {
            throw new Error("User record not found.");
        }

        const user = rows[0];

        if (user.account_type !== "moderator") {
            return {
                success: false,
                message: "This account is not a moderator."
            };
        }

        if (user.approval_status !== "approved") {
            return {
                success: false,
                message: "Moderator account is still pending approval."
            };
        }

        return {
            success: true,
            message: "Moderator login successful.",
            data: user
        };

    };

    exports.getCurrentUser = async (idToken) => {

        const decodedToken = await getAuth().verifyIdToken(idToken);


        const [rows] = await pool.query(
            `
            SELECT
                uid,
                first_name,
                last_name,
                email,
                account_type,
                approval_status
            FROM students
            WHERE uid = ?
            `,
            [decodedToken.uid]
        );


        if(rows.length === 0){
            throw new Error("User not found.");
        }


        return rows[0];

    };