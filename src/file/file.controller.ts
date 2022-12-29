import { Bind, Controller, Get, Param, Post, Res, StreamableFile, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { createReadStream, createWriteStream, rename, writeFileSync } from 'fs';
import { join } from 'path';
import { diskStorage } from 'multer'



@Controller('file')
export class FileController {
    @Get('post/:postId/:fileName')
    getPostFile(@Param('postId') postId: string, @Param('fileName') fileName: string): StreamableFile {
        const file = createReadStream(join(process.cwd(), `post_files/${postId}/${fileName}`));
        return new StreamableFile(file);
    }

    @Post('post')
    @UseInterceptors(FilesInterceptor('file', null, {
        storage: diskStorage({
            destination: join(process.cwd(), 'post_files/temp/'),
            filename(req, file, callback) {
                console.log(req.params.path)
                console.log('file.originalname', file.originalname)

                callback(null, file.originalname)
            },
        })
    }))
    uploadPostFile(@UploadedFiles() files: Array<Express.Multer.File>) {
        const response = [];

        files.forEach(file => {
            const fileReponse = {
                filename: file.filename,
            };
            response.push(fileReponse);
        });

        return response;
    }
}
