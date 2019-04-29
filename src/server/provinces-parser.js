import csvParse from 'csv-parse/lib/es5/sync'
import csvStringify from 'csv-stringify/lib/es5/sync'
import fs from "fs"

const provincesVotesRaw = fs.readFileSync("./src/assets/TXTOTCO99heq8a41c.csv")

const provinces = csvParse(provincesVotesRaw,{"delimiter": ";","rtrim": true});

const provincesTotals = [];
const totals = [];

provinces.map(field => {


	if(field[0] == 'CI')
	{

		let province = []

			let cont = 1;

			province.push({
					territory_id:field[0],
					comunidad_code:field[1],
					province_code:field[2],
					province_name:field[4],
					poll_boxes:field[5],
					census_total:field[6],
					census_counted:field[7],
					census_counted_percentage:field[8],
					voters:field[9],
					voters_percentage:field[10],
					abstention:field[11],
					abstention_percentage:field[12],
					blank_votes:field[13],
					blank_votes_percentage:field[14],
					null_votes:field[15],
					null_votes_percentage:field[16],
					deputies_total:field[17]

			})

			for (let i = 18; i < field.length-1; i++) {


				if((i-18)%5 == 0)
				{
						
					province[0][ 'code ' + cont] = field[i];
					province[0][ 'party ' + cont] = field[i + 1];
					province[0][ 'votes ' + cont] = field[i + 2];
					province[0][ 'percentage ' + cont] = field[i + 3];
					province[0][ 'seats ' + cont] = field[i + 4];

					cont++
				}

			}

			provincesTotals.push(province[0])

	}
	/*if(field[0] == 'TO')
	{
		let cont = 1;

		totals.push({
					territory_id:field[0],
					comunidad_code:field[1],
					province_code:field[2],
					province_name:field[4],
					poll_boxes:field[5],
					census_total:field[6],
					census_counted:field[7],
					census_counted_percentage:field[8],
					voters:field[9],
					voters_percentage:field[10],
					abstention:field[11],
					abstention_percentage:field[12],
					blank_votes:field[13],
					blank_votes_percentage:field[14],
					null_votes:field[15],
					null_votes_percentage:field[16],
					deputies_total:field[17]

			})

		for (let i = 18; i < field.length-1; i++) {


				if((i-18)%5 == 0)
				{
						
					//totals[0][ 'code ' + cont] = field[i];
					totals[0][ 'party ' + cont] = field[i + 1];
					//totals[0][ 'votes ' + cont] = field[i + 2];
					//totals[0][ 'percentage ' + cont] = field[i + 3];
					totals[0][ 'seats ' + cont] = field[i + 4];

					cont++
				}

			}

	}*/

			
})


fs.writeFileSync('./src/assets/Congreso_Abril_2019_Resultados por circuscripcion.csv', csvStringify(provincesTotals, { header : true }));
//fs.writeFileSync('./src/assets/Resultados totales.csv', csvStringify(totals, { header : true }));
