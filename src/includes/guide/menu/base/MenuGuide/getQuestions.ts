import { AbstractState, Guide } from '@/guide/abc/type';
import { TerminalCommand, Question, QUESTION_TYPE } from '@/settings/extension';
import Optional from '@/utils/optional';

function getQuestions(
  name: string,
  command: TerminalCommand,
  questions: Record<string, Question>,
  state: Partial<AbstractState>
): Array<Guide> {
  const keys = Object.keys(questions);

  const first = Optional.ofNullable(keys.shift()).orElseThrow(
    ReferenceError('Question not found...')
  );

  state.itemId = first;

  const guides = [] as Array<Guide>;

  keys.forEach((key) => {
    guides.push(getGuide(key, command, questions));
  });

  return [
    getGuide(
      first,
      command,
      questions,
      Object.assign(state, { guides: guides, name: name })
    ),
  ];
}

function getGuide(
  name: string,
  command: TerminalCommand,
  questions: Record<string, Question>,
  state?: Partial<AbstractState>
): Guide {
  const guide = {} as Guide;
  const question = questions[name];

  guide.key =
    question.type === QUESTION_TYPE.text
      ? 'QuestionInputGuide'
      : 'SelectQuestionGuide';
  guide.state = state ? state : { itemId: name };
  guide.args = [command, question];

  return guide;
}

export default getQuestions;
