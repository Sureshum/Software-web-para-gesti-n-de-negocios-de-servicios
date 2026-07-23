import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inventory } from './entities/inventory.entity';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Inventory)
    private readonly inventoryRepository: Repository<Inventory>,
  ) {}

  async create(createInventoryDto: CreateInventoryDto) {
    const item = this.inventoryRepository.create(createInventoryDto);
    await this.inventoryRepository.save(item);
    return {
      message: 'Insumo de inventario guardado exitosamente',
      item,
    };
  }

  async update(id: number, updateDto: any) {
    const result = await this.inventoryRepository.update(id, updateDto);
    if (result.affected === 0) {
      throw new NotFoundException(`Registro con ID ${id} no encontrado`);
    }
    return this.findOne(id);
  }

  async findAll(): Promise<Inventory[]> {
    return await this.inventoryRepository.find();
  }

  async findOne(id: number): Promise<Inventory> {
    return await this.inventoryRepository.findOneBy({ id });
  }

  async remove(id: number) {
    const result = await this.inventoryRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Registro con ID ${id} no encontrado`);
    }
    return { message: 'Registro eliminado exitosamente' };
  }
}