import { Injectable } from "@nestjs/common";
import { LoggerService } from "@logger";

@Injectable()
export class LoginRepository {
    private context = LoginRepository.name;
    constructor(
        private readonly loggerService: LoggerService,
    ) { }
}