

import csv
import pandas as pd
import argparse
import reverse_geocoder as rg 

parser = argparse.ArgumentParser()
   
parser.add_argument('--start',type = int, default = 1, required=False)
parser.add_argument('--end',type = int, default = 3000, required=False)
parser.add_argument('--LC',type = str, default = 'Snow', required=False)
parser.add_argument('--csv_path',type = str, default = '', required=False)
parser.add_argument('--csv_localized_path',type = str, default = '', required=False)

args = parser.parse_args()
ARGS, unparsed = parser.parse_known_args()

import math

def truncate(number, decimals=0):
    """
    Returns a value truncated to a specific number of decimal places.
    """
    if not isinstance(decimals, int):
        raise TypeError("decimal places must be an integer.")
    elif decimals < 0:
        raise ValueError("decimal places has to be 0 or more.")
    elif decimals == 0:
        return math.trunc(number)

    factor = 10.0 ** decimals
    return math.trunc(number * factor) / factor




new_csv = pd.DataFrame(columns=['ID Class','Name Class','ID Image','Pixel Purity','Human Modification','Center Latitude','Center Longitude','Country Code','Administative Departement Level 1','Administative Departement Level 2','Locality'])
df = pd.read_csv(csv_path+'/coordinates_'+str(ARGS.LC)+'.csv', usecols= [0,1,2,3,4], header=None)
size_df=len(df)
for i in range(ARGS.start,ARGS.end):
	Latitude = float(df[1][i])
	Latitude=truncate(Latitude, 10)
	Latitude=('%+.10f' % Latitude)
	Longitude = float(df[0][i])
	Longitude=truncate(Longitude, 10)
	Longitude=('%+.10f' % Longitude)
	Purity = float(df[2][i])
	Purity=(format(Purity, '.1f'))
	land_cover_class= "PermanentSnow"
	id_class="23"
	human_modification=float(df[4][i])
	human_modification=(format(human_modification, '.1f'))
	rev2 = rg.search([Latitude, Longitude])
	print(rev2) 
	new_row = {'ID Class':str(id_class),'Name Class':str(land_cover_class),'ID Image':str(i).zfill(6),'Pixel Purity':str(Purity),'Human Modification':str(human_modification),'Center Latitude':str(Latitude), 'Center Longitude':str(Longitude), 'Country Code':rev2[0]['cc'],'Administative Departement Level 1':((rev2[0]['admin1']).replace(" ", "-")),'Administative Departement Level 2':((rev2[0]['admin2']).replace(" ", "-")),'Locality':((rev2[0]['name']).replace(" ", "-"))}
	new_csv = new_csv.append(new_row, ignore_index = True)


print(new_csv)
new_csv.to_csv(csv_localized_path+'/coordinates_'+str(ARGS.LC)+'_Localized.csv', index = False)





