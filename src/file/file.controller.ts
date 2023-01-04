import { Bind, Controller, Get, NotFoundException, Param, Post, Res, StreamableFile, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { createReadStream, createWriteStream, existsSync, fstat, lstatSync, mkdirSync, readdir, rename, writeFileSync } from 'fs';
import { join } from 'path';
import { diskStorage } from 'multer'
import { FileService } from './file.service';



@Controller('file')
export class FileController {
    constructor(private readonly fileService: FileService) { }

    @Get('post/:postId/thumbnail')
    getPostThumbnail(@Param('postId') postId: string, @Param('fileName') fileName: string): StreamableFile | NotFoundException {
        const filePath = this.fileService.getThumbnailOrSubstitute(postId)

        if (filePath === 'there is no file') {
            throw new NotFoundException('there is no File')
        } else {
            const file = createReadStream(join(process.cwd(), filePath));
            return new StreamableFile(file)
        }
    }

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
                if (!existsSync('post_files/temp/')) {
                    mkdirSync('post_files/temp/');
                }

                callback(null, file.originalname)
            },
        })
    }))

    uploadPostFile(@UploadedFiles() files: Array<Express.Multer.File>) {
        return this.fileService.uploadPostFiles(files);
    }
}
