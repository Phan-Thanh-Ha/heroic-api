import { BadRequestException, Injectable, ValidationError, ValidationPipe } from '@nestjs/common';

export interface NormalizedValidationError {
    field: string;
    errorCode: string;
    message: string;
}

const CONSTRAINT_CODE_MAP: Record<string, string> = {
    isNotEmpty: 'FIELD_REQUIRED',
    isEmail: 'INVALID_FORMAT',
    isString: 'INVALID_FORMAT',
    isInt: 'INVALID_FORMAT',
    isNumber: 'INVALID_FORMAT',
    isDateString: 'INVALID_DATE',
};

@Injectable()
export class ValidationProvider {
    createValidationPipe(): ValidationPipe {
        return new ValidationPipe({
            whitelist: true,
            transform: true,
            exceptionFactory: (errors: ValidationError[]) => this.buildException(errors),
        });
    }

    private buildException(errors: ValidationError[]) {
        const normalizedErrors = this.normalizeErrors(errors);
        
        // Console log để debug ở server
        console.log('--- VALIDATION ERROR ---');
        console.dir(normalizedErrors, { depth: null });

        // QUAN TRỌNG: Ném ra một object chứa cả message và errors
        throw new BadRequestException({
            message: 'Dữ liệu không hợp lệ', 
            error: 'Validation Error',
            errors: normalizedErrors, // <--- Chúng ta cần cái này ra FE
        });
    }

    private normalizeErrors(errors: ValidationError[]): NormalizedValidationError[] {
        return errors.reduce<NormalizedValidationError[]>((acc, error) => {
            return acc.concat(this.flattenError(error));
        }, []);
    }

    private flattenError(error: ValidationError): NormalizedValidationError[] {
        if (!error.constraints && error.children && error.children.length > 0) {
            return error.children.flatMap((child) => this.flattenError(child));
        }
        if (!error.constraints) return [];

        return Object.entries(error.constraints).map(([constraintKey, message]) => ({
            field: error.property,
            errorCode: CONSTRAINT_CODE_MAP[constraintKey] ?? 'VALIDATION_ERROR',
            message,
        }));
    }
}