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
      host: 'localhost',
      port: 3306,
      username: 'root', 
      password: 'Sebashum.12.', 
      database: 'saas', 
      autoLoadEntities: true, 
      synchronize: true, 
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