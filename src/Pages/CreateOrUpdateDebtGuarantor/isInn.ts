import {
  buildMessage,
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
const regex = /^(\d{10}|\d{12})$/;
function checkINN(input: string) {
  input = '' + input;
  const numbers = input.split('').map(Number);
  if (
    numbers.length == 10 &&
    numbers[9] ==
      ((2 * numbers[0] +
        4 * numbers[1] +
        10 * numbers[2] +
        3 * numbers[3] +
        5 * numbers[4] +
        9 * numbers[5] +
        4 * numbers[6] +
        6 * numbers[7] +
        8 * numbers[8]) %
        11) %
        10
  ) {
    return true;
    //для ИНН в 12 знаков
  } else if (
    numbers.length == 12 &&
    numbers[10] ==
      ((7 * numbers[0] +
        2 * numbers[1] +
        4 * numbers[2] +
        10 * numbers[3] +
        3 * numbers[4] +
        5 * numbers[5] +
        9 * numbers[6] +
        4 * numbers[7] +
        6 * numbers[8] +
        8 * numbers[9]) %
        11) %
        10 &&
    numbers[11] ==
      ((3 * numbers[0] +
        7 * numbers[1] +
        2 * numbers[2] +
        4 * numbers[3] +
        10 * numbers[4] +
        3 * numbers[5] +
        5 * numbers[6] +
        9 * numbers[7] +
        4 * numbers[8] +
        6 * numbers[9] +
        8 * numbers[10]) %
        11) %
        10
  ) {
    return true;
  } else {
    return false;
  }
}
@ValidatorConstraint({ name: 'isInn' })
export class IsInnConstructor implements ValidatorConstraintInterface {
  validate(value: string, args: ValidationArguments): boolean {
    args.constraints[0].notValid = false;
    if (regex.test(value)) {
      args.constraints[0].notValid = true;
      return checkINN(value);
    } else {
      return false;
    }
  }
  defaultMessage(args: ValidationArguments): string {
    if (args.constraints[0]?.notValid) return `This text '($value)' is not inn`;
    return `This text '$value' length not 10 and 12`;
  }
}
export function IsInn(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isInn',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [{ notValid: false }],
      options: validationOptions,
      validator: IsInnConstructor,
    });
  };
}
