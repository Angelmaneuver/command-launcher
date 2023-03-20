import { ConfigurationTarget } from 'vscode';
import * as _                  from 'lodash';
import { SettingBase }         from './base';
import { Optional }            from '../utils/base/optional';
import { LOCATION, Location }  from '../utils/base/type';
import { DATA_TYPE }           from '../constant';

const ITEM_ID             = {
	name:        'name',
	type:        'type',
	lable:       'label',
	description: 'description',
	command:     'command',
	orderNo:     'orderNo',
	autoRun:     'autoRun',
	singleton:   'singleton',
	questions:   'questions',
	selection:   'selection',
	parameter:   'parameter',
	default:     'default',
	from:        'from',
} as const;

const ITEM_ID_VALUE_LIST  = Object.values(ITEM_ID) as Array<string>;

export const CONFIG_ITEMS = {
	commonCommands:    'commonCommands',
	commands:          'commands',
	enableHistory:     'enableHistory',
	keepHistoryNumber: 'keepHistoryNumber',
	history:           'history',
} as const;

const LOOKUP_MODE         = {
	read:  'r',
	write: 'w',
} as const;

type LookupMode = typeof LOOKUP_MODE[keyof typeof LOOKUP_MODE];

export type History = { type: number, name: string, command: string, autoRun: boolean, singleton?: boolean };

export class ExtensionSetting extends SettingBase {
	private _commonCommands:    Record<string, unknown>;
	private _commands:          Record<string, unknown>;
	private _enableHistory:     boolean;
	private _keepHistoryNumber: number;
	private _history:           Array<History>;

	constructor() {
		super('command-launcher', ConfigurationTarget.Global);

		this._commonCommands    = _.cloneDeep(this.get(CONFIG_ITEMS.commonCommands)) as Record<string, unknown>;
		this._commands          = _.cloneDeep(this.get(CONFIG_ITEMS.commands))       as Record<string, unknown>;
		this._enableHistory     = this.get(CONFIG_ITEMS.enableHistory)               as boolean;
		this._keepHistoryNumber = this.get(CONFIG_ITEMS.keepHistoryNumber)           as number;
		this._history           = _.cloneDeep(this.get(CONFIG_ITEMS.history))        as Array<History>;
	}

	public get itemId() {
		return ITEM_ID;
	}

	public get itemIdValues() {
		return ITEM_ID_VALUE_LIST;
	}

	public get lookupMode() {
		return LOOKUP_MODE;
	}

	public get location() {
		return LOCATION;
	}

	public set commonCommands(commands: Record<string, unknown>) {
		this._commonCommands = commands;
	}

	public get commonCommands(): Record<string, unknown> {
		return this._commonCommands;
	}

	public async updateCommonCommands(): Promise<void> {
		if (0 === Object.keys(this._commonCommands).length) {
			return this.remove(CONFIG_ITEMS.commonCommands);
		} else {
			return this.update(CONFIG_ITEMS.commonCommands, this._commonCommands);
		}
	}

	public set commands(commands: Record<string, unknown>) {
		this._commands = commands;
	}

	public get commands(): Record<string, unknown> {
		return this._commands;
	}

	public async updateCommands(): Promise<void> {
		if (0 === Object.keys(this._commands).length) {
			return this.remove(CONFIG_ITEMS.commands);
		} else {
			return this.update(CONFIG_ITEMS.commands, this._commands);
		}
	}

	public async commit(location: Location): Promise<void> {
		if (LOCATION.user === location) {
			return this.updateCommonCommands();
		} else if (LOCATION.profile === location) {
			return this.updateCommands();
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
			return this.remove(CONFIG_ITEMS.enableHistory);
		} else {
			return this.update(CONFIG_ITEMS.enableHistory, this.enableHistory);
		}
	}

	public get keepHistoryNumber() {
		return this._keepHistoryNumber;
	}

	public async updateKeepHistoryNumber(value: number): Promise<void> {
		this._keepHistoryNumber = value;

		if (10 === value) {
			return this.remove(CONFIG_ITEMS.keepHistoryNumber);
		} else {
			return this.update(CONFIG_ITEMS.keepHistoryNumber, this.keepHistoryNumber);
		}
	}

	public get history(): Array<History> {
		return this._history;
	}

	public async updateHistory(history: History): Promise<void> {
		if (!this.enableHistory) {
			return;
		}

		this._history = this.history.filter(item => history.command !== item.command);

		this._history.unshift(history);

		if (0 !== this.keepHistoryNumber && this.history.length > this.keepHistoryNumber) {
			this._history = this._history.slice(0, this.keepHistoryNumber);
		}

		return this.update(CONFIG_ITEMS.history, this.history);
	}

	public async uninstall(): Promise<void> {
		for (const item in CONFIG_ITEMS) {
			await this.remove(item);
		}
	}

