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
var purity= 0.90 // 0.00 = 0%    -    1.00 = 100%

//The path where your assets are imported from with this variable
var consnesus_asset_path="users/ebenhammou/consensus/Swamp_masked"
var reprojected_asset_path="users/ebenhammou/reprojected2/Swamp_masked_2240m"

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
////============================ -Swamp_masked- MASK ===============================
////==========================================================================
////==========================================================================

///////////////////////////// First Dataset ////////////////////////////////// 
var dataset1 = ee.Image('MODIS/006/MCD12Q1/2017_01_01');
var datamask1 = dataset1.select('LC_Type1').unmask(0);
var ModisIgbpSwamp_masked1 = datamask1.eq(11)
var dataset2 = ee.Image('MODIS/006/MCD12Q1/2018_01_01');
var datamask2 = dataset2.select('LC_Type1').unmask(0);
var ModisIgbpSwamp_masked2 = datamask2.eq(11)
var dataset3 = ee.Image('MODIS/006/MCD12Q1/2019_01_01');
var datamask3 = dataset3.select('LC_Type1').unmask(0);
var ModisIgbpSwamp_masked3 = datamask3.eq(11)
var ModisSwamp_masked=ModisIgbpSwamp_masked3.add(ModisIgbpSwamp_masked2.add(ModisIgbpSwamp_masked1))
ModisSwamp_masked=ModisSwamp_masked.divide(3)
Map.addLayer(ModisSwamp_masked,{min: 0, max: 1,format:'jpg'},'Modis1Swamp_masked',false);

///////////////////////////// Second Dataset /////////////////////////////////
var dataset1 = ee.Image('MODIS/006/MCD12Q1/2017_01_01');
var datamask1 = dataset1.select('LC_Type2').unmask(0);
var ModisIgbpSwamp_masked1 = datamask1.eq(11)
var dataset2 = ee.Image('MODIS/006/MCD12Q1/2018_01_01');
var datamask2 = dataset2.select('LC_Type2').unmask(0);
var ModisIgbpSwamp_masked2 = datamask2.eq(11)
var dataset3 = ee.Image('MODIS/006/MCD12Q1/2019_01_01');
var datamask3 = dataset3.select('LC_Type2').unmask(0);
var ModisIgbpSwamp_masked3 = datamask3.eq(11)
var ModisSwamp_masked2=ModisIgbpSwamp_masked3.add(ModisIgbpSwamp_masked2.add(ModisIgbpSwamp_masked1))
ModisSwamp_masked2=ModisSwamp_masked2.divide(3)
Map.addLayer(ModisSwamp_masked2,{min: 0, max: 1,format:'jpg'},'Modis2Swamp_masked',false);
var Modis12Swamp_masked = ModisSwamp_masked2.add(ModisSwamp_masked)
Map.addLayer(Modis12Swamp_masked,{min: 0, max: 2,format:'jpg'},'Modis12Swamp_masked',false);


/////////////////////////// Sixth Dataset /////////////////////////////////////////
var image1 = ee.Image("COPERNICUS/Landcover/100m/Proba-V-C3/Global/2017")
var datamask1 =  image1.select('discrete_classification').unmask(0);
var COPERNICUSSwamp_masked1 =datamask1.eq(90);
var image2 = ee.Image("COPERNICUS/Landcover/100m/Proba-V-C3/Global/2018")
var datamask2 =  image2.select('discrete_classification').unmask(0);
var COPERNICUSSwamp_masked2 =datamask2.eq(90);
var image3 = ee.Image("COPERNICUS/Landcover/100m/Proba-V-C3/Global/2019")
var datamask3 =  image3.select('discrete_classification').unmask(0);
var COPERNICUSSwamp_masked3 =datamask3.eq(90);
var COPERNICUSSwamp_masked=COPERNICUSSwamp_masked3.add(COPERNICUSSwamp_masked2.add(COPERNICUSSwamp_masked1))
COPERNICUSSwamp_masked=COPERNICUSSwamp_masked.divide(3)
Map.addLayer(COPERNICUSSwamp_masked,{min: 0, max: 1,format:'jpg'},'COPERNICUSSwamp_masked',false);
var ModisCOPERNICUSSwamp_masked = COPERNICUSSwamp_masked.add(Modis12Swamp_masked)
Map.addLayer(ModisCOPERNICUSSwamp_masked,{min: 0, max: 3,format:'jpg'},'ModisCOPERNICUSSwamp_masked',false);

