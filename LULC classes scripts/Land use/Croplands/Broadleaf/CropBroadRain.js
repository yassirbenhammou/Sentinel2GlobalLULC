
//-----------------------------------------------------------------------
//-----------------------------------------------------------------------
//
//                        Useful variables
//    
//-----------------------------------------------------------------------
//-----------------------------------------------------------------------

//If you wanna export the consensus image for this class as an asset first put "Exportation" in the task variable
//If you have already exported the asset and you wanna import it, process it and find the pure tiles coordinates put "Processing" in the task variable  
var task = "Exportation"; //Exportation or Reprojection or Processing 

//You can modify the extracted tiles purity with this variable 
var purity= 0.95 // 0.00 = 0%    -    1.00 = 100%

//The path where your assets are imported from with this variable
var consnesus_asset_path="users/ebenhammou/consensus/Rainfed_Broadleaf_Cropland"
var reprojected_asset_path="users/ebenhammou/reprojected2/Rainfed_Broadleaf_Cropland_2240m"

//-----------------------------------------------------------------------
//
//                        Useful function
//    
//-----------------------------------------------------------------------
//--------------- Mosaicking an Image Collection by Date ----------------------//
function mosaicByDate(imcol){
  // imcol: An image collection
  // returns: An image collection
  var imlist = imcol.toList(imcol.size())

  var unique_dates = imlist.map(function(im){
    return ee.Image(im).date().format("YYYY-MM-dd")
  }).distinct()

  var mosaic_imlist = unique_dates.map(function(d){
    d = ee.Date(d)

    var im = imcol
      .filterDate(d, d.advance(1, "day"))
      .mosaic();

    return im.set(
        "system:time_start", d.millis(), 
        "system:id", d.format("YYYY-MM-dd"))
  })

  return ee.ImageCollection(mosaic_imlist)
}

//---------------Reprojection function ----------------------//
var reprojection = function(original){
  var ns=original.projection().nominalScale()
  
  var original_new = original.reproject({
    crs: 'EPSG:4326',//for monitoring EPSG:3857 instead of crs: 'EPSG:4326'
    scale: ns
  })
  
  var original_new_2240m = original_new.reduceResolution({
    reducer: ee.Reducer.mean(),
    bestEffort: false,
    maxPixels: 65535 
  })
  .reproject({
    crs: 'EPSG:4326',
    scale: 2240
  });
  return original_new_2240m
};  
//***********************************************************************


////==========================================================================
////==========================================================================
////============================= MASK Rainfed_Broadleaf_Cropland ==============================
////==========================================================================
////==========================================================================
///////////////////////////// First Dataset ////////////////////////////////// 
var dataset1 = ee.Image('MODIS/006/MCD12Q1/2017_01_01');
var datamask1 = dataset1.select('LC_Type1').unmask(0);
var ModisIgbpRainfed_Broadleaf_Cropland1 = datamask1.eq(12)
var dataset2 = ee.Image('MODIS/006/MCD12Q1/2018_01_01');
var datamask2 = dataset2.select('LC_Type1').unmask(0);
var ModisIgbpRainfed_Broadleaf_Cropland2 = datamask2.eq(12)
var dataset3 = ee.Image('MODIS/006/MCD12Q1/2019_01_01');
var datamask3 = dataset3.select('LC_Type1').unmask(0);
var ModisIgbpRainfed_Broadleaf_Cropland3 = datamask3.eq(12)
var ModisRainfed_Broadleaf_Cropland=ModisIgbpRainfed_Broadleaf_Cropland3.add(ModisIgbpRainfed_Broadleaf_Cropland2.add(ModisIgbpRainfed_Broadleaf_Cropland1))
ModisRainfed_Broadleaf_Cropland=ModisRainfed_Broadleaf_Cropland.divide(3)
Map.addLayer(ModisRainfed_Broadleaf_Cropland,{min: 0, max: 1,format:'jpg'},'Modis1Rainfed_Broadleaf_Cropland',false);

