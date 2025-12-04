import { Injectable } from '@nestjs/common';
import { exec } from 'child_process';

@Injectable()
export class BrowserProvider {
	/**
	 * Tự động mở browser với URL được chỉ định
	 * @param url - URL cần mở
	 * @param browser - Tên browser (mặc định: Google Chrome)
	 */
	openBrowser(url: string, browser: string = 'Google Chrome'): void {
		if (process.env.NODE_ENV !== 'development') {
			return;
		}

		const platform = process.platform;
		let command: string;

		switch (platform) {
			case 'darwin':
				// macOS
				command = `open -a "${browser}" "${url}"`;
				break;
			case 'win32':
				// Windows
				command = browser === 'Google Chrome' 
					? `start chrome "${url}"`
					: `start ${browser.toLowerCase()} "${url}"`;
				break;
			case 'linux':
				// Linux
				command = `xdg-open "${url}"`;
				break;
			default:
				console.log(`⚠️  Platform không được hỗ trợ: ${platform}`);
				return;
		}

		exec(command, (error) => {
			if (error) {
				console.log(`⚠️  Không thể tự động mở browser. Vui lòng mở thủ công: ${url}`);
			} else {
				console.log(`🌐 Đã mở ${browser} với URL: ${url}`);
			}
		});
	}

	/**
	 * Mở Swagger UI
	 * @param port - Port của server
	 */
	openSwagger(port: number): void {
		const swaggerUrl = `http://localhost:${port}/docs`;
		this.openBrowser(swaggerUrl);
	}

	/**
	 * Mở URL tùy chỉnh
	 * @param port - Port của server
	 * @param path - Đường dẫn (mặc định: '/')
	 */
	openUrl(port: number, path: string = '/'): void {
		const url = `http://localhost:${port}${path}`;
		this.openBrowser(url);
	}
}

