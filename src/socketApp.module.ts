import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ChatModule } from './chat/chat.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: process.env.NODE_ENV === 'development' ? '.development.env' : '.production.env',
            isGlobal: true,
        }),
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: process.env.host,
            port: parseInt(process.env.port),
            username: process.env.username,
            password: process.env.password,
            database: process.env.database,
            // entities: [Post, Category, File],
            autoLoadEntities: true,
            synchronize: false,
            timezone: 'Asia/Seoul'
        }),
        ChatModule
    ],
})

export class SocketAppModule {
}