///////////////////////////// Second Dataset /////////////////////////////////
var dataset1 = ee.Image('MODIS/006/MCD12Q1/2017_01_01');
var datamask1 = dataset1.select('LC_Type2').unmask(0);
var ModisIgbpRainfed_Broadleaf_Cropland1 = datamask1.eq(12)
var dataset2 = ee.Image('MODIS/006/MCD12Q1/2018_01_01');
var datamask2 = dataset2.select('LC_Type2').unmask(0);
var ModisIgbpRainfed_Broadleaf_Cropland2 = datamask2.eq(12)
var dataset3 = ee.Image('MODIS/006/MCD12Q1/2019_01_01');
var datamask3 = dataset3.select('LC_Type2').unmask(0);
var ModisIgbpRainfed_Broadleaf_Cropland3 = datamask3.eq(12)
var ModisRainfed_Broadleaf_Cropland2=ModisIgbpRainfed_Broadleaf_Cropland3.add(ModisIgbpRainfed_Broadleaf_Cropland2.add(ModisIgbpRainfed_Broadleaf_Cropland1))
ModisRainfed_Broadleaf_Cropland2=ModisRainfed_Broadleaf_Cropland2.divide(3)
Map.addLayer(ModisRainfed_Broadleaf_Cropland2,{min: 0, max: 1,format:'jpg'},'Modis2Rainfed_Broadleaf_Cropland',false);
var Modis12Rainfed_Broadleaf_Cropland = ModisRainfed_Broadleaf_Cropland2.add(ModisRainfed_Broadleaf_Cropland)
Map.addLayer(Modis12Rainfed_Broadleaf_Cropland,{min: 0, max: 2,format:'jpg'},'Modis12Rainfed_Broadleaf_Cropland',false);

///////////////////////////// Third Dataset ///////////////////////////////////////// 
var dataset1 = ee.Image('MODIS/006/MCD12Q1/2017_01_01');
var datamask1 = dataset1.select('LC_Type3').unmask(0);
var ModisIgbpRainfed_Broadleaf_Cropland1 = datamask1.eq(3)
var dataset2 = ee.Image('MODIS/006/MCD12Q1/2018_01_01');
var datamask2 = dataset2.select('LC_Type3').unmask(0);
var ModisIgbpRainfed_Broadleaf_Cropland2 = datamask2.eq(3)
var dataset3 = ee.Image('MODIS/006/MCD12Q1/2019_01_01');
var datamask3 = dataset3.select('LC_Type3').unmask(0);
var ModisIgbpRainfed_Broadleaf_Cropland3 = datamask3.eq(3)
var ModisRainfed_Broadleaf_Cropland3=ModisIgbpRainfed_Broadleaf_Cropland3.add(ModisIgbpRainfed_Broadleaf_Cropland2.add(ModisIgbpRainfed_Broadleaf_Cropland1))
ModisRainfed_Broadleaf_Cropland3=ModisRainfed_Broadleaf_Cropland3.divide(3)
Map.addLayer(ModisRainfed_Broadleaf_Cropland3,{min: 0, max: 1,format:'jpg'},'Modis3Rainfed_Broadleaf_Cropland',false);
var Modis123Rainfed_Broadleaf_Cropland = ModisRainfed_Broadleaf_Cropland3.add(Modis12Rainfed_Broadleaf_Cropland)
Map.addLayer(Modis123Rainfed_Broadleaf_Cropland,{min: 0, max: 3,format:'jpg'},'Modis123Rainfed_Broadleaf_Cropland',false);

///////////////////////////// Fourth Dataset ///////////////////////////////// 
var dataset1 = ee.Image('MODIS/006/MCD12Q1/2017_01_01');
var datamask1 = dataset1.select('LC_Type4').unmask(0);
var ModisIgbpRainfed_Broadleaf_Cropland1 = datamask1.eq(5)
var dataset2 = ee.Image('MODIS/006/MCD12Q1/2018_01_01');
var datamask2 = dataset2.select('LC_Type4').unmask(0);
var ModisIgbpRainfed_Broadleaf_Cropland2 = datamask2.eq(5)
var dataset3 = ee.Image('MODIS/006/MCD12Q1/2019_01_01');
var datamask3 = dataset3.select('LC_Type4').unmask(0);
var ModisIgbpRainfed_Broadleaf_Cropland3 = datamask3.eq(5)
var ModisRainfed_Broadleaf_Cropland4=ModisIgbpRainfed_Broadleaf_Cropland3.add(ModisIgbpRainfed_Broadleaf_Cropland2.add(ModisIgbpRainfed_Broadleaf_Cropland1))
ModisRainfed_Broadleaf_Cropland4=ModisRainfed_Broadleaf_Cropland4.divide(3)
Map.addLayer(ModisRainfed_Broadleaf_Cropland4,{min: 0, max: 1,format:'jpg'},'Modis4Rainfed_Broadleaf_Cropland',false);
var Modis1234Rainfed_Broadleaf_Cropland = ModisRainfed_Broadleaf_Cropland4.add(Modis123Rainfed_Broadleaf_Cropland)
Map.addLayer(Modis1234Rainfed_Broadleaf_Cropland,{min: 0, max: 4,format:'jpg'},'Modis1234Rainfed_Broadleaf_Cropland',false);


