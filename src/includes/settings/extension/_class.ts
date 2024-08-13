import * as _ from 'lodash';
import { ConfigurationTarget } from 'vscode';

import { SettingBase } from '../base';

import {
  ITEM_ID,
  ITEM_ID_VALUE_LIST,
  COMMAND_CONFIGS,
  CONFIG_ITEMS,
  LOCATION,
  LOOKUP_MODE,
  DATA_TYPE,
  QUESTION_TYPE,
} from './_constant';

import type {
  EntryPoint,
  EntryPointRequiredOrderNo,
  BaseCommandType,
  Commands,
  History,
  Location,
  LookupMode,
  SortItem,
  SortRecord,
} from './_type';

import Optional from '@/utils/optional';

class ExtensionSetting extends SettingBase {
  private _commonCommands: Commands;
  private _profileCommands: Commands;
  private _enableHistory: boolean;
  private _keepHistoryNumber: number;
  private _history: Array<History>;

  constructor() {
    super('command-launcher', ConfigurationTarget.Global);

    this._commonCommands = _.cloneDeep(
      this.get<Commands>(this.configItems.commonCommands)!
    );

    this._profileCommands = _.cloneDeep(
      this.get<Commands>(this.configItems.commands)!
    );

    this._enableHistory = this.get<boolean>(this.configItems.enableHistory)!;

    this._keepHistoryNumber = this.get<number>(
      this.configItems.keepHistoryNumber
    )!;

    this._history = _.cloneDeep(
      this.get<Array<History>>(CONFIG_ITEMS.history)
    )!;
  }

  private get configItems() {
    return CONFIG_ITEMS;
  }

  public get itemId() {
    return ITEM_ID;
  }

  public get itemIdValues() {
    return ITEM_ID_VALUE_LIST;
  }

  public get location() {
    return LOCATION;
  }

  public get lookupMode() {
    return LOOKUP_MODE;
  }

  public get dataType() {
    return DATA_TYPE;
  }

  public get questionType() {
    return QUESTION_TYPE;
  }

  public async updateCommands(
    key: (typeof COMMAND_CONFIGS)[keyof typeof COMMAND_CONFIGS],
    value: Commands
  ): Promise<void> {
    if (0 === Object.keys(value).length) {
      return this.remove(key);
    } else {
      return this.update(key, value);
    }
  }

  public set commonCommands(commands: Commands) {
    this._commonCommands = commands;
  }

  public get commonCommands() {
    return this._commonCommands;
  }

  public async updateCommonCommands(): Promise<void> {
    return this.updateCommands(
      this.configItems.commonCommands,
      this._commonCommands
    );
  }

  public set profileCommands(commands: Commands) {
    this._profileCommands = commands;
  }

  public get profileCommands() {
    return this._profileCommands;
  }

  public async updateProfileCommands(): Promise<void> {
    return this.updateCommands(
      this.configItems.commands,
      this._profileCommands
    );
  }

  public async commit(location: Location): Promise<void> {
    if (this.location.user === location) {
      return this.updateCommonCommands();
    } else if (this.location.profile === location) {
      return this.updateProfileCommands();
    } else {
      return;
    }
  }

  public get enableHistory() {
    return this._enableHistory;
  }

  public async updateEnableHistory(value: boolean): Promise<void> {
    this._enableHistory = value;

    if (!value) {
      return this.remove(this.configItems.enableHistory);
    } else {
      return this.update(this.configItems.enableHistory, this.enableHistory);
    }
  }

  public get keepHistoryNumber() {
    return this._keepHistoryNumber;
  }

  public async updateKeepHistoryNumber(value: number): Promise<void> {
    this._keepHistoryNumber = value;

    if (10 === value) {
      return this.remove(this.configItems.keepHistoryNumber);
    } else {
      return this.update(
        this.configItems.keepHistoryNumber,
        this.keepHistoryNumber
      );
    }
  }

  public get history(): Array<History> {
    return this._history;
  }

  public async updateHistory(history: History): Promise<void> {
    if (!this.enableHistory) {
      return;
    }

    this._history = this.history.filter(
      (item) => history.command !== item.command
    );

    this._history.unshift(history);

    if (
      0 !== this.keepHistoryNumber &&
      this.history.length > this.keepHistoryNumber
    ) {
      this._history = this._history.slice(0, this.keepHistoryNumber);
    }

    return this.update(this.configItems.history, this.history);
  }

  public async clearHistory(): Promise<void> {
    return this.remove(this.configItems.history);
  }

  public async uninstall(): Promise<void> {
    for (const item in CONFIG_ITEMS) {
      await this.remove(item);
    }
  }

