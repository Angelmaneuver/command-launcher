import { headline } from './_headline';
import { placeholder } from './_placeholder';
import { showInformationMessage } from './_showInformationMessage';
import { validate } from './_validate';
import { word } from './_word';

const message = {
  headline,
  placeholder,
  validate,
  showInformationMessage,
  word,
} as const;

export { message };
