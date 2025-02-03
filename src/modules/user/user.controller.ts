import {
    Body,
    Controller,
    Get,
    Headers,
    HttpStatus,
    InternalServerErrorException,
    Post,
    Query,
    Req,
    Res,
    UnauthorizedException,
    UseGuards,
    ValidationPipe,
} from '@nestjs/common';
import {ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags,} from '@nestjs/swagger';
import {UserService} from './user.service';
import {Response} from 'express';
import {AuthGuard} from '@nestjs/passport';
import {JwtPayload} from '../auth/jwt.payload';
import {OAuth2Client} from 'google-auth-library';
import * as crypto from 'crypto';
import {v4 as uuidv4} from 'uuid';
import {AiService} from "../../helpers/ai.service";
import logger from "../../logger";
import {User} from "./entities/user.entity";


@ApiTags('Authentication')
@Controller('user')
export class UserController {
    private client = new OAuth2Client(
        '219715692488-id3m7uhs2qf9u7mo7o8os933fv1ttucm.apps.googleusercontent.com',
    );

    constructor(
        private readonly userService: UserService,
        private readonly aiService: AiService,
    ) {}

    @Post('request-login-otp')
    @ApiOperation({ summary: 'Request OTP for login' })
    @ApiResponse({ status: 200, description: 'OTP sent successfully.' })
    @ApiResponse({ status: 400, description: 'Mobile number is required.' })
    @ApiBody({
        description: 'User mobile number',
        schema: { example: { mobile: '1234567890' } },
    })
    async requestLoginOtp(
        @Body() body: { mobile: string },
        @Res() res: Response,
    ) {
        const { mobile } = body;
        if (!mobile) {
            // Log a warning if mobile number is missing
            logger.warn('Mobile number is missing in request.');
            return res
                .status(HttpStatus.BAD_REQUEST)
                .json({ message: 'Mobile number is required.' });
        }

        // Find user by mobile; if not found, register a new user and assign to 'user'
        let user = await this.userService.findByMobile(mobile);
        console.log('User is find ::', user);
        let isFirstTime = false;
        if (!user) {
            user = await this.userService.registerUserIfNotRegistered(mobile);
            isFirstTime = true;
            logger.info(`New user registered with mobile: ${mobile}`);
        }

        // Generate OTP code and assign it to user
        const otpCode: any = Math.floor(1000 + Math.random() * 9000);
        user.otp_code = otpCode;
        await this.userService.update(user.id, { otp_code: otpCode });

        let status = 'success';
        let message = 'OTP sent successfully. Please verify it to login.';
        let messageCode = '100';

        if (isFirstTime) {
            message = 'User not registered. Registered successfully.';
            messageCode = '102';
        }

        const sendOtp = await this.userService.sendSms(mobile, otpCode);
        if (!sendOtp) {
            status = 'error';
            message = 'OTP not sent.';
            messageCode = '101';
            logger.error(`Failed to send OTP to mobile: ${mobile}`);
        } else {
            logger.info(`OTP sent successfully to mobile: ${mobile}`);
        }

        return res.status(HttpStatus.OK).json({ status, message, code: messageCode });
    }

    @Post('login')
    @ApiOperation({ summary: 'Login with OTP' })
    @ApiResponse({ status: 200, description: 'User logged in successfully.' })
    @ApiResponse({
        status: 400,
        description: 'Mobile number and OTP code are required.',
    })
    @ApiResponse({ status: 401, description: 'Invalid OTP or mobile number.' })
    @ApiBody({
        description: 'Mobile and OTP code',
        schema: { example: { mobile: '1234567890', otp_code: 1234 } },
    })
    async loginWithOtp(
        @Body() body: { mobile: string; otp_code: number },
        @Res() res: Response,
    ) {
        const { mobile, otp_code } = body;
        if (!mobile || !otp_code) {
            logger.warn('Mobile number or OTP code is missing in login request.');
            return res
                .status(HttpStatus.BAD_REQUEST)
                .json({ message: 'Mobile number and OTP code are required.' });
        }

        const user = await this.userService.findByMobile(mobile);
        // Convert otp_code to string for comparison
        if (!user || user.otp_code !== otp_code.toString()) {
            logger.warn(`Invalid OTP or mobile number: ${mobile}`);
            throw new UnauthorizedException('Invalid OTP or mobile number.');
        }

        // Clear OTP and update token expiration time
        user.otp_code = "";
        user.token_expires_at = new Date(Date.now() + 8 * 60 * 60 * 1000);
        await this.userService.update(user.id, user);

        const token = this.userService.generateJwtToken(user.id, user.username);

        logger.info(`User logged in successfully with mobile: ${mobile}`);
        return res.status(HttpStatus.OK).json({
            status: 'success',
            user,
            authorisation: {
                token,
                type: 'bearer',
                expires_at: user.token_expires_at,
            },
        });
    }