///////////////////////////// Fifth Dataset //////////////////////////////////
var dataset1 = ee.Image('MODIS/006/MCD12Q1/2017_01_01');
var datamask1 = dataset1.select('LC_Type5').unmask(0);
var ModisIgbpRainfed_Broadleaf_Cropland1 = datamask1.eq(8)
var dataset2 = ee.Image('MODIS/006/MCD12Q1/2018_01_01');
var datamask2 = dataset2.select('LC_Type5').unmask(0);
var ModisIgbpRainfed_Broadleaf_Cropland2 = datamask2.eq(8)
var dataset3 = ee.Image('MODIS/006/MCD12Q1/2019_01_01');
var datamask3 = dataset3.select('LC_Type5').unmask(0);
var ModisIgbpRainfed_Broadleaf_Cropland3 = datamask3.eq(8)
var ModisRainfed_Broadleaf_Cropland5=ModisIgbpRainfed_Broadleaf_Cropland3.add(ModisIgbpRainfed_Broadleaf_Cropland2.add(ModisIgbpRainfed_Broadleaf_Cropland1))
ModisRainfed_Broadleaf_Cropland5=ModisRainfed_Broadleaf_Cropland5.divide(3)
Map.addLayer(ModisRainfed_Broadleaf_Cropland5,{min: 0, max: 1,format:'jpg'},'ModisRainfed_Broadleaf_Cropland5',false);
var Modis12345Rainfed_Broadleaf_Cropland = ModisRainfed_Broadleaf_Cropland5.add(Modis1234Rainfed_Broadleaf_Cropland)
Map.addLayer(Modis12345Rainfed_Broadleaf_Cropland,{min: 0, max: 5,format:'jpg'},'Modis12345Rainfed_Broadleaf_Cropland',false);

/////////////////////////// Sixth Dataset /////////////////////////////////////////
var image1 = ee.Image("COPERNICUS/Landcover/100m/Proba-V-C3/Global/2017")
var datamask1 =  image1.select('discrete_classification').unmask(0);
var COPERNICUSRainfed_Broadleaf_Cropland1 =datamask1.eq(40)
var image2 = ee.Image("COPERNICUS/Landcover/100m/Proba-V-C3/Global/2018")
var datamask2 =  image2.select('discrete_classification').unmask(0);
var COPERNICUSRainfed_Broadleaf_Cropland2 =datamask2.eq(40)
var image3 = ee.Image("COPERNICUS/Landcover/100m/Proba-V-C3/Global/2019")
var datamask3 =  image3.select('discrete_classification').unmask(0);
var COPERNICUSRainfed_Broadleaf_Cropland3 =datamask3.eq(40)
var COPERNICUSRainfed_Broadleaf_Cropland=COPERNICUSRainfed_Broadleaf_Cropland3.add(COPERNICUSRainfed_Broadleaf_Cropland2.add(COPERNICUSRainfed_Broadleaf_Cropland1))
COPERNICUSRainfed_Broadleaf_Cropland=COPERNICUSRainfed_Broadleaf_Cropland.divide(3)
Map.addLayer(COPERNICUSRainfed_Broadleaf_Cropland,{min: 0, max: 1,format:'jpg'},'COPERNICUSRainfed_Broadleaf_Cropland',false);
var ModisCOPERNICUSRainfed_Broadleaf_Cropland = COPERNICUSRainfed_Broadleaf_Cropland.add(Modis12345Rainfed_Broadleaf_Cropland)
Map.addLayer(ModisCOPERNICUSRainfed_Broadleaf_Cropland,{min: 0, max: 6,format:'jpg'},'ModisCOPERNICUSRainfed_Broadleaf_Cropland',false);

///////////////////////////// Seventh Dataset ////////////////////////////////
var image = ee.Image('ESA/GLOBCOVER_L4_200901_200912_V2_3');
var datamask =  image.select('landcover').unmask(0);
var GLOBCOVERRainfed_Broadleaf_Cropland =datamask.eq(14)////white=Rainfed_Broadleaf_Cropland black=others
Map.addLayer(GLOBCOVERRainfed_Broadleaf_Cropland,{min: 0, max: 1,format:'jpg'},'GLOBCOVERRainfed_Broadleaf_Cropland',false);
var GLOBCOVERModisCOPERNICUSRainfed_Broadleaf_Cropland = GLOBCOVERRainfed_Broadleaf_Cropland.add(ModisCOPERNICUSRainfed_Broadleaf_Cropland)
Map.addLayer(GLOBCOVERModisCOPERNICUSRainfed_Broadleaf_Cropland,{min: 0, max: 7,format:'jpg'},'GLOBCOVERModisCOPERNICUSRainfed_Broadleaf_Cropland',false);

