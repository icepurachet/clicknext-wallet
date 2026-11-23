import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';

@Injectable()
export class AuthGuard {
    constructor (private readonly jwtService: JwtService) {}
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<Request & { user?: {sub: number}}> ();
        const [type, token] = request.headers.authorization?.split(' ') ?? [];

    if (type !== 'Bearer' || !token) {
        throw new UnauthorizedException();
    }

    try {
        request.user = await this.jwtService.verifyAsync<{ sub: number }> (token);
    }catch {
        throw new UnauthorizedException();
    }
    return true;
    }
}