export type DamageFormula =
	"unarmed" | "sword" | "pole" | "mace" | "katana"
	| "hammer" | "dagger" | "gun";

export type AnimationClass = "unarmed"
	| "dagger" | "ninja" | "katana" | "sword"
	| "bigsword" | "hammer" | "pole" | "spear" | "mace"
	| "bow" | "gun" | "xbow" | "measure" | "rod" | "staff" | "handbomb";

export type Element = "fire" | "ice" | "lightning" | "water"
	| "wind" | "earth" | "dark" | "holy";


export interface Profile {
	/** character index, 0-5 */
	character: number;
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
	/** Target physical defense */
	def: number;
	/** Target magical defense */
	mdef: number;
	/** character hp percentage, from 1 to 100 */
	percentHp: number;
	/** The 1st swiftness license */
	swiftness1: boolean;
	/** The 2nd swiftness license */
	swiftness2: boolean;
	/** The 3rd swiftness license */
	swiftness3: boolean;
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
	elements: {
		[K in Element]: {
			/** True if the weapon does damage with this element */
			damage: boolean;
			/** Is the 1.5x modfifier available? */
			bonus: boolean;
			/** How much damage does the target take from the element? */
			react: 0 | 0.5 | 1 | 2;
		};
	}
}
