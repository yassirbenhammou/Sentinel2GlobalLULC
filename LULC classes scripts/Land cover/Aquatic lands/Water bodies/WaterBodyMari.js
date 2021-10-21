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
var purity= 1.00 // 0.00 = 0%    -    1.00 = 100%

//The path where your assets are imported from with this variable
var consnesus_asset_path="users/ebenhammou/consensus/Marine_Water"
var reprojected_asset_path="users/ebenhammou/reprojected2/Marine_Water_2240m"

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
////============================= MASK Marine_Water ==============================
////==========================================================================
////==========================================================================
///////////////////////////// First Dataset ////////////////////////////////// 
var dataset1 = ee.Image('MODIS/006/MCD12Q1/2017_01_01');
var datamask1 = dataset1.select('LC_Type1').unmask(0);
var ModisIgbpMarine_Water1 = datamask1.eq(17)
var dataset2 = ee.Image('MODIS/006/MCD12Q1/2018_01_01');
var datamask2 = dataset2.select('LC_Type1').unmask(0);
var ModisIgbpMarine_Water2 = datamask2.eq(17)
var dataset3 = ee.Image('MODIS/006/MCD12Q1/2019_01_01');
var datamask3 = dataset3.select('LC_Type1').unmask(0);
var ModisIgbpMarine_Water3 = datamask3.eq(17)
var ModisMarine_Water=ModisIgbpMarine_Water3.add(ModisIgbpMarine_Water2.add(ModisIgbpMarine_Water1))
ModisMarine_Water=ModisMarine_Water.divide(3)
Map.addLayer(ModisMarine_Water,{min: 0, max: 1,format:'jpg'},'Modis1Marine_Water',false);

///////////////////////////// Second Dataset /////////////////////////////////
var dataset1 = ee.Image('MODIS/006/MCD12Q1/2017_01_01');
var datamask1 = dataset1.select('LC_Type2').unmask(999);
var ModisIgbpMarine_Water1 = datamask1.eq(0)
var dataset2 = ee.Image('MODIS/006/MCD12Q1/2018_01_01');
var datamask2 = dataset2.select('LC_Type2').unmask(999);
var ModisIgbpMarine_Water2 = datamask2.eq(0)
var dataset3 = ee.Image('MODIS/006/MCD12Q1/2019_01_01');
var datamask3 = dataset3.select('LC_Type2').unmask(999);
var ModisIgbpMarine_Water3 = datamask3.eq(0)
var ModisMarine_Water2=ModisIgbpMarine_Water3.add(ModisIgbpMarine_Water2.add(ModisIgbpMarine_Water1))
ModisMarine_Water2=ModisMarine_Water2.divide(3)
Map.addLayer(ModisMarine_Water2,{min: 0, max: 1,format:'jpg'},'Modis2Marine_Water',false);
var Modis12Marine_Water = ModisMarine_Water2.add(ModisMarine_Water)
Map.addLayer(Modis12Marine_Water,{min: 0, max: 2,format:'jpg'},'Modis12Marine_Water',false);

///////////////////////////// Third Dataset ///////////////////////////////////////// 
var dataset1 = ee.Image('MODIS/006/MCD12Q1/2017_01_01');
var datamask1 = dataset1.select('LC_Type3').unmask(999);
var ModisIgbpMarine_Water1 = datamask1.eq(0)
var dataset2 = ee.Image('MODIS/006/MCD12Q1/2018_01_01');
var datamask2 = dataset2.select('LC_Type3').unmask(999);
var ModisIgbpMarine_Water2 = datamask2.eq(0)
var dataset3 = ee.Image('MODIS/006/MCD12Q1/2019_01_01');
var datamask3 = dataset3.select('LC_Type3').unmask(999);
var ModisIgbpMarine_Water3 = datamask3.eq(0)
var ModisMarine_Water3=ModisIgbpMarine_Water3.add(ModisIgbpMarine_Water2.add(ModisIgbpMarine_Water1))
ModisMarine_Water3=ModisMarine_Water3.divide(3)
Map.addLayer(ModisMarine_Water3,{min: 0, max: 1,format:'jpg'},'Modis3Marine_Water',false);
var Modis123Marine_Water = ModisMarine_Water3.add(Modis12Marine_Water)
Map.addLayer(Modis123Marine_Water,{min: 0, max: 3,format:'jpg'},'Modis123Marine_Water',false);

