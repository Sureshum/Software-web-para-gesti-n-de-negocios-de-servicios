import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('service_orders')
export class ServiceOrder {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'tenant_id' })
  tenantId: number;

  @Column({ name: 'client_id', nullable: true })
  clientId: number;

  @Column({ name: 'assigned_to', nullable: true })
  assignedTo: number;

  @Column({ type: 'enum', enum: ['pending', 'in_progress', 'completed', 'cancelled'], default: 'pending' })
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';

  @Column({ type: 'text' })
  description: string;

  @Column({ name: 'total_cost', type: 'decimal', precision: 10, scale: 2, default: 0.00 })
  totalCost: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}