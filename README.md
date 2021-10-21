# Sentinel2GlobalLULC
In this repository, we provide all the used scripts to create Sentinel2GlobalLULC Dataset and explain each step of their usage.
This Repository contains 7 folders. In the following, we explain the utility of each folder and how to use it :

1- LULC classes scripts: In this folder you'll find all GEE javascripts used to create Sentinel2GlobalLULC classes. Each one of the 29 LULC classes has a script file able to create its final map, reproject it and process it. Files are organized into subfolders in the same hierchical structure illustrated in Figure 2 of Sentinel2GlobalLULC manuscript. Tu use these scripts, you can open a new file in GEE and copy the content of these script in GEE.

2- LULC assets: In this folder you'll find a file "assets_links.txt" that contains links to GEE assets of all LULC classes global map distributions. You can import and vizualise these maps in GEE using the script sample we provide in the other file "assets_manipulation_sample.js" 

3- gHM: In this folder you'll find a GEE script was developed to import, reproject and export the global gHM map. the resulted gHM map was saved as asset, then imported and used in each one of the 29 LULC multi-task scripts saved in "LULC classes scripts" folder. 

4- Reverse geo-referencing: In this folder you'll find a python script to read the exported CSV file of a given LULC class and apply the reverse geo-referencing on their pure tiles coordinates then add the found localization data (country code, locality...etc) to the original CSV files as new columns. When running this script, you can specify the desirable LULC class and the tiles that you wanna apply the geo-referencing on them. 

5- Sentinel-2 images exportation: In this folder you'll find a python script to read the geo-localized CSV files and use pure tile center coordinates of a given LULC to export its corresponding Sentinel-2 satellite tif image through python API of GEE. When running this script, you can specify the desirable LULC class and the tiles that you wanna export from Sentinel-2.

6- Tiff to JPEG conversion: In this folder you'll find a python script to convert the exported GEE tif images into JPEG format.

7- CNN implementation: In this folder you'll find a python script "cross_validation.py" to prepare data partitions that you want to apply deep learning CNN models on them using cross validation. The main script "transferLearning.py" is to train many types of deep learning CNN models on the prepared data using transfer learning and report the test accuracy of the trained models. The third script "utils.py" contains some utility functions that are used by the other python scripts of the same folder. 