///////////////////////////// Fourth Dataset ///////////////////////////////// 
var dataset1 = ee.Image('MODIS/006/MCD12Q1/2017_01_01');
var datamask1 = dataset1.select('LC_Type4').unmask(999);
var ModisIgbpMarine_Water1 = datamask1.eq(0)
var dataset2 = ee.Image('MODIS/006/MCD12Q1/2018_01_01');
var datamask2 = dataset2.select('LC_Type4').unmask(999);
var ModisIgbpMarine_Water2 = datamask2.eq(0)
var dataset3 = ee.Image('MODIS/006/MCD12Q1/2019_01_01');
var datamask3 = dataset3.select('LC_Type4').unmask(999);
var ModisIgbpMarine_Water3 = datamask3.eq(0)
var ModisMarine_Water4=ModisIgbpMarine_Water3.add(ModisIgbpMarine_Water2.add(ModisIgbpMarine_Water1))
ModisMarine_Water4=ModisMarine_Water4.divide(3)
Map.addLayer(ModisMarine_Water4,{min: 0, max: 1,format:'jpg'},'Modis4Marine_Water',false);
var Modis1234Marine_Water = ModisMarine_Water4.add(Modis123Marine_Water)
Map.addLayer(Modis1234Marine_Water,{min: 0, max: 4,format:'jpg'},'Modis1234Marine_Water',false);


///////////////////////////// Fifth Dataset //////////////////////////////////
var dataset1 = ee.Image('MODIS/006/MCD12Q1/2017_01_01');
var datamask1 = dataset1.select('LC_Type5').unmask(999);
var ModisIgbpMarine_Water1 = datamask1.eq(0)
var dataset2 = ee.Image('MODIS/006/MCD12Q1/2018_01_01');
var datamask2 = dataset2.select('LC_Type5').unmask(999);
var ModisIgbpMarine_Water2 = datamask2.eq(0)
var dataset3 = ee.Image('MODIS/006/MCD12Q1/2019_01_01');
var datamask3 = dataset3.select('LC_Type5').unmask(999);
var ModisIgbpMarine_Water3 = datamask3.eq(0)
var ModisMarine_Water5=ModisIgbpMarine_Water3.add(ModisIgbpMarine_Water2.add(ModisIgbpMarine_Water1))
ModisMarine_Water5=ModisMarine_Water5.divide(3)
Map.addLayer(ModisMarine_Water5,{min: 0, max: 1,format:'jpg'},'Modis5Marine_Water',false);
var Modis12345Marine_Water = ModisMarine_Water5.add(Modis1234Marine_Water)
Map.addLayer(Modis12345Marine_Water,{min: 0, max: 5,format:'jpg'},'Modis12345Marine_Water',false);

/////////////////////////// Sixth Dataset /////////////////////////////////////////
var image1 = ee.Image("COPERNICUS/Landcover/100m/Proba-V-C3/Global/2017")
var datamask1 =  image1.select('discrete_classification').unmask(0);
var COPERNICUSMarine_Water1 =datamask1.eq(200)
var image2 = ee.Image("COPERNICUS/Landcover/100m/Proba-V-C3/Global/2018")
var datamask2 =  image2.select('discrete_classification').unmask(0);
var COPERNICUSMarine_Water2 =datamask2.eq(200)
var image3 = ee.Image("COPERNICUS/Landcover/100m/Proba-V-C3/Global/2019")
var datamask3 =  image3.select('discrete_classification').unmask(0);
var COPERNICUSMarine_Water3 =datamask3.eq(200)
var COPERNICUSMarine_Water=COPERNICUSMarine_Water3.add(COPERNICUSMarine_Water2.add(COPERNICUSMarine_Water1))
COPERNICUSMarine_Water=COPERNICUSMarine_Water.divide(3)
Map.addLayer(COPERNICUSMarine_Water,{min: 0, max: 1,format:'jpg'},'COPERNICUSMarine_Water',false);
var ModisCOPERNICUSMarine_Water = COPERNICUSMarine_Water.add(Modis12345Marine_Water)
Map.addLayer(ModisCOPERNICUSMarine_Water,{min: 0, max: 6,format:'jpg'},'ModisCOPERNICUSMarine_Water',false);

