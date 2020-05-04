import { ActorSheetFate } from "./basesheet.js";
import { DEV } from './../config'

export class FAECharacterSheet extends ActorSheetFate {
	static get defaultOptions() {
		const options = super.defaultOptions;
		mergeObject(options, {
			classes: options.classes.concat(['fate', 'accelerated', 'character-sheet']),
			width: 650,
			height: 760,
			resizable: false
		});
		return options;
	}

	get template() {
		return `systems/${DEV.folder}/templates/fae-sheet.html`;
	}

	getData(): FAEActorSheetData {
		const sheetData = super.getData() as FAEActorSheetData;

		sheetData.approaches = {};
		sheetData.cons = {};

		// When a Character has no (extra) Aspects yet,
		// create the 3 empty boxes
		if (Object.keys(sheetData.data.aspects.other.value).length < 1) {
			for (let i = 0; i < 3; i++) {
				sheetData.data.aspects.other.value.push('');
			}
		}

		for (let [a, appr] of Object.entries(sheetData.data.approaches)) {
			sheetData.approaches[a] = appr;
			sheetData.approaches[a].label = CONFIG.FATE.approaches[a];
		}

		for (let [a, con] of Object.entries(sheetData.data.health.cons)) {
			sheetData.cons[a] = con;
			sheetData.cons[a].label = CONFIG.FATE.consequences[a];
			sheetData.cons[a].stress = CONFIG.FATE.consequenceStress[a];
		}

		sheetData.fateLadder = CONFIG.FATE.fateLadder;
		sheetData.stress = sheetData.data.health.stress;
		
		return sheetData;
	}
}