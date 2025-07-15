/** aes 对称加密: https://www.npmjs.com/package/crypto-js */
import CryptoJS from 'crypto-js'

export function aesEncrypt(aeskey: string, value: string) {
    var key = CryptoJS.enc.Utf8.parse(aeskey)
    var srcs = CryptoJS.enc.Utf8.parse(value)

    var encrypted = CryptoJS.AES.encrypt(srcs, key, {
        // 切记   需要和后端算法模式一致
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7,
    })

    return encrypted.toString()
}

export function aesDecrypt(aeskey, Str) {
    var key = CryptoJS.enc.Utf8.parse(aeskey)
    var decrypt = CryptoJS.AES.decrypt(Str, key, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7,
    })
    return CryptoJS.enc.Utf8.stringify(decrypt).toString()
}
