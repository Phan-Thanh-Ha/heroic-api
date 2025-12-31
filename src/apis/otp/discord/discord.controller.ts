import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DiscordService } from './discord.service';
import { CreateDiscordDto } from './dto/create-discord.dto';
import { UpdateDiscordDto } from './dto/update-discord.dto';

@Controller('discord')
export class DiscordController {
  constructor(private readonly discordService: DiscordService) {}

  
}
