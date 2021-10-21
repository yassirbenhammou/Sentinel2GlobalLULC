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
var purity= 0.75 // 0.00 = 0%    -    1.00 = 100%

//The path where your assets are imported from with this variable
var consnesus_asset_path="users/ebenhammou/consensus/Urban"
var reprojected_asset_path="users/ebenhammou/reprojected/Urban_2240m"

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
////============================= MASK Urban ==============================
////==========================================================================
////==========================================================================
///////////////////////////// First Dataset ////////////////////////////////// 
var dataset1 = ee.Image('MODIS/006/MCD12Q1/2017_01_01');
var datamask1 = dataset1.select('LC_Type1').unmask(0);
var ModisIgbpUrban1 = datamask1.eq(13)
var dataset2 = ee.Image('MODIS/006/MCD12Q1/2018_01_01');
var datamask2 = dataset2.select('LC_Type1').unmask(0);
var ModisIgbpUrban2 = datamask2.eq(13)
var dataset3 = ee.Image('MODIS/006/MCD12Q1/2019_01_01');
var datamask3 = dataset3.select('LC_Type1').unmask(0);
var ModisIgbpUrban3 = datamask3.eq(13)
var ModisUrban=ModisIgbpUrban3.add(ModisIgbpUrban2.add(ModisIgbpUrban1))
ModisUrban=ModisUrban.divide(3)
Map.addLayer(ModisUrban,{min: 0, max: 1,format:'jpg'},'Modis1Urban',false);

///////////////////////////// Second Dataset /////////////////////////////////
var dataset1 = ee.Image('MODIS/006/MCD12Q1/2017_01_01');
var datamask1 = dataset1.select('LC_Type2').unmask(0);
var ModisIgbpUrban1 = datamask1.eq(13)
var dataset2 = ee.Image('MODIS/006/MCD12Q1/2018_01_01');
var datamask2 = dataset2.select('LC_Type2').unmask(0);
var ModisIgbpUrban2 = datamask2.eq(13)
var dataset3 = ee.Image('MODIS/006/MCD12Q1/2019_01_01');
var datamask3 = dataset3.select('LC_Type2').unmask(0);
var ModisIgbpUrban3 = datamask3.eq(13)
var ModisUrban2=ModisIgbpUrban3.add(ModisIgbpUrban2.add(ModisIgbpUrban1))
ModisUrban2=ModisUrban2.divide(3)
Map.addLayer(ModisUrban2,{min: 0, max: 1,format:'jpg'},'Modis2Urban',false);
var Modis12Urban = ModisUrban2.add(ModisUrban)
Map.addLayer(Modis12Urban,{min: 0, max: 2,format:'jpg'},'Modis12Urban',false);

///////////////////////////// Third Dataset ///////////////////////////////////////// 
var dataset1 = ee.Image('MODIS/006/MCD12Q1/2017_01_01');
var datamask1 = dataset1.select('LC_Type3').unmask(0);
var ModisIgbpUrban1 = datamask1.eq(10)
var dataset2 = ee.Image('MODIS/006/MCD12Q1/2018_01_01');
var datamask2 = dataset2.select('LC_Type3').unmask(0);
var ModisIgbpUrban2 = datamask2.eq(10)
var dataset3 = ee.Image('MODIS/006/MCD12Q1/2019_01_01');
var datamask3 = dataset3.select('LC_Type3').unmask(0);
var ModisIgbpUrban3 = datamask3.eq(10)
var ModisUrban3=ModisIgbpUrban3.add(ModisIgbpUrban2.add(ModisIgbpUrban1))
ModisUrban3=ModisUrban3.divide(3)
Map.addLayer(ModisUrban3,{min: 0, max: 1,format:'jpg'},'Modis3Urban',false);
var Modis123Urban = ModisUrban3.add(Modis12Urban)
Map.addLayer(Modis123Urban,{min: 0, max: 3,format:'jpg'},'Modis123Urban',false);

///////////////////////////// Fourth Dataset ///////////////////////////////// 
var dataset1 = ee.Image('MODIS/006/MCD12Q1/2017_01_01');
var datamask1 = dataset1.select('LC_Type4').unmask(0);
var ModisIgbpUrban1 = datamask1.eq(8)
var dataset2 = ee.Image('MODIS/006/MCD12Q1/2018_01_01');
var datamask2 = dataset2.select('LC_Type4').unmask(0);
var ModisIgbpUrban2 = datamask2.eq(8)
var dataset3 = ee.Image('MODIS/006/MCD12Q1/2019_01_01');
var datamask3 = dataset3.select('LC_Type4').unmask(0);
var ModisIgbpUrban3 = datamask3.eq(8)
var ModisUrban4=ModisIgbpUrban3.add(ModisIgbpUrban2.add(ModisIgbpUrban1))
ModisUrban4=ModisUrban4.divide(3)
Map.addLayer(ModisUrban4,{min: 0, max: 1,format:'jpg'},'Modis4Urban',false);
var Modis1234Urban = ModisUrban4.add(Modis123Urban)
Map.addLayer(Modis1234Urban,{min: 0, max: 4,format:'jpg'},'Modis1234Urban',false);


