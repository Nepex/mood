import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { RegexType } from '../types';
import { Util } from '../util';

@ValidatorConstraint({ name: 'dayDateValidator', async: false })
export class DayDateValidator implements ValidatorConstraintInterface {
  validate(value: string) {
    if (typeof value !== 'string') return false;

    return Util.getRegex(RegexType.DayDate).test(value);
  }

  defaultMessage() {
    return 'Day is not proper MM-DD-YYYY format';
  }
}
