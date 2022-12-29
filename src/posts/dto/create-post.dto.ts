import { IsArray, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { CreateCategoryDto } from "./create-category.dto";

export class CreatePostDto {
    @IsString()
    @IsNotEmpty()
    readonly title: string;

    @IsString()
    readonly subtitle: string;

    @IsString()
    @IsNotEmpty()
    readonly body: string;

    @IsOptional()
    @IsArray()
    readonly categories: Array<number>

    @IsOptional()
    @IsArray()
    readonly files: Array<string>
}
