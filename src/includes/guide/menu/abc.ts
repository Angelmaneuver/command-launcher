import { ExtensionContext, QuickPickItem } from 'vscode';
import { State }                           from '../base/base';
import { AbstractQuickPickSelectGuide }    from '../base/pick';
import { Optional }                        from '../../utils/base/optional';
import { Command, Folder }                 from '../../utils/base/type';
import * as Constant                       from '../../constant';

export abstract class AbstractMenuGuide extends AbstractQuickPickSelectGuide {
	protected root: boolean;

	constructor(state: State, root?: boolean, context?: ExtensionContext) {
		super(state, context);

		this.root = root ? true : false;
	}

	public init(): void {
		super.init();

		this.placeholder = 'Select the item you want to do.';
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

	protected getCommand(name: string): Command | Folder {
		const error   = ReferenceError('Command item not found...');
		const command = Optional.ofNullable(this.currentCommands[name]).orElseThrow(error) as Record<string, unknown>;

		if (Constant.DATA_TYPE.command === Optional.ofNullable(command['type']).orElseThrow(error)) {
			return command as Command;
		} else {
			return command as Folder;
		}
	}
}
