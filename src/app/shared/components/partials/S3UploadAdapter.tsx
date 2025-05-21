import { ImageService } from '@shared/services/image.service';

export class S3UploadAdapter {
  loader: any;
  imageService = new ImageService();

  constructor(loader: any) {
    this.loader = loader;
  }

  async upload() {
    try {
      const file = await this.loader.file;

      const { signedRequest, url: accessUrl } =
        await this.imageService.getSignedUrl(
          'cover-post',
          file.name,
          file.type
        );

      await this.imageService.uploadToS3(signedRequest, file);

      return {
        default: accessUrl,
      };
    } catch (error) {
      console.error('S3 Upload Adapter Error:', error);
      throw error;
    }
  }

  abort() {}
}
