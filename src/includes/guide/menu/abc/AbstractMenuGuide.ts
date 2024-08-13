import { ExtensionContext, QuickPickItem } from 'vscode';

import * as Constant from '@/constant';
import AbstractQuickPickSelectGuide from '@/guide/base/AbstractQuickPickSelectGuide';
import { State } from '@/guide/base/type';
import ExtensionSetting, {
  BaseCommandType,
  Folder,
  Command,
  TerminalCommand,
  Commands,
  Location,
} from '@/settings/extension';
import Optional from '@/utils/optional';

abstract class AbstractMenuGuide extends AbstractQuickPickSelectGuide {
  constructor(state: State, context?: ExtensionContext) {
    super(state, context);

    if (this.isRoot) {
      this.state.settings = new ExtensionSetting();
    }
  }

  public init(): void {
    super.init();

    this.placeholder = Constant.message.placeholder.menu.select;
  }

  protected prev(): void {
    const hierarchy = [...this.hierarchy];

    hierarchy.pop();

    this.state.hierarchy = hierarchy;

    super.prev();
  }

  protected get isRoot(): boolean {
    return (
      this.settings.location.root === this.location ||
      0 === this.hierarchy.length
    );
  }

  protected getCommands(
    hierarchy: Array<string>,
    allowEmpty: boolean = false
  ): Commands {
    let records: Commands = {};

    if (this.isRoot) {
      records = this.settings.getEntryPoint();
    } else {
      records = this.settings.lookup(
        hierarchy,
        this.location,
        this.settings.lookupMode.read,
        allowEmpty
      );
    }

    const commands = {} as Commands;

    Object.keys(records).forEach((key) => {
      if (!this.settings.itemIdValues.includes(key)) {
        commands[key] = records[key];
      }
    });

    return commands;
  }

  protected get currentCommands(): Commands {
    return this.getCommands(this.hierarchy);
  }

  protected get currentCommandsWithAllowEmpty(): Commands {
    return this.getCommands(this.hierarchy, true);
  }

  protected get parentCommands(): Commands {
    const hierarchy = [...this.hierarchy];

    hierarchy.pop();

    return this.getCommands(hierarchy);
  }

  protected get commandItems(): QuickPickItem[] {
    const records = this.isRoot
      ? this.settings.getEntryPoint()
      : this.currentCommands;

    return Object.keys(records).map((key) => {
      const item = records[key] as BaseCommandType;

      return {
        label: `${item.label} ${key}`,
        description: `${item.description}`,
      };
    });
  }

  protected getCurrentCommandInfo<
    T extends BaseCommandType = BaseCommandType
  >(): T {
    const name =
      this.hierarchy.length > 0
        ? this.hierarchy[this.hierarchy.length - 1]
        : '';

    const command = this.settings.cloneDeep<T>(this.hierarchy, this.location);

    command.name = name;

    if (
      this.settings.dataType.terminalCommand ===
      command[this.settings.itemId.type]
    ) {
      const temporary: Record<string, unknown> = {};

      temporary[this.settings.itemId.questions] = {};
      temporary[this.settings.itemId.autoRun] = true;
      temporary[this.settings.itemId.singleton] = false;

      return {
        ...temporary,
        ...command,
      };
    } else {
      return command;
    }
  }

  protected getCommand(
    name: string
  ): [Folder | Command | TerminalCommand, string, Location] {
    const error = ReferenceError(`Command item '${name}' not found...`);

    const [data, key, location] = this.isRoot
      ? this.getRecordFromEntryPoint(name, error)
      : this.getRecord(name, error);

    const type = Optional.ofNullable(
      data[this.settings.itemId.type]
    ).orElseThrow(error);

    if (this.settings.dataType.command === type) {
      return [data as Command, key, location];
    } else if (this.settings.dataType.terminalCommand === type) {
      return [data as TerminalCommand, key, location];
    } else {
      return [data as Folder, key, location];
    }
  }

  private getRecordFromEntryPoint(
    name: string,
    error: ReferenceError
  ): [Record<string, unknown>, string, Location] {
    const info: Record<string, unknown> = Optional.ofNullable(
      this.settings.getEntryPoint()[name]
    ).orElseThrow(error);

    const key: string = Optional.ofNullable(info.name as string).orElseThrow(
      error
    );

    const location: Location = Optional.ofNullable(
      info.from as Location
    ).orElseThrow(error);

    const data: Record<string, unknown> =
      this.settings.getLocationRecords(location);

    return [Optional.ofNullable(data[key]).orElseThrow(error), key, location];
  }

  private getRecord(
    name: string,
    error: ReferenceError
  ): [Record<string, unknown>, string, Location] {
    return [
      Optional.ofNullable(this.currentCommands[name]).orElseThrow(error),
      name,
      this.location,
    ];
  }
}

export default AbstractMenuGuide;
