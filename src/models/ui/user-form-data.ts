import { UserFormValidation } from "./user-form-validation";
import { User } from "../user/user";
import { DataTransformUtil } from "../../utils/data-transform-util";

export class UserFormData {
  readonly id: number | undefined;
  readonly userName: string;
  readonly email: string;
  readonly isAdmin: boolean;
  readonly locked: boolean;
  readonly name: string;
  readonly permissions: number;
  readonly password: string;
  readonly secondPassword: string;
  readonly createdAt: string | undefined;
  readonly validation: UserFormValidation;

  private constructor(
    id: number | undefined,
    userName: string,
    email: string,
    isAdmin: boolean,
    locked: boolean,
    name: string,
    permissions: number,
    password: string,
    secondPassword: string,
    createdAt: string | undefined,
    validation: UserFormValidation
  ) {
    this.id = id;
    this.userName = userName;
    this.email = email;
    this.isAdmin = isAdmin;
    this.locked = locked;
    this.name = name;
    this.permissions = permissions;
    this.password = password;
    this.secondPassword = secondPassword;
    this.createdAt = createdAt;
    this.validation = validation;
  }

  static create(data?: User): UserFormData {
    return new UserFormData(
      data?.id,
      data?.userName || "",
      data?.email || "",
      data?.isAdmin === true,
      data?.locked === true,
      data?.name || "",
      data?.permissions || 0,
      data?.password || "",
      data?.password || "",
      data?.createdAt,
      UserFormValidation.create(data !== undefined && data.id > 0)
    );
  }

  withId(id: number | undefined): UserFormData {
    return this.copy({ id: id });
  }

  withUserName(userName: string): UserFormData {
    return this.copy({
      userName: userName,
      validation: this.validation.withUserName(userName),
    });
  }

  withName(name: string): UserFormData {
    return this.copy({
      name: name,
      validation: this.validation.withName(name),
    });
  }

  withEmail(email: string, existingEmails: Set<string>): UserFormData {
    return this.copy({
      email: email,
      validation: this.validation.withEmail(email, existingEmails),
    });
  }

  withPermissions(permissions: number): UserFormData {
    return this.copy({
      permissions: permissions,
      validation: this.validation.withPermissions(permissions),
    });
  }

  withPassword(password: string): UserFormData {
    return this.copy({
      password: password,
      validation: this.validation.withPassword(password),
    });
  }

  withSecondPassword(secondPassword: string): UserFormData {
    const validation = this.validation.withSecondPassword(
      this.password,
      secondPassword
    );
    return this.copy({
      secondPassword: secondPassword,
      validation: validation,
    });
  }

  withIsAdmin(isAdmin: boolean): UserFormData {
    return this.copy({ isAdmin: isAdmin });
  }

  withLocked(locked: boolean): UserFormData {
    return this.copy({ locked: locked });
  }

  withCreatedAt(createdAt: string | undefined): UserFormData {
    return this.copy({ createdAt: createdAt });
  }

  hasPermission(permission: number): boolean {
    return (this.permissions & permission) > 0;
  }

  validated(existingEmails: Set<string>): UserFormData {
    const validation = this.validation
      .withUserName(this.userName)
      .withName(this.name)
      .withEmail(this.email, existingEmails)
      .withPermissions(this.permissions)
      .withPassword(this.password)
      .withSecondPassword(this.password, this.secondPassword)
      .validated();
    return this.copy({ validation: validation });
  }

  toData(): User {
    return {
      id: this.id || 0,
      userName: this.userName,
      email: this.email,
      isAdmin: this.isAdmin,
      locked: this.locked,
      name: this.name,
      permissions: this.permissions,
      password: this.password.length > 0 ? this.password : undefined,
      createdAt: this.createdAt,
    };
  }

  private copy(values: Partial<UserFormData>): UserFormData {
    return new UserFormData(
      DataTransformUtil.getOrElseOpt(values.id, this.id),
      DataTransformUtil.getOrElse(values.userName, this.userName),
      DataTransformUtil.getOrElse(values.email, this.email),
      DataTransformUtil.getOrElse(values.isAdmin, this.isAdmin),
      DataTransformUtil.getOrElse(values.locked, this.locked),
      DataTransformUtil.getOrElse(values.name, this.name),
      DataTransformUtil.getOrElse(values.permissions, this.permissions),
      DataTransformUtil.getOrElse(values.password, this.password),
      DataTransformUtil.getOrElse(values.secondPassword, this.secondPassword),
      DataTransformUtil.getOrElseOpt(values.createdAt, this.createdAt),
      DataTransformUtil.getOrElse(values.validation, this.validation)
    );
  }
}
