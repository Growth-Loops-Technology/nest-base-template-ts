import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { FetchDataModule } from './fetch-data/fetchData.module';
@Module({
  // imports: [UserModule, MongooseModule.forRoot(process.env.MONGO_URI)],
  imports: [
    UserModule,
    FetchDataModule,
    ConfigModule.forRoot({
      isGlobal: true, // This makes the config globally available
    }),
    MongooseModule.forRoot(
      'mongodb+srv://debangshimandal:PY337BRNju0ManTh@aistudio.q7oao.mongodb.net/AIStudioDB',
    ),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
