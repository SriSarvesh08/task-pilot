import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export interface DatabaseConfig {
  type: 'postgres';
  url: string;
  autoLoadEntities: boolean;
  synchronize: boolean;
}

export const getDatabaseConfig = (databaseUrl: string, nodeEnv: string): TypeOrmModuleOptions => ({
  type: 'postgres',
  url: databaseUrl,
  autoLoadEntities: true,
  // Only synchronize in development — use migrations in production
  synchronize: nodeEnv !== 'production',
});
