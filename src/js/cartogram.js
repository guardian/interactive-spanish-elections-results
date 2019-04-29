import * as d3B from 'd3'
import * as d3Select from 'd3-selection'
import * as topojson from 'topojson'
import * as d3geo from 'd3-geo'
import {event as currentEvent} from 'd3-selection';
import cartogram from '../assets/spa-hex.json'
import electoralData from '../assets/electoral_data.json'
import provincesVotesRaw from 'raw-loader!./../assets/Congreso_Abril_2019_Resultados por circuscripcion.csv'
import { $ } from "./util"

let d3 = Object.assign({}, d3B, d3Select, d3geo);

const parsed = d3.csvParse(provincesVotesRaw)
const provincesVotes = parsed;
let deputiesByProvince = [];
let parties = []

const atomEl = $('.interactive-wrapper')

let isMobile = window.matchMedia('(max-width: 860px)').matches;
let isDesktop = atomEl.getBoundingClientRect().width > 860;

let maxWidth = 760;
let maxHeight = maxWidth - 100;

let width = !isDesktop ? atomEl.getBoundingClientRect().width : maxWidth;
let height = isMobile ? width : maxHeight;

let padding = 20;

let tooltip = d3.select("#elections-cartogram .tooltip")

let svg = d3.select('#elections-cartogram #cartogram').append('svg')
.attr('width', width)
.attr('height', height)
.attr('class', 'cartogram')

let projection = d3.geoMercator()

let path = d3.geoPath()
.projection(projection)

projection.fitSize([width, height], topojson.feature(cartogram, cartogram.objects['spa-hex-adm1']));

let provincesFeatures = topojson.feature(cartogram, cartogram.objects['spa-hex-adm2']).features

let deputiesCarto = svg.append('g').selectAll('path')
.data(topojson.feature(cartogram, cartogram.objects['spa-hex-deputies']).features)
.enter()
.append('path')
.attr('d', path)
.attr('id', d => 'd' + d.properties.layer)
.attr('class', 'deputy')


let provincesCarto = svg.append('g').selectAll('path')
.data(topojson.feature(cartogram, cartogram.objects['spa-hex-adm2']).features)
.enter()
.append('path')
.attr('d', path)
.attr('class', 'provincia-hex')
.attr('id', d => 'p' +  electoralData.provinces.find(p => p.code == d.properties.layer)["province-code"])
.on('mouseover', mouseover)
.on('mouseout', mouseout)
.on("mousemove", mousemove)

let comunidadesCarto = svg.append('g').selectAll('path')
.data(topojson.feature(cartogram, cartogram.objects['spa-hex-adm1']).features)
.enter()
.append('path')
.attr('d', path)
.attr('class', 'comunidad-hex')


let leabelsGroup = svg.append('g');

electoralData.mainComunidades.forEach(p => {

	leabelsGroup
	.append('text')
	.attr('class', 'cartogram-label-outline')
	.attr('transform', "translate(" + (projection(p.location)[0] + 10) + "," + (projection(p.location)[1] + 5) + ")")
	.text(d => p.comunidad)

	leabelsGroup
	.append('text')
	.attr('class', 'cartogram-label')
	.attr('transform', "translate(" + (projection(p.location)[0] + 10) +"," + (projection(p.location)[1] + 5) + ")")
	.text(d => p.comunidad)

})


let psoeVotes = 0;
let podemosVotes = 0;
let ercVotes = 0;
let juntsVotes = 0;
let ppVotes = 0;


