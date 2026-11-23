import { Controller, Get, Post, Body, UseGuards, Req, Param, ParseIntPipe, Patch, Delete} from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from './auth.guard';
import type { Request } from 'express';
import { request } from 'http';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('hello')
  getHello(): string {
    return this.appService.getHello();
  }  
  @Post('login')
  login(
    @Body('email') email: string,
    @Body('password') password: string
  ): Promise<false | {access_token: string}> {
    return this.appService.login(email, password);
  }

  @Get('me')
  @UseGuards(AuthGuard)
  getme(@Req() request: Request & { user: {sub: number} }) {
    return { id: request.user.sub}
  }

  @Get('transactions')
  @UseGuards(AuthGuard)
  gettransactions(
    @Req() request: Request & { user: { sub: number } }
  ) {
    return this.appService.gettransactions(request.user.sub);
  }

  @Post('transactions')
  @UseGuards(AuthGuard)
  createTransactions(
    @Body('type') type: string,
    @Body('amount') amount: number,
    @Req() request: Request & {user: { sub: number }}
  ) {
    return this.appService.creatTransaction(request.user.sub, type, amount);
  }

  @Get('balance')
  @UseGuards(AuthGuard)
  getBalance(
    @Req() request: Request & {user: {sub: number}}
  ) {
    return this.appService.getBalance(request.user.sub)
  }

  @Patch('transactions/:id')
  @UseGuards(AuthGuard)
  updateTransactions(
    @Param('id', ParseIntPipe) id: number,
    @Body('amount') amount: number,
    @Req() request: Request & {user: {sub: number}}
  ) {
    return this.appService.updateTransaction( request.user.sub, id, amount)
  }

  @Delete('transactions/:id')
  @UseGuards(AuthGuard)
  deleteTransactions( 
    @Param('id', ParseIntPipe) id: number,
    @Req() request: Request & {user: {sub: number}}
  ) {
  return this.appService.deleteTransaction( request.user.sub, id );
  }
}
