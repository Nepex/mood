import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Util } from '../util';

@ValidatorConstraint({ name: 'uidValidator', async: false })
export class UidValidator implements ValidatorConstraintInterface {
  validate(text: string) {
    const alphaRegex = Util.getRegex('alphanumeric');
    return alphaRegex.test(text) && text.length === 32;
  }

  defaultMessage() {
    return 'Uid is not a valid uid';
  }
}
