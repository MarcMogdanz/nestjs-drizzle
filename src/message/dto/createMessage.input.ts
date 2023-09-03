import { IsNotEmpty, IsString } from "class-validator";

export class CreateMessageInput {
  @IsString()
  @IsNotEmpty()
  message: string;
}
