/* sheets:
    Functions for interaction with the Google Sheets API.
*/

const { google } = require("googleapis");
const privatekey = require("./googleCredentials.json");
//const signupSpreadsheetId = "12CgCC6HV9ZJGO8EePqo9PNmy-7UY6GTL1atG8gSItnE";
const signupSpreadsheetId = "1enan-_vOuiTNYjU_P2OvnwP3l61rW1oBxuf8R4O2_l0";

// configure a JWT auth client
const jwtClient = new google.auth.JWT(
    privatekey.client_email,
    null,
    privatekey.private_key,
    ["https://www.googleapis.com/auth/spreadsheets"]
);
// authenticate request
jwtClient.authorize(function(err, tokens) {
    if (err) {
        console.log("ERROR AUTHORIZING GOOGLE SHEETS API: ", err);
        return;
    } else {
        console.log("Successfully connected");
    }
});

module.exports = {};

module.exports.test = (req, res) => {
    console.log("HUH");

    let spreadsheetId = signupSpreadsheetId;
    let sheetRange = "A1:U42";
    let sheets = google.sheets("v4");
    sheets.spreadsheets.values.get(
        {
            auth: jwtClient,
            spreadsheetId: signupSpreadsheetId,
            range: sheetRange
        },
        function(err, response) {
            if (err) {
                console.log("Sheets API returned an error: ", err);
            } else {
                console.log("List from Sheets:");
                console.log("response: ", response.data.values);

                return res.status(200).send({});
            }
        }
    );
};

/**
 * Print the location and time of practice for today
 */
// function gymnasticsInfoLogistics(auth, returnMsgFunc) {
//     let sheets = google.sheets("v4");
//     sheets.spreadsheets.values.get(
//         {
//             auth: auth,
//             spreadsheetId: "1-Lxy_dX73c3-xUHJ-43lBB8ciMdvAOviSS6xWFCypsQ",
//             range: "C28:D37"
//         },
//         function(err, response) {
//             if (err) {
//                 console.log("The API returned an error: " + err);
//                 return "The program failed, sign up using the sheet. Sorry :(";
//             }
//             let rows = response.values;
//             if (rows != undefined) {
//                 let date = new Date();
//                 let day = date.getDay();
//                 if (day == 5 || day == 6) {
//                     returnMsgFunc("There is no practice today.");
//                     return;
//                 }
//                 let info = rows[day][1] + ", " + rows[day + 1][1];
//                 if (day == 0) {
//                     info += "\nPickup is at 5:40";
//                 } else {
//                     info += "\nPickup is at 8:10";
//                 }
//                 returnMsgFunc(info);
//                 return;
//             }
//         }
//     );
// }

/**
 * Print the names and pickup locations of students in the spreadsheet:
 * https://docs.google.com/spreadsheets/d/1-Lxy_dX73c3-xUHJ-43lBB8ciMdvAOviSS6xWFCypsQ
 */
// function gymnasticsInfoPeople(auth, returnMsgFunc) {
//     let sheets = google.sheets("v4");
//     sheets.spreadsheets.values.get(
//         {
//             auth: auth,
//             spreadsheetId: "1-Lxy_dX73c3-xUHJ-43lBB8ciMdvAOviSS6xWFCypsQ",
//             range: "H9:R40"
//         },
//         function(err, response) {
//             if (err) {
//                 console.log("The API returned an error: " + err);
//                 return "The program failed, sign up using the sheet. Sorry :(";
//             }
//             let rows = response.values;
//             let people = [];
//             if (rows != undefined) {
//                 for (let rowNum = 0; rowNum < rows.length; rowNum++) {
//                     let row = rows[rowNum];
//                     if (
//                         row[0] != "" &&
//                         row[0] != undefined &&
//                         row[0] != "McDonalds" &&
//                         row[0] != "New Member (not on list)"
//                     )
//                         people.push(row[0]);
//                     if (
//                         row[2] != "" &&
//                         row[2] != undefined &&
//                         row[2] != "Hub" &&
//                         row[2] != "New Member (not on list)"
//                     )
//                         people.push(row[2]);
//                     if (
//                         row[6] != "" &&
//                         row[6] != undefined &&
//                         row[6] != "Porter" &&
//                         row[6] != "New Member (not on list)"
//                     )
//                         people.push(row[6]);
//                     if (
//                         row[10] != "" &&
//                         row[10] != undefined &&
//                         row[10] != "I'll Be There and can drive if needed" &&
//                         row[10] != "I'll Be there - No ride needed" &&
//                         row[10] != "New Member (not on list)"
//                     )
//                         people.push(row[10]);
//                 }
//             }
//             let returnMessage = "";
//             for (let i = 0; i < people.length; i++) {
//                 returnMessage += people[i];
//                 returnMessage += "\n";
//             }
//             returnMsgFunc(returnMessage);
//             return;
//         }
//     );
// }

