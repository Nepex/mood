import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { RegexType } from '../types';
import { Util } from '../util';

@ValidatorConstraint({ name: 'uidValidator', async: false })
export class UidValidator implements ValidatorConstraintInterface {
  validate(value: string) {
    return (
      Util.getRegex(RegexType.Alphanumeric).test(value) && value.length === 32
    );
  }

  defaultMessage() {
    return 'Uid is not a valid uid';
  }
}