	public lookup(
		hierarchy:  Array<string>,
		location:   Location,
		mode:       LookupMode,
		allowEmpty: boolean = false
	): Record<string, unknown> {
		const searched: Array<string>           = [];
		let   record:   Record<string, unknown> = this.getLocationRecords(location);

		for (const key of hierarchy) {
			searched.push(key);

			const exist = key in record;

			if (LOOKUP_MODE.read === mode && allowEmpty && !exist) {
				return {};
			} else if (LOOKUP_MODE.write === mode && !(key in record)) {
				record[key] = {};
			}

			record = Optional.ofNullable(record[key]).orElseThrow(ReferenceError(`/${searched.join('/')} is not found...`)) as Record<string, unknown>;
		};

		return record;
	}

	public cloneDeep(hierarchy: Array<string>, location: Location): Record<string, unknown> {
		return _.cloneDeep(this.lookup(hierarchy, location, this.lookupMode.read));
	}

	public delete(_hierarchy: Array<string>, location: Location): void {
		const hierarchy = [..._hierarchy];
		const target    = Optional.ofNullable(hierarchy.pop()).orElseThrow(ReferenceError('Deletion target not specified...'));

		delete this.lookup(hierarchy, location, this.lookupMode.read)[target];
	}

	public sort(hierarchy: Array<string>, location: Location, sortWithName: boolean = true): void {
		const registerd                         = this.cloneDeep(hierarchy, location);
		const ordered:  Record<string, unknown> = {};
		const target                            = this.lookup(hierarchy, location, this.lookupMode.read);

		Object.keys(registerd).forEach(
			(key) => {
				delete target[key];

				const record = registerd[key] as Record<string, unknown>;

				if (this.itemIdValues.includes(key)) {
					target[key] = _.cloneDeep(registerd[key]);

					delete registerd[key];
				} else if ('object' === typeof record && this.itemId.orderNo in record) {
					ordered[key] = _.cloneDeep(registerd[key]);

					delete registerd[key];
				}
			}
		);

		this.sortByOrderNo(ordered).forEach((value) => {
			Object.keys(value as Record<string, unknown>).forEach(
				(key) => {
					target[key] = (value as Record<string, unknown>)[key];
				}
			);
		});

		const keys = sortWithName ? Object.keys(registerd).sort() : Object.keys(registerd);

		keys.forEach((key) => {
			target[key] = registerd[key];
		});
	}

	public getEntryPoint(): Record<string, unknown> {
		const result:  Record<string, unknown> = {};
		const ordered: Record<string, unknown> = {};
		const other:   Record<string, unknown> = {};

		this.getSurface(LOCATION.user,    ordered, other);
		this.getSurface(LOCATION.profile, ordered, other);

		this.sortByOrderNo(ordered).forEach((record) => {
			record as Record<string, unknown>;

			Object.keys(record).forEach((key) => {
				result[key] = record[key];
			});
		});

		Object.keys(other).sort().forEach((key) => {
			result[key] = other[key];
		});

		return result;
	}

	public getLocationRecords(location: Location): Record<string, unknown> {
		if (LOCATION.root === location) {
			throw new RangeError(`The root cannot be specified as an argument...`);
		} else if (LOCATION.user === location) {
			return this._commonCommands;
		} else {
			return this._commands;
		}
	}

	private sortByOrderNo(records: Record<string, unknown>): Array<Record<string, unknown>> {
		const fetch = (record: Record<string, unknown>) => {
			return ((record[Object.keys(record)[0]] as Record<string, unknown>)[this.itemId.orderNo]) as string;
		};

		return Object.keys(records).map(
			(key) => {
				const record: Record<string, unknown> = {};

				record[key] = records[key];

				return record;
			}
		).sort(
			(a, b) => {
				const compareA = fetch(a);
				const compareB = fetch(b);

				return (compareA < compareB) ? -1 : 1;
			}
		);
	}

	private getSurface(location: Location, ordered: Record<string, unknown>, other: Record<string, unknown>): void {
		const records: Record<string, unknown> = this.getLocationRecords(location);

		Object.keys(records).forEach((key) => {
			const record = records[key] as Record<string, unknown>;

			if (!(ITEM_ID.type in record)) {
				return;
			}

			const destination = ITEM_ID.orderNo in record ? ordered : other;
			const index       = key;

			if (
				DATA_TYPE.command         === record.type ||
				DATA_TYPE.terminalCommand === record.type
			) {
				const temporary = { ...record, from: location, name: key };

				destination[index] = temporary;
			} else {
				const temporary: Record<string, unknown> = {
					from:        location,
					name:        key,
					type:        record[ITEM_ID.type],
					label:       record[ITEM_ID.lable],
					description: record[ITEM_ID.description],
				};

				if (ITEM_ID.orderNo in record) {
					temporary[ITEM_ID.orderNo] = record[ITEM_ID.orderNo];
				}

				destination[index] = temporary;
			}
		});
	}
}
