import { IsNotEmpty, IsNumber } from 'class-validator';

export class AssignAgentDto {
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsNotEmpty()
  agentNumber: number;

  @IsNotEmpty()
  day: string;
}
