import { AbstractMenuGuide } from './abc';
import { VSCodePreset }      from '../../utils/base/vscodePreset';
import { Command }           from '../../utils/base/type';
import * as Constant         from '../../constant';

const items = {
	back: VSCodePreset.create(VSCodePreset.icons.reply,   'Return', 'Back to previous.'),
	exit: VSCodePreset.create(VSCodePreset.icons.signOut, 'Exit',   'Exit this extenion.'),
};

export class MenuGuide extends AbstractMenuGuide {
	public init(): void {
		super.init();

		this.items = this.items.concat(
			this.commandItems,
			this.root ? [items.exit] : [items.back]
		);
	}

	protected getExecute(label: string | undefined): (() => Promise<void>) | undefined {
		switch (label) {
			case items.back.label:
				this.prev();
			case items.exit.label:
				return undefined;
			default:
				return this.command();
		}
	}

	private command(): (() => Promise<void>) | undefined {
		const command = this.getCommand(this.getLabelStringByItem);

		if (Constant.DATA_TYPE.command === command['type']) {
			this.state.command = (command as Command)['command'];
			return undefined;
		} else {
			const name           = this.getLabelStringByItem;

			this.state.title     = `${this.title}/${name}`;
			this.state.hierarchy = this.hierarchy.concat(name);
			return async () => {
				this.setNextSteps([{ key: 'MenuGuide', state: this.state }]);
			};
		}
	}
}