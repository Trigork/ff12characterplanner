import { Equipment }  from "../Profile";
import { LicenseByName } from "../../data/Licenses";

const l = LicenseByName;

const Accessory: Equipment[] = [
	{ name: "Bangle", l: l("Accessories 2"), },
	{ name: "Berserker Bracers", l: l("Accessories 13"), berserk: true, },
	{ name: "Ruby Ring", l: l("Accessories 15"), },
	{ name: "Bubble Belt", l: l("Accessories 17"), },
	{ name: "Winged Boots", l: l("Accessories 19"), spd: 5, },
	{ name: "Hermes Sandals", l: l("Accessories 20"), str: 5, haste: true, },
	{ name: "Ring of Renewal", l: l("Accessories 22"), },
	{ name: "Orrachea Armlet", l: l("Accessories 1"), },
	{ name: "Blazer Gloves", l: l("Accessories 11"), focus: true, },
	{ name: "Steel Gorget", l: l("Accessories 4"), adrenaline: true, },
	{ name: "Magick Gloves", l: l("Accessories 13"), },
	{ name: "Leather Gorget", l: l("Accessories 6"), },
	{ name: "Amber Armlet", l: l("Accessories 9"), spd: 2, brawler: true, },
	{ name: "Sage's Ring", l: l("Accessories 14"), },
	{ name: "Agate Ring", l: l("Accessories 14"), vit: 20, },
	{ name: "Opal Ring", l: l("Accessories 20"), mag: 5, },
	{ name: "Battle Harness", l: l("Accessories 4"), str: 2, },
	{ name: "Gauntlets", l: l("Accessories 8"), vit: 5, },
	{ name: "Jade Collar", l: l("Accessories 10"), spd: 3, },
	{ name: "Cameo Belt", l: l("Accessories 16"), mag: 3, },
	{ name: "Indigo Pendant", l: l("Accessories 19"), spd: 7, },
	{ name: "Genji Gloves", l: l("Genji Armor"), mag: 3, genjiGloves: true, },
	{ name: "Argyle Armlet", l: l("Accessories 3"), str: 1, },
	{ name: "Tourmaline Ring", l: l("Accessories 5"), },
	{ name: "Rose Corsage", l: l("Accessories 7"), mag: 1, },
	{ name: "Black Belt", l: l("Accessories 9"), vit: 7, },
	{ name: "Nishijin Belt", l: l("Accessories 10"), mag: 3, },
	{ name: "Gillie Boots", l: l("Accessories 12"), str: 1, spd: 10, },
	{ name: "Bowline Sash", l: l("Accessories 15"), mag: 2, },
	{ name: "Fuzzy Miter", l: l("Accessories 17"), str: 2, },
	{ name: "Sash", l: l("Accessories 18"), spd: 20, },
	{ name: "Power Armlet", l: l("Accessories 18"), str: 3, },
	{ name: "Germinas Boots", l: l("Accessories 22"), vit: 20, spd: 50, },
	{ name: "Quasimodo Boots", l: l("Accessories 21"), },
	{ name: "Ribbon", l: l("Ribbon"), },
	{ name: "Steel Poleyns", l: l("Accessories 12"), },
	{ name: "Diamond Armlet", l: l("Accessories 3"), },
	{ name: "Thief's Cuffs", l: l("Accessories 8"), spd: 1, },
	{ name: "Pheasant Netsuke", l: l("Accessories 11"), },
	{ name: "Nihopalaoa", l: l("Accessories 21"), },
	{ name: "Embroidered Tippet", l: l("Accessories 5"), },
	{ name: "Firefly", l: l("Accessories 2"), str: 1, mag: 1, },
	{ name: "Golden Amulet", l: l("Accessories 6"), },
	{ name: "Cat-ear Hood", l: l("Accessories 16"), spd: 3, },
	{ name: "Turtleshell Choker", l: l("Accessories 7"), mag: 2, spd: 3, },
	{ name: "Manufacted Nethicite", },
	{ name: "Goddess's Magicite", },
	{ name: "Dawn Shard", },
];

export default Accessory;

/*
(() => {

var elts = [...$$$body.querySelectorAll("tr")]; // tbody
var s = "";
for (var i = 1; i < elts.length; i+= 3) {
	let ths = [...elts[i].querySelectorAll("th")];
	let tds = [...elts[i].querySelectorAll("td")];
	const name = ths[0].querySelector(".attach").textContent;
	const ll = tds[tds.length - 1].querySelector("a");
	const license = ll && ll.textContent;
	let ss = `\t{ name: "${name}", `;
	if (ll) {
		ss += `l: l("${license}"), `;
	}
	function dod(index, type) {
		const value = Number(tds[index].textContent);
		if (!Number.isNaN(value)) {
			ss += `${type}: ${value}, `;
		}
	}
	dod(4, "str");
	dod(5, "mag");
	dod(6, "vit");
	dod(7, "spd");

	s += ss;
	s += "},\r\n";
}
copy(s);

})();
*/
