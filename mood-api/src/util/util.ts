import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { Logger } from './logger';
import { RegexType } from './types';

const logger = new Logger('Util');

export class Util {
  public static getRegex(type: RegexType): RegExp {
    switch (type) {
      case RegexType.Alphanumeric:
        return new RegExp('^[a-zA-Z0-9_]*$');
      case RegexType.LeadingHashtag:
        return new RegExp('(#+[a-zA-Z0-9(_)]{1,})');
      case RegexType.Name:
        return new RegExp('^[a-zA-Z0-9]*$');
      case RegexType.Email:
        return new RegExp('^[^@]+@[^@]+.[^@]+$');
      case RegexType.DayDate: // MM-DD-YYYY
        return new RegExp(
          '^([0]?[1-9]|[1|2][0-9]|[3][0|1])[-]([0]?[1-9]|[1][0-2])[-]([0-9]{4}|[0-9]{2})$',
        );
    }
  }

  public static sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  public static isNewEntity(entity: any): boolean {
    if (!entity.id && !entity.uid) {
      return true;
    }

    return false;
  }

  public static removeObjProps(object: any, propsToRemove: string[]): any {
    const newObject = { ...object };
    const keys = Object.keys(object);

    for (const propToRemove of propsToRemove) {
      if (keys.includes(propToRemove)) {
        delete newObject[propToRemove];
      }
    }
  }

  public static checkRequiredFields(object: any, props: string[]) {
    const keys = Object.keys(object);

    for (const prop of props) {
      if (!keys.includes(prop)) {
        throw new BadRequestException(`Missing required field: ${prop}`);
      }
    }
  }

  public static validateUserSelfUpdate(
    reqUserId: number,
    entityUserId: number,
  ) {
    if (reqUserId !== entityUserId) {
      throw new UnauthorizedException('Incorrect user');
    }
  }

  public static validateExists(entity: any) {
    if (!entity) {
      throw new BadRequestException('Unable to find record');
    }
  }
}
