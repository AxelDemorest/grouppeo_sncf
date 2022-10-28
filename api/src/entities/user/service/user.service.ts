import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { userDTO } from "../models/user.dto";
import { User } from "../models/user.entity";
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private usersRepository: Repository<User>,
    ) {}

    async createUser(user: userDTO): Promise<User> {
        const salt = await bcrypt.genSalt();
        const hash = await bcrypt.hash(user.user_password, salt);
        user.user_password = hash;
        const createUser = this.usersRepository.create(user);
        await this.usersRepository.save(createUser);
        return createUser;
    }

    async getUserByEmail(email: string): Promise<User> {
        return await this.usersRepository.findOneBy({ user_mail: email });
    }
}