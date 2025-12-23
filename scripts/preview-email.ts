import { render } from '@react-email/render';
import { OtpEmail } from '../src/mail/templates/otp-email';
import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';

async function previewEmail() {
  try {
    console.log('🎨 Rendering OTP email template...\n');

    // Render HTML
    const html = await render(
      OtpEmail({
        otpCode: '482931',
        userName: 'Phan Hà',
      }),
    );

    // Tạo file HTML tạm thời
    const tempDir = path.join(__dirname, '../email-preview');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const htmlPath = path.join(tempDir, 'otp-email.html');
    const txtPath = path.join(tempDir, 'otp-email.txt');

    // Xóa file cũ nếu có (tự động cleanup)
    if (fs.existsSync(htmlPath)) {
      fs.unlinkSync(htmlPath);
    }
    if (fs.existsSync(txtPath)) {
      fs.unlinkSync(txtPath);
    }

    // Tạo file mới
    fs.writeFileSync(htmlPath, html);

    console.log('═══════════════════════════════════════════════════════════');
    console.log('✅ Render thành công!');
    console.log('═══════════════════════════════════════════════════════════\n');
    console.log(`📄 File HTML: ${htmlPath}`);
    console.log('🌐 Đang mở trong browser...\n');

    // Mở trong browser
    const platform = process.platform;
    let command: string;

    if (platform === 'darwin') {
      command = `open "${htmlPath}"`;
    } else if (platform === 'win32') {
      command = `start "" "${htmlPath}"`;
    } else {
      command = `xdg-open "${htmlPath}"`;
    }

    exec(command, (error) => {
      if (error) {
        console.log(`⚠️  Không thể tự động mở browser. Vui lòng mở file thủ công:`);
        console.log(`   ${htmlPath}\n`);
      } else {
        console.log('✨ Đã mở trong browser!\n');
        console.log('💡 File được tự động tạo mới mỗi lần chạy preview.');
        console.log('   File cũ sẽ tự động bị thay thế khi chạy lại.\n');
      }
    });
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

previewEmail();

