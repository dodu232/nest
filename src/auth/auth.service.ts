import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRpository } from './user.repository';
import { AuthCredentialsDto } from './dto/auth-credential.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRpository,
    private jwtService: JwtService,
  ) {}

  async signUp(auth: AuthCredentialsDto): Promise<void> {
    return this.userRepository.createUser(auth);
  }

  async signIn(auth: AuthCredentialsDto): Promise<{ accessToken: string }> {
    const { username, password } = auth;
    const user = await this.userRepository.findOne(username);

    if (user && (await bcrypt.compare(password, user.password))) {
      // 유저 토큰 생성 (secret + payload)
      const payload = { username };
      const accessToken = await this.jwtService.sign(payload);

      return { accessToken };
    } else {
      throw new UnauthorizedException('login failed');
    }
  }
}
