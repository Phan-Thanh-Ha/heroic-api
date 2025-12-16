import { BadRequestException, Injectable, ValidationError, ValidationPipe } from '@nestjs/common';

// Kiểu lỗi chuẩn trả về cho FE
export interface NormalizedValidationError {
	field: string;
	errorCode: string;
	message: string;
}

// Map constraint -> errorCode, dễ thêm/sửa
const CONSTRAINT_CODE_MAP: Record<string, string> = {
	isNotEmpty: 'FIELD_REQUIRED',
	isEmail: 'INVALID_FORMAT',
	isString: 'INVALID_FORMAT',
	isInt: 'INVALID_FORMAT',
};

@Injectable()
export class ValidationProvider {
	createValidationPipe(): ValidationPipe {
		return new ValidationPipe({
			whitelist: true,
			transform: true,
			// Giữ nguyên message tiếng Việt từ DTO, chỉ chuẩn hoá format lỗi
			exceptionFactory: (errors: ValidationError[]) => this.buildException(errors),
		});
	}

	private buildException(errors: ValidationError[]) {
		const normalizedErrors = this.normalizeErrors(errors);

		throw new BadRequestException({
			message: 'Validation Failed',
			errors: normalizedErrors,
		});
	}

	// Chuyển danh sách ValidationError phức tạp thành mảng lỗi phẳng
	private normalizeErrors(errors: ValidationError[]): NormalizedValidationError[] {
		return errors.reduce<NormalizedValidationError[]>((acc, error) => {
			return acc.concat(this.flattenError(error));
		}, []);
	}

	// Flatten 1 ValidationError (kể cả children) thành mảng lỗi
	private flattenError(error: ValidationError): NormalizedValidationError[] {
		// Nếu không có constraints nhưng có children, duyệt tiếp children
		if (!error.constraints && error.children && error.children.length > 0) {
			return error.children.flatMap((child) => this.flattenError(child));
		}

		// Không có lỗi cụ thể
		if (!error.constraints) {
			return [];
		}

		return Object.entries(error.constraints).map(([constraintKey, message]) => ({
			field: error.property,
			errorCode: this.mapConstraintToCode(constraintKey),
			message, // message tiếng Việt lấy từ DTO
		}));
	}

	private mapConstraintToCode(constraintKey: string): string {
		return CONSTRAINT_CODE_MAP[constraintKey] ?? 'VALIDATION_ERROR';
	}
}

