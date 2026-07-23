export class OrderResponseDto {
  id: number;
  tenantId: number;
  clientId: string | number;
  assignedTo: string | number;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  description: string;
  totalCost: number;
  createdAt: Date;
}
