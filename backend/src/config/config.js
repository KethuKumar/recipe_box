

import dotenv from 'dotenv'

dotenv.config()

if(!process.env.MONGO_URI){
    throw new Error("MONGO_URI isn't defined in env")
}
if(!process.env.JWT_SECRET){
    throw new Error("JWT_SECRET isn't defined in env")
}
if(!process.env.PORT){
    throw new Error("PORT isn't defined in env")
}
if(!process.env.IMAGEKIT_PUBLIC_KEY){
    throw new Error("IMAGEKIT_PUBLIC_KEY isn't defined in env")
}
if(!process.env.IMAGEKIT_PRIVATE_KEY){
    throw new Error("IMAGEKIT_PRIVATE_KEY isn't defined in env")
}
if(!process.env.IMAGEKIT_URL_ENDPOINT){
    throw new Error("IMAGEKIT_URL_ENDPOINT isn't defined in env")
}

const config = {
    MONGO_URI:process.env.MONGO_URI,
    JWT_SECRET:process.env.JWT_SECRET,
    IMAGEKIT_PUBLIC_KEY:process.env.IMAGEKIT_PUBLIC_KEY,
    IMAGEKIT_PRIVATE_KEY:process.env.IMAGEKIT_PRIVATE_KEY,
    IMAGEKIT_URL_ENDPOINT:process.env.IMAGEKIT_URL_ENDPOINT
}

export default config