electoralData.provinces.map(p => {

	let results = provincesVotes.find(v => v.province_code === p['province-code'])

	let provinceCode = results.province_code;

	let acumm = 1;

	deputiesByProvince[provinceCode] = []
	

	for(let i = 1 ; i<80 ; i++){

		if(+results['seats ' + i] > 0)
		{
			let party = results['party ' + i];
			let partyBeauty = party;
			let deputies = +results['seats ' + i];
			let votes = +results['votes ' + i];
			let percentage = +results['percentage ' + i];

			if(party == "PODEMOS-EUIB") partyBeauty = 'Podemos-EUIB';
			if(party == "PODEMOS-EU-MAREAS EN COMÚN-EQUO") partyBeauty = 'Podemos-EU-MAREAS EN COMÚN-EQUO';
			if(party == "PODEMOS-EUPV") partyBeauty = 'Podemos-EUPV';
			if(party == "PODEMOS-IU-EQUO") partyBeauty = 'Podemos-IU-EQUO';
			if(party == "PODEMOS-IU-EQUO-AAeC") partyBeauty = 'Podemos-IU-EQUO-AAeC';
			if(party == "PODEMOS-IU-EQUO-BATZARRE") partyBeauty = 'Podemos-IU-EQUO-BATZARRE';
			if(party == "PODEMOS-IU-EQUO BERDEAK") partyBeauty = 'Podemos-IU-EQUO BERDEAK';
			if(party == "PODEMOS-IU LV CA-EQUO")partyBeauty = 'Podemos-IU LV CA-EQUO';
			if(party == "PODEMOS-IX-EQUO" )partyBeauty = 'Podemos-IX-EQUO';
			
			if(party == "Cs") partyBeauty = 'Citizens';

			let partyToKey = partyBeauty;

			if(partyBeauty == 'Podemos-EUIB') partyToKey = 'Podemos and coalitions';
			if(partyBeauty == 'Podemos-EU-MAREAS EN COMÚN-EQUO') partyToKey = 'Podemos and coalitions';
			if(partyBeauty == 'Podemos-EUPV') partyToKey = 'Podemos and coalitions';
			if(partyBeauty == 'Podemos-IU-EQUO') partyToKey = 'Podemos and coalitions';
			if(partyBeauty == 'Podemos-IU-EQUO-AAeC') partyToKey = 'Podemos and coalitions';
			if(partyBeauty == 'Podemos-IU-EQUO-BATZARRE') partyToKey = 'Podemos and coalitions';
			if(partyBeauty == 'Podemos-IU-EQUO BERDEAK') partyToKey = 'Podemos and coalitions';
			if(partyBeauty == 'Podemos-IU LV CA-EQUO') partyToKey = 'Podemos and coalitions';
			if(partyBeauty == 'Podemos-IX-EQUO') partyToKey = 'Podemos and coalitions';
			if(partyBeauty == "ECP-GUANYEM EL CANVI" ) partyToKey = 'Podemos and coalitions';


			if(partyBeauty == 'PP-FORO') partyToKey = 'PP';

			if(partyBeauty == "ERC-SOBIRANISTES") partyToKey = 'ERC'
			if(partyBeauty == "ERC-CATSÍ") partyToKey = 'ERC'
			if(partyBeauty == "ERPV") partyToKey = 'ERC'

			if(partyBeauty == "JxCAT-JUNTS") partyToKey = 'JxCAT-JUNTS'
			if(partyBeauty == "CDC") partyToKey = 'JxCAT-JUNTS'

			if(partyBeauty == "PSC") partyToKey = "PSOE"
			if(partyBeauty == "PSdeG-PSOE") partyToKey = "PSOE"
			if(partyBeauty == "PSE-EE (PSOE)") partyToKey = "PSOE"
			if(partyBeauty == "PSOE") partyToKey = "PSOE"
			if(partyBeauty == "PSOE") partyToKey = "PSOE"


			if(parties.indexOf(partyToKey) == -1){

				parties.push(partyToKey)
			}

			deputiesByProvince[provinceCode].push({
				"deputies" : deputies,
				"votes" : votes,
				"percentage" : percentage,
				"party" : partyBeauty
			});

			for(let j = 0; j < deputies; j++)
			{
				let number = acumm;
				if(acumm<10) number = '0' + acumm;
				d3.select('#d' + provinceCode + number)
				.attr('class', partyBeauty)
				acumm++
			}

		}
		
	}

	deputiesByProvince[provinceCode].sort((a,b) => b.votes - a.votes);

	acumm = 0;

})

parties.sort();

parties.map( party => {
	d3.select('#elections-cartogram #elections-key ul')
	.append('div')
	.html(
		'<svg viewBox="0 0 11.9 11.8" class="' + party + '">' +
		'<polygon class="st0" points="11.9,2.9 10.2,0 6.8,0 5.1,2.9 1.7,2.9 0,5.9 1.7,8.8 5.1,8.8 6.8,11.8 10.2,11.8 11.9,8.8 10.2,5.9"/>' +
		'</svg>' +
		'<div>' + party + '</div>'
		)
})


function mouseover(d){

	d3.selectAll('.provincia-hex').style('fill-opacity',1)
	d3.select(this).style('fill-opacity',0)

	let province = electoralData.provinces.find(e => d.properties.layer == e.code)

	tooltip.classed(" over", true)

	tooltip.select('.tooltip-province').html(province.name)
	tooltip.select('.tooltip-deputies').html(province['deputies-to-elect'])

	deputiesByProvince[province['province-code']].map(dep => {

		let row = tooltip.select('.tooltip-results')
		.append('div')
		.attr('class', 'tooltip-row')

		row
		.append('div')
		.attr('class','tooltip-party')
		.html(dep.party)

		row
		.append('div')
		.attr('class','tooltip-deputies')
		.html(dep.deputies)
	})

	tooltip.style('top', getPos(currentEvent).posY + 'px')
	tooltip.style('left', getPos(currentEvent).posX + 'px')

	d3.selectAll(".geo-map .provinces path").classed("over", true)
	d3.select(".geo-map #p" + province['province-code']).classed("over", false)


}
function mouseout(){

	tooltip.classed(" over", false)
	
	d3.selectAll('.provincia-hex').style('fill-opacity',0)

	tooltip.select('.tooltip-results').html('')

	d3.selectAll(".geo-map .provinces path").classed("over", false)

}

