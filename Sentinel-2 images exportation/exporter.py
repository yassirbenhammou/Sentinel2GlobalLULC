
import ee
import pandas as pd
import csv
import sys
import operator
import argparse

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


parser = argparse.ArgumentParser()
   
parser.add_argument('--start',type = int, default = 1, required=False)
parser.add_argument('--end',type = int, default = 3000, required=False)
parser.add_argument('--LC',type = str, default = 'Rainfed_Broadleaf_Cropland', required=False)
parser.add_argument('--csv_localized_path',type = str, default = '', required=False)
args = parser.parse_args()
ARGS, unparsed = parser.parse_known_args()


MAX_CLOUD_PROBABILITY = 20;

def maskClouds(img):
	clouds = ee.Image(img.get('cloud_mask')).select('probability');
	isNotCloud = clouds.lt(MAX_CLOUD_PROBABILITY);
	return img.updateMask(isNotCloud);

def maskEdges(s2_img):
	return s2_img.updateMask(s2_img.select('B8A').mask().updateMask(s2_img.select('B9').mask()));


ee.Authenticate()
ee.Initialize()

####### Sorting the csv given the purity level ######## 
#df = csv.reader(open("/Users/yassirben/Desktop/earthengine/exportation/samples/coordinates_Urban_75.csv"), delimiter=",")
df = pd.read_csv(csv_localized_path+'/coordinates_'+str(ARGS.LC)+'_Localized.csv', usecols= [0,1,2,3,4,5,6,7,8,9,10], header=None)
#sortedlist = sorted(df, key=operator.itemgetter(2), reverse=True)
#print(sortedlist)


#103,123

size_df=len(df)
for i in range(ARGS.start,ARGS.end):
	ID_Class= str(df[0][i])
	Name_Class= str(df[1][i])
	ID_Image= str(df[2][i])
	Longitude = float(df[6][i])
	Longitude=truncate(Longitude, 10)
	Longitude=('%+.10f' % Longitude)
	Latitude = float(df[5][i])
	Latitude=truncate(Latitude, 10)
	Latitude=('%+.10f' % Latitude)
	Purity=float(df[3][i])
	Country_Code=str(df[7][i])
	Administative_Departement_Level_1=str(df[8][i])
	Administative_Departement_Level_2=str(df[9][i])
	Locality=str(df[10][i])
	Human_Modification=float(df[4][i])
	print("Exporting: ",Longitude,Latitude)
	x=ee.Number(float(Longitude))
	y=ee.Number(float(Latitude))
	cor1=(x).subtract(0.0100)
	cor2=(y).subtract(0.0100)
	cor3=(x).add(0.0100)
	cor4=(y).add(0.0100)
	region=ee.Geometry.Rectangle([cor1,cor2,cor3,cor4],None,False);
	s2Sr = ee.ImageCollection('COPERNICUS/S2').filterBounds(region);
	s2Clouds = ee.ImageCollection('COPERNICUS/S2_CLOUD_PROBABILITY').filterBounds(region);
	START_DATE = ee.Date('2015-06-23');
	END_DATE = ee.Date('2020-10-27');
	criteria = ee.Filter.date(START_DATE, END_DATE);
	s2Sr = s2Sr.filter(criteria).map(maskEdges);
	s2Clouds = s2Clouds.filter(criteria);
	s2SrWithCloudMask = ee.Join.saveFirst('cloud_mask').apply(**{"primary": s2Sr, "secondary": s2Clouds, "condition": ee.Filter.equals(**{"leftField": 'system:index', "rightField": 'system:index'})});
	s2CloudMaskedPercentile25 =ee.Image(ee.ImageCollection(s2SrWithCloudMask).map(maskClouds).reduce(ee.Reducer.percentile([25]))).unmask(0).clip(region);
	visArgs = {"bands": ["B4_p25", "B3_p25", "B2_p25"], "min": 1, "max": 3558};
	s2CloudMasked_rgb = ee.Image((s2CloudMaskedPercentile25.visualize(**visArgs).copyProperties(s2CloudMaskedPercentile25,s2CloudMaskedPercentile25.propertyNames()))).clip(region);
	task=(ee.batch.Export.image.toDrive(
		image = s2CloudMasked_rgb,
		folder='CropBroadRain_tif',
		scale= 10,
		skipEmptyTiles= True,
		fileNamePrefix = ID_Class+'_'+Name_Class+'_'+str(Purity)+'%_'+ID_Image+'_'+str(Human_Modification)+'_'+'('+str(Latitude)+','+str(Longitude)+')_'+str(Country_Code)+'_'+str(Administative_Departement_Level_1)+'_'+str(Administative_Departement_Level_2)+'_'+str(Locality))
		)
	task.start()
	task.status()