///////////////////////////// Fifth Dataset //////////////////////////////////
var dataset1 = ee.Image('MODIS/006/MCD12Q1/2017_01_01');
var datamask1 = dataset1.select('LC_Type5').unmask(0);
var ModisIgbpUrban1 = datamask1.eq(9)
var dataset2 = ee.Image('MODIS/006/MCD12Q1/2018_01_01');
var datamask2 = dataset2.select('LC_Type5').unmask(0);
var ModisIgbpUrban2 = datamask2.eq(9)
var dataset3 = ee.Image('MODIS/006/MCD12Q1/2019_01_01');
var datamask3 = dataset3.select('LC_Type5').unmask(0);
var ModisIgbpUrban3 = datamask3.eq(9)
var ModisUrban5=ModisIgbpUrban3.add(ModisIgbpUrban2.add(ModisIgbpUrban1))
ModisUrban5=ModisUrban5.divide(3)
Map.addLayer(ModisUrban5,{min: 0, max: 1,format:'jpg'},'ModisUrban5',false);
var Modis12345Urban = ModisUrban5.add(Modis1234Urban)
Map.addLayer(Modis12345Urban,{min: 0, max: 5,format:'jpg'},'Modis12345Urban',false);

/////////////////////////// Sixth Dataset /////////////////////////////////////////
var image1 = ee.Image("COPERNICUS/Landcover/100m/Proba-V-C3/Global/2017")
var datamask1 =  image1.select('discrete_classification').unmask(0);
var COPERNICUSUrban1 =datamask1.eq(50)
var image2 = ee.Image("COPERNICUS/Landcover/100m/Proba-V-C3/Global/2018")
var datamask2 =  image2.select('discrete_classification').unmask(0);
var COPERNICUSUrban2 =datamask2.eq(50)
var image3 = ee.Image("COPERNICUS/Landcover/100m/Proba-V-C3/Global/2019")
var datamask3 =  image3.select('discrete_classification').unmask(0);
var COPERNICUSUrban3 =datamask3.eq(50)
var COPERNICUSUrban=COPERNICUSUrban3.add(COPERNICUSUrban2.add(COPERNICUSUrban1))
COPERNICUSUrban=COPERNICUSUrban.divide(3)
Map.addLayer(COPERNICUSUrban,{min: 0, max: 1,format:'jpg'},'COPERNICUSUrban',false);
var ModisCOPERNICUSUrban = COPERNICUSUrban.add(Modis12345Urban)
Map.addLayer(ModisCOPERNICUSUrban,{min: 0, max: 6,format:'jpg'},'ModisCOPERNICUSUrban',false);

///////////////////////////// Seventh Dataset ////////////////////////////////
var image = ee.Image('ESA/GLOBCOVER_L4_200901_200912_V2_3');
var datamask =  image.select('landcover').unmask(0);
var GLOBCOVERUrban =datamask.eq(190)////white=Urban black=others
Map.addLayer(GLOBCOVERUrban,{min: 0, max: 1,format:'jpg'},'GLOBCOVERUrban',false);
var GLOBCOVERModisCOPERNICUSUrban = GLOBCOVERUrban.add(ModisCOPERNICUSUrban)
Map.addLayer(GLOBCOVERModisCOPERNICUSUrban,{min: 0, max: 7,format:'jpg'},'GLOBCOVERModisCOPERNICUSUrban',false);


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
var JRCGLOBCOVERModisCOPERNICUSUrban =GLOBCOVERModisCOPERNICUSUrban.multiply(JRC)
Map.addLayer(JRCGLOBCOVERModisCOPERNICUSUrban,{min: 0, max: 7,format:'jpg'},'JRCGLOBCOVERModisCOPERNICUSUrban',false);

///////////////////////////////////JRC Mapping///////////////////////////////////
var image= ee.Image('JRC/GSW1_2/GlobalSurfaceWater');
var datamask = image.select('max_extent').unmask(999);
var JRCM =datamask.eq(0)
Map.addLayer(JRCM,{min: 0, max: 1,format:'jpg'},'JRCM',false);
var UrbanwithoutWater = JRCM.multiply(JRCGLOBCOVERModisCOPERNICUSUrban)
Map.addLayer(UrbanwithoutWater,{min: 0, max: 7,format:'jpg'},'UrbanwithoutWater',false);

UrbanwithoutWater=UrbanwithoutWater.divide(7)
Map.addLayer(UrbanwithoutWater,{min: 0, max: 1,format:'jpg'},'Urban_addition_divided_by_7',false);

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
          
        var proj = UrbanwithoutWater.projection().nominalScale().getInfo();
          
        Export.image.toAsset({
          image: UrbanwithoutWater, 
          description: 'consensus/Urban',
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
          description: 'reprojected/Urban_2240m',
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
        Map.addLayer(image,{min: 0, max: 1,format:'jpg'},'Urban_2240m_Asset_image',false);
        
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
          f = f.set('land_cover_class', "Urban");
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
        var filename='coordinates_Urban'
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




