import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { GeneralResponse } from '../models/general-response';
import { User } from '../models/user';
import PasswordUtil from '../utils/password-util';

@Injectable()
export class UsersService {
  protected users;

  constructor() {
    this.users = [];
  }

  async saveUser(user: User): Promise<GeneralResponse> {
    let oldUser;
    if (user.email) {
      oldUser = await this.searchUserByEmail(user.email);
    }

    if (oldUser) {
      throw new HttpException(
        'Error saving user, the user already exists',
        HttpStatus.CONFLICT,
      );
    }

    user.password = await PasswordUtil.encryptPassword(user.password);
    this.users.push(user);

    return {
      statusCode: HttpStatus.CREATED,
      data: user,
    };
  }

  async updateUser(user: User): Promise<GeneralResponse> {
    if (user.email) {
      const oldUser = await this.searchUserByEmail(user.email);
      const index = await this.searchUserIndexByEmail(user.email);
      const newUser = Object.assign(oldUser, user);

      this.users[index] = newUser;

      return {
        statusCode: HttpStatus.OK,
        data: newUser,
      };
    } else {
      throw new HttpException('Error updating user', HttpStatus.CONFLICT);
    }
  }

  async deleteUser(userEmail: string): Promise<GeneralResponse> {
    if (userEmail) {
      const index = this.searchUserIndexByEmail(userEmail);

      this.users.splice(index);

      return {
        statusCode: HttpStatus.OK,
        data: {},
      };
    }
  }

  async getUsers(): Promise<GeneralResponse> {
    return {
      statusCode: HttpStatus.OK,
      data: this.users,
    };
  }

  async getUserByEmail(userEmail: string): Promise<GeneralResponse> {
    const user = this.searchUserByEmail(userEmail);

    if (!user) {
      throw new HttpException(
        'Error getting user, the user does not exists',
        HttpStatus.CONFLICT,
      );
    }

    return {
      statusCode: HttpStatus.OK,
      data: user,
    };
  }

  searchUserByEmail(userEmail: string) {
    return this.users.find(({ email }) => email === userEmail);
  }

  searchUserIndexByEmail(userEmail: string) {
    return this.users.findIndex(({ email }) => email === userEmail);
  }
}
