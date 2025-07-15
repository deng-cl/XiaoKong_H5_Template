import { JSEncrypt } from 'jsencrypt'

interface StorageOptions {
    namespace?: string
    encrypt?: boolean
    publicKey?: string
    privateKey?: string
}

export class HStorage {
    private namespace: string
    private encrypt: boolean
    private privateKey: string
    private publicKey: string

    constructor(options: StorageOptions = {}) {
        const {
            namespace = 'Hpbs-',
            encrypt = false,
            privateKey = 'MIICdwIBADANBgkqhkiG9w0BAQEFAASCAmEwggJdAgEAAoGBANk07rSimv89cQTP6tOPr6ipejFYrPQl8TvBXTd0ehnI4Rs8Du7Ej8veBfX+s7ERwVkfUE42O7qoPxs9xiamunVvEzJTp4ObVj6ZvAafm7NzwouPHVNyQfwNQMZy2KbJNRq/DS+pXv4J1nJU68fnbNI73936S020pXYm5CDq0NYLAgMBAAECgYAqSxVD1PmrQ3JzRmzqHutMQxvI6gRbUdwED6Wv+50e0i+K1wntUhbR0nyEpsCkdNmaGe/QGt1MfiAzlLa1pfdeNFb2N9/1UzwvR0Ae+PayPZaQLoa/d9u+gC+Kz3kmL9Gl2r8G73CIMzJVFrsYPeT3UtN4qH0S8kaSwiQCs57SSQJBAP5pFTH+5a54sfpVLPRMBq7ZghYYNeuPIUE27X7nn8SI1sX+yxT2nJvk16RIQowDzBOZDqPeSKP0DL0fo6ev2XcCQQDakFgYKox8/o9DEoyIT6u4ZWaI1F3uJkya7Y+1nMcLQZtpUhXkADr/b7kKjI0uXm1qhcWmHTAW3IW+xWpP1k0NAkEA+nZpr3bKmCGq1lDUmQ3f5nOsZiQfsXCPxKxW1AEkgVBWYUaemFzRgYih49Jf8YgreX/NsfY8fWzevbJQY93zsQJAB5BPPCbczcaRdqTBsEXxj2QS9FFFHuS8afAmtQZD7SPMGQz6LPXFFOns4WyTxjMGXlVazbDc5S2kg0GZuEGWUQJBANrhMQwtystDwrg3p/TMUQ7JSrQ0MBj2vXGRk7aN3khHk6soNXtegYX5+ezgqASYCZ6cgYSfEnvXc+V7ed+1qi4=',
            publicKey = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDZNO60opr/PXEEz+rTj6+oqXoxWKz0JfE7wV03dHoZyOEbPA7uxI/L3gX1/rOxEcFZH1BONju6qD8bPcYmprp1bxMyU6eDm1Y+mbwGn5uzc8KLjx1TckH8DUDGctimyTUavw0vqV7+CdZyVOvH52zSO9/d+ktNtKV2JuQg6tDWCwIDAQAB',
        } = options
        this.namespace = namespace
        this.encrypt = encrypt
        this.privateKey = privateKey
        this.publicKey = publicKey
    }

    private getNamespacedKey(key: string): string {
        // -- 本地换成 key
        return `${this.namespace}${key}${this.encrypt ? '-e' : ''}` // - '-e' 用于标识加密时使用的本地换成，避免切换开启加密时，加解密失败（Tip:即加密与不加密是两套不同的本地缓存，但是 clear 与 clearNamespace 不做处理，会将 namespace 都清空）
    }

    private encryptData(data: any): string | false {
        // -- 加密
        data = JSON.stringify({ v: data })
        const encryptor = new JSEncrypt()
        encryptor.setPublicKey(this.publicKey)
        return encryptor.encrypt(data)
    }

    private decryptData(encrypted: any): string {
        // -- 解密
        const encryptor = new JSEncrypt()
        encryptor.setPrivateKey(this.privateKey)
        return JSON.parse(encryptor.decrypt(encrypted) as any).v
    }

    set<T>(key: string, value: T, ttl?: number): void {
        try {
            const namespacedKey = this.getNamespacedKey(key)

            const item = {
                // -- 扩展过期时间
                value,
                expires: ttl ? Date.now() + ttl : undefined,
            }

            let serialized = JSON.stringify(item)
            if (this.encrypt) {
                // -- 加密
                let enSerialized = this.encryptData(item)
                if (enSerialized === false) throw new Error('HStorage: Encryption failed')
                serialized = enSerialized
            }

            // console.log('H SET:', serialized, item)

            localStorage.setItem(namespacedKey, serialized)
        } catch (error) {
            console.error('Storage set error:', error)
        }
    }

    get<T>(key: string): T | null {
        try {
            const namespacedKey = this.getNamespacedKey(key)
            let serialized = localStorage.getItem(namespacedKey)
            if (!serialized) return null

            let item = null
            if (this.encrypt)
                item = this.decryptData(serialized) as any // -- 解密
            else item = JSON.parse(serialized) as { value: T; expires?: number }

            if (item.expires && Date.now() > item.expires) {
                this.remove(key)
                return null
            }

            // console.log('H GET:', serialized, item)

            return item.value
        } catch (error) {
            console.error('Storage get error:', error)
            return null
        }
    }

    remove(key: string): void {
        const namespacedKey = this.getNamespacedKey(key)
        localStorage.removeItem(namespacedKey)
    }

    clear(): void {
        if (this.namespace) {
            this.clearNamespace()
        } else {
            localStorage.clear()
        }
    }

    clearNamespace(): void {
        Object.keys(localStorage)
            .filter((key) => key.startsWith(this.namespace))
            .forEach((key) => localStorage.removeItem(key))
    }
}
