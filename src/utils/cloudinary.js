import {v2 as cloudinary} from "cloudinary"
import fs from "fs"

// Configuration
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});


const uploadOnCloudinary  = async (filePath) => {
    try {
        if(!filePath) return null

        const response = await cloudinary.uploader.upload(filePath,
            {
                resource_type: "auto",
            }
        )

        console.log(`File uploaded on Cloudinary ${response}`);
        return response;

    } catch (error) {
        fs.unlinkSync(filePath); // Delete the file from the server if it is not uploaded on Cloudinary 
    } 
}



// Upload an image
const uploadResult = await cloudinary.uploader.upload("https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg", {
    public_id: "shoes"
}).catch((error)=>{console.log(error)});

console.log(uploadResult);