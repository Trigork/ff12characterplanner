import * as React from "react";
import PartyModel from "../model/PartyModel";
import { optimizeForCharacter } from "../dps/OptimizeForCharacter";
import { OptimizerResult } from "../dps/Optimize";
import { Characters } from "../data/Characters";
import "./Dps.scss";
import { Environment, Equipment, Profile, AllElements } from "../dps/Profile";
import { CalculateResult } from "../dps/Calculate";

export interface Props {
	party: PartyModel;
}

interface State {
	env: Environment;
}

interface InputProps<T> {
	value: T;
	changeValue: (newValue: T) => void;
	label: string;
	tooltip: string;
}

interface NumberProps extends InputProps<number> {
	min: number;
	max: number;
}

let nextLabelId = 0;
function getId() {
	return "lid-" + ++nextLabelId;
}

function NumberInput(props: NumberProps) {
	const id = getId();
	return <div aria-label={props.tooltip} className="control">
		<label htmlFor={id}>{props.label}</label>
		<input
			id={id}
			type="number"
			value={props.value}
			min={props.min}
			max={props.max}
			onChange={ev => ev.currentTarget.validity.valid && props.changeValue(ev.currentTarget.valueAsNumber)}
		/>
	</div>;
}

function BoolInput(props: InputProps<boolean>) {
	const id = getId();
	return <div aria-label={props.tooltip} className="control">
		<label htmlFor={id}>{props.label}</label>
		<input
			id={id}
			type="checkbox"
			checked={props.value}
			onChange={() => props.changeValue(!props.value)}
		/>
	</div>;
}

function tooltipFor(e: Equipment) {
	const ret = Array<string>();
	if (e.animationType) {
		ret.push({
			unarmed: "Unarmed",
			dagger: "Dagger",
			ninja: "Ninja Sword",
			katana: "Katana",
			sword: "Sword",
			bigsword: "Greatsword",
			hammer: "Hammer/Axe",
			pole: "Pole",
			spear: "Spear",
			mace: "Mace",
			bow: "Bow",
			gun: "Gun",
			xbow: "Crossbow",
			measure: "Measure",
			rod: "Rod",
			staff: "Staff",
			handbomb: "Handbomb"
		}[e.animationType]);
	}
	if (e.damageType === "gun" && e.animationType !== "gun") {
		ret.push("Pierce");
	}
	function f(k: keyof Profile, s: string) {
		const v = e[k];
		if (typeof v === "number" && v > 0) {
			ret.push(`${v} ${s}`);
		} else if (v === true) {
			ret.push(s);
		}
	}
	f("attack", "Att");
	f("chargeTime", "CT");
	f("combo", "Cb");
	f("str", "Str");
	f("mag", "Mag");
	f("vit", "Vit");
	f("spd", "Spd");
	f("brawler", "Brawler");
	f("berserk", "Berserk");
	f("haste", "Haste");
	f("bravery", "Bravery");
	f("focus", "Focus");
	f("adrenaline", "Adrenaline");
	f("genjiGloves", "Combo+");
	for (const elt of AllElements) {
		f(elt + "Damage" as any, elt[0].toUpperCase() + elt.slice(1) + " Damage");
	}
	for (const elt of AllElements) {
		f(elt + "Bonus" as any, elt[0].toUpperCase() + elt.slice(1) + " Bonus");
	}
	return ret.join(",");
}

export default class Dps extends React.PureComponent<Props, State> {
	constructor(props: Props) {
		super(props);

		this.state = {
			env: {
				character: -1,
				def: 30,
				mdef: 30,
				percentHp: 1,
				fireReaction: 1,
				iceReaction: 1,
				lightningReaction: 1,
				waterReaction: 1,
				windReaction: 1,
				earthReaction: 1,
				darkReaction: 1,
				holyReaction: 1,
				level: 70,
				resistGun: false,
				battleSpeed: 6,
				berserk: true,
				haste: true,
				bravery: true	
			}
		};
	}

