import * as Constant from '@/constant';

class BaseValidator {
  public static async validateRequired(
    value: string
  ): Promise<string | undefined> {
    if (!value || value.length === 0) {
      return new Promise<string>((resolve) => {
        resolve(Constant.message.validate.required);
      });
    } else {
      return undefined;
    }
  }
}

export { BaseValidator };
