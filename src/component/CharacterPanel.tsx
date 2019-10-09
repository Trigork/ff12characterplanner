import * as React from "react";
import "./CharacterPanel.scss";
import { LicenseGroups, LicenseGroup, License } from "../data/Licenses";
import PartyModel, { Coloring } from "../model/PartyModel";
import { Characters } from "../data/Characters";
import { confirm } from "../Dialog";

export interface Props {
	party: PartyModel;
	changeParty(newParty: PartyModel): void;
	characterIndex: number;
	boardIndex: number;
	changeIndices(characterIndex: number, boardIndex: number): void;
	qeActive: boolean;
	toggleQe(): void;
	plannedParty?: PartyModel;
	dpsActive: boolean;
	toggleDps(): void;
}

export default class CharacterPanel extends React.PureComponent<Props> {
	private renderClassInfo(characterIndex: number, index: number) {
		const j = this.props.party.getJob(characterIndex, index);
		const selected = this.props.characterIndex === characterIndex && this.props.boardIndex === index;
		if (!j) {
			const disabled = index === 1 && !this.props.party.getJob(characterIndex, 0);
			return <button disabled={disabled} className="job nojob" aria-pressed={selected} onClick={ev => { ev.stopPropagation(); this.props.changeIndices(characterIndex, index); }}>
				<span className="name">No Job</span>
			</button>;
		} else {
			return <button className="job" aria-pressed={selected} onClick={ev => { ev.stopPropagation(); this.props.changeIndices(characterIndex, index); }}>
				<span className="name">{j.name}</span>
			</button>;
		}
	}

	private renderLicenseGroup(g: LicenseGroup, i: number, colors: Map<License, Coloring>, plannedColors?: Map<License, Coloring>) {
		const children = Array<React.ReactNode>();
		if (typeof g.contents[0].grants!.what === "number") {
			// display a numeric total
			const a = Array<License>();
			const b = Array<License>();
			const c = Array<License>();
			const d = Array<License>();
			for (const l of g.contents) {
				switch (colors.get(l)) {
					case Coloring.OBTAINED: a.push(l); break;
					case Coloring.CERTAIN: b.push(l); break;
					case Coloring.POSSIBLE: c.push(l); break;
					case Coloring.BLOCKED:
					default:
						if (plannedColors && plannedColors.has(l) && plannedColors.get(l) !== Coloring.BLOCKED) {
							d.push(l);
						}
						break;
				}
			}
			const onClick = (licenses: License[], add: boolean) => {
				let party = this.props.party;
				for (const l of licenses) {
					if (add) {
						party = party.add(this.props.characterIndex, l);
					} else {
						party = party.delete(this.props.characterIndex, l);
					}
					this.props.changeParty(party);
				}
			};
			if (a.length) { children.push(<p key={0} className="l obtained" onClick={() => onClick(a, false)}>+{a.reduce((acc, val) => acc + (val.grants!.what as number), 0)}</p>); }
			if (b.length) { children.push(<p key={1} className="l certain" onClick={() => onClick(b, true)}>+{b.reduce((acc, val) => acc + (val.grants!.what as number), 0)}</p>); }
			if (c.length) { children.push(<p key={2} className="l possible" onClick={() => onClick(c, true)}>+{c.reduce((acc, val) => acc + (val.grants!.what as number), 0)}</p>); }
			if (d.length) { children.push(<p key={3} className="l planned">+{d.reduce((acc, val) => acc + (val.grants!.what as number), 0)}</p>); }
		} else {
			// display each license (could display each granted spell if desired?)
			for (const l of g.contents) {
				let className: string;
				let obtained = false;
				switch (colors.get(l)) {
					case Coloring.OBTAINED: className = "l obtained"; obtained = true; break;
					case Coloring.CERTAIN: className = "l certain"; break;
					case Coloring.POSSIBLE: className = "l possible"; break;
					case Coloring.BLOCKED:
					default:
						if (plannedColors && plannedColors.has(l) && plannedColors.get(l) !== Coloring.BLOCKED) {
							className = "l planned"; break;
						} else {
							continue; // don't render not at all available licenses
						}
				}
				const onClick = () => {
					if (obtained) {
						this.props.changeParty(this.props.party.delete(this.props.characterIndex, l));
					} else {
						this.props.changeParty(this.props.party.add(this.props.characterIndex, l));
					}
				};
				children.push(<p
					key={l.fullName}
					className={className}
					aria-label={l.text}
					onClick={onClick}
				>
					{l.fullName}
				</p>);
			}
		}
		if (children.length) {
			return <div key={i} className="group">
				<h3 className="name">{g.name}</h3>
				{children}
			</div>;
		} else {
			return null;
		}
	}