///////////////////////////// Seventh Dataset ////////////////////////////////
var image = ee.Image('ESA/GLOBCOVER_L4_200901_200912_V2_3');
var datamask =  image.select('landcover').unmask(0);
var GLOBCOVERMarine_Water =datamask.eq(210)////white=Marine_Water black=others
Map.addLayer(GLOBCOVERMarine_Water,{min: 0, max: 1,format:'jpg'},'GLOBCOVERMarine_Water',false);
var GLOBCOVERModisCOPERNICUSMarine_Water = GLOBCOVERMarine_Water.add(ModisCOPERNICUSMarine_Water)
Map.addLayer(GLOBCOVERModisCOPERNICUSMarine_Water,{min: 0, max: 7,format:'jpg'},'GLOBCOVERModisCOPERNICUSMarine_Water',false);

///////////////////////////// Eighth Dataset /////////////////////////////////////////
var image = ee.Image('JAXA/ALOS/PALSAR/YEARLY/FNF/2017');
var datamask = image.select('fnf').unmask(0);
var PALSAR =datamask.eq(3)
Map.addLayer(PALSAR,{min: 0, max: 1,format:'jpg'},'PALSAR',false);
var PALSARGLOBCOVERModisCOPERNICUSMarine_Water = PALSAR.add(GLOBCOVERModisCOPERNICUSMarine_Water)
Map.addLayer(PALSARGLOBCOVERModisCOPERNICUSMarine_Water,{min: 0, max: 8,format:'jpg'},'PALSARGLOBCOVERModisCOPERNICUSMarine_Water',false);

///////////////////////////// Tenth Dataset /////////////////////////////////////////
var dataset1 = ee.Image('JRC/GSW1_2/YearlyHistory/2017');
var datamask1 = dataset1.select('waterClass').unmask(0);
var JRC1 = datamask1.eq(3)
var dataset2 = ee.Image('JRC/GSW1_2/YearlyHistory/2018');
var datamask2 = dataset2.select('waterClass').unmask(0);
var JRC2 = datamask2.eq(3)
var dataset3 = ee.Image('JRC/GSW1_2/YearlyHistory/2019');
var datamask3 = dataset3.select('waterClass').unmask(0);
var JRC3 = datamask3.eq(3)
var JRC=JRC3.or(JRC2.or(JRC1))
Map.addLayer(JRC,{min: 0, max: 1,format:'jpg'},'JRC',false);
var JRCPALSARGLOBCOVERModisCOPERNICUSMarine_Water =PALSARGLOBCOVERModisCOPERNICUSMarine_Water.multiply(JRC)
Map.addLayer(JRCPALSARGLOBCOVERModisCOPERNICUSMarine_Water,{min: 0, max: 8,format:'jpg'},'JRCPALSARGLOBCOVERModisCOPERNICUSMarine_Water',false);

///////////////////////////////////JRC Mapping///////////////////////////////////
var image= ee.Image('JRC/GSW1_2/GlobalSurfaceWater');
var datamask = image.select('max_extent').unmask(0);
var JRCM =datamask.eq(1)
Map.addLayer(JRCM,{min: 0, max: 1,format:'jpg'},'JRCM',false);
var Marine_Water = JRCM.multiply(JRCPALSARGLOBCOVERModisCOPERNICUSMarine_Water)
Map.addLayer(Marine_Water,{min: 0, max: 8,format:'jpg'},'Marine_Water',false);

Marine_Water=Marine_Water.divide(8)
Map.addLayer(Marine_Water,{min: 0, max: 1,format:'jpg'},'Marine_Water_addition_divided_by_8',false);

/////////////////////////////////// Tsinghua based Urban areas elimination method ///////////////////////////////////
var Tsinghua1 = ee.Image("Tsinghua/FROM-GLC/GAIA/v10").unmask(999);
var Tsinghua = Tsinghua1.select('change_year_index').eq(999)

Marine_Water=Marine_Water.multiply(Tsinghua); 
Map.addLayer(Marine_Water,{min: 0, max: 1,format:'jpg'},'Marine_Water_without_urban',false);


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
          
        var proj = Marine_Water.projection().nominalScale().getInfo();
          
        Export.image.toAsset({
          image: Marine_Water, 
          description: 'consensus/Marine_Water',
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
          description: 'reprojected2/Marine_Water_2240m',
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
        Map.addLayer(image,{min: 0, max: 1,format:'jpg'},'Marine_Water_2240m_Asset_image',false);
        
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
          f = f.set('land_cover_class', "Marine_Water");
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
        var filename='coordinates_Marine_Water'
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














