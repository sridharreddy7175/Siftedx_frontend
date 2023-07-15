import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import AWS from "aws-sdk";
import { AwsFolderInfo } from "../model/utility";

export class S3Helper {
  constructor() {
    AWS.config.update({
      accessKeyId: 'AKIA36DQ3R5EM7XK5YMI',
      secretAccessKey: "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",
    });
  }

  static async uploadFile(file: any, progressCB: (progress: any) => void, awsInfo: AwsFolderInfo): Promise<any> {
    const target = {
      Bucket: 'shiftedx-data',// awsInfo?.bucketName,
      Key: `${awsInfo.folderPath}/${file?.name}`,
      Body: file,
      ACL: "public-read",
    };
    const parellelUpload = new Upload({
      client: new S3Client({
        region: "us-east-1",
        credentials: {
          accessKeyId: 'AKIA36DQ3R5EM7XK5YMI',
          secretAccessKey: '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',
        },
      }),
      leavePartsOnError: false,
      params: target,
    });
    parellelUpload.on("httpUploadProgress", progressCB);
    const result = await parellelUpload.done();
    return result;
  }
  static async uploadFilesToS3BySigned(signedUrl: any, file: any, fileType: any) {
    try {
      const formData = new FormData();
      formData.append('Content-Type', fileType);
      formData.append('file', file);
      const myHeaders = new Headers({ 'Content-Type': fileType });
      const response = await fetch(signedUrl, {
        method: 'PUT',
        headers: myHeaders,
        body: file
      });
      return response;
    } catch (err) {
      return '';
    }
  }
}
