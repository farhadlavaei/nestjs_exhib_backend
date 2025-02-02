export class InstagramUserDto {
    user_id: string;          // شناسه کاربری اینستاگرام
    username: string;         // نام کاربری اینستاگرام
    name: string;             // نام کاربر
    account_type: string;     // نوع حساب (Business یا Media_Creator)
    profile_picture_url: string; // URL عکس پروفایل
    followers_count: number;  // تعداد دنبال‌کنندگان
    follows_count: number;    // تعداد حساب‌هایی که دنبال می‌کند
    media_count: number;      // تعداد رسانه‌ها
}
