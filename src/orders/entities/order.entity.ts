import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Client } from '../../clients/entities/client.entity';
import { User } from '../../users/entities/user.entity';

@Entity('service_orders')
export class ServiceOrder {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'tenant_id' })
  tenantId: number;

  @Column({ name: 'client_id', nullable: true })
  clientId: number;

  @ManyToOne(() => Client, { eager: false, nullable: true })
  @JoinColumn({ name: 'client_id' })
  client: Client;

  @Column({ name: 'assigned_to', nullable: true })
  assignedTo: number;

  @ManyToOne(() => User, { eager: false, nullable: true })
  @JoinColumn({ name: 'assigned_to' })
  user: User;

  @Column({ type: 'enum', enum: ['pending', 'in_progress', 'completed', 'cancelled'], default: 'pending' })
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';

  @Column({ type: 'text' })
  description: string;

  @Column({ name: 'total_cost', type: 'decimal', precision: 10, scale: 2, default: 0.00 })
  totalCost: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
