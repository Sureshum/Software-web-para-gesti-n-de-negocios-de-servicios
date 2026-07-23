import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServiceOrder } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';

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

  async findAll() {
    const orders = await this.orderRepository.find({
      relations: ['client', 'user', 'tenant'],
    });
  
    // Mapeamos para asegurar una estructura plana y segura para el frontend
    return orders.map(order => ({
      ...order,
      clientName: order.client?.name || `Cliente #${order.clientId}`,
      userName: order.user?.name || `Usuario #${order.assignedTo}`,
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
