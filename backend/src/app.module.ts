import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { HealthModule } from './modules/health/health.module.js';
import { AuthModule } from './modules/auth/auth.module.js';
import { TasksModule } from './modules/tasks/tasks.module.js';
import { ProjectsModule } from './modules/projects/projects.module.js';
import { getDatabaseConfig } from './config/index.js';

@Module({
  imports: [
    // Load environment variables globally
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Database connection — configured but won't fail if DB is unavailable
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const databaseUrl = configService.get<string>('DATABASE_URL');
        const nodeEnv = configService.get<string>('NODE_ENV', 'development');

        // If no DATABASE_URL is set, use in-memory sqlite
        if (!databaseUrl || databaseUrl.trim() === '') {
          return {
            type: 'better-sqlite3',
            database: ':memory:',
            autoLoadEntities: true,
            synchronize: true,
          } as unknown as TypeOrmModuleOptions;
        }

        return getDatabaseConfig(databaseUrl, nodeEnv);
      },
    }),

    // Feature modules
    HealthModule,
    AuthModule,
    TasksModule,
    ProjectsModule,
  ],
})
export class AppModule {}
