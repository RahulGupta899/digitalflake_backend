import crypto from 'crypto'

export const encrypt = (rawdata)=>{
    if (!rawdata) return "";
    try {
        const cipher = crypto.createCipheriv(process.env.CRYPTO_ENC_ALGO,
            process.env.SECRET_KEY,
            process.env.INIT_VECTOR);
        let encryptedData = cipher.update(rawdata, "utf-8", "hex");
        encryptedData += cipher.final('hex');
        return encryptedData;
    }catch (e) {
        console.log(e)
        return "";
    }
}

export const decrypt = (encryptdata)=>{
    if (!encryptdata) return "";
    try {
        const cipher = crypto.createDecipheriv(process.env.CRYPTO_ENC_ALGO, process.env.SECRET_KEY, process.env.INIT_VECTOR);
        let decryptedData = cipher.update(encryptdata, "hex", "utf-8");
        decryptedData += cipher.final('utf-8');
        return decryptedData;
    } catch (e) {
        this.log(e.stack, "DECRYPT001");  
        return "";
    }
}