import { ExtensionContext, QuickPickItem }  from 'vscode';
import { State }                            from '../base/base';
import { AbstractQuickPickSelectGuide }     from '../base/pick';
import { ExtensionSetting }                 from '../../settings/extension';
import { Optional }                         from '../../utils/base/optional';
import { Command, TerminalCommand ,Folder } from '../../utils/base/type';
import * as Constant                        from '../../constant';

export abstract class AbstractMenuGuide extends AbstractQuickPickSelectGuide {
	protected root: boolean;

	constructor(state: State, root?: boolean, context?: ExtensionContext) {
		super(state, context);

		this.root = root ? true : false;

		if (this.root) {
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

	protected get commandItems(): QuickPickItem[] {
		return Object.keys(this.currentCommands).map(
			(key) => {
				const item = this.currentCommands[key] as Record<string, unknown>;

				return ({
					label:       `${item.label} ${key}`,
					description: `${item.description}`,
				});
			}
		);
	}

	protected getCommand(name: string): Command | TerminalCommand | Folder {
		const error = ReferenceError(`Command item '${name}' not found...`);
		const data  = Optional.ofNullable(this.currentCommands[name]).orElseThrow(error) as Record<string, unknown>;
		const type  = Optional.ofNullable(data[this.settings.itemId.type]).orElseThrow(error);

		if (Constant.DATA_TYPE.command === type) {
			return data as Command;
		} else if (Constant.DATA_TYPE.terminalCommand === type) {
			return data as TerminalCommand;
		} else {
			return data as Folder;
		}
	}
}
