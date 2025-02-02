import {Injectable, InternalServerErrorException, Logger,} from '@nestjs/common';
import {HttpService} from '@nestjs/axios';
import {firstValueFrom} from 'rxjs';
import * as cheerio from 'cheerio';

@Injectable()
export class AiService {
    private readonly logger = new Logger(AiService.name);
    private readonly baseUrl = process.env.CHAT_COMPLITION_URI;
    private readonly apiKey = process.env.AVALAI_API_KEY;
    private readonly accessToken = process.env.ACCESS_TOKEN;

    private supportDataCache: any[] = [];
    private trainedDocuments: string[] = [];

    constructor(private readonly httpService: HttpService) {
    }

    async fetchSupportData(): Promise<void> {
        try {
            const response = await firstValueFrom(
                this.httpService.get('https://qa.holoo.co.ir/1272/crm', {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }),
            );

            const $ = cheerio.load(response.data);
            $('.qa-a-list-item').each((index, element) => {
                const answerId = $(element).attr('id');
                const answerText = $(element)
                    .find('.qa-a-item-content[itemprop="text"]')
                    .text()
                    .trim();
                const upvoteCount = $(element)
                    .find('.qa-upvote-count-data')
                    .text()
                    .trim();

                if (answerText) {
                    this.supportDataCache.push({
                        id: answerId,
                        text: answerText,
                        upvotes: upvoteCount,
                    });
                }
            });

            this.supportDataCache.push({
                id: 0,
                text: this.cachedData(),
                upvotes: '',
            });

            this.logger.log('Support data fetched and cached successfully.');
        } catch (error: any) {
            this.logger.error('Error fetching support data', error);
            if (error.response) {
                this.logger.error(`Response status: ${error.response.status}`);
                this.logger.error(
                    `Response data: ${JSON.stringify(error.response.data)}`,
                );
            } else {
                this.logger.error(`Error message: ${error.message}`);
            }
            throw new Error('Failed to fetch support data');
        }
    }

    async getSupportData(): Promise<any[]> {
        return this.supportDataCache;
    }

    async getResponseById(answerId: string): Promise<any | null> {
        const answer = this.supportDataCache.find((item) => item.id === answerId);
        return answer || null;
    }

    async parseJsonBlock(jsonBlock: string): Promise<any> {
        // استفاده از الگوی ریجکس برای استخراج محتوای JSON بین ```json و ```
        const regex = /```json\s*([\s\S]*?)\s*```/i;
        const match = jsonBlock.match(regex);

        if (!match || match.length < 2) {
            return false
        }

        const jsonString = match[1].trim();

        try {
            const parsedJson = JSON.parse(jsonString);
            return parsedJson;
        } catch (error) {
            return false;
        }
    }

    async getResponse(
        userQuestion: string,
        postsData: any,
        lastMessages: any,
        scenarios: any | null,
        language: string | null,
        baseUrl: string
    ): Promise<any> {
        if (!userQuestion || typeof userQuestion !== 'string') {
            throw new Error('Invalid user question');
        }

        try {
            const messages = await this.createMessages(
                userQuestion,
                postsData,
                lastMessages,
                scenarios,
                language,
                baseUrl
            );
            const response = await this.sendRequestToOpenAI(messages);
            return this.handleErrors(response);
        } catch (error: any) {
            console.log(error);
            this.logger.error(`Error message: ${error.message}`);
            throw new Error(error);
        }


    }

