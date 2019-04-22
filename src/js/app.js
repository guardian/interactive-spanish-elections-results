import * as d3B from 'd3'
import * as d3Select from 'd3-selection'
import * as topojson from 'topojson'
import * as d3geo from 'd3-geo'
import csv from 'csv-parse/lib/sync'
import map from '../assets/admn1_admn2'
import municipalities from '../assets/municipios'
import electoralData from '../assets/electoral_data?12345'
import { $ } from "./util"

let d3 = Object.assign({}, d3B, d3Select, d3geo);

let width = 900;
let height = width;

/*let svg = d3.select(".interactive-wrapper").append('svg')
.attr('width', width)
.attr('height', height)*/

let projection = d3.geoMercator()

let path = d3.geoPath()
.projection(projection)



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
	fetch('<%= path %>/assets/TXMUNCO999dch6go2/' + file).then(response =>{
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

		/*if(data.length == 51)
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

	projection.fitSize([width, height], topojson.feature(municipalities, municipalities.objects.municipios));

	let municipiosFeatures = topojson.feature(municipalities, municipalities.objects.municipios).features

	let winnersGroup = d3.select(".interactive-wrapper").append('svg')
	.attr('width', width)
	.attr('height', height)

	let winners = winnersGroup.selectAll('path')
	.data(municipiosFeatures)
	.enter()
	.append('path')
	.attr('d', path)
	.style('fill', '#F6F6F6')
	.attr('id', d => 'm' + d.properties.NATCODE.substr(6,10))
	.attr('class', d => d.properties.Texto)

	let psoeGroup = d3.select(".interactive-wrapper").append('svg')
	.attr('width', width)
	.attr('height', height)

	let psoe_depth = psoeGroup.selectAll('path')
	.data(municipiosFeatures)
	.enter()
	.append('path')
	.attr('d', path)
	.style('fill', '#F6F6F6')
	.attr('id', d => 'm' + d.properties.NATCODE.substr(6,10))
	.attr('class', d => d.properties.Texto)

	let ppGroup = d3.select(".interactive-wrapper").append('svg')
	.attr('width', width)
	.attr('height', height)

	let pp_depth = ppGroup.selectAll('path')
	.data(municipiosFeatures)
	.enter()
	.append('path')
	.attr('d', path)
	.style('fill', '#F6F6F6')
	.attr('id', d => 'm' + d.properties.NATCODE.substr(6,10))
	.attr('class', d => d.properties.Texto)


	let podemosGroup = d3.select(".interactive-wrapper").append('svg')
	.attr('width', width)
	.attr('height', height)

	let podemos_depth = podemosGroup.selectAll('path')
	.data(municipiosFeatures)
	.enter()
	.append('path')
	.attr('d', path)
	.style('fill', '#F6F6F6')
	.attr('id', d => 'm' + d.properties.NATCODE.substr(6,10))
	.attr('class', d => d.properties.Texto)


	let csGroup = d3.select(".interactive-wrapper").append('svg')
	.attr('width', width)
	.attr('height', height)

	let cs_depth = csGroup.selectAll('path')
	.data(municipiosFeatures)
	.enter()
	.append('path')
	.attr('d', path)
	.style('fill', '#F6F6F6')
	.attr('id', d => 'm' + d.properties.NATCODE.substr(6,10))
	.attr('class', d => d.properties.Texto)

	let voxGroup = d3.select(".interactive-wrapper").append('svg')
	.attr('width', width)
	.attr('height', height)

	let vox_depth = voxGroup.selectAll('path')
	.data(municipiosFeatures)
	.enter()
	.append('path')
	.attr('d', path)
	.style('fill', '#F6F6F6')
	.attr('id', d => 'm' + d.properties.NATCODE.substr(6,10))
	.attr('class', d => d.properties.Texto)


	data.map(municipality =>{


		let votedParties = municipality.results.filter(result => +result.party_votes_percentage > 0);

		let winner = votedParties.find( p => +p.party_votes_percentage === d3.max(votedParties, party => +party.party_votes_percentage));

		if(winner)
		{

			let party = electoralData.parties.find(party => party.acronym === winner.party_acronym)


			if(party)
			{
				let color = party.color

				winnersGroup.select("#m" + municipality.provincia_code + municipality.municipality_code)
				.style('fill', 'red')
				.style('fill', color)
			}
			else
			{
				console.log('-----------------*',winner.party_acronym)
			}

			
		}
		else
		{
			console.log("---------------->", municipality)
		}


		let psoe = municipality.results.find(result => result.party_code === "0096" || result.party_code === "0092" || result.party_code === "0093" || result.party_code === "0094" || result.party_code === "0097");

		if(psoe){

			psoeGroup.select("#m" + municipality.provincia_code + municipality.municipality_code)
			.style('fill', '#C70000')
			.style('fill-opacity', +psoe.party_votes_percentage /10000)
			.attr('class' , 'psoe' + +psoe.party_votes_percentage /10000)
		}


		let pp = municipality.results.find(result => result.party_code === "0083" || result.party_code === "0084" || result.party_code === "0085" || result.party_code === "0086" || result.party_code === "0052");

		if(pp){

			ppGroup.select("#m" + municipality.provincia_code + municipality.municipality_code)
			.style('fill', '#1896d7')
			.style('fill-opacity', +pp.party_votes_percentage /10000)
			.attr('class' , 'pp' + +pp.party_votes_percentage /10000)
		}


		let podemos = municipality.results.find(result => result.party_code === "0074" || result.party_code === "0075" || result.party_code === "0076" || result.party_code === "0077" || result.party_code === "0078" || result.party_code === "0079" || result.party_code === "0080" || result.party_code === "0081" || result.party_code === "0082" || result.party_code === "0032");

		if(podemos){

			podemosGroup.select("#m" + municipality.provincia_code + municipality.municipality_code)
			.style('fill', '#951d7a')
			.style('fill-opacity', +podemos.party_votes_percentage /10000)
			.attr('class' , 'podemos' + +podemos.party_votes_percentage /10000)
		}

		let cs = municipality.results.find(result => result.party_code === "0022" || result.party_code === "0023" );

		if(cs){

			csGroup.select("#m" + municipality.provincia_code + municipality.municipality_code)
			.style('fill', '#ed6300')
			.style('fill-opacity', +cs.party_votes_percentage /10000)
			.attr('class' , 'cs' + +cs.party_votes_percentage /10000)
		}


		let vox = municipality.results.find(result => result.party_code === "0117");

		if(vox){

			voxGroup.select("#m" + municipality.provincia_code + municipality.municipality_code)
			.style('fill', '#9C835F')
			.style('fill-opacity', +vox.party_votes_percentage /10000)
			.attr('class' , 'vox' + +vox.party_votes_percentage /10000)
		}

		

	})



}





















 










