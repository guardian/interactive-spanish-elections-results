import * as d3B from 'd3'
import * as d3Select from 'd3-selection'
import * as topojson from 'topojson'
import * as d3geo from 'd3-geo'
import csv from 'csv-parse/lib/sync'
import map from '../assets/admn1_admn2'
import electoralData from '../assets/electoral_data'
import { $ } from "./util"
import almeria from 'raw-loader!./../assets/TXMUNDI99INI/TXMUNDI99049.csv'

let d3 = Object.assign({}, d3B, d3Select, d3geo);

const files = ["TXMUNDI99019.csv","TXMUNDI99029.csv","TXMUNDI99039.csv","TXMUNDI99049.csv","TXMUNDI99059.csv","TXMUNDI99069.csv","TXMUNDI99079.csv","TXMUNDI99089.csv","TXMUNDI99099.csv","TXMUNDI99109.csv","TXMUNDI99119.csv","TXMUNDI99129.csv","TXMUNDI99139.csv","TXMUNDI99149.csv","TXMUNDI99159.csv","TXMUNDI99169.csv","TXMUNDI99179.csv","TXMUNDI99189.csv","TXMUNDI99199.csv","TXMUNDI99209.csv","TXMUNDI99219.csv","TXMUNDI99229.csv","TXMUNDI99239.csv","TXMUNDI99249.csv","TXMUNDI99259.csv","TXMUNDI99269.csv","TXMUNDI99279.csv","TXMUNDI99289.csv","TXMUNDI99299.csv","TXMUNDI99309.csv","TXMUNDI99319.csv","TXMUNDI99329.csv","TXMUNDI99339.csv","TXMUNDI99349.csv","TXMUNDI99359.csv","TXMUNDI99369.csv","TXMUNDI99379.csv","TXMUNDI99389.csv","TXMUNDI99399.csv","TXMUNDI99409.csv","TXMUNDI99419.csv","TXMUNDI99429.csv","TXMUNDI99439.csv","TXMUNDI99449.csv","TXMUNDI99459.csv","TXMUNDI99469.csv","TXMUNDI99479.csv","TXMUNDI99489.csv","TXMUNDI99499.csv","TXMUNDI99509.csv","TXMUNDI99519.csv","TXMUNDI99529.csv"]

let data = []

Promise.all(files
.map(file => {
	fetch('<%= path %>/assets/TXMUNDI99INI/' + file).then(response =>{
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
					municipality[0].results.push({
						party_code:i,//field[i],
						party_acronym:i + 1,//field[i + 1],
						party_votes:i + 2,//field[i + 2],
						party_votes_percentage:i + 3//field[i + 3]
					})
				}
			}

			let file = municipality[0]

			data.push(file)

			
		})
	})

}))
.then(d => {
	console.log(data)
	
})