function mousemove(){


	tooltip.style('top', getPos(currentEvent).posY + 'px')
	tooltip.style('left', getPos(currentEvent).posX + 'px')
	
}


function getPos(currentEvent){

	let left = document.getElementById('elections-cartogram').getBoundingClientRect().x;
	let top = document.getElementById('cartogram').getBoundingClientRect().y;

	let tWidth = +tooltip.style("width").split('px')[0]
	let tHeight = +tooltip.style("height").split('px')[0]

	let posX = 0;
	let posY = currentEvent.clientY - top + padding

	if(currentEvent.clientX - left > width /2){
		posX += width - tWidth
	}

	if(currentEvent.clientY - top > height /2){
		posY -= tHeight + padding * 2
	}

	return {posX:posX, posY:posY}
}

/*svg.on("click", function() {
  console.log(projection.invert(d3.mouse(this)));
});

*/

if(isMobile)
{

	let mainComunidades = [
	{"comunidad":"Madrid", "location":[-7.907373222825101, 40.44]},
	{"comunidad":"Catalonia", "location":[1.8517667305883931, 43.846563304934755]},
	{"comunidad":"Andalucía", "location":[-4.646415182498417, 36.27556370201688]},
	{"comunidad":"Basque Country", "location":[-2.471860305570312, 43.846563304934755]},
	{"comunidad":"Canary Islands", "location":[ 1.2631202831035129, 36.59746938953572]},
	{"comunidad":"Balearic Islands", "location":[2.8636194717040353, 38.78913825380521]},
	{"comunidad":"Galicia", "location":[-8.02631985465719, 43.846563304934755]}
	]



	let paths = [

	{"from":[ -6.8282224882214635, 40.38930306353237], "to":[-5.077318810198557, 40.38930306353237]},
	{"from":[ -2.310799659349214, 43.28778915512214 ],"to":[ -2.310799659349214, 43.646875860789585 ]},
	{"from":[ 1.971033385753744, 42.18228064477118 ],"to":[  1.971033385753744, 43.646875860789585]},
	{"from":[ -4.647601668029822, 36.449063450644836 ],"to":[  -4.647601668029822, 37.38414543194909 ]},
	{"from":[ -7.910904739716214, 43.646875860789585 ],"to":[ -7.910904739716214, 43.357133665458335 ]}

	] 

	mainComunidades.forEach(p => {

		leabelsGroup
		.append('text')
		.attr('class', 'map-label')
		.attr('transform', "translate(" + (projection(p.location)[0] + 10) +"," + (projection(p.location)[1] + 5) + ")")
		.text(d => p.comunidad)

	})

	leabelsGroup.selectAll('path')
	.data(paths)
	.enter()
	.append('path')
	.attr('class', 'line')
	.attr('d', d => lngLatToArc(d, 'from', 'to', 100))


	function lngLatToArc(d, sourceName, targetName, bend){
		// If no bend is supplied, then do the plain square root
		bend = bend || 1;
		// `d[sourceName]` and `d[targetname]` are arrays of `[lng, lat]`
		// Note, people often put these in lat then lng, but mathematically we want x then y which is `lng,lat`

		var sourceLngLat = d[sourceName],
		targetLngLat = d[targetName];

		if (targetLngLat && sourceLngLat) {
			var sourceXY = projection( sourceLngLat ),
			targetXY = projection( targetLngLat );

			// Uncomment this for testing, useful to see if you have any null lng/lat values
			// if (!targetXY) console.log(d, targetLngLat, targetXY)
			var sourceX = sourceXY[0],
			sourceY = sourceXY[1];

			var targetX = targetXY[0],
			targetY = targetXY[1];

			var dx = targetX - sourceX,
			dy = targetY - sourceY,
			dr = Math.sqrt(dx * dx + dy * dy)*bend;

			// To avoid a whirlpool effect, make the bend direction consistent regardless of whether the source is east or west of the target
			var west_of_source = (targetX - sourceX) < 0;
			if (west_of_source) return "M" + targetX + "," + targetY + "A" + dr + "," + dr + " 0 0,1 " + sourceX + "," + sourceY;
			return "M" + sourceX + "," + sourceY + "A" + dr + "," + dr + " 0 0,1 " + targetX + "," + targetY;
			
		} else {
			return "M0,0,l0,0z";
		}
	}



}