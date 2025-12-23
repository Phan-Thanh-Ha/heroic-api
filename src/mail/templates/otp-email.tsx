import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Preview,
    Section,
    Text,
    Hr,
    Link,
} from '@react-email/components';
import { Tailwind } from '@react-email/tailwind';
import * as React from 'react';

interface OtpEmailProps {
    otpCode: string;
    userName?: string;
}

export const OtpEmail = ({ otpCode, userName = 'Bạn' }: OtpEmailProps) => {
    return (
        <Html>
            <Head>
                <Tailwind />
            </Head>
            <Preview>Mã xác thực OTP: {otpCode} - Heroic</Preview>
            <Body className="bg-[#f4f7f9] py-12 px-4 font-sans">
                <Container className="bg-white max-w-[520px] mx-auto rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                    
                    {/* Header: Logo thanh lịch */}
                    <Section className="bg-[#1e293b] py-10 px-6 text-center">
                        <Text className="text-white text-4xl font-extrabold m-0 tracking-tighter italic">
                            HEROIC<span className="text-indigo-400">.</span>
                        </Text>
                    </Section>

                    {/* Nội dung chính */}
                    <Section className="px-10 py-12">
                        <Heading className="text-gray-800 text-2xl font-semibold m-0 mb-4">
                            Xác thực yêu cầu của bạn
                        </Heading>

                        <Text className="text-gray-600 text-base leading-relaxed m-0 mb-6">
                            Chào <strong className="text-gray-900">{userName}</strong>, chúng tôi nhận được yêu cầu đăng nhập/xác thực từ tài khoản của bạn. Hãy sử dụng mã bảo mật dưới đây:
                        </Text>

                        {/* OTP Box: Thiết kế hiện đại nổi bật */}
                        <Section className="bg-gray-50 rounded-2xl p-8 my-8 text-center border border-dashed border-gray-300">
                            <Text className="text-gray-500 text-xs font-bold uppercase tracking-[0.2em] m-0 mb-4">
                                Mã OTP của bạn (6 chữ số)
                            </Text>
                            <Text className="text-indigo-600 font-mono text-5xl font-black tracking-[10px] m-0">
                                {otpCode}
                            </Text>
                        </Section>

                        {/* Thời gian hiệu lực & Bảo mật */}
                        <Section className="mb-8">
                            <Text className="text-gray-600 text-sm leading-6 m-0 text-center">
                                ⏱️ Có hiệu lực trong <strong className="text-red-500">5 phút</strong>.
                            </Text>
                            <Text className="text-gray-400 text-xs mt-2 text-center italic">
                                Nếu không phải bạn, hãy đổi mật khẩu ngay để bảo vệ tài khoản.
                            </Text>
                        </Section>

                        <Hr className="border-gray-100 my-8" />

                        {/* Liên kết hỗ trợ */}
                        <Text className="text-gray-500 text-[13px] text-center leading-6 m-0">
                            Bạn gặp khó khăn? <Link href="" className="text-indigo-600 underline">Liên hệ đội ngũ hỗ trợ</Link>
                        </Text>
                    </Section>

                    {/* Footer chân trang */}
                    <Section className="bg-gray-50 py-8 px-10 text-center border-t border-gray-100">
                        <Text className="text-gray-400 text-xs uppercase tracking-widest font-bold mb-3">
                            © 2025 Heroic Inc.
                        </Text>
                        <Text className="text-gray-400 text-[11px] leading-5 m-0 px-4">
                            80 Đường 3, Phường Tân Kiểng, Quận 7, TP. Hồ Chí Minh, Việt Nam <br/>
                            Email này được gửi tự động, vui lòng không phản hồi trực tiếp.
                        </Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
};

OtpEmail.PreviewProps = {
    otpCode: '482931',
    userName: 'Thành Luân Võ',
} as OtpEmailProps;

export default OtpEmail;