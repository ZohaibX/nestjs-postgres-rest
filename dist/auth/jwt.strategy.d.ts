import { Strategy } from 'passport-jwt';
import { UserRepository } from './auth.repository';
import { JwtPayload } from './jwt-payload.interface';
import { User } from './auth.entity';
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private userRepo;
    constructor(userRepo: UserRepository);
    validate(payload: JwtPayload): Promise<User>;
}
export {};
