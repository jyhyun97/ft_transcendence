import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { StatsService } from './stats.service';
import { CreateStatDto } from './dto/create-stat.dto';
import { UpdateStatDto } from './dto/update-stat.dto';
import { IsInt, IsNumber, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { AuthGuard } from 'src/auth/auth.guard';

class GetRankingQuery
{
	@IsOptional()
	@Type(() => Number)
	@IsInt()
	@Min(1)
	n : number;
}

@Controller('stat')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

	@Get()
	@UseGuards(AuthGuard)
	getRanking(@Query() query: GetRankingQuery) {
		return this.statsService.getRanking(query.n);
	}

	@Patch(':nickname')
	@UseGuards(AuthGuard)
	update(@Param('nickname') nickName: string, @Body() updateStatDto: UpdateStatDto) {
		return this.statsService.update(nickName, updateStatDto);
	}

//   @Delete(':id')
//   remove(@Param('id') id: string) {
//     return this.statsService.remove(+id);
//   }
	
}
