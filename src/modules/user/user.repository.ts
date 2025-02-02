// src/users/user.repository.ts
import { Injectable } from '@nestjs/common';
import { Users } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import logger from "../../logger";

@Injectable()
export class UserRepository {
    constructor(
        @InjectRepository(Users)
        private readonly userRepository: Repository<Users>,
    ) {}


    async create(data: Partial<Users>): Promise<Users> {
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

    async findByEmail(email: string): Promise<Users | null> {
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

    async findOneBy(conditions: Partial<Users>): Promise<Users | null> {
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

    async save(user: Users): Promise<Users> {
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

    async update(user: Users, data: Partial<Users>): Promise<Users> {
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

    async delete(user: Users): Promise<void> {
        try {
            logger.info(`Deleting user: ${user.id}`);
            await this.userRepository.remove(user);
            logger.info(`User deleted successfully: ${user.id}`);
        } catch (error: any) {
            logger.error('Error deleting user: ' + error.message, error.stack);
            throw new Error('Unable to delete user');
        }
    }

    async findByUsername(username: string): Promise<Users | null> {
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

    async findById(id: number): Promise<Users | null> {
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

    async remove(user: Users): Promise<void> {
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
