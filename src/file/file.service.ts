import { Injectable } from '@nestjs/common';
import { existsSync, readdirSync } from 'fs';

@Injectable()
export class FileService {
    getThumbnailOrSubstitute(postId: string): string {
        if (existsSync(`post_files/${postId}/`)) {
            if (existsSync(`post_files/${postId}/thumbnail`)) {
                return `post_files/${postId}/thumbnail`;
            } else {
                const files = readdirSync(`post_files/${postId}/`)
                if (files && files.length > 0) {
                    return `post_files/${postId}/${files[0]}`;
                } else {
                    return 'there is no file'
                }
            }
        } else {
            return 'there is no file'
        }

    }
    uploadPostFiles(files: Array<Express.Multer.File>) {
        const response = [];
        files.forEach(file => {
            const fileReponse = {
                filename: file.filename,
            };
            response.push(fileReponse);
        });
        return response
    }
}
