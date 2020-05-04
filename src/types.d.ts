interface Consequence {
	stress: number,
	value: string
}

interface Health {
	cons: {
		mild: Consequence,
		moderate: Consequence,
		severe: Consequence
	}
}

interface FAEHealth extends Health {
	stress: {
		1: boolean,
		2: boolean,
		3: boolean
	}
}

/**
 * Data properties common to all Fate Actors
 */
declare interface FateActorData extends ActorData {
	details: {
		description: { value: string; },
		biography: { value: string; },
		points: {
			current: number,
			refresh: number
		}
	},
	health: Health,
	aspects: {
		hc: { value: string; },
		trouble: { value: string; },
		other: { value: string[]; }
	},
}

/**
 * Data properties common to all Fate Actor Sheets,
 * including computed properties
 */
declare interface FateActorSheetData extends ActorSheetData {
	data: FateActorData,
	stunts: any
}

/**
 * Data properties used by the Fate Accelerated (FAE) Actor type
 */
declare interface FAEActorData extends FateActorData {
	health: FAEHealth,
	approaches: {
		[key: string]: any
	}
}

/**
 * Data properties used by the Fate Accelerate (FAE) Actor Sheet,
 * including computed properties
 */
declare interface FAEActorSheetData extends FateActorSheetData {
	data: FAEActorData,
	fateLadder: any
	approaches: {
		[key: string]: any
	},
	stress: any,
	cons: {
		[key: string]: any
	}
}