/**
 * The Fate Core game system for Foundry Virtual Tabletop
 * Author: Nick van Oosten (NickEast)
 * Software License: GNU GPLv3
 * Content License:
 *      This work is based on Fate Core System and Fate Accelerated Edition (found at http://www.faterpg.com/),
 *      products of Evil Hat Productions, LLC, developed, authored, and edited by Leonard Balsera, Brian Engard,
 *      Jeremy Keller, Ryan Macklin, Mike Olson, Clark Valentine, Amanda Valentine, Fred Hicks, and Rob Donoghue,
 *      and licensed for our use under the Creative Commons Attribution 3.0 Unported license
 *      (http://creativecommons.org/licenses/by/3.0/).
 */

// Import modules
import { FATE } from './module/config';
import { preloadHandlebarsTemplates } from './module/templates';
import { CoreCharacterSheet } from './module/actor/coresheet';
import { FAECharacterSheet } from './module/actor/faesheet';
import { ItemSheetFATE } from './module/item/itemsheet';

/* -------------------------------- */
/*	System initialization			*/
/* -------------------------------- */

Hooks.once('init', async function() {
	console.log(`FATEEEEE`);

	CONFIG.FATE = FATE;

	await preloadHandlebarsTemplates();

	// Register Actor sheets
	Actors.unregisterSheet('core', ActorSheet);
	Actors.registerSheet('Fate', FAECharacterSheet, { types: ['Accelerated'], makeDefault: true });
	// Actors.registerSheet('Fate', CoreCharacterSheet, { types: ['Core'], makeDefault: false });

	// Register Item sheets
	Items.unregisterSheet('core', ItemSheet);
	Items.registerSheet('fate', ItemSheetFATE, { makeDefault: true });
});

/* -------------------------------- */
/*	Everything else					*/
/*	(TODO: Move somewhere safer)	*/
/* -------------------------------- */

// Adds a simple Handlebars "for loop" block helper
Handlebars.registerHelper('for', function(times: number, block: any) {
	var accum = '';
	for (let i = 0; i < times; i++) {
		block.data.index = i;
		block.data.num = i + 1;
		accum += block.fn(i);
	}
	return accum;
});