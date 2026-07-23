import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from './entities/client.entity';
import { CreateClientDto } from './dto/create-client.dto';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) {}

  async create(createClientDto: CreateClientDto) {
    const client = this.clientRepository.create(createClientDto);
    await this.clientRepository.save(client);
    return {
      message: 'Cliente guardado exitosamente',
      client,
    };
  }

  async update(id: number, updateDto: any) {
    const result = await this.clientRepository.update(id, updateDto);
    if (result.affected === 0) {
      throw new NotFoundException(`Registro con ID ${id} no encontrado`);
    }
    return this.findOne(id);
  }

  async findAll() {
    const clients = await this.clientRepository.find({
      relations: ['tenant'],
    });
    
    return clients.map(client => ({
      id: client.id,
      tenantId: client.tenant?.name || client.tenantId || 'Sin negocio',
      name: client.name,
      phone: client.phone,
      email: client.email,
      createdAt: client.createdAt,
    }));
  }

  async findOne(id: number): Promise<any> {
    const client = await this.clientRepository.findOne({
      where: { id },
      relations: ['tenant'],
    });
    if (!client) {
      throw new NotFoundException(`Cliente con ID ${id} no encontrado`);
    }
    
    return {
      id: client.id,
      tenantId: client.tenantId,
      name: client.name,
      phone: client.phone,
      email: client.email,
      createdAt: client.createdAt,
    };
  }

  async remove(id: number) {
    const result = await this.clientRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Cliente con ID ${id} no encontrado`);
    }
    return { message: 'Cliente eliminado exitosamente' };
  }
}
