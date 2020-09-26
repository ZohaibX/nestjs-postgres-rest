"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const auth_entity_1 = require("./auth.entity");
const bcrypt = require("bcryptjs");
const common_2 = require("@nestjs/common");
let UserRepository = class UserRepository extends typeorm_1.Repository {
    async signUp(authCredentialsDto) {
        const { username, password } = authCredentialsDto;
        const user = this.create();
        user.username = username;
        user.salt = await bcrypt.genSalt();
        user.password = await bcrypt.hash(password, user.salt);
        try {
            await user.save();
            return user.username;
        }
        catch (error) {
            if (error.code === '23505') {
                throw new common_1.ConflictException('Username already exists');
            }
            else {
                throw new common_1.InternalServerErrorException();
            }
        }
    }
    async validateUserAccount(authCredentialsDto) {
        const { username, password } = authCredentialsDto;
        const user = await this.findOne({ username: username });
        if (!user)
            throw new common_2.NotFoundException('User not found');
        const validatePassword = await user.validatePassword(password);
        if (user && validatePassword)
            return user.username;
        return null;
    }
};
UserRepository = __decorate([
    typeorm_1.EntityRepository(auth_entity_1.User)
], UserRepository);
exports.UserRepository = UserRepository;
//# sourceMappingURL=auth.repository.js.map