///////////////////////////// Seventh Dataset ////////////////////////////////
var image = ee.Image('ESA/GLOBCOVER_L4_200901_200912_V2_3');
var datamask =  image.select('landcover').unmask(0);
var GLOBCOVERSwamp_masked =datamask.eq(180).or(datamask.eq(160))////white=Swamp_masked black=others
Map.addLayer(GLOBCOVERSwamp_masked,{min: 0, max: 1,format:'jpg'},'GLOBCOVERSwamp_masked',false);
var GLOBCOVERModisCOPERNICUSSwamp_masked = GLOBCOVERSwamp_masked.add(ModisCOPERNICUSSwamp_masked)
Map.addLayer(GLOBCOVERModisCOPERNICUSSwamp_masked,{min: 0, max: 4,format:'jpg'},'GLOBCOVERModisCOPERNICUSSwamp_masked',false);

/*
///////////////////////////// Eighth Dataset /////////////////////////////////////////
var image = ee.Image('JAXA/ALOS/PALSAR/YEARLY/FNF/2017');
var datamask = image.select('fnf').unmask(0);
var PALSAR =datamask.eq(1)
Map.addLayer(PALSAR,{min: 0, max: 1,format:'jpg'},'PALSAR',false);
var PALSARGLOBCOVERModisCOPERNICUSSwamp_masked = PALSAR.add(GLOBCOVERModisCOPERNICUSSwamp_masked)
Map.addLayer(PALSARGLOBCOVERModisCOPERNICUSSwamp_masked,{min: 0, max: 5,format:'jpg'},'PALSARGLOBCOVERModisCOPERNICUSSwamp_masked',false);

/////////////////////////// Ninth Dataset /////////////////////////////////////////
var image = ee.Image("USGS/GFSAD1000_V1");
var datamask = image.select('landcover').unmask(999);
var GFSADSwamp_masked =datamask.eq(0)//white=Cropland black=others
Map.addLayer(GFSADSwamp_masked,{min: 0, max: 1,format:'jpg'},'GFSADSwamp_masked',false);
var GLOBCOVERModisCOPERNICUSSwamp_masked = GFSADSwamp_masked.add(PALSARGLOBCOVERModisCOPERNICUSSwamp_masked)
Map.addLayer(GLOBCOVERModisCOPERNICUSSwamp_masked,{min: 0, max: 6,format:'jpg'},'GLOBCOVERModisCOPERNICUSSwamp_masked',false);
*/

///////////////////////////// Eleventh Dataset ///////////////////////////
var image = ee.Image("UMD/hansen/global_forest_change_2019_v1_7");
var datamask = image.select('treecover2000').unmask(0);
var Hansen1 =datamask.gt(10)
var datamask2 = image.select('loss').unmask(999);
var Hansen2 =datamask2.eq(0)
var datamask3 = image.select('gain').unmask(999);
var Hansen3 =datamask3.eq(0)
var datamask4 = image.select('datamask').unmask(999);
var Hansen4 =datamask4.eq(2)
var Hansen = Hansen4.or(Hansen1.and(Hansen2.and(Hansen3)))
Map.addLayer(Hansen,{min: 0, max: 1,format:'jpg'},'Hansen',false);
var HansenGLOBCOVERModisCOPERNICUSSwamp_masked = Hansen.add(GLOBCOVERModisCOPERNICUSSwamp_masked)
Map.addLayer(HansenGLOBCOVERModisCOPERNICUSSwamp_masked,{min: 0, max: 5,format:'jpg'},'HansenGLOBCOVERModisCOPERNICUSSwamp_masked',false);

///////////////////////////// Twelvth Dataset ///////////////////////////
var image = ee.Image('NASA/JPL/global_forest_canopy_height_2005');
var datamask = image.select('1').unmask(0);
var GFCHSwamp_masked=datamask.gt(2)
Map.addLayer(GFCHSwamp_masked,{min: 0, max: 1,format:'jpg'},'GFCHSwamp_masked',false);
var GFCHHansenGLOBCOVERModisCOPERNICUSSwamp_masked = GFCHSwamp_masked.add(HansenGLOBCOVERModisCOPERNICUSSwamp_masked)
Map.addLayer(GFCHHansenGLOBCOVERModisCOPERNICUSSwamp_masked,{min: 0, max: 6,format:'jpg'},'GFCHHansenGLOBCOVERModisCOPERNICUSSwamp_masked',false);

///////////////////////////// Thirteenth Dataset ///////////////////////////
var ic = ee.ImageCollection('NASA/MEASURES/GFCC/TC/v3').filter(ee.Filter.date('2015-01-01', '2015-12-31'));

// Mosaic the collection of tiles
var ic_m = mosaicByDate(ic);
var ic_mask12 = ic_m.map(function(image) {
  var mask = image.select('tree_canopy_cover').unmask(0);
  mask = mask.gt(10);
  return mask
})