  public lookup<T extends Commands | BaseCommandType = Commands>(
    hierarchy: Array<string>,
    location: Location,
    mode: LookupMode,
    allowEmpty: boolean = false
  ): T {
    const searched: Array<string> = [];
    let record: Commands = this.getLocationRecords(location);

    for (const key of hierarchy) {
      searched.push(key);

      const exist = key in record;

      if (this.lookupMode.read === mode && allowEmpty && !exist) {
        return {} as T;
      } else if (this.lookupMode.write === mode && !(key in record)) {
        record[key] = {};
      }

      record = Optional.ofNullable(record[key]).orElseThrow(
        ReferenceError(`/${searched.join('/')} is not found...`)
      );
    }

    return record as T;
  }

  public cloneDeep<T extends Commands | BaseCommandType = Commands>(
    hierarchy: Array<string>,
    location: Location
  ): T {
    return _.cloneDeep(this.lookup(hierarchy, location, this.lookupMode.read));
  }

  public delete(_hierarchy: Array<string>, location: Location): void {
    const hierarchy = [..._hierarchy];
    const target = Optional.ofNullable(hierarchy.pop()).orElseThrow(
      ReferenceError('Deletion target not specified...')
    );

    delete this.lookup(hierarchy, location, this.lookupMode.read)[target];
  }

  public sort(
    hierarchy: Array<string>,
    location: Location,
    sortWithName: boolean = true
  ): void {
    const registerd = this.cloneDeep(hierarchy, location);
    const ordered: SortRecord = {};
    const target = this.lookup(hierarchy, location, this.lookupMode.read);

    Object.keys(registerd).forEach((key) => {
      delete target[key];

      const record = registerd[key] as Commands;

      if (this.itemIdValues.includes(key)) {
        target[key] = _.cloneDeep(registerd[key]);

        delete registerd[key];
      } else if ('object' === typeof record && this.itemId.orderNo in record) {
        ordered[key] = _.cloneDeep(registerd[key] as SortItem);

        delete registerd[key];
      }
    });

    if (Object.keys(ordered).length > 0) {
      const sorted = this.sortByOrderNo(ordered);

      Object.keys(sorted).forEach((key) => {
        target[key] = sorted[key];
      });
    }

    const keys = sortWithName
      ? Object.keys(registerd).sort()
      : Object.keys(registerd);

    keys.forEach((key) => {
      target[key] = registerd[key];
    });
  }

  public getEntryPoint(): Record<string, EntryPoint> {
    const result: Record<string, EntryPoint> = {};
    const ordered: Record<string, EntryPointRequiredOrderNo> = {};
    const other: Record<string, EntryPoint> = {};

    this.getSurface(this.location.user, ordered, other);
    this.getSurface(this.location.profile, ordered, other);

    if (Object.keys(ordered).length > 0) {
      const sorted = this.sortByOrderNo(ordered);

      Object.keys(sorted).forEach((key) => {
        result[key] = sorted[key];
      });
    }

    Object.keys(other)
      .sort()
      .forEach((key) => {
        result[key] = other[key];
      });

    return result;
  }

  public getLocationRecords(location: Location): Commands {
    if (this.location.root === location) {
      throw new RangeError(`The root cannot be specified as an argument...`);
    } else if (this.location.user === location) {
      return this._commonCommands;
    } else {
      return this._profileCommands;
    }
  }

  private sortByOrderNo<T extends SortRecord = SortRecord>(records: T): T {
    return Object.keys(records)
      .map((k) => {
        return {
          key: k,
          value: {
            ...records[k],
          },
        };
      })
      .sort((a, b) => {
        return a.value.orderNo < b.value.orderNo ? -1 : 1;
      })
      .reduce((accumulator, item) => {
        return { ...accumulator, [item.key]: item.value };
      }, {} as T);
  }

  private getSurface(
    location: Location,
    ordered: Record<
      string,
      Omit<EntryPoint, 'orderNo'> & Required<Pick<EntryPoint, 'orderNo'>>
    >,
    other: Record<string, EntryPoint>
  ): void {
    const records = this.getLocationRecords(location);

    Object.keys(records).forEach((key) => {
      const record = records[key] as BaseCommandType;

      if (!(this.itemId.type in record)) {
        return;
      }

      const destination = this.itemId.orderNo in record ? ordered : other;
      const index = key;

      if (
        this.dataType.command === record.type ||
        this.dataType.terminalCommand === record.type
      ) {
        const temporary = { ...record, from: location, name: key };

        destination[index] = temporary;
      } else {
        const temporary: EntryPoint = {
          from: location,
          name: key,
          type: record[this.itemId.type],
          label: record[this.itemId.lable],
          description: record[this.itemId.description],
        };

        if (this.itemId.orderNo in record) {
          temporary[this.itemId.orderNo] = record[this.itemId.orderNo];
        }

        destination[index] = temporary;
      }
    });
  }
}

export { ExtensionSetting };
