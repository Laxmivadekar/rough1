const https = require('http');

module.exports = (mobileNumber, otp, callback) => {
    const reqUrl = "http://sms.autobysms.com/app/smsapi/index.php?key=45DC43E1347DA4&campaign=0&routeid=9&type=text&contacts="
        + mobileNumber
        + "&senderid=ADINPL&msg=Your OTP for login in A2D EATS is "
        + otp
        + " Do not share with anyone. -Team A2D&template_id=1707164965599404738";

    if(process.env.MODE === 'DEV'){
        callback({opt: 123456});
    }else{
        https.get(reqUrl, (resp) => {
            let data = '';

            // A chunk of data has been received.
            resp.on('data', (chunk) => {
                data += chunk;
            });

            // The whole response has been received. Print out the result.
            resp.on('end', () => {
                console.log(data);
                callback(data);
                //console.log(JSON.parse(data).explanation);
            });

        }).on("error", (err) => {
            console.log("Error: " + err.message);
        });
    }
}