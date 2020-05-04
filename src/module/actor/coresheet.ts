import { ActorSheetFate } from "./basesheet.js";
import { DEV } from './../config'

export class CoreCharacterSheet extends ActorSheetFate {
	static get defaultOptions() {
		const options = super.defaultOptions;
		mergeObject(options, {
			classes: options.classes.concat(['fate', 'core', 'character-sheet']),
			width: 650,
			height: 740,
			resizable: false
		});
		return options;
	}

	get template() {
		return `systems/${DEV.folder}/templates/core-sheet.html`;
	}
}