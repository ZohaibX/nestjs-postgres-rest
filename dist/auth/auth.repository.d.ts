import { Repository } from 'typeorm';
import { User } from './auth.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
export declare class UserRepository extends Repository<User> {
    signUp(authCredentialsDto: AuthCredentialsDto): Promise<string>;
    validateUserAccount(authCredentialsDto: AuthCredentialsDto): Promise<string>;
}