	private changeEnv<K extends keyof Environment>(key: K, value: Environment[K]) {
		this.setState(s => ({
			env: {
				...s.env,
				[key]: value
			}
		}));
	}

	render() {
		const components = Array.from({ length: 6 })
			.map((_, idx) => {
				const env = { ...this.state.env, character: idx };
				const results = optimizeForCharacter(env, this.props.party);
				return <SingleCharacterDps key={idx} name={Characters[idx].name} results={results} />;
			});
		return <div className="dps-optimizer">
			<div className="controls">
				<NumberInput
					min={0}
					max={250}
					label="Def"
					tooltip="Target's physical defense"
					value={this.state.env.def}
					changeValue={v => this.changeEnv("def", v)}
				/>
				<NumberInput
					min={0}
					max={250}
					label="MDef"
					tooltip="Target's magical defense"
					value={this.state.env.mdef}
					changeValue={v => this.changeEnv("mdef", v)}
				/>
				<NumberInput
					min={1}
					max={100}
					label="HP%"
					tooltip="Character's HP percentage"
					value={this.state.env.percentHp}
					changeValue={v => this.changeEnv("percentHp", v)}
				/>
				{/* elemental reactions... (8 dropdowns) */}
				<NumberInput
					min={1}
					max={99}
					label="Lvl"
					tooltip="Character's level"
					value={this.state.env.level}
					changeValue={v => this.changeEnv("level", v)}
				/>
				<BoolInput
					label="Resist G&M"
					tooltip="Does the target resist guns and measures?"
					value={this.state.env.resistGun}
					changeValue={v => this.changeEnv("resistGun", v)}
				/>
				{/* battle speed... (dropdown?) */}
				<BoolInput
					label="Berserk"
					tooltip="Is the berserk buff available?"
					value={this.state.env.berserk}
					changeValue={v => this.changeEnv("berserk", v)}
				/>
				<BoolInput
					label="Haste"
					tooltip="Is the haste buff available?"
					value={this.state.env.haste}
					changeValue={v => this.changeEnv("haste", v)}
				/>
				<BoolInput
					label="Bravery"
					tooltip="Is the bravery buff available?"
					value={this.state.env.bravery}
					changeValue={v => this.changeEnv("bravery", v)}
				/>
			</div>
			<div className="results">
				<table>
					<tbody>
						{components}
					</tbody>
				</table>	
			</div>
		</div>;
	}
}

function EqCell(props: { value?: Equipment }) {
	const { value } = props;
	return <td
		aria-label={value && tooltipFor(value)}
	>
		{value && value.name}
	</td>;
}

function DpsCell(props: { value: CalculateResult }) {
	const { value } = props;
	return <td
		className="r"
		aria-label={`Base Damage: ${Math.round(value.baseDmg)}\nModified Damage: ${Math.round(value.modifiedDamage)}\nComboed Damage: ${Math.round(value.comboDamage)}\nCharge Time: ${value.chargeTime.toFixed(2)}s\nAnimation Time: ${value.animationTime.toFixed(2)}s`}
	>
		{Math.round(value.dps)}
	</td>;
}

function SingleCharacterDps(props: { name: string, results: OptimizerResult[] }) {
	return <>
		<tr>
			<th colSpan={9999}>{props.name}</th>
		</tr>
		<tr>
			<th className="r">DPS</th>
			<th>Weapon</th>
			<th>Ammo</th>
			<th>Helm</th>
			<th>Armor</th>
			<th>Accessory</th>
		</tr>

		{props.results.map((r, i) => <tr key={i} className="data-row">
			<DpsCell value={r.dps} />
			<EqCell value={r.doll.weapon} />
			<EqCell value={r.doll.ammo} />
			<EqCell value={r.doll.helm} />
			<EqCell value={r.doll.armor} />
			<EqCell value={r.doll.accessory} />
		</tr>)}
	</>;
}