/*
 * Sign up on the sheet
 * TODO: deal with if people sign up for the same spot at the same time
 */
// function gymnasticsSignUp(auth, returnMsgFunc, user) {
//     const name = user.name;
//     const pickupLocation = user.pickupLocation;
//     const driver = user.isDriver;
//
//     let date = new Date();
//     let day = date.getDay();
//     if (day == 5 || day == 6) {
//         returnMsgFunc("There is no practice today");
//         return;
//     }
//     let time = date.getHours();
//     if ((day == 0 && time >= 15) || (day >= 1 && day <= 4 && time >= 17)) {
//         console.log(day);
//         console.log(time);
//         returnMsgFunc("It's past the sign up time, text Morgan to sign up");
//         return;
//     }
//
//     let sheets = google.sheets("v4");
//     let a1notation;
//     sheets.spreadsheets.values.get(
//         {
//             auth: auth,
//             spreadsheetId: "1-Lxy_dX73c3-xUHJ-43lBB8ciMdvAOviSS6xWFCypsQ",
//             range: "H9:R40"
//         },
//         function(err, response) {
//             if (err) {
//                 console.log("The API returned an error: " + err);
//                 returnMsgFunc(
//                     "The program failed, sign up using the sheet. Sorry :("
//                 );
//                 return;
//             }
//             let rows = response.values;
//             let a1notation;
//             let a1notationA;
//             let a1notationB;
//             let places;
//             if (rows != undefined) {
//                 //find these values from database?
//                 if (justRideBack) {
//                     places = [0, 1, 2, 3, 4, 5, 6, 7, 8];
//                     for (let i = 0; i < places.length; i++) {
//                         if (
//                             rows[places[i]][10] == undefined ||
//                             rows[places[i]][10] == ""
//                         ) {
//                             a1notationA =
//                                 "R" + (9 + places[i]) + ":R" + (9 + places[i]);
//                             a1notationB =
//                                 "S" + (9 + places[i]) + ":S" + (9 + places[i]);
//                             break;
//                         }
//                     }
//                     sheets.spreadsheets.values.update(
//                         {
//                             spreadsheetId:
//                                 "1-Lxy_dX73c3-xUHJ-43lBB8ciMdvAOviSS6xWFCypsQ",
//                             range: a1notationA,
//                             valueInputOption: "RAW",
//                             resource: {
//                                 values: [[name]]
//                             },
//                             auth: auth
//                         },
//                         function(err, response) {
//                             if (err) {
//                                 console.log(
//                                     "The API returned an error: " + err
//                                 );
//                                 returnMsgFunc(
//                                     "The program failed, sign up using the sheet. Sorry :("
//                                 );
//                                 return;
//                             } else {
//                                 returnMsgFunc("You are signed up");
//                                 return;
//                             }
//                         }
//                     );
//                     sheets.spreadsheets.values.update(
//                         {
//                             spreadsheetId:
//                                 "1-Lxy_dX73c3-xUHJ-43lBB8ciMdvAOviSS6xWFCypsQ",
//                             range: a1notationB,
//                             valueInputOption: "RAW",
//                             resource: {
//                                 values: [[user.pickupLocation]]
//                             },
//                             auth: auth
//                         },
//                         function(err, response) {
//                             if (err) {
//                                 console.log(
//                                     "The API returned an error: " + err
//                                 );
//                                 returnMsgFunc(
//                                     "The program failed, sign up using the sheet. Sorry :("
//                                 );
//                                 return;
//                             }
//                         }
//                     );
//                 } else if (canDrive) {
//                     places = [10, 11, 12, 13, 14, 15, 16];
//                     for (let i = 0; i < places.length; i++) {
//                         if (
//                             rows[places[i]][10] == undefined ||
//                             rows[places[i]][10] == ""
//                         ) {
//                             a1notationA =
//                                 "R" + (9 + places[i]) + ":R" + (9 + places[i]);
//                             a1notationB =
//                                 "S" + (9 + places[i]) + ":S" + (9 + places[i]);
//                             break;
//                         }
//                     }
//                     sheets.spreadsheets.values.update(
//                         {
//                             spreadsheetId:
//                                 "1-Lxy_dX73c3-xUHJ-43lBB8ciMdvAOviSS6xWFCypsQ",
//                             range: a1notationA,
//                             valueInputOption: "RAW",
//                             resource: {
//                                 values: [[name]]
//                             },
//                             auth: auth
//                         },
//                         function(err, response) {
//                             if (err) {
//                                 console.log(
//                                     "The API returned an error: " + err
//                                 );
//                                 returnMsgFunc(
//                                     "The program failed, sign up using the sheet. Sorry :("
//                                 );
//                                 return;
//                             } else {
//                                 returnMsgFunc("You are signed up");
//                             }
//                         }
//                     );
//                     sheets.spreadsheets.values.update(
//                         {
//                             spreadsheetId:
//                                 "1-Lxy_dX73c3-xUHJ-43lBB8ciMdvAOviSS6xWFCypsQ",
//                             range: a1notationB,
//                             valueInputOption: "RAW",
//                             resource: {
//                                 values: [[when]]
//                             },
//                             auth: auth
//                         },
//                         function(err, response) {
//                             if (err) {
//                                 console.log(
//                                     "The API returned an error: " + err
//                                 );
//                                 returnMsgFunc(
//                                     "The program failed, sign up using the sheet. Sorry :("
//                                 );
//                                 return;
//                             }
//                         }
//                     );
//                 } else if (noRide) {
//                     places = [18, 19, 20, 21, 22, 23, 24, 25, 26];
//                     for (let i = 0; i < places.length; i++) {
//                         if (
//                             rows[places[i]][10] == undefined ||
//                             rows[places[i]][10] == ""
//                         ) {
//                             a1notation =
//                                 "R" + (9 + places[i]) + ":R" + (9 + places[i]);
//                             break;
//                         }
//                     }
//                 } else {
//                     if (pickupLocation == "McDonalds") {
//                         if (driver) {
//                             places = [0, 6, 12, 18];
//                         } else {
//                             places = [
//                                 1,
//                                 2,
//                                 3,
//                                 4,
//                                 7,
//                                 8,
//                                 9,
//                                 10,
//                                 13,
//                                 14,
//                                 15,
//                                 16,
//                                 19,
//                                 20,
//                                 21,
//                                 22
//                             ];
//                         }
//                         for (let i = 0; i < places.length; i++) {
//                             if (
//                                 rows[places[i]][0] == undefined ||
//                                 rows[places[i]][0] == ""
//                             ) {
//                                 a1notation =
//                                     "H" +
//                                     (9 + places[i]) +
//                                     ":H" +
//                                     (9 + places[i]);
//                                 break;
//                             }
//                         }
//                     }
//                     if (pickupLocation == "Hub") {
//                         if (driver) {
//                             places = [0, 6, 12, 18];
//                         } else {
//                             places = [
//                                 1,
//                                 2,
//                                 3,
//                                 4,
//                                 7,
//                                 8,
//                                 9,
//                                 10,
//                                 13,
//                                 14,
//                                 15,
//                                 16,
//                                 19,
//                                 20,
//                                 21,
//                                 22
//                             ];
//                         }
//                         for (let i = 0; i < places.length; i++) {
//                             if (
//                                 rows[places[i]][2] == undefined ||
//                                 rows[places[i]][2] == ""
//                             ) {
//                                 a1notation =
//                                     "J" +
//                                     (9 + places[i]) +
//                                     ":J" +
//                                     (9 + places[i]);
//                                 break;
//                             }
//                         }
//                     }
//                     if (pickupLocation == "Porter") {
//                         if (driver) {
//                             places = [0, 6, 12, 18];
//                         } else {
//                             places = [
//                                 1,
//                                 2,
//                                 3,
//                                 4,
//                                 7,
//                                 8,
//                                 9,
//                                 10,
//                                 13,
//                                 14,
//                                 15,
//                                 16,
//                                 19,
//                                 20,
//                                 21,
//                                 22
//                             ];
//                         }
//                         for (let i = 0; i < places.length; i++) {
//                             if (
//                                 rows[places[i]][6] == undefined ||
//                                 rows[places[i]][6] == ""
//                             ) {
//                                 a1notation =
//                                     "N" +
//                                     (9 + places[i]) +
//                                     ":N" +
//                                     (9 + places[i]);
//                                 break;
//                             }
//                         }
//                     }
//                 }
//                 sheets.spreadsheets.values.update(
//                     {
//                         spreadsheetId:
//                             "1-Lxy_dX73c3-xUHJ-43lBB8ciMdvAOviSS6xWFCypsQ",
//                         range: a1notation,
//                         valueInputOption: "RAW",
//                         resource: {
//                             values: [[name]]
//                         },
//                         auth: auth
//                     },
//                     function(err, response) {
//                         if (err) {
//                             console.log("The API returned an error: " + err);
//                             returnMsgFunc(
//                                 "The program failed, sign up using the sheet. Sorry :("
//                             );
//                             return;
//                         } else {
//                             let returnMessage = "You are signed up";
//                             if (driver) {
//                                 returnMessage += " as a driver";
//                             }
//                             returnMsgFunc(returnMessage);
//                             return;
//                         }
//                     }
//                 );
//             }
//         }
//     );
// }