///////////////////////////// Ninth Dataset /////////////////////////////////////////
var image = ee.Image("USGS/GFSAD1000_V1");
var datamask = image.select('landcover').unmask(0);
var GFSAD =(datamask.eq(3)).or((datamask.eq(4)).or(datamask.eq(5)))////white=Rainfed_Broadleaf_Cropland black=others
Map.addLayer(GFSAD,{min: 0, max: 1,format:'jpg'},'GFSAD',false);
var GFSADGLOBCOVERModisCOPERNICUSRainfed_Broadleaf_Cropland = GFSAD.add(GLOBCOVERModisCOPERNICUSRainfed_Broadleaf_Cropland)
Map.addLayer(GFSADGLOBCOVERModisCOPERNICUSRainfed_Broadleaf_Cropland,{min: 0, max: 8,format:'jpg'},'GFSADGLOBCOVERModisCOPERNICUSRainfed_Broadleaf_Cropland',false);

///////////////////////////// Tenth Dataset /////////////////////////////////////////
var dataset1 = ee.Image('JRC/GSW1_2/YearlyHistory/2017');
var datamask1 = dataset1.select('waterClass').unmask(0);
var JRC1 = datamask1.eq(1).or(datamask1.eq(0))
var dataset2 = ee.Image('JRC/GSW1_2/YearlyHistory/2018');
var datamask2 = dataset2.select('waterClass').unmask(0);
var JRC2 = datamask2.eq(1).or(datamask2.eq(0))
var dataset3 = ee.Image('JRC/GSW1_2/YearlyHistory/2019');
var datamask3 = dataset3.select('waterClass').unmask(0);
var JRC3 = datamask3.eq(1).or(datamask3.eq(0))
var JRC=JRC3.and(JRC2.and(JRC1))
Map.addLayer(JRC,{min: 0, max: 1,format:'jpg'},'JRC',false);
var JRCGFSADGLOBCOVERModisCOPERNICUSRainfed_Broadleaf_Cropland =JRC.multiply(GFSADGLOBCOVERModisCOPERNICUSRainfed_Broadleaf_Cropland)
Map.addLayer(JRCGFSADGLOBCOVERModisCOPERNICUSRainfed_Broadleaf_Cropland,{min: 0, max: 8,format:'jpg'},'JRCGFSADGLOBCOVERModisCOPERNICUSRainfed_Broadleaf_Cropland',false);

///////////////////////////////////JRC Mapping///////////////////////////////////
var image= ee.Image('JRC/GSW1_2/GlobalSurfaceWater');
var datamask = image.select('max_extent').unmask(999);
var JRCM =datamask.eq(0)
Map.addLayer(JRCM,{min: 0, max: 1,format:'jpg'},'JRCM',false);
var Rainfed_Broadleaf_CroplandwithoutWater = JRCM.multiply(JRCGFSADGLOBCOVERModisCOPERNICUSRainfed_Broadleaf_Cropland)
Map.addLayer(Rainfed_Broadleaf_CroplandwithoutWater,{min: 0, max: 8,format:'jpg'},'Rainfed_Broadleaf_CroplandwithoutWater',false);

Rainfed_Broadleaf_CroplandwithoutWater=Rainfed_Broadleaf_CroplandwithoutWater.divide(8)
Map.addLayer(Rainfed_Broadleaf_CroplandwithoutWater,{min: 0, max: 1,format:'jpg'},'Rainfed_Broadleaf_Cropland_addition_divided_by_8',false);


/////////////////////////////////// Tsinghua based Urban areas elimination method ///////////////////////////////////
var Tsinghua1 = ee.Image("Tsinghua/FROM-GLC/GAIA/v10").unmask(999);
var Tsinghua = Tsinghua1.select('change_year_index').eq(999)

Rainfed_Broadleaf_CroplandwithoutWater=Rainfed_Broadleaf_CroplandwithoutWater.multiply(Tsinghua); 
Map.addLayer(Rainfed_Broadleaf_CroplandwithoutWater,{min: 0, max: 1,format:'jpg'},'Rainfed_Broadleaf_Cropland_without_urban',false);



//-----------------------------------------------------------------------
//-----------------------------------------------------------------------
//
//                        Consensus results exportation and processing
//    
//-----------------------------------------------------------------------
//-----------------------------------------------------------------------

