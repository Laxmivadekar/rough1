const fs = require('fs');
const crypto = require('crypto');
const algorithm = 'aes-256-cbc'; //Using AES encryption
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

const orderStatus = {
    Cancelled: 0,
    Initiated: 2,
    AwaitingPaymentConfirmation: 3,
    PaymentReceived: 4,
    PaymentFailed: 5
};

const orderType = {
    Package: 'Package',
    Event: 'Event'
}
module.exports = {
    sysConst: {
        orderStatus,
        orderType
    },
    isObjectContainsKey: (obj, val) => {
        if (val === undefined || val === null) {
            return false;
        }
        let keys = Object.keys(obj);
        for(let key in keys){
            if (obj[keys[key]] === val) {
                return true;
            }
        }
        return false;
    },
    isValidURL(str) {
        let pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
            '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
        return !!pattern.test(str);
    },
    getDefaultValueOnNull(val, defaultValue = null) {
        if (val !== null && val !== undefined) {
            return val;
        }
        return defaultValue != null ? defaultValue : '';
    },
    getBoolean(val) {
        val = val !== undefined ? val.toString().toLowerCase().trim() : false;
        switch (val) {
            case "true":
            case true:
            case "1":
                return true;
            case "false":
            case false:
            case "0":
                return false;
            default:
                Boolean(val);
        }
    },
    deleteFileIfExists: (path) => {
        return new Promise((callback) => {
            fs.access(path, fs.F_OK, (err) => {
                if (err) {
                    //file does not exists
                    return callback(false);
                }
                //file exists need to delete
                fs.unlink(path, (err) => {
                    if (err) {
                        return callback(false);
                    }
                    callback(true);
                });
            });
        });
    },
    reviewStatusConstrains: {
        pendingForApproval: 'pending_for_approval',
        approved: 'approved',
        hidden: 'hidden',
        deleted: 'deleted',
    },
    inquiryStatusConstrains: {
        deleted: 0,
        initiated: 1,
        sent: 2,
        inProgress: 3,
        processed: 4,
    },
    encrypt: (text) => {
        let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
        let encrypted = cipher.update(text);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        return {iv: iv.toString('hex'), encryptedData: encrypted.toString('hex')};
    },
    decrypt: (text) => {
        let iv = Buffer.from(text.iv, 'hex');
        let encryptedText = Buffer.from(text.encryptedData, 'hex');
        let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    },
    encodeBase64(txt){
        let buff = Buffer.from(txt);
        return buff.toString('base64');
    },
    decodeBase64(txt){
        let buff = Buffer.from(txt, 'base64');
        return buff.toString('ascii');
    },
    generateOTP : ()=> {
        // Declare a digits variable
        // which stores all digits
        var digits = '0123456789';
        let OTP = '';
        for (let i = 0; i < 6; i++ ) {
            OTP += digits[Math.floor(Math.random() * 10)];
        }
        return OTP;
    },
};