import { User } from "../user/user";
import { ValidationUtil } from "../../utils/validation-util";
import { DataTransformUtil } from "../../utils/data-transform-util";

export class UserFormValidation {
  readonly isUserNameValid: boolean;
  readonly isEmailValid: boolean;
  readonly isNameValid: boolean;
  readonly arePermissionsValid: boolean;
  readonly isPasswordValid: boolean;
  readonly isSecondPasswordValid: boolean;
  readonly isValid: boolean;

  readonly userNameErrors: string[];
  readonly emailErrors: string[];
  readonly nameErrors: string[];
  readonly permissionErrors: string[];
  readonly passwordErrors: string[];
  readonly secondPasswordErrors: string[];

  readonly isInitial: boolean;
  readonly ignorePassword: boolean;

  private constructor(
    userNameErrors: string[],
    emailErrors: string[],
    nameErrors: string[],
    permissionErrors: string[],
    passwordErrors: string[],
    secondPasswordErrors: string[],
    isInitial: boolean,
    ignorePassword: boolean
  ) {
    this.isUserNameValid = isInitial || userNameErrors.length === 0;
    this.isEmailValid = isInitial || emailErrors.length === 0;
    this.isNameValid = isInitial || nameErrors.length === 0;
    this.arePermissionsValid = isInitial || permissionErrors.length === 0;
    this.isPasswordValid =
      isInitial || ignorePassword || passwordErrors.length === 0;
    this.isSecondPasswordValid =
      isInitial || ignorePassword || secondPasswordErrors.length === 0;
    this.userNameErrors = userNameErrors;
    this.emailErrors = emailErrors;
    this.nameErrors = nameErrors;
    this.permissionErrors = permissionErrors;
    this.passwordErrors = passwordErrors;
    this.secondPasswordErrors = secondPasswordErrors;
    this.isValid =
      this.isEmailValid &&
      this.isNameValid &&
      this.arePermissionsValid &&
      this.isPasswordValid &&
      this.isSecondPasswordValid;
    this.isInitial = isInitial;
    this.ignorePassword = ignorePassword;
  }

  private static validateEmail(
    email: string,
    existingEmails: Set<string>
  ): string[] {
    if (email.length === 0) {
      return ["E-mail address is empty"];
    }
    if (!ValidationUtil.isValidEmail(email)) {
      return ["E-mail address is invalid"];
    }
    if (existingEmails.has(email)) {
      return ["E-mail address already exists"];
    }
    return [];
  }

  private static validateName(name: string): string[] {
    if (name.length === 0) {
      return ["Name is empty"];
    }
    return [];
  }

  private static validateUserName(userName: string): string[] {
    if (userName.length === 0) {
      return ["User name is empty"];
    }
    if (new RegExp(/\s/).test(userName)) {
      return ["User name contains whitespaces"];
    }
    return [];
  }

  private static validatePermissions(permissions: number): string[] {
    if (permissions <= 0) {
      return ["No permissions assigned"];
    }
    return [];
  }

  private static validatePassword(password: string): string[] {
    if (password.length === 0) {
      return ["Password is empty"];
    }
    if (password.length < 8) {
      return ["Password is too short"];
    }
    return [];
  }

  private static validateSecondPassword(
    password: string,
    secondPassword: string
  ): string[] {
    if (password.length > 0 && secondPassword !== password) {
      return ["Passwords do not match"];
    }
    return [];
  }

  static create(ignorePassword: boolean): UserFormValidation {
    return new UserFormValidation([], [], [], [], [], [], true, ignorePassword);
  }

  static from(user: User, existingEmails: Set<string>): UserFormValidation {
    const userNameErrors = this.validateUserName(user.userName);
    const emailErrors = this.validateEmail(user.email, existingEmails);
    const nameErrors = this.validateName(user.name);
    const permissionErrors = this.validatePermissions(user.permissions);
    return new UserFormValidation(
      userNameErrors,
      emailErrors,
      nameErrors,
      permissionErrors,
      [],
      [],
      false,
      true
    );
  }

  getUserNameErrors(): string[] {
    return this.isInitial ? [] : this.userNameErrors;
  }

  getEmailErrors(): string[] {
    return this.isInitial ? [] : this.emailErrors;
  }

  getNameErrors(): string[] {
    return this.isInitial ? [] : this.nameErrors;
  }

  getPermissionsErrors(): string[] {
    return this.isInitial ? [] : this.permissionErrors;
  }

  getPasswordErrors(): string[] {
    return this.isInitial || this.ignorePassword ? [] : this.passwordErrors;
  }

  getSecondPasswordErrors(): string[] {
    return this.isInitial || this.ignorePassword
      ? []
      : this.secondPasswordErrors;
  }

  withUserName(userName: string): UserFormValidation {
    return this.copy({
      userNameErrors: UserFormValidation.validateUserName(userName),
      isInitial: false,
    });
  }

  withEmail(email: string, existingEmails: Set<string>): UserFormValidation {
    const emailErrors = UserFormValidation.validateEmail(email, existingEmails);
    return this.copy({ emailErrors: emailErrors, isInitial: false });
  }

  withName(name: string): UserFormValidation {
    return this.copy({
      nameErrors: UserFormValidation.validateName(name),
      isInitial: false,
    });
  }

  withPermissions(permissions: number): UserFormValidation {
    const permissionsErrors = UserFormValidation.validatePermissions(
      permissions
    );
    return this.copy({ permissionErrors: permissionsErrors, isInitial: false });
  }

  withPassword(password: string): UserFormValidation {
    return this.copy({
      passwordErrors: UserFormValidation.validatePassword(password),
      isInitial: false,
    });
  }

  withSecondPassword(
    password: string,
    secondPassword: string
  ): UserFormValidation {
    const secondPasswordErrors = UserFormValidation.validateSecondPassword(
      password,
      secondPassword
    );
    return this.copy({
      secondPasswordErrors: secondPasswordErrors,
      isInitial: false,
    });
  }

  validated(): UserFormValidation {
    return this.copy({ isInitial: false });
  }

  private copy(values: Partial<UserFormValidation>): UserFormValidation {
    return new UserFormValidation(
      DataTransformUtil.getOrElse(values.userNameErrors, this.userNameErrors),
      DataTransformUtil.getOrElse(values.emailErrors, this.emailErrors),
      DataTransformUtil.getOrElse(values.nameErrors, this.nameErrors),
      DataTransformUtil.getOrElse(
        values.permissionErrors,
        this.permissionErrors
      ),
      DataTransformUtil.getOrElse(values.passwordErrors, this.passwordErrors),
      DataTransformUtil.getOrElse(
        values.secondPasswordErrors,
        this.secondPasswordErrors
      ),
      DataTransformUtil.getOrElse(values.isInitial, this.isInitial),
      DataTransformUtil.getOrElse(values.ignorePassword, this.ignorePassword)
    );
  }
}
