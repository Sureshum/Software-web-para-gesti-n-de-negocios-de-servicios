export class CreateOrderDto {
  tenantId: number;
  clientId?: number;
  assignedTo?: number;
  status?: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  description: string;
  totalCost?: number;
}