// function gymnasticsCancel(auth, returnMsgFunc, name) {
//     let date = new Date();
//     let day = date.getDay();
//     let time = date.getHours();
//     if (day == 5 || day == 6) {
//         returnMsgFunc("There is no practice today");
//         return;
//     }
//     if ((day == 0 && time >= 16) || (day >= 1 && day <= 4 && time >= 18)) {
//         returnMsgFunc("It is past the cancel time, text Morgan to cancel");
//         return;
//     }
//
//     let sheets = google.sheets("v4");
//     sheets.spreadsheets.values.get(
//         {
//             auth: auth,
//             spreadsheetId: "1-Lxy_dX73c3-xUHJ-43lBB8ciMdvAOviSS6xWFCypsQ",
//             range: "H9:R40"
//         },
//         function(err, response) {
//             if (err) {
//                 console.log("The API returned an error: " + err);
//                 returnMsgFunc(
//                     "The program failed, cancel using the sheet. Sorry :("
//                 );
//                 return;
//             }
//             let rows = response.values;
//             let a1notation = "";
//             let realRowNum = 9;
//             if (rows != undefined) {
//                 for (let rowNum = 0; rowNum < rows.length; rowNum++) {
//                     let row = rows[rowNum];
//                     if (row[0] == name) {
//                         a1notation = "H" + realRowNum + ":" + "H" + realRowNum;
//                         break;
//                     } else if (row[2] == name) {
//                         a1notation = "J" + realRowNum + ":" + "J" + realRowNum;
//                         break;
//                     } else if (row[6] == name) {
//                         a1notation = "N" + realRowNum + ":" + "N" + realRowNum;
//                         break;
//                     } else if (row[10] == name) {
//                         a1notation = "R" + realRowNum + ":" + "R" + realRowNum;
//                         break;
//                     } else {
//                         realRowNum++;
//                     }
//                 }
//                 sheets.spreadsheets.values.update(
//                     {
//                         spreadsheetId:
//                             "1-Lxy_dX73c3-xUHJ-43lBB8ciMdvAOviSS6xWFCypsQ",
//                         range: a1notation,
//                         valueInputOption: "RAW",
//                         resource: {
//                             values: [[""]]
//                         },
//                         auth: auth
//                     },
//                     function(err, response) {
//                         if (err) {
//                             console.log("The API returned an error: " + err);
//                             returnMsgFunc(
//                                 "The program failed, cancel using the sheet. Sorry :("
//                             );
//                             return;
//                         } else {
//                             returnMsgFunc(
//                                 "Your name has been removed from the sheet"
//                             );
//                             return;
//                         }
//                     }
//                 );
//             }
//         }
//     );
// }
//
// function gymnasticsCheckStatus(
//     auth,
//     returnMsgFunc,
//     user,
//     sign,
//     cancel,
//     driver
// ) {
//     const name = user.name;
//     if (sign == true && cancel == true) {
//         returnMsgFunc("You cannot sign up and cancel at the same time.");
//         return;
//     }
//     let sheets = google.sheets("v4");
//     sheets.spreadsheets.values.get(
//         {
//             auth: auth,
//             spreadsheetId: "1-Lxy_dX73c3-xUHJ-43lBB8ciMdvAOviSS6xWFCypsQ",
//             range: "H9:R40"
//         },
//         function(err, response) {
//             if (err) {
//                 console.log("The API returned an error: " + err);
//                 returnMsgFunc(
//                     "The program screwed up, use the sheet, sorry :("
//                 );
//                 return;
//             }
//             let rows = response.values;
//             let status = false;
//             if (rows != undefined) {
//                 for (let rowNum = 0; rowNum < rows.length; rowNum++) {
//                     let row = rows[rowNum];
//                     if (row[0] == name) {
//                         status = true;
//                         break;
//                     } else if (row[2] == name) {
//                         status = true;
//                         break;
//                     } else if (row[6] == name) {
//                         status = true;
//                         break;
//                     } else if (row[10] == name) {
//                         status = true;
//                         break;
//                     } else {
//                     }
//                 }
//             }
//             if (status) {
//                 if (sign) {
//                     returnMsgFunc("You are already signed up");
//                     return;
//                 } else if (cancel) {
//                     gymnasticsCancel(auth, returnMsgFunc, name);
//                     return;
//                 } else {
//                     returnMsgFunc("You are already signed up.");
//                     return;
//                 }
//             } else {
//                 if (sign) {
//                     gymnasticsSignUp(auth, returnMsgFunc, user);
//                     return;
//                 } else {
//                     returnMsgFunc("You are not signed up.");
//                     return;
//                 }
//             }
//         }
//     );
// }

