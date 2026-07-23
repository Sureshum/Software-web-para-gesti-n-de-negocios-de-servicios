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

    return orders.map(order => {
      // Función para extraer el nombre limpio de cualquier formato
      const getCleanName = (value: any): string => {
        if (!value) return 'Sin asignar';
        
        // Si es un objeto con propiedad name
        if (typeof value === 'object' && value.name) {
          return value.name;
        }
        
        // Si es un string, limpiar prefijos
        if (typeof value === 'string') {
          let clean = value
            .replace(/^Cliente\s*#\s*/, '')
            .replace(/^Usuario\s*#\s*/, '')
            .replace(/^Cliente#/, '')
            .replace(/^Usuario#/, '')
            .replace(/^#/, '')
            .trim();
          return clean || value;
        }
        
        return String(value);
      };

      // Obtener nombres limpios
      let clientName = 'Sin cliente';
      let userName = 'Sin asignar';

      // Si client es un objeto
      if (order.client) {
        if (typeof order.client === 'object' && order.client.name) {
          clientName = order.client.name;
        } else if (typeof order.client === 'string') {
          clientName = getCleanName(order.client);
        } else {
          clientName = String(order.client);
        }
      }

      // Si user es un objeto
      if (order.user) {
        if (typeof order.user === 'object' && order.user.name) {
          userName = order.user.name;
        } else if (typeof order.user === 'string') {
          userName = getCleanName(order.user);
        } else {
          userName = String(order.user);
        }
      }

      return {
        id: order.id,
        tenantId: order.tenantId,
        clientId: clientName,
        assignedTo: userName,
        status: order.status,
        description: order.description,
        totalCost: order.totalCost,
        createdAt: order.createdAt,
      };
    });
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
