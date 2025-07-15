/** ras 非对称加密: https://www.npmjs.com/package/jsencrypt */
import { JSEncrypt } from 'jsencrypt'

/**
 * 加密
 */
export function rsaEncrypt(publicKey, value, isWrapObj = true) {
    if (isWrapObj) value = JSON.stringify({ v: value })
    const encryptor = new JSEncrypt()
    encryptor.setPublicKey(publicKey)
    return encryptor.encrypt(value)
}

/**
 * 解密
 */
export function rsaDecrypt(privateKey, value, isWrapObj = true) {
    const encryptor = new JSEncrypt()
    encryptor.setPrivateKey(privateKey)

    return isWrapObj ? JSON.parse(encryptor.decrypt(value) as any).v : encryptor.decrypt(value)
}
