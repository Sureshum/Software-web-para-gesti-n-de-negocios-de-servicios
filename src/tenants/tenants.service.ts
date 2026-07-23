import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tenant } from './entities/tenant.entity';
import { CreateTenantDto } from './dto/create-tenant.dto';

@Injectable()
export class TenantsService {
  constructor(
    @InjectRepository(Tenant)
    private readonly tenantRepository: Repository<Tenant>,
  ) {}

  async create(createTenantDto: CreateTenantDto) {
    try {
      const tenant = this.tenantRepository.create(createTenantDto);
      await this.tenantRepository.save(tenant);
      
      return {
        message: 'Negocio guardado exitosamente',
        tenant,
      };
    } catch (error: any) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('El subdominio ya está registrado');
      }
      throw error;
    }
  }

  async findAll(): Promise<Tenant[]> {
    return await this.tenantRepository.find();
  }

  async findOne(id: number): Promise<Tenant> {
    return await this.tenantRepository.findOneBy({ id });
  }

  async remove(id: number) {
    const result = await this.tenantRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Tenant con ID ${id} no encontrado`);
    }
    return { message: 'Negocio eliminado exitosamente' };
  }

  async update(id: number, updateDto: any) {
  const result = await this.tenantRepository.update(id, updateDto);
  if (result.affected === 0) {
    throw new NotFoundException(`Registro con ID ${id} no encontrado`);
  }
  return this.findOne(id);
}
}