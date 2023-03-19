import { State }                 from '../../../base/base';
import { AbstractEditMenuGuide } from '../abc';
import { Optional }              from '../../../../utils/base/optional';
import * as Constant             from '../../../../constant';

export abstract class AbstractQuestionEditMenuGuide extends AbstractEditMenuGuide {
	protected root: boolean;

	constructor(state: State, type: Constant.DataType, root: boolean = false) {
		super(state, type);

		this.root = root;
	}

	protected async delete(): Promise<void> {
		const hierarchy = [...this.hierarchy];

		this.settings.delete(hierarchy, this.location);

		hierarchy.pop();

		if (0 === Object.keys(this.settings.lookup(hierarchy, this.location, this.settings.lookupMode.read)).length) {
			this.settings.delete(hierarchy, this.location);
		}

		await this.settings.commit(this.location);

		this.updateEnd(this.processType.deleted);
	}

	protected async save(): Promise<void> {
		const target = this.settings.lookup([...this.hierarchy], this.location, this.settings.lookupMode.read);
		const parent = [...this.hierarchy];
		const pre    = Optional.ofNullable(parent.pop()).orElseThrow(ReferenceError('Edit target not found...'));
		const name   = this.guideGroupResultSet[this.settings.itemId.name] as string;

		Object.keys(this.guideGroupResultSet).forEach(key => {
			if (this.settings.itemId.name === key) {
				return;
			}

			target[key] = this.guideGroupResultSet[key];
		});

		if (this.settings.itemId.name in this.guideGroupResultSet) {
			const original = this.settings.cloneDeep(parent, this.location);

			this.settings.delete(parent, this.location);

			const target   = this.settings.lookup(parent, this.location, this.settings.lookupMode.write);

			Object.keys(original).forEach(key => {
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
}
