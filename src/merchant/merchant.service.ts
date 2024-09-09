// merchant.service.ts  
import { Injectable } from '@nestjs/common';  
import { CreateMerchantDto, UpdateMerchantDto } from './dtos/merchant.dto';  

@Injectable()  
export class MerchantService {  
  private merchants = []; // This could be a database in a real application  

  create(createMerchantDto: CreateMerchantDto) {  
    const newMerchant = { id: Date.now(), ...createMerchantDto };  
    this.merchants.push(newMerchant);  
    return newMerchant;  
  }  

  findAll() {  
    return this.merchants;  
  }  

  findOne(id: number) {  
    return this.merchants.find(merchant => merchant.id === id);  
  }  

  update(id: number, updateMerchantDto: UpdateMerchantDto) {  
    const merchantIndex = this.merchants.findIndex(merchant => merchant.id === id);  
    if (merchantIndex >= 0) {  
      this.merchants[merchantIndex] = { ...this.merchants[merchantIndex], ...updateMerchantDto };  
      return this.merchants[merchantIndex];  
    }  
    return null;  
  }  

  remove(id: number) {  
    const merchantIndex = this.merchants.findIndex(merchant => merchant.id === id);  
    if (merchantIndex >= 0) {  
      const removedMerchant = this.merchants.splice(merchantIndex, 1);  
      return removedMerchant[0];  
    }  
    return null;  
  }  
}