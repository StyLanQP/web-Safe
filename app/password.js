const CryptoJS = require('crypto-js')
// const hash = (type, str) => crypto.createHash(type).update(str).digest('hex')
// const md5 = str => hash('md5', str)
// const sha1 = str => hash('sha1', str)
// const encryptPassword = (salt, password) => md5(salt + 'abced@#4@%#$7' + password)
// const psw = '11111'
// console.log('md5', md5(psw))
// console.log('sha1', sha1(psw))
// console.log('哈哈哈哈', md5('oooooftg' + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiaWF0IjoxNjE4MzA1NDc0LCJleHAiOjE2MTgzMDU2NTR9.LSL_tUR74zJZJMBQmPdVDUHuybJ_S24VF4MRpyJDSz0' + 88888 + '12465488991'))

function getAesString(data,key,iv){//加密
    var key  = CryptoJS.enc.Utf8.parse(key);
    var iv   = CryptoJS.enc.Utf8.parse(iv);
    var encrypted =CryptoJS.AES.encrypt(data,key,
        {
            iv:iv,
            mode:CryptoJS.mode.CBC,
            padding:CryptoJS.pad.Pkcs7
        });
    return encrypted.toString();    //返回的是base64格式的密文
}

const getAES =(data, iv)=>{ //加密
    var key  = 'yhus$gs528n35^*^$#@#^&(';  //密钥
    // var iv   = time1;
    var encrypted =getAesString(data,key,iv); //密文
    var encrypted1 =CryptoJS.enc.Utf8.parse(encrypted);
    return encrypted;
}


module.exports = getAES



// password = crypto.createHmac("md5", "cyl").update(password).digest("hex");