switch(task) {
    
    case "Exportation":
      print("The executed task is the exportation only")
        var World =  ee.Geometry.Polygon(
          [[[-180, 90],
          [-180, -90],
          [180, -90],
          [180, 90]]], null, false);
          
        var proj = Rainfed_Broadleaf_CroplandwithoutWater.projection().nominalScale().getInfo();
          
        Export.image.toAsset({
          image: Rainfed_Broadleaf_CroplandwithoutWater, 
          description: 'consensus/Rainfed_Broadleaf_Cropland',
          //crs: proj.crs,
          //crsTransform: transform_new,
          scale: proj,
          maxPixels: 1e13,
          region: World
          });
        break;
        
    case "Reprojection":
      print("The executed task is the reprojection only")
      var image = ee.Image(consnesus_asset_path);
      var reproj_image=reprojection(image)
      var proj = reproj_image.projection().nominalScale().getInfo();
      var World =  ee.Geometry.Polygon(
          [[[-180, 90],
          [-180, -90],
          [180, -90],
          [180, 90]]], null, false);  
        Export.image.toAsset({
          image: reproj_image, 
          description: 'reprojected2/Rainfed_Broadleaf_Cropland_2240m',
          //crs: proj.crs,
          //crsTransform: transform_new,
          scale: proj,
          maxPixels: 1e13,
          region: World
          });
          break;
          
    case "Processing":
        print("The executed tasks are Asset importation and Processing and Coordinates generation");
        
        //importing the asset image
        var image = ee.Image(reprojected_asset_path);
        
        //information about the asset image
        print('Imported image',image.getInfo())
        print('Imported image CRS',image.projection().crs().getInfo())
        print('Imported image Nominal scale',image.projection().nominalScale())
        
        //visualizing the asset image
        Map.addLayer(image,{min: 0, max: 1,format:'jpg'},'Rainfed_Broadleaf_Cropland_2240m_Asset_image',false);
        
        //counting the number of pure tiles
        var purity_perc = ee.Number(purity).multiply(100)
        print('Used purity percentage',purity_perc)
        var World =  ee.Geometry.Polygon(
                [[[-180, 90],
                  [-180, -90],
                  [180, -90],
                  [180, 90]]], null, false);
        
        var image_purity_mask = image.gte(purity).updateMask(image.gte(purity))
        Map.addLayer(image_purity_mask,{min: 0, max: 1,format:'jpg'},'Asset_image_with_the_used_purity_percentage')
        var NumOfTiles = image_purity_mask.reduceRegion({
          reducer: ee.Reducer.count(),
          geometry: World,
          maxPixels: 1e13,
          bestEffort: true,
          tileScale: 16})
        print('Number of pure tiles',NumOfTiles)
        
        // converting the image into a features collection of its coordinates
        var coordsImage = ee.Image.pixelLonLat().reproject(image_purity_mask.projection())
        var coordsImage = coordsImage.updateMask(image_purity_mask);
        //Map.addLayer(coordsImage, {},"coordsImage")
        coordsImage=coordsImage.sample(World)
        coordsImage=coordsImage.distinct(['longitude','latitude'])
        var pixel_value = function(f){
          var longitude= f.getNumber('longitude')
          var latitude= f.getNumber('latitude')
          var point = (ee.Geometry.Point(longitude,latitude));
          var pix= ee.Number(image.reduceRegion(ee.Reducer.first(),point,1).get('max_extent')).multiply(100);
          f = f.set('pixel_purity', pix);
          f = f.set('land_cover_class', "Rainfed_Broadleaf_Cropland");
          var GHM = ee.Image("users/lareb/utils/GHM_2240");
          var ghm= ee.Number(GHM.reduceRegion(ee.Reducer.first(),point,1).get('gHM')).multiply(100);
          f = f.set('human_modification', ghm);
          return f;
        };
        coordsImage = coordsImage.map(pixel_value);
        print('Coordinates',coordsImage)
        
        //sorting the collection given purity level
        coordsImage = coordsImage.sort('pixel_purity', false)
        //center the map to the first element
        //var point1=(ee.Geometry.Point(coordsImage.first().getNumber('longitude'),coordsImage.first().getNumber('latitude')))
        //Map.centerObject(point1)
        
        // Export the FeatureCollection to a KML file
        var filename='coordinates_Rainfed_Broadleaf_Cropland'
        var foldername='Coordinates'
        Export.table.toDrive({
          collection: coordsImage,
          description:filename,
          folder:foldername,
          selectors:['longitude','latitude','pixel_purity','land_cover_class','human_modification'],
          fileFormat: 'CSV'
        });
        break;
}










