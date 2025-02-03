// src/users/user.repository.ts
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import logger from "../../logger";
import {User} from "./entities/user.entity";

@Injectable()
export class UserRepository {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}


    async create(data: Partial<User>): Promise<User> {
        try {
            logger.info('Creating user with data: ' + JSON.stringify(data));
            const user = this.userRepository.create(data);
            const savedUser = await this.userRepository.save(user);
            logger.info(`User created successfully: ${savedUser.id}`);
            return savedUser;
        } catch (error: any) {
            logger.error('Error creating user: ' + error.message, error.stack);
            throw new Error('Unable to create user');
        }
    }

    async findByEmail(email: string): Promise<User | null> {
        try {
            logger.info(`Finding user by email: ${email}`);
            const user = await this.userRepository.findOneBy({ email });
            logger.info(`User found by email: ${email}`);
            return user;
        } catch (error: any) {
            logger.error('Error finding user by email: ' + error.message, error.stack);
            throw new Error('Unable to find user by email');
        }
    }

    async findOneBy(conditions: Partial<User>): Promise<User | null> {
        try {
            logger.info(`Finding user with conditions: ${JSON.stringify(conditions)}`);
            const user = await this.userRepository.findOneBy(conditions);
            logger.info(`User found with conditions: ${JSON.stringify(conditions)}`);
            return user;
        } catch (error: any) {
            logger.error(`Error finding user with conditions ${JSON.stringify(conditions)}: ${error.message}`, error.stack);
            throw new Error('Unable to find user');
        }
    }

    async save(user: User): Promise<User> {
        try {
            logger.info(`Saving user: ${user.id}`);
            const savedUser = await this.userRepository.save(user);
            logger.info(`User saved successfully: ${savedUser.id}`);
            return savedUser;
        } catch (error: any) {
            logger.error('Error saving user: ' + error.message, error.stack);
            throw new Error('Unable to save user');
        }
    }

    async update(user: User, data: Partial<User>): Promise<User> {
        try {
            logger.info(`Updating user: ${user.id} with data: ${JSON.stringify(data)}`);
            const updatedUser = await this.userRepository.save({ ...user, ...data });
            logger.info(`User updated successfully: ${updatedUser.id}`);
            return updatedUser;
        } catch (error: any) {
            logger.error('Error updating user: ' + error.message, error.stack);
            throw new Error('Unable to update user');
        }
    }

    async delete(user: User): Promise<void> {
        try {
            logger.info(`Deleting user: ${user.id}`);
            await this.userRepository.remove(user);
            logger.info(`User deleted successfully: ${user.id}`);
        } catch (error: any) {
            logger.error('Error deleting user: ' + error.message, error.stack);
            throw new Error('Unable to delete user');
        }
    }

    async findByUsername(username: string): Promise<User | null> {
        try {
            logger.info(`Finding user by username: ${username}`);
            const user = await this.userRepository.findOneBy({ username });
            logger.info(`User found by username: ${username}`);
            return user;
        } catch (error: any) {
            logger.error('Error finding user by username: ' + error.message, error.stack);
            throw new Error('Unable to find user by username');
        }
    }

    async findById(id: number): Promise<User | null> {
        try {
            logger.info(`Finding user by ID: ${id}`);
            const user = await this.userRepository.findOneBy({ id });
            logger.info(`User found by ID: ${id}`);
            return user;
        } catch (error: any) {
            logger.error('Error finding user by ID: ' + error.message, error.stack);
            throw new Error('Unable to find user by ID');
        }
    }

    async isShowedTour(userId: number): Promise<void> {
        try {
            logger.info(`Marking tour as shown for user ID: ${userId}`);
            await this.userRepository.update(userId, { is_showed_tour: true });
            logger.info(`Tour marked as shown for user ID: ${userId}`);
        } catch (error: any) {
            logger.error('Error marking tour as shown: ' + error.message, error.stack);
            throw new Error('Unable to mark tour as shown');
        }
    }

    async remove(user: User): Promise<void> {
        try {
            logger.info(`Removing user: ${user.id}`);
            await this.userRepository.remove(user);
            logger.info(`User removed successfully: ${user.id}`);
        } catch (error: any) {
            logger.error('Error removing user: ' + error.message, error.stack);
            throw new Error('Unable to remove user');
        }
    }
}
