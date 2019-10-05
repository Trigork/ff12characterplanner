import { License } from "../data/Licenses";
import { Ammo } from "./equip/Ammo";
import PartyModel from "../model/PartyModel";

export type DamageFormula =
	"unarmed" | "sword" | "pole" | "mace" | "katana"
	| "hammer" | "dagger" | "gun";

export type AnimationClass = "unarmed"
	| "dagger" | "ninja" | "katana" | "sword"
	| "bigsword" | "hammer" | "pole" | "spear" | "mace"
	| "bow" | "gun" | "xbow" | "measure" | "rod" | "staff" | "handbomb";

export const AllElements = ["fire", "ice", "lightning", "water", "wind", "earth", "dark", "holy"] as const;

export interface Environment {
	/** character index, 0-5 */
	character: number;
	/** Target physical defense */
	def: number;
	/** Target magical defense */
	mdef: number;
	/** character hp percentage, from 1 to 100 */
	percentHp: number;
	/** How much damage does the target take from the element? */
	fireReaction: 0 | 0.5 | 1 | 2;
	/** How much damage does the target take from the element? */
	iceReaction: 0 | 0.5 | 1 | 2;
	/** How much damage does the target take from the element? */
	lightningReaction: 0 | 0.5 | 1 | 2;
	/** How much damage does the target take from the element? */
	waterReaction: 0 | 0.5 | 1 | 2;
	/** How much damage does the target take from the element? */
	windReaction: 0 | 0.5 | 1 | 2;
	/** How much damage does the target take from the element? */
	earthReaction: 0 | 0.5 | 1 | 2;
	/** How much damage does the target take from the element? */
	darkReaction: 0 | 0.5 | 1 | 2;
	/** How much damage does the target take from the element? */
	holyReaction: 0 | 0.5 | 1 | 2;
	/** character level, 1-99 */
	level: number;
	/** True if target resists guns and measures */
	resistGun: boolean;
	/** slowest(1) to fastest(6) */
	battleSpeed: 1 | 2 | 3 | 4 | 5 | 6;
	/** The 1st swiftness license */
	swiftness1: boolean;
	/** The 2nd swiftness license */
	swiftness2: boolean;
	/** The 3rd swiftness license */
	swiftness3: boolean;
}

export interface Profile {
	damageType: DamageFormula;
	animationType: AnimationClass;
	/** Weapon attack value */
	attack: number;
	/** Weapon CB value */
	combo: number;
	/** Weapon CT value */
	chargeTime: number;
	/** character stat, max 99 */
	str: number;
	/** character stat, max 99 */
	mag: number;
	/** character stat, max 99 */
	vit: number;
	/** character stat, max 99 */
	spd: number;
	/** Is the brawler license available? */
	brawler: boolean;
	berserk: boolean;
	haste: boolean;
	bravery: boolean;
	/** Is the focus license available? */
	focus: boolean;
	/** Is the adrenaline license available? */
	adrenaline: boolean;
	genjiGloves: boolean;

	/** True if the weapon does damage with this element */
	fireDamage: boolean;
	/** True if the weapon does damage with this element */
	iceDamage: boolean;
	/** True if the weapon does damage with this element */
	lightningDamage: boolean;
	/** True if the weapon does damage with this element */
	waterDamage: boolean;
	/** True if the weapon does damage with this element */
	windDamage: boolean;
	/** True if the weapon does damage with this element */
	earthDamage: boolean;
	/** True if the weapon does damage with this element */
	darkDamage: boolean;
	/** True if the weapon does damage with this element */
	holyDamage: boolean;

	/** Is the 1.5x modfifier available? */
	fireBonus: boolean;
	/** Is the 1.5x modfifier available? */
	iceBonus: boolean;
	/** Is the 1.5x modfifier available? */
	lightningBonus: boolean;
	/** Is the 1.5x modfifier available? */
	waterBonus: boolean;
	/** Is the 1.5x modfifier available? */
	windBonus: boolean;
	/** Is the 1.5x modfifier available? */
	earthBonus: boolean;
	/** Is the 1.5x modfifier available? */
	darkBonus: boolean;
	/** Is the 1.5x modfifier available? */
	holyBonus: boolean;
}

export interface Equipment extends Partial<Profile> {
	name: string;
	l?: License;
}

export interface PaperDoll {
	weapon: Equipment;
	ammo?: Ammo;
	helm?: Equipment;
	armor?: Equipment;
	accessory?: Equipment;
}

function mergeImpl(p: Profile, next: Partial<Profile>): Profile {
	const ret = { ...p };
	for (const k in next) {
		const v = (next as any)[k];
		if (typeof v === "boolean" && v) {
			(ret as any)[k] = v;
		} else if (typeof v === "number") {
			(ret as any)[k] += v;
		} else {
			throw new Error(`Unexpected type on Profile[${k}]: ${typeof v}`);
		}
	}
	return ret;
}
function mergeEq(p: Profile, nextEq: Equipment) {
	const { name, l, ...next } = nextEq;
	return mergeImpl(p, next);
}
function mergeAmmo(p: Profile, nextAmmo: Ammo) {
	const { name, l, type, ...next } = nextAmmo;
	return mergeImpl(p, next);	
}

export function createProfile(startingProfile: Profile, doll: PaperDoll) {
	let ret = mergeEq(startingProfile, doll.weapon);
	if (doll.ammo) {
		ret = mergeAmmo(ret, doll.ammo);
	}
	if (doll.helm) {
		ret = mergeEq(ret, doll.helm);
	}
	if (doll.armor) {
		ret = mergeEq(ret, doll.armor);
	}
	if (doll.accessory) {
		ret = mergeEq(ret, doll.accessory);
	}
	return ret;
}

/** The items available to a particular character to equip */
export interface EquipmentPool {
	armors: Equipment[];
	helms: Equipment[];
	accessories: Equipment[];
}
