import { DEV } from './config'


/**
 * Preload a set of templates to compile and cache them for
 * fast access during rendering
 */
export const preloadHandlebarsTemplates = async function() {

	const templatePaths = [

		// Global sheet partials
		`systems/${DEV.folder}/templates/sheet-id.html`,
		`systems/${DEV.folder}/templates/sheet-aspects.html`,
		`systems/${DEV.folder}/templates/sheet-biography.html`,
		`systems/${DEV.folder}/templates/sheet-stunts.html`,
	];

	// Load the template partials
	return loadTemplates(templatePaths);
}