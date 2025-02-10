import AWS from "aws-sdk";

export interface IMulterFile {
  originalname: string;
  buffer: Buffer;
  mimetype: string;
}

export async function uploadToS3Bucket(
  file: IMulterFile,
  folderName: string
): Promise<string> {
  try {
    if (!file) {
      throw new Error("No file uploaded");
    }

    // Ensure environment variables are available
    if (!process.env.BUCKET_NAME || !process.env.BUCKET_ACCESS_KEY || !process.env.BUCKET_SECRET_ACCESS_KEY || !process.env.BUCKET_REGION) {
      throw new Error("Missing required AWS S3 environment variables.");
    }

    const params: any = {
      Bucket: process.env.BUCKET_NAME,
      Key: `${folderName}s/${Date.now()}_${file.originalname}`,
      Body: file.buffer,
      ContentType: file.mimetype,
      // ACL: "public-read", // Make the file public
    };

    AWS.config.update({
      accessKeyId: process.env.BUCKET_ACCESS_KEY,
      secretAccessKey: process.env.BUCKET_SECRET_ACCESS_KEY,
      region: process.env.BUCKET_REGION,
    });

    console.log("Bucket Name:", process.env.BUCKET_NAME);
    console.log("Access Key:", process.env.BUCKET_ACCESS_KEY);
    console.log("Secret Access Key:", process.env.BUCKET_SECRET_ACCESS_KEY);
    console.log("Region:", process.env.BUCKET_REGION);


    const s3 = new AWS.S3();

    const uploadedResult = await s3.upload(params).promise();

    // Check if the upload result is valid
    if (!uploadedResult || !uploadedResult.Location) {
      throw new Error("Failed to get the uploaded file URL from S3");
    }

    return uploadedResult.Location; // Return the URL of the uploaded file
  } catch (error: any) {
    console.error(`S3 Upload failed: ${error.message}`);
    throw new Error(`S3 Upload failed: ${error.message}`);
  }
}
