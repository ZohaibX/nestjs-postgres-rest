import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthService } from './auth.service';
import { User } from './auth.entity';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    signUp(authCredentialsDto: AuthCredentialsDto): Promise<{
        signToken: string;
    }>;
    signIn(authCredentialsDto: AuthCredentialsDto): Promise<{
        signToken: string;
    }>;
    test(user: User): void;
}
