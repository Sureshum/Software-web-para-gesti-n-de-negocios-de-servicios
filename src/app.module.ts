import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TenantsModule } from './tenants/tenants.module';
import { UsersModule } from './users/users.module';
import { ClientsModule } from './clients/clients.module';
import { InventoryModule } from './inventory/inventory.module';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: (globalThis as any).process?.env?.DB_HOST || 'localhost',
      port: Number((globalThis as any).process?.env?.DB_PORT) || 3306,
      username: (globalThis as any).process?.env?.DB_USER || 'root', 
      password: (globalThis as any).process?.env?.DB_PASSWORD || 'Sebashum.12.', 
      database: (globalThis as any).process?.env?.DB_NAME || 'saas', 
      autoLoadEntities: true, 
      synchronize: true, 
      ssl: (globalThis as any).process?.env?.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
    }),
    
    TenantsModule,
    UsersModule,
    ClientsModule,
    InventoryModule,
    OrdersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
