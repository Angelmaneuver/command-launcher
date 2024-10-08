import AbstractEditMenuGuide from './AbstractEditMenuGuide';

import { State } from '@/guide/base/type';
import { Question, DataType } from '@/settings/extension';
import Optional from '@/utils/optional';

abstract class AbstractQuestionEditMenuGuide extends AbstractEditMenuGuide {
  protected root: boolean;

  constructor(state: State, type: DataType, root: boolean = false) {
    super(state, type);

    this.root = root;
  }

  protected async delete(): Promise<void> {
    const hierarchy = [...this.hierarchy];

    this.settings.delete(hierarchy, this.location);

    hierarchy.pop();

    if (
      0 ===
      Object.keys(
        this.settings.lookup(
          hierarchy,
          this.location,
          this.settings.lookupMode.read
        )
      ).length
    ) {
      this.settings.delete(hierarchy, this.location);
    }

    await this.settings.commit(this.location);

    this.updateEnd(this.processType.deleted);
  }

  protected async save(): Promise<void> {
    const target = this.settings.lookup(
      [...this.hierarchy],
      this.location,
      this.settings.lookupMode.read
    );

    const parent = [...this.hierarchy];

    const pre = Optional.ofNullable(parent.pop()).orElseThrow(
      ReferenceError('Edit target not found...')
    );

    const name = this.guideGroupResultSet[this.settings.itemId.name] as string;

    Object.keys(this.guideGroupResultSet).forEach((key) => {
      if (this.settings.itemId.name === key) {
        return;
      }

      target[key] = this.guideGroupResultSet[key];
    });

    if (this.settings.itemId.name in this.guideGroupResultSet) {
      const original = this.settings.cloneDeep(parent, this.location);

      this.settings.delete(parent, this.location);

      const target = this.settings.lookup(
        parent,
        this.location,
        this.settings.lookupMode.write
      );

      Object.keys(original).forEach((key) => {
        target[pre === key ? name : key] = original[key];
      });
    }

    if (this.settings.itemId.orderNo in this.guideGroupResultSet) {
      this.settings.sort(parent, this.location, false);
    }

    await this.settings.commit(this.location);

    this.updateEnd(this.processType.updated);
  }

  protected get isRoot(): boolean {
    return this.root;
  }

  protected get currentHierarchy(): unknown {
    return this.settings.lookup(
      this.hierarchy,
      this.location,
      this.settings.lookupMode.read
    );
  }

  protected get questions(): Record<string, Question> {
    return this.lookup(this.hierarchy.concat(this.settings.itemId.questions));
  }

  protected get questionsFromSetting(): Record<string, Question> {
    const hierarchy = [...this.hierarchy];

    hierarchy.pop();

    return this.lookup(hierarchy);
  }

  private lookup(hierarchy: Array<string>): Record<string, Question> {
    return this.settings.lookup(
      hierarchy,
      this.location,
      this.settings.lookupMode.read,
      true
    ) as Record<string, Question>;
  }

  protected get question(): Question {
    return this.currentHierarchy as Question;
  }
}

export default AbstractQuestionEditMenuGuide;
