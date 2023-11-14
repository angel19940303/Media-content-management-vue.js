import { DataTransformUtil } from "../../utils/data-transform-util";

export class PasswordChangeValidation {
  readonly isValid: boolean;
  readonly isOldPasswordValid: boolean;
  readonly isNewPasswordValid: boolean;
  readonly isSecondPasswordValid: boolean;

  readonly oldPasswordErrors: string[];
  readonly newPasswordErrors: string[];
  readonly secondPasswordErrors: string[];

  readonly isInitial: boolean;

  private constructor(
    oldPasswordErrors: string[],
    newPasswordErrors: string[],
    secondPasswordErrors: string[],
    isInitial: boolean
  ) {
    this.isOldPasswordValid = isInitial || oldPasswordErrors.length === 0;
    this.isNewPasswordValid = isInitial || newPasswordErrors.length === 0;
    this.isSecondPasswordValid = isInitial || secondPasswordErrors.length === 0;
    this.oldPasswordErrors = oldPasswordErrors;
    this.newPasswordErrors = newPasswordErrors;
    this.secondPasswordErrors = secondPasswordErrors;
    this.isInitial = isInitial;
    this.isValid =
      this.isOldPasswordValid &&
      this.isNewPasswordValid &&
      this.isSecondPasswordValid;
  }

  static create() {
    return new PasswordChangeValidation([], [], [], true);
  }

  private static validatePassword(password: string): string[] {
    if (password.length === 0) {
      return ["Password is empty"];
    }
    return [];
  }

  private static validateNewPassword(password: string): string[] {
    const passwordErrors = this.validatePassword(password);
    if (passwordErrors.length > 0) {
      return passwordErrors;
    }
    if (password.length < 8) {
      return ["Password is shorter than 8 characters"];
    }
    return [];
  }

  private static validateSecondPassword(
    password: string,
    secondPassword: string
  ): string[] {
    if (password.length > 0 && password !== secondPassword) {
      return ["Passwords do not match"];
    }
    return [];
  }

  getOldPasswordErrors(): string[] {
    return this.isInitial ? [] : this.oldPasswordErrors;
  }

  getNewPasswordErrors(): string[] {
    return this.isInitial ? [] : this.newPasswordErrors;
  }

  getSecondPasswordErrors(): string[] {
    return this.isInitial ? [] : this.secondPasswordErrors;
  }

  withOldPassword(password: string): PasswordChangeValidation {
    const errors = PasswordChangeValidation.validatePassword(password);
    return this.copy({ oldPasswordErrors: errors, isInitial: false });
  }

  withNewPassword(password: string): PasswordChangeValidation {
    const errors = PasswordChangeValidation.validateNewPassword(password);
    return this.copy({ newPasswordErrors: errors, isInitial: false });
  }

  withSecondPassword(
    password: string,
    secondPassword: string
  ): PasswordChangeValidation {
    const errors = PasswordChangeValidation.validateSecondPassword(
      password,
      secondPassword
    );
    return this.copy({ secondPasswordErrors: errors, isInitial: false });
  }

  validated(): PasswordChangeValidation {
    return this.copy({ isInitial: false });
  }

  private copy(
    values: Partial<PasswordChangeValidation>
  ): PasswordChangeValidation {
    return new PasswordChangeValidation(
      DataTransformUtil.getOrElse(
        values.oldPasswordErrors,
        this.oldPasswordErrors
      ),
      DataTransformUtil.getOrElse(
        values.newPasswordErrors,
        this.newPasswordErrors
      ),
      DataTransformUtil.getOrElse(
        values.secondPasswordErrors,
        this.secondPasswordErrors
      ),
      DataTransformUtil.getOrElse(values.isInitial, this.isInitial)
    );
  }
}