    @Post('register')
    @ApiOperation({ summary: 'Register a new user' })
    @ApiResponse({ status: 201, description: 'User registered successfully!' })
    @ApiBody({ description: 'User data', type: User })
    async register(
        @Body(new ValidationPipe()) userData: Partial<User>,
    ): Promise<{ message: string }> {
        await this.userService.register(userData);
        logger.info(
            `User registered successfully with data: ${JSON.stringify(userData)}`,
        );
        return { message: 'User registered successfully!' };
    }

    @Post('verify-otp')
    @ApiOperation({ summary: 'Verify OTP' })
    @ApiResponse({ status: 200, description: 'OTP verified successfully.' })
    @ApiResponse({ status: 400, description: 'Invalid OTP or mobile number.' })
    @ApiBody({
        description: 'Mobile and OTP code',
        schema: { example: { mobile: '1234567890', otp_code: '1234' } },
    })
    async verifyOtp(
        @Body() otpData: { mobile: string; otp_code: string },
    ): Promise<{ message: string }> {
        try {
            const result = await this.userService.verifyOtp(otpData);
            logger.info(`OTP verified successfully for mobile: ${otpData.mobile}`);
            return result;
        } catch (error: any) {
            logger.warn(`Failed OTP verification for mobile: ${otpData.mobile}`, error);
            throw error;
        }
    }

