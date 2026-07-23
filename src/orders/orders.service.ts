import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServiceOrder } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';

// Definir el tipo de respuesta
type OrderResponse = {
  id: number;
  tenantId: number;
  clientId: string | number;
  assignedTo: string | number;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  description: string;
  totalCost: number;
  createdAt: Date;
};

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(ServiceOrder)
    private readonly orderRepository: Repository<ServiceOrder>,
  ) {}

  create(createOrderDto: CreateOrderDto) {
    const order = this.orderRepository.create(createOrderDto);
    return this.orderRepository.save(order);
  }

  async findAll(): Promise<OrderResponse[]> {
    const orders = await this.orderRepository.find({
      relations: ['client', 'user', 'tenant'],
    });

    return orders.map(order => ({
      id: order.id,
      tenantId: order.tenantId,
      clientId: order.client?.name || order.clientId || 'Sin cliente',
      assignedTo: order.user?.name || order.assignedTo || 'Sin asignar',
      status: order.status,
      description: order.description,
      totalCost: order.totalCost,
      createdAt: order.createdAt,
    }));
  }

  async findOne(id: number): Promise<ServiceOrder> {
    const item = await this.orderRepository.findOne({
      where: { id },
      relations: ['client', 'user', 'tenant'],
    });
    if (!item) {
      throw new NotFoundException(`Orden con ID ${id} no encontrada`);
    }
    return item;
  }

  async update(id: number, updateDto: any) {
    const result = await this.orderRepository.update(id, updateDto);
    if (result.affected === 0) {
      throw new NotFoundException(`Orden con ID ${id} no encontrada`);
    }
    return this.findOne(id);
  }

  async remove(id: number) {
    const result = await this.orderRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Orden de servicio con ID ${id} no encontrada`);
    }
    return { message: 'Orden eliminada exitosamente' };
  }
}
