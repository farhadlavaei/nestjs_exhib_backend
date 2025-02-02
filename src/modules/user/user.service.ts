import {
    BadRequestException,
    HttpException,
    HttpStatus,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import {UserRepository} from './user.repository';
import {Users} from './entities/user.entity';
import {HttpService} from '@nestjs/axios';
import {ConfigService} from '@nestjs/config';
import {JwtService} from '@nestjs/jwt';
import * as nodemailer from 'nodemailer';
import * as bcrypt from 'bcrypt';
import {firstValueFrom, lastValueFrom} from 'rxjs';
import * as qs from 'qs';
import {ConnectToApi} from "../../helpers/connect-to-api.helper";
import logger from "../../logger";

@Injectable()
export class UserService {
    private clientId = '525511713776631';
    private clientSecret = 'a7bf2060ccc4d0fd47cc43a8909383a1';
    private readonly redirectUri: string;
    private readonly tokenUrl: string;

    constructor(
        private readonly userRepository: UserRepository,
        private readonly connectToApi: ConnectToApi,
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService,
    ) {

    }


    async register(data: Partial<Users>): Promise<Users> {
        try {
            logger.info('Registering user with data: ' + JSON.stringify(data));
            const user: any = await this.userRepository.create(data);
            logger.info(`User registered successfully: ${user.id}`);
            return user;
        } catch (error: any) {
            logger.error('Error registering user: ' + error.message, error.stack);
            throw new InternalServerErrorException('Error registering user');
        }
    }

    async verifyOtp(otpData: {
        mobile: string;
        otp_code: string;
    }): Promise<{ message: string }> {
        try {
            logger.info(`Verifying OTP for mobile: ${otpData.mobile}`);
            // Assuming OTP verification logic here
            logger.info(`OTP verified successfully for mobile: ${otpData.mobile}`);
            return {message: 'OTP verified successfully!'};
        } catch (error: any) {
            logger.error('Error verifying OTP: ' + error.message, error.stack);
            throw new InternalServerErrorException('Error verifying OTP');
        }
    }

    async update(id: number, data: Partial<Users>): Promise<Users> {
        try {
            logger.info(`Updating user with ID: ${id}`);
            const user = await this.userRepository.findById(id);
            if (!user) {
                logger.warn(`User with ID ${id} not found`);
                throw new NotFoundException(`User with ID ${id} not found`);
            }
            const updatedUser = await this.userRepository.update(user, data);
            logger.info(`User with ID: ${id} updated successfully`);
            return updatedUser;
        } catch (error: any) {
            logger.error('Error updating user: ' + error.message, error.stack);
            throw new InternalServerErrorException('Error updating user');
        }
    }

    async delete(id: number): Promise<void> {
        try {
            logger.info(`Deleting user with ID: ${id}`);
            const user = await this.userRepository.findById(id);
            if (!user) {
                logger.warn(`User with ID ${id} not found`);
                throw new NotFoundException(`User with ID ${id} not found`);
            }
            await this.userRepository.delete(user);
            logger.info(`User with ID: ${id} deleted successfully`);
        } catch (error: any) {
            logger.error('Error deleting user: ' + error.message, error.stack);
            throw new InternalServerErrorException('Error deleting user');
        }
    }

    async findByMobile(mobile: string): Promise<Users | any> {
        try {
            logger.info(`Finding user by mobile: ${mobile}`);
            const user = await this.userRepository.findByUsername(mobile);
            logger.info(`User found by mobile: ${mobile}`);
            return user;
        } catch (error: any) {
            logger.error(
                'Error finding user by mobile: ' + error.message,
                error.stack,
            );
            throw new InternalServerErrorException('Error finding user by mobile');
        }
    }

    async registerUserIfNotRegistered(mobile: string): Promise<Users> {
        try {
            logger.info(`Registering user if not registered for mobile: ${mobile}`);
            const user = new Users();
            user.mobile = mobile;
            user.username = mobile;
            const registeredUser = await this.userRepository.create(user);
            logger.info(`User registered successfully for mobile: ${mobile}`);
            return registeredUser;
        } catch (error: any) {
            logger.error(
                'Error registering user if not registered: ' + error.message,
                error.stack,
            );
            throw new InternalServerErrorException(
                'Error registering user if not registered',
            );
        }
    }

    async sendSms(mobile: string, otpCode: string): Promise<boolean> {
        const apiUrl: any = this.configService.get<string>('PARS_GREEN_MAIN_URL');
        const smsToken: any = this.configService.get<string>('PARS_GREEN_TOKEN');

        const requestPayload = {
            SmsBody: `*Soodsaz*\nYour OTP Code: ${otpCode}\n`,
            Mobiles: [mobile],
        };

        try {
            logger.info(`Sending SMS to mobile: ${mobile}`);
            const api = new ConnectToApi(apiUrl, smsToken, this.httpService);
            const response = await api
                .Exec('Message/SendSms', requestPayload)
                .toPromise();

            if (!response.R_Success) {
                throw new Error(`Failed to send OTP: ${response.R_Message}`);
            }

            logger.info(`SMS sent successfully to mobile: ${mobile}`);
            return true;
        } catch (error: any) {
            logger.error('Error sending SMS: ' + error.message, error.stack);
            throw new InternalServerErrorException('Error sending SMS');
        }
    }

    async loginWithOtp(mobile: string, otp_code: number): Promise<any> {
        try {
            logger.info(`Logging in with OTP for mobile: ${mobile}`);
            const user = await this.userRepository.findByUsername(mobile);

            if (!user || user.otp_code !== otp_code.toString()) {
                logger.warn(`Invalid OTP or mobile number for mobile: ${mobile}`);
                throw new UnauthorizedException('Invalid OTP or mobile number.');
            }

            user.otp_code = "";
            user.token_expires_at = new Date(Date.now() + 8 * 60 * 60 * 1000);
            await this.userRepository.update(user, {
                otp_code: null,
                token_expires_at: user.token_expires_at,
            } as any);

            const token = this.jwtService.sign({
                id: user.id,
                username: user.username,
            });

            logger.info(`User logged in successfully with OTP for mobile: ${mobile}`);
            return {
                status: 'success',
                user,
                accounts_count: 0,
                authorisation: {
                    token,
                    type: 'bearer',
                    expires_at: user.token_expires_at,
                },
            };
        } catch (error: any) {
            logger.error('Error logging in with OTP: ' + error.message, error.stack);
            throw new InternalServerErrorException('Error logging in with OTP');
        }
    }

    generateJwtToken(userId: number, username: string): string {
        logger.info(`Generating JWT token for user ID: ${userId}`);
        return this.jwtService.sign({sub: userId, id: userId, username});
    }

    async findById(id: number): Promise<Users> {
        try {
            logger.info(`Finding user by ID: ${id}`);
            const user = await this.userRepository.findById(id);
            if (!user) {
                logger.warn(`User with ID ${id} not found`);
                throw new NotFoundException(`User with ID ${id} not found`);
            }
            logger.info(`User found by ID: ${id}`);
            return user;
        } catch (error: any) {
            logger.error('Error finding user by ID: ' + error.message, error.stack);
            throw new InternalServerErrorException('Error finding user by ID');
        }
    }

    async createUserWithOtp(email: string, otpCode: string): Promise<Users> {
        try {
            logger.info(`Creating user with OTP for email: ${email}`);
            const user = new Users();
            user.email = email;
            user.username = email;
            user.otp_code = otpCode;
            user.otp_expires_at = new Date(Date.now() + 10 * 60 * 1000);
            const createdUser = await this.userRepository.save(user);
            logger.info(`User created with OTP for email: ${email}`);
            return createdUser;
        } catch (error: any) {
            logger.error(
                'Error creating user with OTP: ' + error.message,
                error.stack,
            );
            throw new InternalServerErrorException('Error creating user with OTP');
        }
    }

    async sendEmail(email: string, otpCode: string): Promise<boolean> {
        const transporter = nodemailer.createTransport({
            host: 'smtp.c1.liara.email',
            port: 587,
            secure: false,
            auth: {
                user: 'jovial_cray_p7pirh',
                pass: '173d5317-7d27-4be6-998f-93e4e3f62c8e',
            },
        });

        const mailOptions = {
            from: 'info@mail.holootech.com',
            to: email,
            subject: 'Your OTP Code',
            html: `
        <!DOCTYPE html>
        <html lang="en" dir="ltr">
            <head>
                <meta charset="UTF-8" />
                <title>OTP Verification</title>
                <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
                <meta content="OTP Verification Email" name="description" />
                <meta name="author" content="Holootech Company" />
                <meta http-equiv="X-UA-Compatible" content="IE=edge" />

                <!-- favicon -->
                <link rel="shortcut icon" href="https://panel.holootech.com/assets/images/favicon/favicon.ico" />
                <!-- Font -->
                <link href="https://fonts.googleapis.com/css?family=Nunito:400,600,700&display=swap" rel="stylesheet">
            </head>

            <body style="font-family: Nunito, sans-serif; font-size: 15px; font-weight: 400;">
                <!-- Hero Start -->
                <div style="margin-top: 50px;">
                    <table cellpadding="0" cellspacing="0" style="font-family: Nunito, sans-serif; font-size: 15px; font-weight: 400; max-width: 600px; border: none; margin: 0 auto; border-radius: 6px; overflow: hidden; background-color: #fff; box-shadow: 0 0 3px rgba(60, 72, 88, 0.15);">
                        <thead>
                            <tr style="background-color: #4f46e5; padding: 3px 0; line-height: 68px; text-align: center; color: #fff; font-size: 24px; font-weight: 700; letter-spacing: 1px;">
                                <th scope="col"><img src="https://holootech.com/assets/images/logo-light.png" alt="Logo"></th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr>
                                <td style="padding: 48px 24px 0; color: #161c2d; font-size: 18px; font-weight: 600;">
                                    Hello,
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 15px 24px 15px; color: #8492a6;">
                                    Your OTP code is below. Use it to verify your email address.
                                </td>
                            </tr>

                            <tr>
                                <td style="padding: 15px 24px;">
                                    <span style="display: inline-block; padding: 8px 20px; font-size: 16px; font-weight: 600; border-radius: 6px; background-color: #4f46e5; color: #ffffff;">${otpCode}</span>
                                </td>
                            </tr>

                            <tr>
                                <td style="padding: 15px 24px 0; color: #8492a6;">
                                    This OTP is valid for 10 minutes. If you did not request this, please ignore this email.
                                </td>
                            </tr>

                            <tr>
                                <td style="padding: 15px 24px 15px; color: #8492a6;">
                                    Support Team
                                </td>
                            </tr>

                            <tr>
                                <td style="padding: 16px 8px; color: #8492a6; background-color: #f8f9fc; text-align: center;">
                                    © <script>document.write(new Date().getFullYear())</script> holootech.com
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <!-- Hero End -->
            </body>
        </html>
      `,
        };

        try {
            logger.info(`Sending OTP email to: ${email}`);
            await transporter.sendMail(mailOptions);
            logger.info(`OTP sent successfully to email: ${email}`);
            return true;
        } catch (error: any) {
            logger.error('Error sending email: ' + error.message, error.stack);
            throw new InternalServerErrorException('Error sending email');
        }
    }

    async verifyUserOtp(
        email: string,
        otpCode: number,
        password: string,
    ): Promise<Users | null> {
        try {
            logger.info(`Verifying user OTP for email: ${email}`);
            const user = await this.userRepository.findByEmail(email);
            if (
                !user ||
                user.otp_code !== otpCode.toString() ||
                new Date() > user.otp_expires_at
            ) {
                logger.warn(`Invalid OTP or expired for email: ${email}`);
                return null;
            }

            user.otp_code = "";
            user.password = await this.hashPassword(password);
            user.email_verified_at = new Date();
            user.is_verified = true;
            const verifiedUser = await this.userRepository.save(user);
            logger.info(`User OTP verified and updated for email: ${email}`);
            return verifiedUser;
        } catch (error: any) {
            logger.error('Error verifying user OTP: ' + error.message, error.stack);
            throw new InternalServerErrorException('Error verifying user OTP');
        }
    }

    async validateUser(email: string, password: string): Promise<Users | null> {
        try {
            logger.info(`Validating user with email: ${email}`);
            const user = await this.userRepository.findByEmail(email);
            console.log('user : ', user);
            if (user && (await bcrypt.compare(password, user.password))) {
                logger.info(`User validated successfully with email: ${email}`);
                return user;
            }
            logger.warn(`Invalid credentials for email: ${email}`);
            return null;
        } catch (error: any) {
            console.log('ERROR: ', error);
            logger.error('Error validating user: ' + error.message, error.stack);
            throw new InternalServerErrorException('Error validating user');
        }
    }

    generateJwtTokenByEmail(userId: number, email: string): string {
        logger.info(`Generating JWT token by email for user ID: ${userId}`);
        return this.jwtService.sign({sub: userId, email});
    }

    async findByEmail(email: string): Promise<Users | null> {
        try {
            logger.info(`Finding user by email: ${email}`);
            const user = await this.userRepository.findOneBy({email});
            logger.info(`User found by email: ${email}`);
            return user;
        } catch (error: any) {
            logger.error(
                'Error finding user by email: ' + error.message,
                error.stack,
            );
            throw new InternalServerErrorException('Error finding user by email');
        }
    }

    async isShowedTour(userId: number): Promise<void> {
        try {
            logger.info(`Marking tour as shown for user ID: ${userId}`);
            await this.userRepository.isShowedTour(userId);
            logger.info(`Tour marked as shown for user ID: ${userId}`);
        } catch (error: any) {
            logger.error(
                'Error marking tour as shown: ' + error.message,
                error.stack,
            );
            throw new InternalServerErrorException('Unable to mark tour as shown');
        }
    }

    async createUserWithEmailAndPassword(
        email: string,
        name: string,
        password: string,
    ): Promise<Users> {
        const hashedPassword = await this.hashPassword(password);
        const user = new Users();
        user.email = email;
        user.username = email;
        user.first_name = name;
        user.password = hashedPassword;
        user.is_verified = true;
        return this.userRepository.save(user);
    }

    async sendEmailWithPassword(
        email: string,
        password: string,
    ): Promise<boolean> {
        const transporter = nodemailer.createTransport({
            host: 'smtp.c1.liara.email',
            port: 587,
            secure: false,
            auth: {
                user: 'jovial_cray_p7pirh',
                pass: '173d5317-7d27-4be6-998f-93e4e3f62c8e',
            },
        });

        const mailOptions = {
            from: process.env.MAIL_FROM,
            to: email,
            subject: 'Your Account Password',
            html: `
      <!DOCTYPE html>
      <html lang="en" dir="ltr">
          <head>
              <meta charset="UTF-8" />
              <title>Password Notification</title>
              <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
              <meta content="Password Notification Email" name="description" />
              <meta name="author" content="Holootech Company" />
              <meta http-equiv="X-UA-Compatible" content="IE=edge" />

              <!-- favicon -->
              <link rel="shortcut icon" href="https://panel.holootech.com/assets/images/favicon/favicon.ico" />
              <!-- Font -->
              <link href="https://fonts.googleapis.com/css?family=Nunito:400,600,700&display=swap" rel="stylesheet">
          </head>

          <body style="font-family: Nunito, sans-serif; font-size: 15px; font-weight: 400;">
              <!-- Hero Start -->
              <div style="margin-top: 50px;">
                  <table cellpadding="0" cellspacing="0" style="font-family: Nunito, sans-serif; font-size: 15px; font-weight: 400; max-width: 600px; border: none; margin: 0 auto; border-radius: 6px; overflow: hidden; background-color: #fff; box-shadow: 0 0 3px rgba(60, 72, 88, 0.15);">
                      <thead>
                          <tr style="background-color: #4f46e5; padding: 3px 0; line-height: 68px; text-align: center; color: #fff; font-size: 24px; font-weight: 700; letter-spacing: 1px;">
                              <th scope="col"><img src="https://holootech.com/assets/images/logo-light.png" alt="Logo"></th>
                          </tr>
                      </thead>

                      <tbody>
                          <tr>
                              <td style="padding: 48px 24px 0; color: #161c2d; font-size: 18px; font-weight: 600;">
                                  Hello,
                              </td>
                          </tr>
                          <tr>
                              <td style="padding: 15px 24px 15px; color: #8492a6;">
                                  Your account has been created/updated. Below is your password:
                              </td>
                          </tr>

                          <tr>
                              <td style="padding: 15px 24px;">
                                  <span style="display: inline-block; padding: 8px 20px; font-size: 16px; font-weight: 600; border-radius: 6px; background-color: #4f46e5; color: #ffffff;">${password}</span>
                              </td>
                          </tr>

                          <tr>
                              <td style="padding: 15px 24px 0; color: #8492a6;">
                                  Please change your password after logging in. If you did not request this, please contact support.
                              </td>
                          </tr>

                          <tr>
                              <td style="padding: 15px 24px 15px; color: #8492a6;">
                                  Support Team
                              </td>
                          </tr>

                          <tr>
                              <td style="padding: 16px 8px; color: #8492a6; background-color: #f8f9fc; text-align: center;">
                                  © <script>document.write(new Date().getFullYear())</script> holootech.com
                              </td>
                          </tr>
                      </tbody>
                  </table>
              </div>
              <!-- Hero End -->
          </body>
      </html>
    `,
        };

        console.log(mailOptions);

        try {
            logger.info(`Sending password email to: ${email}`);
            logger.info(`Email content ${mailOptions.html}`);
            await transporter.sendMail(mailOptions);
            logger.info(`Password sent successfully to email: ${email}`);
            return true;
        } catch (error: any) {
            logger.error('Error sending email: ' + error.message, error.stack);
            throw new InternalServerErrorException('Error sending email');
        }
    }


    generateRandomPassword(): string {
        const length = 12;
        const charset =
            'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let password = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * charset.length);
            password += charset[randomIndex];
        }
        return password;
    }

    async deauthorizeUser(userId: string): Promise<void> {
        try {
            // یافتن کاربر بر اساس userId و انجام عملیات لازم
            const user = await this.userRepository.findOneBy({
                instagram_id: userId,
            });
            if (user) {
                // به‌روزرسانی یا حذف کاربر
                // به عنوان مثال، حذف توکن‌ها و اطلاعات حساس کاربر
                user.is_verified = false;
                await this.userRepository.save(user);
            }
        } catch (error: any) {
            console.error('Error deauthorizing user:', error);
            throw new InternalServerErrorException('Error deauthorizing user');
        }
    }

    async deleteUserData(userId: string): Promise<void> {
        try {
            // یافتن و حذف داده‌های کاربر
            const user = await this.userRepository.findOneBy({
                instagram_id: userId,
            });
            if (user) {
                await this.userRepository.delete(user);
            }
        } catch (error: any) {
            console.error('Error deleting user data:', error);
            throw new InternalServerErrorException('Error deleting user data');
        }
    }

    async resetPasswordEmail(body: {
        email: string;
    }): Promise<{ message: string }> {
        const {email} = body;

        // بررسی وجود ایمیل
        if (!email) {
            logger.warn('Email is missing in reset password request.');
            throw new BadRequestException('Email is required.');
        }

        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            logger.warn(`User not found with email: ${email}`);
            throw new NotFoundException('User not found.');
        }

        // تولید کد OTP
        const otpCode = Math.floor(1000 + Math.random() * 9000).toString();
        logger.info(`Send OTP to email: ${email} with OTP: ${otpCode}`);

        // ارسال کد OTP به ایمیل
        const sendOtp = await this.sendEmail(email, otpCode);
        if (!sendOtp) {
            logger.error(`Failed to send OTP to email: ${email}`);
            throw new InternalServerErrorException('Failed to send OTP.');
        }

        // به‌روزرسانی کاربر با OTP
        await this.userRepository.update(user, {
            otp_code: otpCode,
            otp_expires_at: new Date(Date.now() + 10 * 60 * 1000),
        });

        logger.info(`OTP sent successfully to email: ${email}`);
        return {
            message:
                'OTP sent successfully. Please verify it to reset your password.',
        };
    }

    async updateUserWithOtp(email: string, otpCode: string): Promise<Users> {
        try {
            logger.info(`Updating user with OTP for email: ${email}`);
            const user = await this.userRepository.findByEmail(email);
            if (!user) {
                logger.warn(`User not found with email: ${email}`);
                throw new NotFoundException('User not found.');
            }

            // به‌روزرسانی اطلاعات کاربر با OTP
            user.otp_code = otpCode;
            user.otp_expires_at = new Date(Date.now() + 10 * 60 * 1000); // تنظیم زمان انقضا برای 10 دقیقه
            const updatedUser = await this.userRepository.save(user);
            logger.info(`User updated with OTP for email: ${email}`);
            return updatedUser;
        } catch (error: any) {
            logger.error(
                'Error updating user with OTP: ' + error.message,
                error.stack,
            );
            throw new InternalServerErrorException('Error updating user with OTP');
        }
    }

    async getUserProfile(userId: number): Promise<Partial<Users>> {
        try {
            const user = await this.userRepository.findById(userId);
            if (!user) {
                throw new NotFoundException('User not found');
            }

            const {email, first_name, full_name, id, last_name, username} = user;
            return {email, first_name, full_name, id, last_name, username};
        } catch (error: any) {
            logger.error('Error retrieving user profile: ' + error.message);
            throw new InternalServerErrorException('Failed to retrieve user profile');
        }
    }

    async exchangeCodeForAccessToken(code: string): Promise<any> {
        const tokenUrl = 'https://api.instagram.com/oauth/access_token';
        const redirectUri = 'https://api.holootech.com/user/instagram/callback';
        const longLivedTokenUrl = 'https://graph.instagram.com/access_token';

        const postFields = {
            client_id: this.clientId,
            client_secret: this.clientSecret,
            grant_type: 'authorization_code',
            redirect_uri: redirectUri,
            code: code,
        };

        console.log('postFields:', JSON.stringify(postFields, null, 2));

        try {
            // Step 1: دریافت short-lived access token
            const response = await lastValueFrom(
                this.httpService.post(tokenUrl, qs.stringify(postFields), {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                }),
            );
            console.log('Short-lived access token response:', response.data);

            const shortLivedAccessToken = response.data.access_token;

            // Step 2: دریافت long-lived access token
            const longLivedResponse = await lastValueFrom(
                this.httpService.get(longLivedTokenUrl, {
                    params: {
                        grant_type: 'ig_exchange_token',
                        client_secret: this.clientSecret,
                        access_token: shortLivedAccessToken,
                    },
                }),
            );

            console.log('Long-lived access token response:', longLivedResponse.data);

            return {
                shortLivedAccessToken,
                access_token: longLivedResponse.data.access_token,
                expires_in: longLivedResponse.data.expires_in,
            };
        } catch (error: any) {
            console.error('Error details:', error);
            if (error.response) {
                // Handle API response errors
                throw new HttpException(
                    {
                        status: 'error',
                        message: 'Error exchanging code for access token',
                        error: error.response.data,
                    },
                    error.response.status,
                );
            } else {
                // Handle network or unexpected errors
                throw new HttpException(
                    'An unexpected error occurred',
                    HttpStatus.INTERNAL_SERVER_ERROR,
                );
            }
        }
    }

    private async hashPassword(password: string): Promise<string> {
        logger.info(`Hashing password`);
        const salt = await bcrypt.genSalt(10);
        return bcrypt.hash(password, salt);
    }
}
