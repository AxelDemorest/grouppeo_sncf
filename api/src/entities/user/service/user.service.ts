import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { userDTO } from '../models/user.dto';
import { User } from '../models/user.entity';
import { generate } from 'generate-password';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  // TODO : Envoyer le mot de passe par mail
  async createUser(user: userDTO): Promise<User> {
    const password = generate({
      length: 10,
      numbers: true,
    });
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password, salt);
    user.user_password = hash;
    const createUser = this.usersRepository.create(user);
    await this.usersRepository.save(createUser);
    return createUser;
  }

  async getUserByEmail(email: string): Promise<User> {
    return await this.usersRepository.findOneBy({ user_mail: email });
  }

  async getUsers(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async updateUser(user_id: number, data: userDTO): Promise<User> {
    const user = await this.usersRepository.findOneBy({ user_id: user_id });

    if (!user) {
      throw new NotFoundException(`Group with ID=${user_id} not found`);
    }

    delete data.user_id;

    await this.usersRepository.update(user_id, data);

    return data;
  }

  async removeUser(id: string): Promise<any> {
    return this.usersRepository
      .createQueryBuilder()
      .delete()
      .from(User)
      .where('user_id = :id', { id })
      .execute();
  }
}
