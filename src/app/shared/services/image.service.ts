import { ApiService } from '@core/services/api.service';

export interface SignedUrlResponse {
  signedRequest: string;
  url: string;
}

export class ImageService {
  private http = new ApiService();

  async getSignedUrl(
    typeUpload: string,
    fileName: string,
    fileType: string
  ): Promise<SignedUrlResponse> {
    const params = {
      type_upload: typeUpload,
      file_name: encodeURIComponent(fileName),
      file_type: encodeURIComponent(fileType),
    };

    const res = (await this.http.get(['/signatures'], params, {
      requiresAuth: true,
    })) as SignedUrlResponse;

    return res;
  }

  async uploadToS3(signedUrl: string, file: File): Promise<void> {
    const uploadRes = await fetch(signedUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': file.type,
      },
      body: file,
    });

    if (!uploadRes.ok) {
      const errText = await uploadRes.text();
      console.error('Upload to S3 failed:', errText);
      throw new Error('Upload to S3 failed');
    }
  }
}