// read a range of values from the spreadsheet
async function readValues(range) {
    return new Promise(function(resolve, reject) {
        const sheets = google.sheets("v4");
        sheets.spreadsheets.values.get(
            {
                auth: jwtClient,
                spreadsheetId: signupSpreadsheetId,
                range: range,
                majorDimension: "COLUMNS"
            },
            function(err, response) {
                if (err) {
                    return reject(err);
                } else {
                    return resolve(response.data.values);
                }
            }
        );
    });
}

// read a range of values from the spreadsheet
async function writeValues(range, values) {
    return new Promise(function(resolve, reject) {
        // check if arguments are valid
        if (
            !Array.isArray(values) ||
            values.length === 0 ||
            !Array.isArray(values[0])
        ) {
            return reject(new Error("Invalid values: ", values));
        } else if (typeof range !== "string") {
            return reject(new Error("Invalid range: ", range));
        }

        const sheets = google.sheets("v4");
        const resource = { values };
        sheets.spreadsheets.values.update(
            {
                auth: jwtClient,
                spreadsheetId: signupSpreadsheetId,
                range,
                valueInputOption: "RAW",
                resource
            },
            function(err, response) {
                if (err) {
                    return reject(err);
                } else {
                    return resolve();
                }
            }
        );
    });
}

