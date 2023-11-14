import { PasswordChangeValidation } from "./password-change-validation";
import { DataTransformUtil } from "../../utils/data-transform-util";
import { Login } from "../login/login";

export class PasswordChangeFormData {
  readonly email: string;
  readonly oldPassword: string;
  readonly newPassword: string;
  readonly secondPassword: string;
  readonly validation: PasswordChangeValidation;

  private constructor(
    email: string,
    oldPassword: string,
    newPassword: string,
    secondPassword: string,
    validation: PasswordChangeValidation
  ) {
    this.email = email;
    this.oldPassword = oldPassword;
    this.newPassword = newPassword;
    this.secondPassword = secondPassword;
    this.validation = validation;
  }

  static create(email: string): PasswordChangeFormData {
    return new PasswordChangeFormData(
      email,
      "",
      "",
      "",
      PasswordChangeValidation.create()
    );
  }

  withOldPassword(password: string): PasswordChangeFormData {
    return this.copy({
      oldPassword: password,
      validation: this.validation.withOldPassword(password),
    });
  }

  withNewPassword(password: string): PasswordChangeFormData {
    return this.copy({
      newPassword: password,
      validation: this.validation.withNewPassword(password),
    });
  }

  withSecondPassword(password: string): PasswordChangeFormData {
    const newValidation = this.validation.withSecondPassword(
      this.newPassword,
      password
    );
    return this.copy({ secondPassword: password, validation: newValidation });
  }

  toData(): Login {
    return {
      email: this.email,
      password: this.oldPassword,
      newPassword: this.newPassword,
    };
  }

  validated(): PasswordChangeFormData {
    return this.copy({ validation: this.validation.validated() });
  }

  private copy(
    values: Partial<PasswordChangeFormData>
  ): PasswordChangeFormData {
    return new PasswordChangeFormData(
      DataTransformUtil.getOrElse(values.email, this.email),
      DataTransformUtil.getOrElse(values.oldPassword, this.oldPassword),
      DataTransformUtil.getOrElse(values.newPassword, this.newPassword),
      DataTransformUtil.getOrElse(values.secondPassword, this.secondPassword),
      DataTransformUtil.getOrElse(values.validation, this.validation)
    );
  }
}
