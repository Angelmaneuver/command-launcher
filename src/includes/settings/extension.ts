import { ConfigurationTarget } from 'vscode';
import * as _                  from 'lodash';
import { SettingBase }         from './base';
import { Optional }            from '../utils/base/optional';

const ITEM_ID            = {
	name:        'name',
	type:        'type',
	lable:       'label',
	description: 'description',
	command:     'command',
	orderNo:     'orderNo',
	autoRun:     'autoRun',
	questions:   'questions',
	selection:   'selection',
	parameter:   'parameter',
	default:     'default',
} as const;

const ITEM_ID_VALUE_LIST = Object.values(ITEM_ID) as Array<string>;

const CONFIG_ITEMS       = {
	commands:          'commands',
	enableHistory:     'enableHistory',
	keepHistoryNumber: 'keepHistoryNumber',
	history:           'history',
} as const;

const LOOKUP_MODE        = {
	read:  'r',
	write: 'w',
} as const;

type LookupMode = typeof LOOKUP_MODE[keyof typeof LOOKUP_MODE];

type History    = { type: number, name: string, command: string, autoRun: boolean };

export class ExtensionSetting extends SettingBase {
	private _commands:          Record<string, unknown>;
	private _enableHistory:     boolean;
	private _keepHistoryNumber: number;
	private _history:           Array<History>;

	constructor() {
		super('command-launcher', ConfigurationTarget.Global);

		this._commands          = _.cloneDeep(this.get(CONFIG_ITEMS.commands)) as Record<string, unknown>;
		this._enableHistory     = this.get(CONFIG_ITEMS.enableHistory)         as boolean;
		this._keepHistoryNumber = this.get(CONFIG_ITEMS.keepHistoryNumber)     as number;
		this._history           = _.cloneDeep(this.get(CONFIG_ITEMS.history))  as Array<History>;
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

	public set commands(commands: Record<string, unknown>) {
		this._commands = commands;
	}

	public get commands(): Record<string, unknown> {
		return this._commands;
	}

	public async commit(): Promise<void> {
		return this.update(CONFIG_ITEMS.commands, this._commands);
	}

	public async updateEnableHistory(value: boolean): Promise<void> {
		this._enableHistory = value;

		if (!value) {
			return this.remove(CONFIG_ITEMS.enableHistory);
		} else {
			return this.update(CONFIG_ITEMS.enableHistory, this.enableHistory);
		}
	}

	public get enableHistory() {
		return this._enableHistory;
	}

	public async updateKeepHistoryNumber(value: number): Promise<void> {
		this._keepHistoryNumber = value;

		if (10 === value) {
			return this.remove(CONFIG_ITEMS.keepHistoryNumber);
		} else {
			return this.update(CONFIG_ITEMS.keepHistoryNumber, this.keepHistoryNumber);
		}
	}

	public get keepHistoryNumber() {
		return this._keepHistoryNumber;
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

	public get history(): Array<History> {
		return this._history;
	}

	public async uninstall(): Promise<void> {
		for (const item in CONFIG_ITEMS) {
			await this.remove(item);
		}
	}

	public lookup(hierarchy: Array<string>, mode: LookupMode, allowEmpty: boolean = false): Record<string, unknown> {
		const searched: Array<string>           = [];
		let   record:   Record<string, unknown> = this._commands;

		for (const key of hierarchy) {
			searched.push(key);

			const exist = key in record;

			if (LOOKUP_MODE.read === mode && allowEmpty && !exist) {
				return {};
			} else if (LOOKUP_MODE.write === mode && !(key in record)) {
				record[key] = {};
			}

			record = (
				Optional.ofNullable(record[key])
						.orElseThrow(ReferenceError(`/${searched.join('/')} is not found...`))
			) as Record<string, unknown>;
		};

		return record;
	}

	public cloneDeep(hierarchy: Array<string>): Record<string, unknown> {
		return _.cloneDeep(this.lookup(hierarchy, this.lookupMode.read));
	}

	public delete(_hierarchy: Array<string>): void {
		const hierarchy = [..._hierarchy];
		const target    = Optional.ofNullable(hierarchy.pop()).orElseThrow(ReferenceError('Deletion target not specified...'));

		delete this.lookup(hierarchy, this.lookupMode.read)[target];
	}

	public sort(hierarchy: Array<string>, sortWithName: boolean = true): void {
		const registerd                         = this.cloneDeep(hierarchy);
		const ordered:  Record<string, unknown> = {};
		const target                            = this.lookup(hierarchy, this.lookupMode.read);
		const fetch                             = (record: Record<string, unknown>) => {
			return ((record[Object.keys(record)[0]] as Record<string, unknown>)[this.itemId.orderNo]) as string;
		};

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

		const sortedByOrderNo = Object.keys(ordered).map(
			(key) => {
				const record: Record<string, unknown> = {};

				record[key] = ordered[key];

				return record;
			}
		).sort(
			(a, b) => {
				const compareA = fetch(a);
				const compareB = fetch(b);

				return (compareA < compareB) ? -1 : 1;
			}
		);

		sortedByOrderNo.forEach(
			(value) => {
				Object.keys(value as Record<string, unknown>).forEach(
					(key) => {
						target[key] = (value as Record<string, unknown>)[key];
					}
				);
			}
		);

		const keys = sortWithName ? Object.keys(registerd).sort() : Object.keys(registerd);

		keys.forEach(
			(key) => {
				target[key] = registerd[key];
			}
		);
	}
}
