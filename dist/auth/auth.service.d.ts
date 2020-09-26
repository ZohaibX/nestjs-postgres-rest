import { JwtService } from '@nestjs/jwt';
import { UserRepository } from './auth.repository';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
export declare class AuthService {
    private userRepo;
    private jwtService;
    private logger;
    constructor(userRepo: UserRepository, jwtService: JwtService);
    signUp(authCredentialsDto: AuthCredentialsDto): Promise<{
        signToken: string;
    }>;
    signIn(authCredentialsDto: AuthCredentialsDto): Promise<{
        signToken: string;
    }>;
}
