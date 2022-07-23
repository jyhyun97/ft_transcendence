import { Body, Controller, Get, Param, Post, Query, Redirect, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';

@Controller('oauth')
export class AuthController {
	constructor(private readonly authService: AuthService) { }

	@Get('login')
	async saveAccessToken(@Res() res: Response, @Query('code') code: string) {
		console.log("code=", code);
		await this.authService.saveAccessToken(res, code);
	}

	@Redirect('https://api.intra.42.fr/oauth/authorize?client_id=10fd003cd72e573d39cefc1302e9a5c3a9722ad06f7bffe91bf3b3587ace5036&redirect_uri=http%3A%2F%2F10.19.236.57%3A3000%2Foauth%2Flogin&response_type=code', 301)
	@Get('42')
	getOauthPage() {
		console.log("authorization/42");
		return {
		};
	}

	@Post('sendEmail')
	async sendEmail(
		@Param('id') id: string,
		@Body() body,
	): Promise<void> {
		await this.authService.sendEmail(id, body.email);
	}

	@Post('validEmail')
	async validEmail(
		@Param('id') id: string,
		@Body() body,
	): Promise<boolean> {
		return await this.authService.validEmail(id, body.code);
	}
}