    async getResponseForDemo(
        userQuestion: string,
        postsData: any,
        lastMessages: any,
    ): Promise<any> {
        const maxRetries = 5;
        let attempt = 0;

        try {
            const prompt = await this.createPrompt(
                userQuestion,
                postsData,
                lastMessages,
            );
            const response = await firstValueFrom(
                this.httpService.post(
                    `${this.baseUrl}/chat/completions`,
                    {
                        model: process.env.AVALAI_MODEL || 'gpt-3.5-turbo',
                        messages: [{role: 'user', content: prompt}],
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${this.apiKey}`,
                            'Content-Type': 'application/json',
                        },
                    },
                ),
            );
            return this.handleErrors(response);
        } catch (error: any) {
            this.logger.error('Error fetching AI response', error);
            if (error.response) {
                this.logger.error(`Response status: ${error.response.status}`);
                this.logger.error(
                    `Response data: ${JSON.stringify(error.response.data)}`,
                );
            } else {
                this.logger.error(`Error message: ${error.message}`);
            }

            if (error.response && error.response.status === 429) {
                attempt++;
                const waitTime = Math.pow(2, attempt) * 1000; // Exponential backoff
                this.logger.warn(
                    `Rate limit exceeded. Attempt ${attempt} of ${maxRetries}. Retrying in ${waitTime / 1000} seconds...`,
                );
                await this.sleep(waitTime);
            } else {
                throw new InternalServerErrorException('Failed to fetch AI response');
            }
        }

        throw new Error('Max retries exceeded');
    }

    cachedData() {
        return (
            '\n' +
            'شبکه دانش مالی هلو\n' +
            'اینجا هر سوالی یک جواب داره\n' +
            'شبکه دانش مالی هلو |مرجع سوالات مالی، حسابداری، نرم افزاری و پشتیبانی آنلاین هلو\n' +
            '\n' +
            '    سوالات\n' +
            '    پر طرفدار\n' +
            '    بدون پاسخ\n' +
            '    طرح پرسش\n' +
            '\n' +
            'سوال بپرسید، پاسخ دهید، رای بدهید و امتیاز بگیرید\n' +
            'انتقال اطلاعات از هلو به crm\n' +
            '24 1\n' +
            '472 بازدید\n' +
            'درخصوص انتقال اطلاعات از هلو به crm به چه صورت میتوان ارتباط بین هلو و نیلا پلاس را برقرار نمود؟\n' +
            'سوال شده مرداد 20, 1401 در سرویس های متصل به نرم افزار هلو (نیلا) توسط nj تازه وارد (544 امتیاز) | 472 بازدید\n' +
            '6 پاسخ\n' +
            '7 1\n' +
            'بهترین پاسخ\n' +
            'مواردی که افزونه نیلا‌+ در اختیار کاربران قرار می‌دهد به شرح زیر است:\n' +
            '\n' +
            '✓ مشتری از  CRM ایده‌آل به نرم‌افزار هلو منتقل می‌شود:\n' +
            '\n' +
            'با ثبت مشتری در نرم‌افزار crm ایده‌آل و کلیک رو دکمه انتقال، اطلاعات مشتری شامل نام، تلفن، آدرس و اطلاعات رسمی، به نرم‌افزار هلو منتقل می‌شود.\n' +
            '\n' +
            ' \n' +
            '\n' +
            '✓ کالا از نرم‌افزار هلو به  CRM ایده‌آل منتقل می‌شود:\n' +
            '\n' +
            'در نرم‌افزار CRM ایده‌آل شما می‌توانید در قسمت کالا و محصولات، با کلیک روی دکمه دریافت اطلاعات، لیست کالا و محصولات را به همراه لیست قیمت، از نرم‌افزار هلو به نرم‌افزار CRM  ایده‌آل منتقل کنید.\n' +
            '\n' +
            ' \n' +
            '\n' +
            '✓ موجودی انبار به صورت آنلاین از نرم‌افزار هلو خوانده می‌شود و در  CRM ایده‌آل نمایش داده می‌شود:\n' +
            '\n' +
            'در نرم‌افزار CRM ایده‌آل می‌توانید به صورت آنلاین در لحظه موجودی هر کالا را براساس انبار نرم‌افزار هلو چک کنید و کارشناسان نیز می‌توانند در هنگام درج کالا در پیش‌فاکتور و فاکتور، موجودی کالا را مشاهده کنند.\n' +
            '\n' +
            ' \n' +
            '\n' +
            '✓ مانده حساب مشتری در نرم‌افزار هلو به صورت آنلاین در پرونده مشتریان  CRM ایده‌آل نمایش داده می‌شود:\n' +
            '\n' +
            'در نرم‌افزار CRM ایده‌آل در پرونده هر مشتری میزان فروشی که صورت گرفته و میزان مانده حساب مشتری به صورت آنلاین از نرم‌افزار هلو خوانده و نمایش داده می‌شود.\n' +
            '\n' +
            ' \n' +
            '\n' +
            '✓ فاکتور به صورت دو طرفه لینک است:\n' +
            '\n' +
            'در نرم‌افزار CRM ایده‌آل شما می‌توانید کلیک بر روی دکمه دریافت فاکتور ها، کلیه فاکتورها را از نرم‌افزار هلو به  CRM ایده‌آل منتقل کرده و با کلیک بر روی دکمه انتقال فاکتورها، کلیه فاکتورهای صادرشده در نرم‌افزار CRM ایده‌آل را به نرم‌افزار هلو انتقال دهید.\n' +
            'پاسخ داده شده مرداد 20, 1401 توسط Parviz.amraei مسلط (29.6هزار امتیاز)\n' +
            'انتخاب شده اسفند 9, 1401 توسط pouneh shayesteh\n' +
            '4 0\n' +
            'برای انجام این کار باید افزونه نیلا پلاس را خریداری کرد که ارتباط بین نرم افزار و سایت ویا crm صورت بگیرد\n' +
            '\n' +
            '(crm ایده آل) را باید داشته باشید\n' +
            'پاسخ داده شده آذر 21, 1401 توسط behzad استاد یار (106هزار امتیاز)\n' +
            '4 0\n' +
            'باید از افزونه وب سرویس اسفاده کرد با توجه خروجی که نرم افزار هلو از بانک اطلاعتی میدهد میتواهد کلیه اطلاعات خروجی گرفت و در بستر اپ crm انتقال داد که نیاز به تخصص دارد جهت اتصال حتمال با افراد متخصص مشورت کنید\n' +
            'پاسخ داده شده آذر 21, 1401 توسط peymanfcr حرفه‌ای (34.0هزار امتیاز)\n' +
            '4 0\n' +
            'با سلام\n' +
            '\n' +
            'ببینید ارتباط بین نرم افزار حسابداری هلو و نرم افزار CRM به وسیله ی وب سرویس صورت میگیرد از طریق API های درخواستی شما هم ارتباط رد و بدل می گردد .\n' +
            '\n' +
            'اما افزونه ی نیلا پلاس فقط بابت ارتباط نرم افزار حسابداری هلو و CRM ایده آل می باشد .\n' +
            'پاسخ داده شده آذر 21, 1401 توسط Reihaneh تازه کار (6.6هزار امتیاز)\n' +
            '4 0\n' +
            'سلام\n' +
            '\n' +
            'باید افزونه را خریداری کنید ، با شماره 02173607 تماس بگیرید جهت راهنمایی\n' +
            'پاسخ داده شده آذر 23, 1401 توسط پرهام رحیمی حرفه‌ای (31.7هزار امتیاز)\n' +
            '0 0\n' +
            'افزونه نیلا را از داخلطریق نمایندگی  خریداری نمایید\n' +
            'پاسخ داده شده 9 اسفند 1402 توسط s.mirkhani استاد تمام (151هزار امتیاز)\n' +
            '\n' +
            '10.6هزار سوال\n' +
            '\n' +
            '12.8هزار پاسخ\n' +
            '\n' +
            '1.8هزار دیدگاه\n' +
            '\n' +
            '14.2هزار کاربر\n' +
            'دسته بندی ها\n' +
            '\n' +
            '    تمامی دسته بندی ها\n' +
            '    سامانه مودیان مالیاتی 151\n' +
            '    مالیات بر ارزش افزوده / اظهارنامه مالیاتی 66\n' +
            '    عوارض و مالیات در نرم افزار هلو 120\n' +
            '    قوانین مالیاتی کشور ( مشمولین و معافیت مالیاتی / مالیات بر درآمد مشاغل) 14\n' +
            '    نصب و راه اندازی / SLM و قفل سخت افزاری 565\n' +
            '    راهنمای منوها و سوالات داخل نرم افزار 4.0هزار\n' +
            '    پشتیبانی و پیغام در نرم افزار هلو 1.2هزار\n' +
            '    راهنمای نرم افزارهای تخصصی اصناف 923\n' +
            '    راهنمای خرید(نرم افزار، ارتقا کد ،کیت و تمدید پشتیبانی) 858\n' +
            '    نرم افزار حسابداری تولیدی و فروش پوشاک،کیف،کفش 131\n' +
            '    نرم افزار حسابداری پخش 112\n' +
            '    نرم افزار حسابداری کافه و رستوران 191\n' +
            '    نرم افزار حسابداری لوازم یدکی 63\n' +
            '    نرم افزار حسابداری آهن فروشی 32\n' +
            '    نرم افزار حسابداری سوپرمارکت و هایپرمارکت 32\n' +
            '    نرم افزار حسابداری لوازم بهداشتی و مصالح ساختمانی 37\n' +
            '    نرم افزار حسابداری موبایل، سخت افزار و ماشین های اداری 68\n' +
            '    نرم افزار حسابداری مدیریت آرایشگاه 58\n' +
            '    نرم افزار حسابداری قنادی و نان ، آجیل و خشکبار 61\n' +
            '    نرم افزار حسابداری لوازم خانگی 34\n' +
            '    نرم افزار حسابداری میوه و تره بار 50\n' +
            '    نرم افزار حسابداری سنگ فروشی 41\n' +
            '    نرم افزار حسابداری شیشه بری 34\n' +
            '    نرم افزار حسابداری آرایشی و بهداشتی 24\n' +
            '    نرم افزار حسابداری کاشی و سرامیک 27\n' +
            '    نرم افزار حسابداری طلا و جواهر فروشی 22\n' +
            '    سرویس های متصل به نرم افزار هلو (نیلا) 178\n' +
            '    نرم افزار هلو لایت 43\n' +
            '    راهنمای کیت ها و امکانات 237\n' +
            '    راهکارها و امکانات سخت افزاری 102\n' +
            '    آموزش 79\n' +
            '    بستن حساب 335\n' +
            '    انبارگردانی 63\n' +
            '    داشبورد گزارشات هلو (گزارش آنلاین) 48\n' +
            '    حسابداری / حقوق و دستمزد 369\n' +
            '    محصولات اسپاد 148\n' +
            '\n' +
            '\n' +
            'آینده شغلیت با هلو\n' +
            '\n' +
            'آموزش رسمی و مدرک معتبر دوره حسابداری نرم افزار حسابداری هلو توسط شرکت هلو\n' +
            'همه‌چیز درباره‌ی شبکه دانش مالی هلو\n' +
            'سامانه تخصصی پرسش و پاسخ\n' +
            '\n' +
            'شبکه دانش مالی هلو یک وب‌سایت پرسش و پاسخ تخصصی است؛ به این معنی که می‌توانید هر سوال تخصصی‌ای در حوزه مالی و حسابداری دارید بپرسید و از افراد متخصص کمک بگیرید.\n' +
            'در واقع هم می‌توانید بپرسید هم می‌توانید به سوال‌هایی که در حوزه تخصص شماست، پاسخ دهید.\n' +
            'از مهم‌ترین هدف‌های این شبکه، اشتراک‌گذاری اطلاعات کاربران و ثبت آنها به‌صورت طبقه‌بندی شده است.\n' +
            'در این شبکه همه‌ی کاربرها امتیازاتی دارند که سطح آنها را نشان می‌دهد. در واقع هر سوالی که پرسیده یا پاسخ داده می‌شود به کاربرها اعتبار و امتیازی می‌دهد و رزومه کاربری آنها را مشخص می‌کند.\n' +
            '\n' +
            'بپرسید، پاسخ دهید، زمان را بخرید و امتیاز بگیرید!\n' +
            '\n' +
            'سامانه مؤدیان مالیاتی ۱۴۰۲\n' +
            'آموزش ویدئویی سامانه مودیان از طریق مدرس رسمی و شرکت نرم افزار حسابداری هلو\n' +
            'همه‌ی آن‌چیزی که باید درمورد سامانه مودیان بدانید\n' +
            'تماشای ویدئو\n' +
            '\n' +
            'نرم افزار حسابداری\n' +
            'سوالات مشابه\n' +
            '\n' +
            '    در خصوص انتقال یا کپی اطلاعات از یک شرکت به شرکت دیگر در بستر برنامه هلو چند شرکته\n' +
            '    انتقال اطلاعات کالا از اکسل به نرم افزار هلو\n' +
            '    crm متصل به نرم افزار\n' +
            '    اتصال به crm فروش\n' +
            '\n' +
            '    تماس با ما\n' +
            '\n'
        );
    }

    async trainDocuments(documents: string[]): Promise<any> {
        try {
            const response = await firstValueFrom(
                this.httpService.post(
                    `${this.baseUrl}/train`,
                    {
                        documents,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${this.apiKey}`,
                            'Content-Type': 'application/json',
                        },
                    },
                ),
            );

            this.trainedDocuments = documents;

            console.log('response', response);
            return this.handleErrors(response);
        } catch (error: any) {
            this.logger.error('Error training documents', error);
            throw new InternalServerErrorException('Failed to train documents');
        }
    }

    async askQuestionBasedOnTrainedDocuments(question: string): Promise<any> {
        if (this.trainedDocuments.length === 0) {
            throw new Error(
                'No trained documents available. Please train the model first.',
            );
        }

        const prompt = `
        شما باید به سوالات زیر بر اساس داکیومنت‌های بارگذاری شده پاسخ دهید:
        ${this.trainedDocuments.join('\n')}
        
        سوال کاربر: ${question}
        `;

        try {
            const response = await firstValueFrom(
                this.httpService.post(
                    `${this.baseUrl}/chat/completions`,
                    {
                        model: process.env.AVALAI_MODEL || 'gpt-3.5-turbo',
                        messages: [{role: 'user', content: prompt}],
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${this.apiKey}`,
                            'Content-Type': 'application/json',
                        },
                    },
                ),
            );

            return this.handleErrors(response);
        } catch (error: any) {
            this.logger.error('Error fetching AI response', error);
            throw new InternalServerErrorException('Failed to fetch AI response');
        }
    }

    async sendAutomatedResponse(recipientId: string, messageText: string) {
        const url = `https://graph.facebook.com/v17.0/me/messages?access_token=${this.accessToken}`;
        const responseBody = {
            recipient: {id: recipientId},
            message: {text: messageText},
        };

        try {
            const response = await firstValueFrom(
                this.httpService.post(url, responseBody, {
                    headers: {'Content-Type': 'application/json'},
                }),
            );
            return this.handleErrors(response);
        } catch (error: any) {
            this.logger.error('Error sending message:', error);
            throw new InternalServerErrorException('Failed to send message');
        }
    }

    async getFacebookInfoByEndPoint(
        endpoint: string,
        parameters: string,
    ): Promise<any> {
        let url: string = `https://graph.facebook.com/v17.0/me/${endpoint}?access_token=${this.accessToken}`;
        if (parameters) {
            url += parameters;
        }

        try {
            const response = await firstValueFrom(
                this.httpService.post(
                    url,
                    {},
                    {
                        headers: {'Content-Type': 'application/json'},
                    },
                ),
            );
            return this.handleErrors(response);
        } catch (error: any) {
            this.logger.error('Error sending message:', error);
            throw new InternalServerErrorException('Failed to send message');
        }
    }

    async extractArrayAsObject(data: any): Promise<any> {
        if (data && typeof data === 'object') {
            const arrayKey = Object.keys(data).find((key) => Array.isArray(data[key]));
            if (arrayKey) {
                return data[arrayKey];
            }
        }
        return null;
    }

    async extractArrayAsArray(data: any): Promise<any[]> {
        if (data && typeof data === 'object') {
            const arrayKey = Object.keys(data).find((key) => Array.isArray(data[key]));
            if (arrayKey) {
                return [data[arrayKey]];
            } else {

                return [data];
            }
        }
        return [];
    }

    private handleErrors(response: any): any {
        if (response.status === 200) {
            return response.data;
        } else {
            const errorMessage = response.data?.error_message || 'Unexpected error';
            throw new Error(errorMessage);
        }
    }

    private async createMessages(
        userQuestion: string,
        postsData: any,
        lastMessages: Array<{ role: string; content: string }>,
        scenarios: any | null,
        language: string | null,
        baseUrl: string | null
    ): Promise<Array<any>> {
        const introduction = `
شما یک مدل هوش مصنوعی هستید که در زمینه دیجیتال مارکتینگ تخصص دارید. سوالات کاربر درباره اینستاگرام و محتوای پست‌ها است.
لطفاً با توجه به داده‌های زیر، به پرسش کاربر پاسخ دهید.
`;

        const detectLanguage = '';
        //const detectLanguage = `به هر زبانی که کاربر سوال پرسید به همان زبان پاسخ بده.`;
        // const detectLanguage = `Identify the user’s language and respond in the ${language}. Never Identify the user witch language you use.`;

        const supportData =
            postsData?.data
                ?.map(
                    (post: any) => `
                        پست ID: ${post?.id}
                        متن: ${post?.caption_text}
                        لایک‌ها: ${post?.like_count}
                        کامنت‌ها: ${post?.comment_count}
                        تصویر:${post?.thumbnail_url}
                        `,
                )
                .join('\n') || 'هیچ اطلاعاتی موجود نیست.';

        const messages = [
            ...lastMessages,
            {role: 'system', content: introduction},
            {
                role: 'system',
                content: `اطلاعات پشتیبانی و پرسشهای احتمالی و پاسخ آنها:\n${scenarios}`,
            },
            {
                role: 'user',
                content: `پرسش کاربر: ${userQuestion}. ${detectLanguage}.`,
            },
            {role: 'assistant', content: `اطلاعات پشتیبانی:\n${supportData}`},
            {
                role: 'system',
                content: `
لطفاً پاسخ خود را به صورت JSON با ساختار زیر فراهم کنید:

{
  "status": "success" یا "fail",
  "message": "پیام پاسخ هوش مصنوعی",
  "data": {
    // داده‌های مورد نیاز به صورت آبجکت
  },
  "command": "user_info" یا "default_ai_response" یا "schudle_post" یا "update_post" یا "create_scenario" یا "product_list"
}

- \`status\` نشان‌دهنده موفقیت یا شکست درخواست است.
- \`message\` باید پیام پاسخ هوش مصنوعی باشد.
- \`data\` شامل داده‌های مورد نیاز به صورت آبجکت است.
- \`command\` باید یکی از موارد مشخص شده یا توسط هوش مصنوعی تعیین شود.

همه داده هایی که در data قرار است بازگردانی شوند را بر اساس این موارد نام گذاری کن
- \`user_info\` هرگونه عملیات مربوط به کاربر جاری
- \`default_ai_response\` هرگونه عملیات عادی و گفتگوهای عادی
- \`schudle_post\` هرگونه عملیات برای زمانبندی ارسال پست
- \`update_post\` هرگونه عملیات CRUD بر روی پست ها و محصولات پیج
- \`product_list\` هرگونه داده و یا اطلاعات در خصوص پست ها و یا محصولات
- \`create_post\` هرگونه داده و یا اطلاعات در خصوص ایجاد پست ها و یا محصولات


علاوه بر data در message هم تجمیع کل پیام به صورتی که بتوان در html نمایش داد را هم ایجاد کن
            `,
            },
            {
                role: 'system',
                content: `
اگر کاربر در پیام‌های قبلی خود اطلاعاتی مانند نام و نام خانوادگی، شماره تماس همراه، آدرس و کدپستی را ارائه نکرده است، لطفاً این اطلاعات را به هر روشی که ممکن است دریافت کرده و در قسمت \`data\` به صورت جداگانه به صورت آبجکت زیر قرار دهید:

{
  "user_info": {
    "first_name": "نام",
    "last_name": "نام خانوادگی",
    "mobile": "شماره تماس",
    "address": "آدرس",
    "postal_code": "کدپستی"
  },
  // سایر داده‌ها
}

اطلاعات دریافت شده را در \`data\` به صورت دقیق و تفکیک شده وارد کنید.
            `,
            },
            {
                role: 'system',
                content: `
اگر کاربر درخواست شماره حساب کرد، علاوه بر اعلام شماره حساب، باید از کاربر بخواهید که مشخصات خود شامل نام، نام خانوادگی، شماره همراه، آدرس و کدپستی را وارد کند. این اطلاعات باید در همان پیام اعلام شماره حساب ذکر شود و در قسمت \`data\` ذخیره شود.
            `,
            },
            {
                role: 'system',
                content: `
هرگونه اطلاعات در خصوص پست ها و یا محصولات باید در \`data\` به صورت جداگانه به صورت آبجکت و حتما به صورت آرایه در زیر قرار دهید:

{
  "product_list": [{
      post_id: "کد محصول",
      title: 'عنوان پست یا محصول یا خلاصه ای از کپشن',
      description: 'خلاصه بیشتر از کپشن.',
      specifications: 'خلاصه و اهم مشخصات محصول',
      price: 'قیمت محصول',
      hashtags: 'هشتگ ها',
      image_url: 'تصویر',
      product_message: 'پیام مخصوص محصول جاری'
    } , ... ],
  // سایر داده‌ها
}

اطلاعات دریافت شده را در \`data\` به صورت دقیق و تفکیک شده وارد کنید.
            `,
            },
            {
                role: 'system',
                content: `
اگر کاربر درخواست شماره حساب کرد، علاوه بر اعلام شماره حساب، باید از کاربر بخواهید که مشخصات خود شامل نام، نام خانوادگی، شماره همراه، آدرس و کدپستی را وارد کند. این اطلاعات باید در همان پیام اعلام شماره حساب ذکر شود و در قسمت \`data\` ذخیره شود.
            `
            },
            {
                role: 'system',
                content: `
وظیفه شما تولید محتوای حرفه‌ای برای اینستاگرام است. اگر کاربر درخواست تولید محتوا کرد، باید:
1. یک کپشن جذاب و متناسب با موضوع درخواست‌شده ارائه دهید.
2. هشتگ‌های مرتبط و پرکاربرد برای افزایش دیده‌شدن محتوا پیشنهاد کنید.
3. پیشنهادهایی برای نوع محتوای بصری (عکس، ویدیو، یا گرافیک) که بهترین بازدهی را داشته باشد، ارائه دهید.
4. تمام این اطلاعات را در قالب یک پیام کامل ارائه کنید و در قسمت \`data\` ذخیره کنید.
5. محتوای تولیدشده باید شامل حداقل سه پاراگراف حرفه‌ای، جذاب و مخاطب‌پسند باشد و بسته به نیاز کاربر، امکان ایجاد بیش از سه پاراگراف نیز وجود داشته باشد.
6. در متن محتوا از شکلک‌ها و آیکن‌های مناسب (مانند 🌟، 🚀، ❤️ و غیره) استفاده کنید تا جذابیت بصری افزایش یابد.
7. محتوای ارائه‌شده باید به‌گونه‌ای باشد که بتوان آن را در قالب HTML نمایش داد (استفاده از تگ‌های HTML برای قالب‌بندی مناسب محتوا مانند <p>، <strong>، <ul>، و غیره).
    `,
            },


            //{role: 'assistant', content: `زبان پاسخگویی: ${detectLanguage}\n`},
        ];

        return messages;
    }

    private async sendRequestToOpenAI(messages: Array<any>): Promise<any> {
        const payload = {
            model: process.env.AVALAI_MODEL || 'gpt-4',
            messages: messages,
        };
        return firstValueFrom(
            this.httpService.post(`${this.baseUrl}/chat/completions`, payload, {
                headers: {
                    Authorization: `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json',
                },
            }),
        );
    }

    private logError(error: any, attempt: number): void {
        this.logger.error('Error fetching AI response', error);

        if (error.response) {
            this.logger.error(`Response status: ${error.response.status}`);
            this.logger.error(
                `Response data: ${JSON.stringify(error.response.data)}`,
            );
        } else {
            this.logger.error(`Error message: ${error.message}`);
        }

        this.logger.warn(`Attempt ${attempt + 1} failed.`);
    }

    private sleep(ms: number) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    private async createPrompt(
        userQuestion: string,
        supportData: any,
        lastMessages: any,
    ): Promise<string> {
        const lastUserMessages = JSON.stringify(
            lastMessages?.details || 'هیچ تاریخچه‌ای موجود نیست.',
        );

        const greetingResponse = `
سلام، من چت بات هوشمند denro هستم. خوشحالم که اینجا هستید.
من اینجا هستم تا به سوالات شما پاسخ دهم و در پیدا کردن اطلاعات موردنیازتان کمک بکنم.
هر سوالی دارید، لطفاً بپرسید.
`;

        const introduction = `
شما یک مدل هوش مصنوعی هستید که باید به سوالات مربوط به دیجیتال مارکتینگ پاسخ دهید. 
شما در زمینه دیجیتال مارکتینگ و مدیریت پست‌های اینستاگرام تخصص دارید.
وظیفه شما این است که با استفاده از اطلاعات زیر:
- پرسش کاربر
- داده‌های پشتیبانی (پست‌های اینستاگرام)
- تاریخچه گفتگوهای قبلی کاربر

به پرسش‌های کاربر پاسخ دهید. لطفاً پاسخ‌هایتان واضح، دقیق و مرتبط با سوال باشد.
اگر اطلاعات لازم در دسترس نیست، به کاربر اطلاع دهید.
`;

        if (!supportData || !supportData.data || !Array.isArray(supportData.data)) {
            return `
${introduction}
اطلاعات پشتیبانی: داده‌ای در دسترس نیست.
پرسش کاربر: ${userQuestion}
`;
        }

        const postsInfo = supportData.data
            .map((post: any) => {
                return `
پست ID: ${post.id}
کاربر ID: ${post.user_id}
متن: "${post.caption_text}"
تعداد لایک: ${post.like_count}
تعداد کامنت: ${post.comment_count}
تاریخ ایجاد: ${post.created_at}
لینک تصویر: ${post.thumbnail_url}
-------------------------------
`;
            })
            .join('\n');

        const sendPrompt = `
${introduction}

### اطلاعات پشتیبانی:
${postsInfo.length > 0 ? postsInfo : 'هیچ داده‌ای موجود نیست.'}

### تاریخچه گفتگوهای قبلی کاربر:
${lastUserMessages}

### سوال کاربر:
"${userQuestion}"

### پاسخ مورد انتظار:
لطفاً بر اساس سوال کاربر و اطلاعات بالا پاسخ دهید.
`;

        console.log('sendPrompt : ', sendPrompt);
        return sendPrompt;
    }

    private async analyzeUserInput(
        userQuestion: string,
    ): Promise<{ isGreeting: boolean }> {
        const prompt = `
شما یک مدل هوش مصنوعی هستید که وظیفه تحلیل متن ورودی کاربران را دارد.
وظیفه شما این است که مشخص کنید آیا متن ورودی کاربر نوعی سلام (مانند "سلام"، "hello"، یا دیگر کلمات معادل به زبان‌های مختلف) است یا خیر.

ورودی: ${userQuestion} 

اگر متن ورودی یک سلام است، پاسخ را به این شکل برگردانید:
{
  "isGreeting": true
}

اگر متن ورودی یک سلام نیست، پاسخ را به این شکل برگردانید:
{
  "isGreeting": false
}

لطفاً توجه داشته باشید که فقط و فقط در قالب JSON بازگردانید و هیچ متن اضافه‌ای تولید نکنید.
لطفا توجه داشته باشید که یک قالب جیسون معتبر بازگردانی شود.
`;
        const response = await this.getResponseForDemo(prompt, null, null);
        const content = response?.choices?.[0]?.message?.content;

        if (!content || typeof content !== 'string') {
            throw new Error(
                'Invalid AI response format: Content is empty or not a string',
            );
        }

        const sanitizedContent = content.replace(/```json\s*|\s*```/g, '').trim();

        try {
            const jsonResponse = JSON.parse(sanitizedContent);
            if (typeof jsonResponse.isGreeting !== 'boolean') {
                throw new Error('Invalid JSON format: isGreeting is not a boolean');
            }

            return jsonResponse;
        } catch (error: any) {
            this.logger.error('Failed to parse AI response', error);
            throw new Error('Invalid AI response format');
        }
    }
}
