import * as d3B from 'd3'
import * as d3Select from 'd3-selection'
import * as topojson from 'topojson'
import * as d3geo from 'd3-geo'
import csv from 'csv-parse/lib/sync'
import map from '../assets/admn1_admn2'
import municipalities from '../assets/municipios'
import electoralData from '../assets/electoral_data'
import { $ } from "./util"

let d3 = Object.assign({}, d3B, d3Select, d3geo);

let width = 900;
let height = width;


let projection = d3.geoMercator()

let path = d3.geoPath()
.projection(projection)





//const files = ["TXMUNDI99019.csv","TXMUNDI99029.csv","TXMUNDI99039.csv","TXMUNDI99049.csv","TXMUNDI99059.csv","TXMUNDI99069.csv","TXMUNDI99079.csv","TXMUNDI99089.csv","TXMUNDI99099.csv","TXMUNDI99109.csv","TXMUNDI99119.csv","TXMUNDI99129.csv","TXMUNDI99139.csv","TXMUNDI99149.csv","TXMUNDI99159.csv","TXMUNDI99169.csv","TXMUNDI99179.csv","TXMUNDI99189.csv","TXMUNDI99199.csv","TXMUNDI99209.csv","TXMUNDI99219.csv","TXMUNDI99229.csv","TXMUNDI99239.csv","TXMUNDI99249.csv","TXMUNDI99259.csv","TXMUNDI99269.csv","TXMUNDI99279.csv","TXMUNDI99289.csv","TXMUNDI99299.csv","TXMUNDI99309.csv","TXMUNDI99319.csv","TXMUNDI99329.csv","TXMUNDI99339.csv","TXMUNDI99349.csv","TXMUNDI99359.csv","TXMUNDI99369.csv","TXMUNDI99379.csv","TXMUNDI99389.csv","TXMUNDI99399.csv","TXMUNDI99409.csv","TXMUNDI99419.csv","TXMUNDI99429.csv","TXMUNDI99439.csv","TXMUNDI99449.csv","TXMUNDI99459.csv","TXMUNDI99469.csv","TXMUNDI99479.csv","TXMUNDI99489.csv","TXMUNDI99499.csv","TXMUNDI99509.csv","TXMUNDI99519.csv","TXMUNDI99529.csv"]
const files = [
"TXMUNCO99019.csv",
"TXMUNCO99029.csv",
"TXMUNCO99039.csv",
"TXMUNCO99049.csv",
"TXMUNCO99059.csv",
"TXMUNCO99069.csv",
"TXMUNCO99079.csv",
"TXMUNCO99089.csv",
"TXMUNCO99099.csv",
"TXMUNCO99109.csv",
"TXMUNCO99119.csv",
"TXMUNCO99129.csv",
"TXMUNCO99139.csv",
"TXMUNCO99149.csv",
"TXMUNCO99159.csv",
"TXMUNCO99169.csv",
"TXMUNCO99179.csv",
"TXMUNCO99189.csv",
"TXMUNCO99199.csv",
"TXMUNCO99209.csv",
"TXMUNCO99219.csv",
"TXMUNCO99229.csv",
"TXMUNCO99239.csv",
"TXMUNCO99249.csv",
"TXMUNCO99259.csv",
"TXMUNCO99269.csv",
"TXMUNCO99279.csv",
"TXMUNCO99289.csv",
"TXMUNCO99299.csv",
"TXMUNCO99309.csv",
"TXMUNCO99319.csv",
"TXMUNCO99329.csv",
"TXMUNCO99339.csv",
"TXMUNCO99349.csv",
"TXMUNCO99359.csv",
"TXMUNCO99369.csv",
"TXMUNCO99379.csv",
"TXMUNCO99389.csv",
"TXMUNCO99399.csv",
"TXMUNCO99409.csv",
"TXMUNCO99419.csv",
"TXMUNCO99429.csv",
"TXMUNCO99439.csv",
"TXMUNCO99449.csv",
"TXMUNCO99459.csv",
"TXMUNCO99469.csv",
"TXMUNCO99479.csv",
"TXMUNCO99489.csv",
"TXMUNCO99499.csv",
"TXMUNCO99509.csv",
"TXMUNCO99519.csv",
"TXMUNCO99529.csv"]

let data = []

