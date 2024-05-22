import { DeleteResult, Repository } from 'typeorm';
import { Board } from './board.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';
import { BoardStatus } from './board-status.enum';
import { threadId } from 'worker_threads';
import { User } from 'src/auth/user.entity';

@Injectable()
export class BoardRepository {
  constructor(
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,
  ) {}

  async create(dto: CreateBoardDto, user: User): Promise<Board>{
    const {title, description} = dto;

    const board = this.boardRepository.create({
        title,
        description,
        status: BoardStatus.PUBLIC,
        user
    });

    return await this.boardRepository.save(board);
  }

  async findOneBy(id : number): Promise<Board>{
    return this.boardRepository.findOneBy({id});
  }

  async findAll(user: User): Promise<Board[]>{
    const query = this.boardRepository.createQueryBuilder('board');

    query.where('board.userId = :userId', {userId: user.id});

    return await query.getMany();
  }

  async update(id: number, dto: CreateBoardDto): Promise<Board>{
    const {title, description} = dto;

    const board = this.boardRepository.create({
        title,
        description,
        status: BoardStatus.PUBLIC
    });

    this.boardRepository.update(id, board);

    return board;
  }

  async updateStatus(id: number, status: BoardStatus): Promise<Board>{
    const board  = await this.findOneBy(id);
    board.status = status;
    await this.boardRepository.save(board);

    return board;
  }

  async delete(id: number, user: User): Promise<DeleteResult>{
    return this.boardRepository.delete({id, user});
  }
}