	private renderStatInfo() {
		const colors = this.props.party.color(this.props.characterIndex);
		const plannedColors = this.props.plannedParty && this.props.plannedParty.color(this.props.characterIndex);
		return LicenseGroups.map((g, i) => this.renderLicenseGroup(g, i, colors, plannedColors));
	}

	private renderResetJob() {
		const c = this.props.characterIndex;
		const job = this.props.party.getJob(c, this.props.boardIndex);
		let label: string;
		let disabled: boolean;
		if (job) {
			label = `Unlearn ${job.name} from ${Characters[c].name}`;
			disabled = false;
		} else {
			label = `Unlearn current job from ${Characters[c].name}`;
			disabled = true;
		}
		return <button
			className="action"
			aria-label={label}
			disabled={disabled}
			onClick={async () => {
				if (await confirm(label + "?")) {
					this.props.changeParty(this.props.party.removeJob(c, job!));
				}
			}}
		>
			Reset Job
		</button>;
	}

	private renderResetCharacter() {
		const c = this.props.characterIndex;
		const disabled = this.props.party.unemployed(c);
		const label = `Unlearn all jobs from ${Characters[c].name}`;
		return <button
			className="action"
			aria-label={label}
			disabled={disabled}
			onClick={async () => {
				if (await confirm(label + "?")) {
					this.props.changeParty(this.props.party.removeAllJobs(c));
				}
			}}
		>
			Reset Character
		</button>;
	}

	private renderResetAll() {
		const disabled = this.props.party.allUnemployed();
		return <button
			className="action"
			aria-label="Unlearn all jobs from all characters"
			disabled={disabled}
			onClick={async () => {
				if (await confirm("Unlearn all jobs from all characters?")) {
					this.props.changeParty(new PartyModel());
				}
			}}
		>
			Reset All
		</button>;
	}

	private renderToggleQe() {
		return <button
			className="action"
			aria-label="Manage Quickenings and Espers for all characters at once."
			onClick={this.props.toggleQe}
			aria-pressed={this.props.qeActive}
		>
			{this.props.qeActive ? "Hide Mist Planner" : "Show Mist Planner"}
		</button>;
	}

	private renderToggleDps() {
		return <button
			className="action"
			aria-label="Simulate character damage output"
			onClick={this.props.toggleDps}
			aria-pressed={this.props.dpsActive}
		>
			{this.props.dpsActive ? "Hide DPS Simulator" : "Show DPS Simulator"}
		</button>;		
	}

	private selectCharacter(index: number) {
		if (this.props.characterIndex === index) {
			this.props.changeIndices(index, this.props.boardIndex ^ 1);
		} else {
			this.props.changeIndices(index, 0);
		}
	}

	render() {
		return <div className="character-panel">
			<div className="actions">
				{this.renderResetJob()}
				{this.renderResetCharacter()}
				{this.renderResetAll()}
				{this.renderToggleQe()}
				{this.renderToggleDps()}
			</div>
			<div className="character-select">
				{Characters.map((c, i) => <div className="character" key={i} aria-pressed={this.props.characterIndex === i} onClick={() => this.selectCharacter(i)}>
					<span className="name">{c.name}</span>
					<br />
					{this.renderClassInfo(i, 0)}
					<br />
					{this.renderClassInfo(i, 1)}
					<br />
					<span>{this.props.party.getLpCount(i)} LP</span>
				</div>)}
			</div>
			<div className="stats">
				{this.renderStatInfo()}
			</div>
		</div>;
	}
}