Promise.all(files
.map(file => {
	fetch('<%= path %>/assets/TXMUNCO993n6g4p7f/' + file).then(response =>{
		return response.ok ? response.text() : Promise.reject(response.status);
	})
	.then(text =>{

		let province = csv(text,{"delimiter": ";","rtrim": true})

		province.map(field => {

			let municipality = []

			municipality.push({
					comunidad_code:field[0],
					provincia_code:field[1],
					fixed_value_0:field[2],
					municipality_code:field[3],
					district_code:field[4],
					municipality_name:field[5],
					fixed_value_1:field[6],
					fixed_value_2:field[7],
					poll_boxes:field[8],
					census_total:field[9],
					census_counted:field[10],
					census_counted_percentage:field[11],
					voters:field[12],
					voters_percentage:field[13],
					abstention:field[14],
					abstention_percentage:field[15],
					blank_votes:field[16],
					blank_votes_percentage:field[17],
					null_votes:field[18],
					null_votes_percentage:field[19],
					results:[]
			})

			for (let i = 20; i < 340; i++) {

				if(i % 4 == 0){

					if(field[i + 1].length != 55)
					{
						municipality[0].results.push({
							party_code:/*i,*/field[i],
							party_acronym:/*i + 1,*/field[i + 1],
							party_votes:/*i + 2,*/field[i + 2],
							party_votes_percentage:/*i + 3*/field[i + 3]
						})
					}
					
				}
			}

			data.push(municipality[0])

			
		})
	})
	.then(d => {

		console.log(data.length)

		//makeMap()

		/*if(data.length == 200)
		{
			makeMap()
		}*/


		if(data.length == 8223)
		{
			makeMap()
		}
	
	})

}))


