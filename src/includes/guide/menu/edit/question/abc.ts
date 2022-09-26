import { AbstractEditMenuGuide } from '../abc';
import { Optional }              from '../../../../utils/base/optional';

export abstract class AbstractQuestionEditMenuGuide extends AbstractEditMenuGuide {
	protected async delete(): Promise<void> {
		const hierarchy = [...this.hierarchy];

		this.settings.delete(hierarchy);

		hierarchy.pop();

		if (0 === Object.keys(this.settings.lookup(hierarchy, this.settings.lookupMode.read)).length) {
			this.settings.delete(hierarchy);
		}

		await this.settings.commit();

		this.updateEnd(this.processType.deleted);
	}

	protected async save(): Promise<void> {
		const target = this.settings.lookup([...this.hierarchy], this.settings.lookupMode.read);
		const parent = [...this.hierarchy];
		const pre    = Optional.ofNullable(parent.pop()).orElseThrow(ReferenceError('Edit target not found...'));
		const name   = this.guideGroupResultSet[this.settings.itemId.name] as string;

		Object.keys(this.guideGroupResultSet).forEach(
			(key) => {
				if (this.settings.itemId.name === key) {
					return;
				}

				target[key] = this.guideGroupResultSet[key];
			}
		);

		if (this.settings.itemId.name in this.guideGroupResultSet) {
			const original = this.settings.cloneDeep(parent);

			this.settings.delete(parent);

			const target   = this.settings.lookup(parent, this.settings.lookupMode.write);

			Object.keys(original).forEach(
				(key) => {
					target[pre === key ? name : key] = original[key];
				}
			);
		}

		if (this.settings.itemId.orderNo in this.guideGroupResultSet) {
			this.settings.sort(parent, false);
		}

		await this.settings.commit();

		this.updateEnd(this.processType.updated);
	}
}
