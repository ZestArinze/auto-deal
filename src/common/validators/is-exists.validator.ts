import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { EntityManager } from 'typeorm';

export interface ExistsConstraintInput {
  table: string;
  col: string;
  inputProperty: string;
}

export interface IsExistsValidationOptions extends ValidationOptions {
  context: ExistsConstraintInput;
}

export function IsExists(validationOptions: IsExistsValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsExistsConstraint',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [validationOptions.context],
      validator: IsExistsConstraint,
    });
  };
}

@Injectable()
@ValidatorConstraint({ name: 'isExistsConstraint', async: true })
export class IsExistsConstraint implements ValidatorConstraintInterface {
  private message = 'A record for this input does not exist.';

  constructor(private readonly entityManager: EntityManager) {}

  async validate(value: string, args: ValidationArguments): Promise<boolean> {
    console.log({ args: args });
    console.log({ constraintsZero: args.constraints[0] });

    const { table, col, inputProperty } = args
      .constraints[0] as ExistsConstraintInput;

    const valueToFind = args.object[inputProperty];

    try {
      const data = await this.entityManager
        .getRepository(table)
        .createQueryBuilder(table)
        .where({ [col]: valueToFind })
        .getOne();

      if (data) {
        return true;
      } else {
        this.message = `The selected ${inputProperty} does not exist`;
        return false;
      }
    } catch (error) {
      this.message = `Something went wrong`;
      return false;
    }
  }

  defaultMessage(args: ValidationArguments) {
    return this.message;
  }
}