const makeMap = empty  => {

	projection.fitSize([width, height], topojson.feature(municipalities, municipalities.objects.municipios_4326));

	let municipiosFeatures = topojson.feature(municipalities, municipalities.objects.municipios_4326).features

	let winnersGroup = d3.select("#elections-municipalities").append('svg')
	.attr('width', width)
	.attr('height', height)

	let winners = winnersGroup.selectAll('path')
	.data(municipiosFeatures)
	.enter()
	.append('path')
	.attr('d', path)
	.attr('id', d => 'm' + d.properties.NATCODE.substr(6,10))
	.attr('municipality', d => d.properties.Texto)
	.attr('class', 'municipality')

	let psoeGroup = d3.select("#elections-municipalities").append('svg')
	.attr('width', width)
	.attr('height', height)

	let psoe_depth = psoeGroup.selectAll('path')
	.data(municipiosFeatures)
	.enter()
	.append('path')
	.attr('d', path)
	.attr('id', d => 'm' + d.properties.NATCODE.substr(6,10))
	.attr('municipality', d => d.properties.Texto)
	.attr('class', 'municipality')


	let comunidadesPsoe = psoeGroup.append('g').selectAll('path')
	.data(topojson.feature(map, map.objects.comunidades).features)
	.enter()
	.append('path')
	.attr('d', path)
	.attr('class', 'comunidad')
	

	let ppGroup = d3.select("#elections-municipalities").append('svg')
	.attr('width', width)
	.attr('height', height)

	let pp_depth = ppGroup.selectAll('path')
	.data(municipiosFeatures)
	.enter()
	.append('path')
	.attr('d', path)
	.attr('id', d => 'm' + d.properties.NATCODE.substr(6,10))
	.attr('municipality', d => d.properties.Texto)
	.attr('class', 'municipality')

	let comunidadesPp = ppGroup.append('g').selectAll('path')
	.data(topojson.feature(map, map.objects.comunidades).features)
	.enter()
	.append('path')
	.attr('d', path)
	.attr('class', 'comunidad')


	let podemosGroup = d3.select("#elections-municipalities").append('svg')
	.attr('width', width)
	.attr('height', height)

	let podemos_depth = podemosGroup.selectAll('path')
	.data(municipiosFeatures)
	.enter()
	.append('path')
	.attr('d', path)
	.attr('id', d => 'm' + d.properties.NATCODE.substr(6,10))
	.attr('municipality', d => d.properties.Texto)
	.attr('class', 'municipality')

	let comunidadesPodemos = podemosGroup.append('g').selectAll('path')
	.data(topojson.feature(map, map.objects.comunidades).features)
	.enter()
	.append('path')
	.attr('d', path)
	.attr('class', 'comunidad')


	let csGroup = d3.select("#elections-municipalities").append('svg')
	.attr('width', width)
	.attr('height', height)

	let cs_depth = csGroup.selectAll('path')
	.data(municipiosFeatures)
	.enter()
	.append('path')
	.attr('d', path)
	.attr('id', d => 'm' + d.properties.NATCODE.substr(6,10))
	.attr('municipality', d => d.properties.Texto)
	.attr('class', 'municipality')

	let comunidadesCs = csGroup.append('g').selectAll('path')
	.data(topojson.feature(map, map.objects.comunidades).features)
	.enter()
	.append('path')
	.attr('d', path)
	.attr('class', 'comunidad')

	let voxGroup = d3.select("#elections-municipalities").append('svg')
	.attr('width', width)
	.attr('height', height)

	let vox_depth = voxGroup.selectAll('path')
	.data(municipiosFeatures)
	.enter()
	.append('path')
	.attr('d', path)
	.attr('id', d => 'm' + d.properties.NATCODE.substr(6,10))
	.attr('municipality', d => d.properties.Texto)
	.attr('class', 'municipality')

	let comunidadesVox = voxGroup.append('g').selectAll('path')
	.data(topojson.feature(map, map.objects.comunidades).features)
	.enter()
	.append('path')
	.attr('d', path)
	.attr('class', 'comunidad')


	data.map(municipality =>{


		let votedParties = municipality.results.filter(result => +result.party_votes_percentage > 0);

		

		let winner = votedParties.filter( p => +p.party_votes_percentage === d3.max(votedParties, party => +party.party_votes_percentage));


		let party;


		if(winner.length > 0)
		{

			if(municipality.municipality_name == 'Madrid')console.log(municipality, winner)
			if(winner.length > 1){

				party =  electoralData.parties.find(party => party.acronym === 'Others')
			}
			else{

				party = electoralData.parties.find(party => party.acronym === winner[0].party_acronym)
			}

			winnersGroup.select("#m" + municipality.provincia_code + municipality.municipality_code)
			.attr('class', party.acronym)

			
		}
		else
		{
			winnersGroup.select("#m" + municipality.provincia_code + municipality.municipality_code)
			.attr('class', 'nodata')
			//console.log("NO VOTES YET ------>",municipality.municipality_name, municipality)
		}


		let psoe = municipality.results.find(result => result.party_code === "0096" || result.party_code === "0092" || result.party_code === "0093" || result.party_code === "0094" || result.party_code === "0097");
		let psoePercentage = +psoe.party_votes_percentage / 100

		if(psoe){

			psoeGroup.select("#m" + municipality.provincia_code + municipality.municipality_code)
			.style('fill-opacity', psoePercentage / 100)
			.attr('class' , 'PSOE')
		}


		let pp = municipality.results.find(result => result.party_code === "0083" || result.party_code === "0084" || result.party_code === "0085" || result.party_code === "0086" || result.party_code === "0052");
		let ppPercentage = +pp.party_votes_percentage / 100

		if(pp){

			ppGroup.select("#m" + municipality.provincia_code + municipality.municipality_code)
			.style('fill-opacity', ppPercentage /100)
			.attr('class' , 'PP')
		}


		let podemos = municipality.results.find(result => result.party_code === "0074" || result.party_code === "0075" || result.party_code === "0076" || result.party_code === "0077" || result.party_code === "0078" || result.party_code === "0079" || result.party_code === "0080" || result.party_code === "0081" || result.party_code === "0082" || result.party_code === "0032");
		let podemosPercentage = +podemos.party_votes_percentage / 100

		if(podemos){

			podemosGroup.select("#m" + municipality.provincia_code + municipality.municipality_code)
			.style('fill-opacity', podemosPercentage /100)
			.attr('class' , 'PODEMOS')
		}

		let cs = municipality.results.find(result => result.party_code === "0022" || result.party_code === "0023" || result.party_code === "0052" );
		let csPercentage = +cs.party_votes_percentage / 100

		if(cs){

			csGroup.select("#m" + municipality.provincia_code + municipality.municipality_code)
			.style('fill-opacity', csPercentage / 100)
			.attr('class' , 'Cs')
		}


		let vox = municipality.results.find(result => result.party_code === "0117");
		let voxPercentage = +vox.party_votes_percentage / 100

		if(vox){

			voxGroup.select("#m" + municipality.provincia_code + municipality.municipality_code)
			.style('fill-opacity', voxPercentage / 100)
			.attr('class' , 'VOX')
		}

		

	})
}