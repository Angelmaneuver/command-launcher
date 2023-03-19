import { ExtensionContext, QuickPickItem } from 'vscode';
import { State }                           from '../base/base';
import { AbstractQuickPickSelectGuide }    from '../base/pick';
import { ExtensionSetting }                from '../../settings/extension';
import { Optional }                        from '../../utils/base/optional';
import { 
	LOCATION,
	Location,
	Command,
	TerminalCommand,
	Folder,
}                                          from '../../utils/base/type';
import * as Constant                       from '../../constant';

export abstract class AbstractMenuGuide extends AbstractQuickPickSelectGuide {
	constructor(state: State, context?: ExtensionContext) {
		super(state, context);

		if (this.isRoot) {
			this.state.settings = new ExtensionSetting();
		}
	}

	public init(): void {
		super.init();

		this.placeholder = 'Select the item you want to do.';
	}

	protected prev(): void {
		const hierarchy = [...this.hierarchy];

		hierarchy.pop();

		this.state.hierarchy = hierarchy;

		super.prev();
	}

	protected get isRoot(): boolean {
		return LOCATION.root === this.location || 0 === this.hierarchy.length;
	}

	protected getCommands(hierarchy: Array<string>, allowEmpty: boolean = false): Record<string, unknown> {
		let records: Record<string, unknown> = {};

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

		const commands = {} as Record<string, unknown>;

		Object.keys(records).forEach(
			(key) => {
				if (!this.settings.itemIdValues.includes(key)) {
					commands[key] = records[key];
				}
			}
		);

		return commands;
	}

	protected get currentCommands(): Record<string, unknown> {
		return this.getCommands(this.hierarchy);
	}

	protected get currentCommandsWithAllowEmpty(): Record<string, unknown> {
		return this.getCommands(this.hierarchy, true);
	}

	protected get parentCommands(): Record<string, unknown> {
		const hierarchy = [...this.hierarchy];

		hierarchy.pop();

		return this.getCommands(hierarchy);
	}

	protected get commandItems(): QuickPickItem[] {
		const records = this.isRoot ? this.settings.getEntryPoint() : this.currentCommands;

		return Object.keys(records).map((key) => {
			const item = records[key] as Record<string, unknown>;

			return ({
				label:       `${item.label} ${key}`,
				description: `${item.description}`,
			});
		});
	}

	protected get currentCommandInfo(): Record<string, unknown> {
		const command = this.settings.cloneDeep(this.hierarchy, this.location);

		if (Constant.DATA_TYPE.terminalCommand === command[this.settings.itemId.type]) {
			command[this.settings.itemId.questions] = Optional.ofNullable(command[this.settings.itemId.questions]).orElseNonNullable({});
			command[this.settings.itemId.autoRun]   = Optional.ofNullable(command[this.settings.itemId.autoRun]).orElseNonNullable(true);
			command[this.settings.itemId.singleton] = Optional.ofNullable(command[this.settings.itemId.singleton]).orElseNonNullable(false);
		}

		return command;
	}

	protected getCommand(name: string): [Command | TerminalCommand | Folder, string, Location] {
		const error                 = ReferenceError(`Command item '${name}' not found...`);
		const [data, key, location] = this.isRoot ? this.getRecordFromEntryPoint(name, error) : this.getRecord(name, error);
		const type                  = Optional.ofNullable(data[this.settings.itemId.type]).orElseThrow(error);

		if (Constant.DATA_TYPE.command === type) {
			return [data as Command, key, location];
		} else if (Constant.DATA_TYPE.terminalCommand === type) {
			return [data as TerminalCommand, key, location];
		} else {
			return [data as Folder, key, location];
		}
	}

	private getRecordFromEntryPoint(name: string, error: ReferenceError): [Record<string, unknown>, string, Location] {
		const info:     Record<string, unknown> = Optional.ofNullable(this.settings.getEntryPoint()[name]).orElseThrow(error);
		const key:      string                  = Optional.ofNullable(info.name as string).orElseThrow(error);
		const location: Location                = Optional.ofNullable(info.from as Location).orElseThrow(error);
		const data:     Record<string, unknown> = this.settings.getLocationRecords(location);

		return [Optional.ofNullable(data[key]).orElseThrow(error), key, location];
	}

	private getRecord(name: string, error: ReferenceError): [Record<string, unknown>, string, Location] {
		return [Optional.ofNullable(this.currentCommands[name]).orElseThrow(error), name, this.location];
	}
}