// Combine over time
var c = ee.Image(0);
for (var i = 0; i < 1; i++) {
  var image = ee.Image(ic_mask12.toList(ic_mask12.size()).get(i));
  c = c.add(image);
}
var GFCC = c;
Map.addLayer(GFCC,{min: 0, max: 1,format:'jpg'},'GFCC',false);
var GFCCGFCHHansenGLOBCOVERModisCOPERNICUSSwamp_masked = GFCC.add(GFCHHansenGLOBCOVERModisCOPERNICUSSwamp_masked)
Map.addLayer(GFCCGFCHHansenGLOBCOVERModisCOPERNICUSSwamp_masked,{min: 0, max: 7,format:'jpg'},'GFCCGFCHHansenGLOBCOVERModisCOPERNICUSSwamp_masked',false);

///////////////////////////// Tenth Dataset /////////////////////////////////////////
var dataset1 = ee.Image('JRC/GSW1_2/YearlyHistory/2017');
var datamask1 = dataset1.select('waterClass').unmask(0);
var JRC1 = datamask1.eq(2).or(datamask1.eq(3))
var dataset2 = ee.Image('JRC/GSW1_2/YearlyHistory/2018');
var datamask2 = dataset2.select('waterClass').unmask(0);
var JRC2 = datamask2.eq(2).or(datamask2.eq(3))
var dataset3 = ee.Image('JRC/GSW1_2/YearlyHistory/2019');
var datamask3 = dataset3.select('waterClass').unmask(0);
var JRC3 = datamask3.eq(2).or(datamask3.eq(3))
var JRC=JRC3.or(JRC2.or(JRC1))
Map.addLayer(JRC,{min: 0, max: 1,format:'jpg'},'JRC',false);
var JRCGFCCGFCHHansenGLOBCOVERModisCOPERNICUSSwamp_masked =JRC.add(GFCCGFCHHansenGLOBCOVERModisCOPERNICUSSwamp_masked)
Map.addLayer(JRCGFCCGFCHHansenGLOBCOVERModisCOPERNICUSSwamp_masked,{min: 0, max: 8,format:'jpg'},'JRCGFCCGFCHHansenGLOBCOVERModisCOPERNICUSSwamp_masked',false);


///////////////////////////////////JRC Mapping ///////////////////////////////////
var image= ee.Image('JRC/GSW1_2/GlobalSurfaceWater');
var datamask = image.select('max_extent').unmask(0);
var JRCM =datamask.eq(1)
Map.addLayer(JRCM,{min: 0, max: 1,format:'jpg'},'JRCM',false);
var Swamp_maskedwithoutWater = JRCM.add(JRCGFCCGFCHHansenGLOBCOVERModisCOPERNICUSSwamp_masked)
Map.addLayer(Swamp_maskedwithoutWater,{min: 0, max: 9,format:'jpg'},'Swamp_masked',false);

Swamp_maskedwithoutWater=Swamp_maskedwithoutWater.divide(9)
Map.addLayer(Swamp_maskedwithoutWater,{min: 0, max: 1,format:'jpg'},'Swamp_masked_addition_divided_by_9',false);


///////////////////////////// Mask Swamp ////////////////////////////////
var image = ee.Image('ESA/GLOBCOVER_L4_200901_200912_V2_3');
var datamask =  image.select('landcover').unmask(0);
var GLOBCOVERSwamp_mask =datamask.neq(170)////white=Swamp_masked black=others
Map.addLayer(GLOBCOVERSwamp_mask,{min: 0, max: 1,format:'jpg'},'GLOBCOVERSwamp_mask',false);
Swamp_maskedwithoutWater = Swamp_maskedwithoutWater.multiply(GLOBCOVERSwamp_mask)
Map.addLayer(Swamp_maskedwithoutWater,{min: 0, max: 1,format:'jpg'},'Swamp_masked',false);


/////////////////////////////////// Tsinghua based Urban areas elimination method ///////////////////////////////////
var Tsinghua1 = ee.Image("Tsinghua/FROM-GLC/GAIA/v10").unmask(999);
var Tsinghua = Tsinghua1.select('change_year_index').eq(999)

Swamp_maskedwithoutWater=Swamp_maskedwithoutWater.multiply(Tsinghua); 
Map.addLayer(Swamp_maskedwithoutWater,{min: 0, max: 1,format:'jpg'},'Swamp_masked_without_urban',false);


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
          
        var proj = Swamp_maskedwithoutWater.projection().nominalScale().getInfo();
          
        Export.image.toAsset({
          image: Swamp_maskedwithoutWater, 
          description: 'consensus/Swamp_masked',
          //crs: 'EPSG:3857',
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
          description: 'reprojected2/Swamp_masked_2240m',
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
        Map.addLayer(image,{min: 0, max: 1,format:'jpg'},'Swamp_masked_2240m_Asset_image',false);
        
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
          f = f.set('land_cover_class', "Swamp_masked");
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
        var filename='coordinates_Swamp_masked'
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
















