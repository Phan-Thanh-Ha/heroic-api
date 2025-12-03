import { Injectable, Scope } from '@nestjs/common';
import { format } from 'date-fns';
import { COLOR_ENUM } from '@common';

@Injectable({
	scope: Scope.DEFAULT,
})
export class LoggerService {
	private dateTime = '';
	constructor() {
		this.dateTime = format(new Date(), 'dd/MM/yyyy, hh:mm:ss a');
	}

	async log(context: string, message: string, data?: any) {
		console.log(
			`${COLOR_ENUM.Green}[Server] - ${COLOR_ENUM.Reset}${this.dateTime} - ${COLOR_ENUM.Green}LOG ${COLOR_ENUM.Yellow}[${context}] - ${COLOR_ENUM.Cyan}${message}${COLOR_ENUM.Reset} `,
			data || '',
		);
	}

	async error(context: string, message: string, trace?: any) {
		console.log(
			`${COLOR_ENUM.Green}[Server] - ${COLOR_ENUM.Reset}${this.dateTime} - ${COLOR_ENUM.Red}ERROR ${COLOR_ENUM.Yellow}[${context}] - ${COLOR_ENUM.Cyan}${message}${COLOR_ENUM.Reset} `,
			trace,
		);
	}

	async debug(context: string, message: string, data?: any) {
		console.log(
			`${COLOR_ENUM.Green}[Server] - ${COLOR_ENUM.Reset}${this.dateTime} - ${COLOR_ENUM.Magenta}DEBUG ${COLOR_ENUM.Yellow}[${context}] - ${COLOR_ENUM.Cyan}${message}${COLOR_ENUM.Reset} `,
			data ? JSON.stringify(data) : '',
		);
	}
}
