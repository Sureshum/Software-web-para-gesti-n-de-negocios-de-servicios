import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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
    return this.findOne(id); // Retorna el registro actualizado
  }

  async findAll(): Promise<Client[]> {
    return await this.clientRepository.find();
  }

  async findOne(id: number): Promise<Client> {
    return await this.clientRepository.findOneBy({ id });
  }

  async remove(id: number) {
    const result = await this.clientRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Cliente con ID ${id} no encontrado`);
    }
    return { message: 'Cliente eliminado exitosamente' };
  }

}