// if we have permission to write, it is a valid time to sign up
async function checkIfValidTime() {
    return new Promise(async function(resolve, reject) {
        try {
            await writeValues("A100:A100", [["c"]]);
            await writeValues("A100:A100", [[""]]);
            return resolve(true);
        } catch (writeValue) {
            return resolve(false);
        }
    });
}

// returns an object with the slots that could potentially be filled with people
// function slots() {
//     const peoplePerCar = 4;
//     const firstSlotRow = 9;
//     const carsPerLocation = 4;
//
//     const slots = {
//         McDonalds: {
//             drivers: driverSlots.map(row => `${McDonaldsCol}:${row}`),
//             riders: riderSlots.map(row => `${McDonaldsCol}:${row}`)
//         }
//     };
// }

// resolves to true if the name exists on the list
async function checkIfSignedUp(name) {
    return new Promise(async function(resolve, reject) {
        // get all the values in the table
        const wantedCols = ["H", "J", "N", "R"];
        const places = ["McDonalds", "Hub", "Porter Boathouse", "Other"];
        const highestRow = "9";
        const lowestRow = "31";

        // read the values of every location's column (including Other column)
        const readValuesPromises = wantedCols.map(col => {
            const values = `${col}${highestRow}:${col}${lowestRow}`;
            return readValues(values);
        });

        // wait for all the values to get returned from the spreadsheet
        // for some reason it returns this as the first value of a 3d array
        try {
            var peopleCols = (await Promise.all(readValuesPromises))[0];
        } catch (getColsError) {
            return reject(getColsError);
        }

        console.log("peopleCols: ", peopleCols);

        // go through each column
        for (let col = 0; col < peopleCols.length; col++) {
            // get the list of people who signed up in that column
            const peopleCol = peopleCols[col];
            // go through each row
            for (let row = 0; row < peopleCol.length; row++) {
                // if the value at that column and row is the name ...
                if (peopleCol[row] === name) {
                    // ... return that column and row so it can be used later
                    const isSignedUp = true;
                    const location = places[col];
                    // the user is driving if their name is in a row with value 6n
                    const driving = row % 6 === 0;
                    const cell = `${wantedCols[col]}${row +
                        parseInt(highestRow, 10)}`;
                    return resolve({ isSignedUp, location, driving, cell });
                }
            }
        }

        return resolve({ isSignedUp: false });
    });
}

