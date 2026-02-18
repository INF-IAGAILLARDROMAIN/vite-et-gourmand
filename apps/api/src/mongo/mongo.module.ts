import { Module, DynamicModule, Logger } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { OrderStat, OrderStatSchema } from './schemas/order-stat.schema.js';
import { MongoService } from './mongo.service.js';

@Module({})
export class MongoModule {
  private static readonly logger = new Logger(MongoModule.name);

  static forRoot(): DynamicModule {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
      this.logger.warn(
        'MONGODB_URI not set — MongoDB features disabled. Stats endpoints will return empty data.',
      );
      return {
        module: MongoModule,
        global: true,
        providers: [MongoService],
        exports: [MongoService],
      };
    }

    return {
      module: MongoModule,
      global: true,
      imports: [
        MongooseModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (config: ConfigService) => ({
            uri: config.get<string>('MONGODB_URI'),
          }),
        }),
        MongooseModule.forFeature([
          { name: OrderStat.name, schema: OrderStatSchema },
        ]),
      ],
      providers: [MongoService],
      exports: [MongoService],
    };
  }
}
