import CryptoJS from 'crypto-js';

const test = async (req, res) => {
    res.send('auth controller');
};
const codeGenerated = async (req, res) => {
    let emailCode = Math.random().toString(36).slice(2, 7);
    var hash = CryptoJS.SHA256(emailCode);
    var a = hash.toString(CryptoJS.enc.Base64)
    res.send('Code generate!'+a);
};

export {
    test,
    codeGenerated
}