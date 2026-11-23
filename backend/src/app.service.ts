import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createPool, Pool, PoolConnection, ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { compare } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { access } from 'fs';

@Injectable()
export class AppService {
  private readonly pool:Pool;

  constructor(
    private readonly configService: ConfigService, 
    private readonly jwtService: JwtService
  ) {
    this.pool = createPool ({
      host: this.configService.getOrThrow<string>('DB_HOST'),
      port: Number(this.configService.getOrThrow<string>('DB_PORT')),
      user: this.configService.getOrThrow<string>('DB_USER'),
      password: this.configService.getOrThrow<string>('DB_PASSWORD'),
      database: this.configService.getOrThrow<string>('DB_NAME'),
    })
  }

  async onModuleInit() {
    await this.pool.query('SELECT 1');
    console.log('DATABASE CONNECTED')
  }
   
  getHello(): string {
    return 'Clicknext API';
  }

  async login(email: string, password: string): Promise<false | {access_token: string}>{
    const [rows] = await this.pool.execute<RowDataPacket[]>(
      'SELECT * FROM USERS WHERE email = ?', [email]
    )
    const user = rows[0];
    if (!user) {
      return false ;
    }

    const isPasswordValid = await compare(password, user.password_hash) ;
    if (!isPasswordValid) {
      return false;
    }
    const token = await this.jwtService.signAsync({ sub: user.id });
    return { access_token: token }
  } 

  async gettransactions(userId: number) {
    const [rows] = await this.pool.execute<RowDataPacket[]>(
      `SELECT transactions.*, users.email
      FROM transactions
      JOIN users ON transactions.user_id = users.id
      WHERE transactions.user_id = ?
      ORDER BY transactions.id DESC`, [userId]
    );
    return rows.map(row => ({
      ...row, amount: Number(row.amount)
    }));
  }

  async creatTransaction(userId: number, type: string, amount: number) {
    if( type !== 'deposit' && type !== 'withdraw') {
    throw new BadRequestException('ประเภทต้องเป็น deposit หรือ withdraw');
  }

  if (
    typeof amount !== 'number' || !Number.isFinite(amount) || amount < 0 || amount > 100000 ) 
   {
    throw new BadRequestException('จำนวนเงินต้องเป็นตัวเลข 0-100000')
  }

  if (type === 'withdraw') {
  const { balance } = await this.getBalance(userId);

  if (amount > balance) {
    throw new BadRequestException('ยอดเงินไม่เพียงพอ');
  }
  }

    const [rows] = await this.pool.execute<ResultSetHeader> (
      'INSERT INTO transactions (user_id, type, amount) values (?,?,?)', [userId, type, amount]
    );
    return {id: rows.insertId}
  }

  async updateTransaction(userId: number, id: number, amount: number)
  {
    if (
      typeof amount !== 'number' || !Number.isFinite(amount) || amount < 0 || amount > 100000
    ) {
      throw new BadRequestException('จำนวนเงินต้องเป็นตัวเลข 0-100000')
    }
    const [rows] = await this.pool.execute<RowDataPacket[]>(
    'SELECT type, amount FROM transactions WHERE id = ? AND user_id = ?',
    [id, userId]
    );

    const item = rows[0];

    if (!item) {
    throw new BadRequestException('ไม่พบรายการ');
    }

    const { balance } = await this.getBalance(userId);
    const oldAmount = Number(item.amount);

    const newBalance = item.type === 'deposit'
      ? balance - oldAmount + amount
      : balance + oldAmount - amount;

    if (newBalance < 0) {
      throw new BadRequestException('แก้ไขไม่ได้ เพราะยอดเงินจะติดลบ');
    }

    const [result] = await this.pool.execute<ResultSetHeader> (
      'UPDATE transactions SET amount = ? where id = ? AND user_id = ?', [amount, id, userId]
    );
    return { updated: result.affectedRows}
  }

  async getBalance(userId: number) {
    const [rows] = await this.pool.execute<RowDataPacket[]> (
      `SELECT COALESCE(
       SUM(CASE
         WHEN type = 'deposit' THEN amount
         ELSE -amount
       END), 0
     ) AS balance
     FROM transactions
     WHERE user_id = ?`,
    [userId]
    );
    console.log(rows)
    return { balance: Number(rows[0].balance)}
  }

  async deleteTransaction(userId: number, id: number) {
    const [rows] = await this.pool.execute<RowDataPacket[]>(
    'SELECT type, amount FROM transactions WHERE id = ? AND user_id = ?',
    [id, userId]
    );

    const item = rows[0];

    if (!item) {
      throw new BadRequestException('ไม่พบรายการ');
    }

    const { balance } = await this.getBalance(userId);

    if (item.type === 'deposit' && balance < Number(item.amount)) {
      throw new BadRequestException('ลบไม่ได้ เพราะยอดเงินจะติดลบ');
    }

    const [result] = await this.pool.execute<ResultSetHeader> (
      'DELETE FROM transactions WHERE id = ? AND user_id = ?', [id, userId]
    );
    return { deleted : result.affectedRows};
  }
}