async function addNameToSheet(name, location, driver) {
    return new Promise(async function(resolve, reject) {
        return resolve();
    });
}

module.exports.signUp = async (name, location, driver) => {
    return new Promise(async (resolve, reject) => {
        // make sure input is valid
        if (typeof name !== "string" || name.length === 0) {
            return reject(
                new Error("Invalid input to signUp(). Value of name was ", name)
            );
        }

        console.log("Name is valid: ", name);

        // check if it's too late to sign up today or if it's not a practice day
        try {
            const validTime = await checkIfValidTime();
            console.log("validTime: ", validTime);
            if (!validTime) {
                return resolve("Sheet is closed!");
            }
        } catch (checkIfValidTimeError) {
            return reject(checkValidTimeError);
        }

        console.log("Sheet is open");

        // see if the user is already on the list for that day
        try {
            var {
                isSignedUp,
                location: oldLoc,
                driving,
                cell
            } = await checkIfSignedUp(name);
        } catch (checkIfSignedUpError) {
            return reject(checkIfSignedUpError);
        }

        console.log("cell: ", cell);

        // if user is already on list, tell them that they're already on the list
        // as well as where they're getting picked up
        if (isSignedUp) {
            console.log("Already signed up");
            const rideOrDrive = driving ? "pick up friends" : "get picked up";
            const message = `You're already signed up to ${rideOrDrive} from ${oldLoc}`;
            console.log(message);
            return resolve(message);
        }

        // if the user is not already on the list, add them
        else {
            console.log("Adding name to sheet");
            try {
                await addNameToSheet(name, location, driver);
            } catch (addNameError) {
                return reject(addNameError);
            }
        }

        console.log("Added name to sheet");

        // return successfully
        const rideOrDrive = driver ? "pick up friends" : "get picked up";
        return resolve(
            "You are signed up to " + rideOrDrive + " from " + location
        );
    });

    // editSheet(user, true, false, gymnasticsCheckStatus, function(msg) {
    //     sendText(msg);
    // });
};
module.exports.cancel = name => {
    // editSheet(user, false, true, gymnasticsCheckStatus, function(msg) {
    //     sendText(msg);
    // });
};
// module.exports.checkStatus = (user, sendText) => {
//     editSheet(user, false, false, gymnasticsCheckStatus, function(msg) {
//         sendText(msg);
//     });
// };
// module.exports.infoPeople = sendText => {
//     editSheet(null, false, false, gymnasticsInfoPeople, function(msg) {
//         sendText(msg);
//     });
// };
// module.exports.infoLogistics = sendText => {
//     editSheet(null, false, false, gymnasticsInfoLogistics, function(msg) {
//         sendText(msg);
//     });
// };
