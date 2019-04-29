import * as d3B from 'd3'
import * as d3Select from 'd3-selection'
import * as topojson from 'topojson'
import * as d3geo from 'd3-geo'
import map from '../assets/admn1_admn2.json?123'
import provincesVotesRaw from 'raw-loader!./../assets/Congreso_Abril_2019_Resultados por circuscripcion.csv'
import electoralData from '../assets/electoral_data'
import {event as currentEvent} from 'd3-selection';
import { $ } from "./util"

let d3 = Object.assign({}, d3B, d3Select, d3geo);

let mainComunidades = [
	{"comunidad":"Madrid", "location":[-8.70896475056788, 40.43271083404107]},
	{"comunidad":"Catalonia", "location":[3.7021367134571945, 41.34055512450301]},
	{"comunidad":"Andalusia", "location":[-5.267693225114382, 35.4926181702362]},
	{"comunidad":"Basque Country", "location":[-2.593824346415369, 44.520148741647674]},
	{"comunidad":"Canary Islands", "location":[ 3.0210325043186224, 35.28300873163696]},
	{"comunidad":"Balearic Islands", "location":[3.379433880190461, 38.63271492904698]},
	{"comunidad":"Galicia", "location":[-8.468155410474292, 44.45544313728824]}
	]

let paths = [

	{"from":[-7.0896475056788, 40.43271083404107], "to":[-4.4036897738022915, 40.43271083404107]},
	{"from":[ -2.454628077533657, 43.47595745278307 ],"to":[ -2.454628077533657, 44.16995634597881 ]},
	{"from":[ 2.7202042248160696, 41.35490023929793 ],"to":[ 2.256503477338289, 41.377328003798894 ]},
	{"from":[ -4.667814675852475, 35.74605490215351 ],"to":[ -4.667814675852475, 36.51041049451024 ]},
	{"from":[ -7.910904739716214, 44.12414412990034 ],"to":[ -7.910904739716214, 43.74134749305692 ]}

]

let parties = []

const atomEl = $('.interactive-wrapper')

let isMobile = window.matchMedia('(max-width: 860px)').matches;

let width = isMobile ? atomEl.getBoundingClientRect().width : 300;
let height = width;

d3.select("#elections-geographical")
.style("width", width + 'px')

let tooltip = d3.select("#elections-geographical .tooltip")

let padding = 60;

let svg = d3.select('#coropleth').append('svg')
.attr('width', width)
.attr('height', height)
.attr('class', 'geo-map')

let projection = d3.geoMercator()

let path = d3.geoPath()
.projection(projection)

projection.fitSize([width, height], topojson.feature(map, map.objects.provincias));

let provincesMap = svg.append('g')
.attr('class', "provinces")
.selectAll('path')
.data(topojson.feature(map, map.objects.provincias).features)
.enter()
.append('path')
.attr('d', path)
.attr('id', d => 'p' + String(d.properties.code).substr(4,5))
.attr('class', 'province')


provincesMap
.on('mouseover', mouseover)
.on('mouseout', mouseout)
.on('mousemove', mousemove)

let comunitiesMap = svg.append('g').selectAll('path')
.data(topojson.feature(map, map.objects.comunidades).features)
.enter()
.append('path')
.attr('d', path)
.attr('class', 'comunidad')

let leabelsGroup = svg.append('g');

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



let parsed = d3.csvParse(provincesVotesRaw)

let provincesVotes = parsed;

let deputiesByProvince = [];

electoralData.provinces.map(p => {

	let results = provincesVotes.find(v => v.province_code === p['province-code'])

	let provinceCode = results.province_code;

	let votesDummy = []
	
	for(let i = 1 ; i<80 ; i++){

		if(+results['seats ' + i] > 0)
		{
		
			votesDummy.push({votes:+results['votes ' + i], party:results['party ' + i], deputies:+results['seats ' + i]})
		}
	}

	votesDummy.sort((a,b) => b.votes - a.votes);

	deputiesByProvince[provinceCode] = votesDummy;


	let winner = votesDummy[0];


	if(votesDummy[0] != undefined){
		d3.select('#p' + p["province-code"]).attr('class', winner.party)
	
			let party = winner.party
			let partyBeauty = party;

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

		}

} )

parties.sort();

parties.map( party => {
	d3.select('#elections-geographical #elections-key ul')
	.append('div')
	.html(
		'<svg viewBox="0 0 11.9 11.8" class="' + party + '">' +
		'<rect width="12" height="12"/>' +
		'</svg>' +
		'<div>' + party + '</div>'
		)
})


/*svg.on("click", function() {
  console.log(projection.invert(d3.mouse(this)));
});
*/

function mouseover(d){

	let thisCode = String(d.properties.code).substr(4,5)

	d3.selectAll(".geo-map .provinces path").classed("over", true)
	d3.select(".geo-map #p" + thisCode).classed("over", false)
	
	let cartoProvince = d3.select('.cartogram #p' + thisCode);
	let cartoProvinces = d3.selectAll('.cartogram .provincia-hex');

	cartoProvinces.style('fill-opacity', 1)
	cartoProvince.style('fill-opacity', 0)

	let province = electoralData.provinces.find(e => thisCode == e["province-code"])

	tooltip.classed(" over", true)

	tooltip.select('.tooltip-province').html(province.name)
	tooltip.select('.tooltip-deputies').html(province['deputies-to-elect'])

	deputiesByProvince[thisCode].map(dep => {
		
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

}


function mouseout(d){

	let cartoProvinces = d3.selectAll('.cartogram .provincia-hex');
	cartoProvinces.style('fill-opacity', 0)

	d3.selectAll(".geo-map .provinces path").classed("over", false)
	
	tooltip.select('.tooltip-results').html('')

	tooltip.classed(" over", false)

}

function mousemove(d){

	tooltip.style('top', getPos(currentEvent).posY + padding + 'px')
	tooltip.style('left', getPos(currentEvent).posX + 'px')
	
}


function getPos(currentEvent){

	let left = document.getElementById('elections-geographical').getBoundingClientRect().x;
	let top = document.getElementById('coropleth').getBoundingClientRect().y;

	let tWidth = +tooltip.style("width").split('px')[0]
	let tHeight = +tooltip.style("height").split('px')[0]

	let posX = 0;
	let posY = currentEvent.clientY - top + padding

	if(currentEvent.clientX - left > width /2){
		posX += width - tWidth
	}

	/*if(currentEvent.clientY - top > height /2){
		posY -= tHeight + padding * 2
	}*/

	return {posX:posX, posY:posY}
}

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


