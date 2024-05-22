import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';
import { Board } from './board.entity';
import { BoardRepository } from './board.repository';
import { BoardStatus } from './board-status.enum';
import { User } from 'src/auth/user.entity';

@Injectable()
export class BoardsService {
  constructor(private readonly boardRepository: BoardRepository) {}

  createBoard(dto: CreateBoardDto, user: User): Promise<Board> {
    return this.boardRepository.create(dto, user);
  }

  async getBoardById(id: number): Promise<Board> {
    const found = await this.boardRepository.findOneBy(id);
    if (!found) {
      throw new NotFoundException(`Can't find Board with id ${id}`);
    }

    return found;
  }

  async getAllBoards(user: User): Promise<Board[]> {
    const board: Board[] = await this.boardRepository.findAll(user);
    if (!board) {
      throw new NotFoundException(`Can't find Board`);
    }
    return board;
  }

  async updateBoard(id: number, dto: CreateBoardDto): Promise<Board> {
    const found = await this.boardRepository.findOneBy(id);
    if (!found) {
      throw new NotFoundException(`Can't find Board with id ${id}`);
    }

    return this.boardRepository.update(id, dto);
  }

  async updateBoardStatus(id: number, status: BoardStatus): Promise<Board> {
    return await this.boardRepository.updateStatus(id, status);
  }

  async deleteBoard(id: number, user: User): Promise<void> {
    const result = await this.boardRepository.delete(id, user);

    if(result.affected === 0){
      throw new NotFoundException(`Can't find Board with id ${id}`);
    }
  }
}
