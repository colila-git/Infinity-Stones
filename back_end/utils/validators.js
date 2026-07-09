// Validate ADNU GBox email
const isValidGBoxEmail = (email) => {
    return email.toLowerCase().endsWith("@gbox.adnu.edu.ph");
};

// Validate 9-digit ID Number
const isValidIDNumber = (idNumber) => {
    return /^\d{9}$/.test(idNumber);
};

module.exports = {
    isValidGBoxEmail,
    isValidIDNumber
};

// Validate account type
const isValidAccountType = (accountType) => {
    return ["user", "moderator"].includes(accountType);
};

// Validate affiliation
const isValidAffiliation = (affiliation) => {
    return ["CO", "SH", "HR"].includes(affiliation);
};

module.exports = {
    isValidGBoxEmail,
    isValidIDNumber,
    isValidAccountType,
    isValidAffiliation
};