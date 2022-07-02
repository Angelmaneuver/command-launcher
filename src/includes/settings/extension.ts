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
} as const;

const ITEM_ID_VALUE_LIST = Object.values(ITEM_ID) as Array<string>;

const LOOKUP_MODE        = {
	read:  'r',
	write: 'w',
} as const;

type LookupMode = typeof LOOKUP_MODE[keyof typeof LOOKUP_MODE];

export class ExtensionSetting extends SettingBase {
	private _commands: Record<string, unknown>;

	constructor() {
		super('command-launcher', ConfigurationTarget.Global);

		this._commands = _.cloneDeep(this.get('commands')) as Record<string, unknown>;
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
		return this.update('commands', this._commands);
	}

	public async uninstall(): Promise<void> {
		return this.remove('commands');
	}

	public lookup(hierarchy: Array<string>, mode: LookupMode): Record<string, unknown> {
		const searched: Array<string>           = [];
		let   record:   Record<string, unknown> = this._commands;

		hierarchy.forEach(
			(key) => {
				searched.push(key);

				if (LOOKUP_MODE.write === mode && !(key in record)) {
					record[key] = {};
				}

				record = (
					Optional.ofNullable(record[key])
							.orElseThrow(ReferenceError(`/${searched.join('/')} is not found...`))
				) as Record<string, unknown>;
			}
		);

		return record;
	}

	public cloneDeep(hierarchy: Array<string>): Record<string, unknown> {
		return _.cloneDeep(this.lookup(hierarchy, this.lookupMode.read));
	}

	public delete(hierarchy: Array<string>): void {
		const target = Optional.ofNullable(hierarchy.pop()).orElseThrow(ReferenceError('Deletion target not specified...'));

		delete this.lookup(hierarchy, this.lookupMode.read)[target];
	}

	public sort(hierarchy: Array<string>): void {
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

		Object.keys(registerd).sort().forEach(
			(key) => {
				target[key] = registerd[key];
			}
		);
	}
}