    @Post('register-email')
    @ApiOperation({ summary: 'Register a new user with email' })
    @ApiResponse({ status: 200, description: 'OTP sent successfully to email.' })
    @ApiResponse({ status: 400, description: 'Email is required.' })
    @ApiBody({
        description: 'User email',
        schema: { example: { email: 'example@example.com' } },
    })
    async registerEmail(@Body() body: { email: string }, @Res() res: Response) {
        const { email } = body;
        if (!email) {
            logger.warn('Email is missing in registration request.');
            return res.status(HttpStatus.BAD_REQUEST).json({
                message: 'Email is required.',
                errorCode: 'EMAIL_REQUIRED',
            });
        }
        const user = await this.userService.findByEmail(email);
        if (user) {
            logger.warn(`User already registered with email: ${email}`);
            return res.status(HttpStatus.BAD_REQUEST).json({
                message: 'User already registered.',
                errorCode: 'USER_ALREADY_REGISTERED',
            });
        }
        const otpCode = Math.floor(1000 + Math.random() * 9000).toString();
        logger.info(`Sending OTP to email: ${email} with OTP: ${otpCode}`);
        const sendOtp = await this.userService.sendEmail(email, otpCode);
        if (!sendOtp) {
            logger.error(`Failed to send OTP to email: ${email}`);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: 'Failed to send OTP.',
                errorCode: 'OTP_SEND_FAILED',
            });
        }
        const newUser = await this.userService.createUserWithOtp(email, otpCode);
        if (!newUser) {
            logger.error(`Failed to create user with email: ${email}`);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: 'Failed to create user.',
                errorCode: 'USER_CREATION_FAILED',
            });
        }
        logger.info(`OTP sent successfully to email: ${email}`);
        return res.status(HttpStatus.OK).json({
            status: 'success',
            message: 'OTP sent successfully. Please verify it to complete registration.',
        });
    }

    @Post('reset-password-email')
    @ApiOperation({ summary: 'Send OTP to reset password via email' })
    @ApiResponse({ status: 200, description: 'OTP sent successfully to email.' })
    @ApiResponse({ status: 400, description: 'Email is required.' })
    @ApiResponse({ status: 404, description: 'User not found.' })
    @ApiBody({
        description: 'User email',
        schema: { example: { email: 'example@example.com' } },
    })
    async resetPasswordEmail(
        @Body() body: { email: string },
        @Res() res: Response,
    ) {
        const { email } = body;
        if (!email) {
            logger.warn('Email is missing in reset password request.');
            return res.status(HttpStatus.BAD_REQUEST).json({
                message: 'Email is required.',
                errorCode: 'EMAIL_REQUIRED',
            });
        }
        const user = await this.userService.findByEmail(email);
        if (!user) {
            logger.warn(`User not found with email: ${email}`);
            return res
                .status(HttpStatus.NOT_FOUND)
                .json({ message: 'User not found.', errorCode: 'USER_NOT_FOUND' });
        }
        const otpCode = Math.floor(1000 + Math.random() * 9000).toString();
        logger.info(`Sending OTP to email: ${email} with OTP: ${otpCode}`);
        const sendOtp = await this.userService.sendEmail(email, otpCode);
        if (!sendOtp) {
            logger.error(`Failed to send OTP to email: ${email}`);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: 'Failed to send OTP.',
                errorCode: 'OTP_SEND_FAILED',
            });
        }
        const updateUser = await this.userService.updateUserWithOtp(email, otpCode);
        if (!updateUser) {
            logger.error(`Failed to update user with email: ${email}`);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: 'Failed to update user.',
                errorCode: 'USER_UPDATE_FAILED',
            });
        }
        logger.info(`OTP sent successfully to email: ${email}`);
        return res.status(HttpStatus.OK).json({
            status: 'success',
            message: 'OTP sent successfully. Please verify it to reset your password.',
        });
    }

    @Post('verify-email-otp')
    @ApiOperation({ summary: 'Verify OTP and complete registration with email' })
    @ApiResponse({ status: 200, description: 'Registration completed successfully.' })
    @ApiResponse({ status: 400, description: 'Email and OTP code are required.' })
    @ApiResponse({ status: 401, description: 'Invalid OTP or email.' })
    @ApiBody({
        description: 'Email and OTP code',
        schema: {
            example: {
                email: 'example@example.com',
                otp_code: 1234,
                password: 'password123',
            },
        },
    })
    async verifyEmailOtp(
        @Body() body: { email: string; otp_code: number; password: string },
        @Res() res: Response,
    ) {
        const { email, otp_code, password } = body;
        if (!email || !otp_code || !password) {
            logger.warn('Email, OTP code or password is missing in verification request.');
            return res
                .status(HttpStatus.BAD_REQUEST)
                .json({ message: 'Email, OTP code and password are required.' });
        }
        const user = await this.userService.verifyUserOtp(email, otp_code, password);
        if (!user) {
            logger.warn(`Invalid OTP or email: ${email}`);
            throw new UnauthorizedException('Invalid OTP or email.');
        }
        const token = this.userService.generateJwtTokenByEmail(user.id, user.email);
        logger.info(`User registered and logged in successfully with email: ${email}`);
        return res.status(HttpStatus.OK).json({
            status: 'success',
            user,
            authorisation: { token, type: 'bearer' },
        });
    }

    @Post('login-email')
    @ApiOperation({ summary: 'Login with email and password' })
    @ApiResponse({ status: 200, description: 'User logged in successfully.' })
    @ApiResponse({ status: 400, description: 'Email and password are required.' })
    @ApiResponse({ status: 401, description: 'Invalid email or password.' })
    @ApiBody({
        description: 'Email and password',
        schema: { example: { email: 'example@example.com', password: 'password123' } },
    })
    async loginEmail(
        @Body() body: { email: string; password: string },
        @Res() res: Response,
    ) {
        const { email, password } = body;
        if (!email || !password) {
            logger.warn('Email or password is missing in login request.');
            return res
                .status(HttpStatus.BAD_REQUEST)
                .json({ message: 'Email and password are required.' });
        }
        const user = await this.userService.validateUser(email, password);
        if (!user) {
            logger.warn(`Invalid email or password: ${email}`);
            throw new UnauthorizedException('Invalid email or password.');
        }
        const token = this.userService.generateJwtToken(user.id, user.email);
        logger.info(`User logged in successfully with email: ${email}`);
        return res.status(HttpStatus.OK).json({
            status: 'success',
            user,
            authorisation: { token, type: 'bearer' },
        });
    }

    @Get('is-showed-tour')
    @ApiBearerAuth('access-token')
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: 'Mark the tour as showed for the user' })
    @ApiResponse({
        status: 200,
        description: 'Successfully marked the tour as viewed.',
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized - User not found or not authenticated.',
    })
    async isShowedTour(@Req() req: any, @Res() res: Response) {
        const user = req.user as JwtPayload;
        const userId = user.id;
        if (!userId) {
            logger.warn('User not authenticated.');
            return res
                .status(HttpStatus.UNAUTHORIZED)
                .json({ status: 'fail', message: 'The user cannot be found.' });
        }
        await this.userService.isShowedTour(userId);
        logger.info(`Marked the tour as viewed for user ID: ${userId}`);
        return res.status(HttpStatus.OK).json({
            status: 'success',
            message: 'Set the user has viewed the tour.',
        });
    }

    @Post('google-login')
    async googleLogin(
        @Body()
            body: {
            email: string;
            name: string;
            googleId: string;
            token: string;
        },
        @Res() res: Response,
    ) {
        const { email, name, googleId, token } = body;
        try {
            // Verify Google token
            const ticket = await this.client.verifyIdToken({
                idToken: token,
                audience:
                    '219715692488-id3m7uhs2qf9u7mo7o8os933fv1ttucm.apps.googleusercontent.com',
            });
            const payload = ticket.getPayload();
            if (!payload) {
                return res
                    .status(HttpStatus.UNAUTHORIZED)
                    .json({ message: 'Invalid token' });
            }
            if (payload.email !== email || payload.sub !== googleId) {
                return res
                    .status(HttpStatus.UNAUTHORIZED)
                    .json({ message: 'Token data does not match provided user data' });
            }
            // Use as any for methods not defined in UserService types
            const userData = await (this.userService as any).validateFacebookToken(token);
            const fbUser = await (this.userService as any).getFacebookUserData(token);
            let user = await this.userService.findByEmail(email);
            let newUser;
            if (!user) {
                const password = Math.random().toString(36).slice(-8);
                newUser = await this.userService.createUserWithEmailAndPassword(
                    email,
                    name,
                    password,
                );
                await this.userService.sendEmailWithPassword(email, password);
            } else {
                newUser = user;
            }
            const jwtToken = this.userService.generateJwtToken(newUser.id, newUser.email);
            return res.status(HttpStatus.OK).json({
                status: 'success',
                user: newUser,
                authorisation: { token: jwtToken, type: 'bearer' },
            });
        } catch (error: any) {
            console.log(error);
            logger.error(error);
            return res
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .json({ message: 'Error during Google login' });
        }
    }



    @Get('data-deletion-status')
    async dataDeletionStatus(@Res() res) {
        try {
            const confirmationCode = uuidv4();
            return res.status(HttpStatus.OK).json({
                status: 'success',
                message: 'Your data has been successfully deleted.',
                confirmation_code: confirmationCode,
            });
        } catch (error: any) {
            console.error('Error displaying data deletion status:', error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                status: 'error',
                message: 'Failed to display data deletion status',
            });
        }
    }

    @Get('profile')
    @ApiBearerAuth('access-token')
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({summary: 'Get current user profile'})
    @ApiResponse({
        status: 200,
        description: 'Successfully retrieved user profile.',
    })
    @ApiResponse({status: 401, description: 'Unauthorized.'})
    async getUserProfile(@Req() req: any, @Res() res: Response) {
        try {
            const user = req.user as JwtPayload;
            const userId = user.id;

            if (!userId) {
                return res
                    .status(HttpStatus.UNAUTHORIZED)
                    .json({message: 'Unauthorized: User not found in request'});
            }

            const userProfile = await this.userService.getUserProfile(userId);
            return res.status(HttpStatus.OK).json({
                status: 'success',
                data: userProfile,
            });
        } catch (error: any) {
            return res
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .json({message: 'Failed to retrieve user profile'});
        }
    }

    private successResponse(data: any, message?: string) {
        return {
            status: 'success',
            data: data || [],
            message: message || null,
        };
    }

    private failResponse(message: string) {
        return {
            status: 'fail',
            data: [],
            message,
        };
    }
}
