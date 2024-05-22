import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { AuthCredentialsDto } from './dto/auth-credential.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserRpository {
  constructor(
    @InjectRepository(User)
    private readonly userRpository: Repository<User>,
  ) {}

  async createUser(auth: AuthCredentialsDto): Promise<void> {
    const { username, password } = auth;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.userRpository.create({
      username,
      password: hashedPassword,
    });

    try {
      await this.userRpository.save(user);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Existing username');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async findOne(username: string): Promise<User> {
    return await this.userRpository.findOneBy({ username });
  }
}
