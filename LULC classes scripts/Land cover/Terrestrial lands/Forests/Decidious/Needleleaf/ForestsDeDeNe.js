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
var consnesus_asset_path="users/lareb/consensus/Forest_DDN"
var reprojected_asset_path="users/lareb/reprojected2/Forest_DDN_2240m"
//-----------------------------------------------------------------------
//-----------------------------------------------------------------------
//
//                        Useful function
//    
//-----------------------------------------------------------------------
//-----------------------------------------------------------------------

//Function for Mosaicking an Image Collection by Date 

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



//-----------------------------------------------------------------------
//-----------------------------------------------------------------------
//
//                        Consensus creation over many products
//    
//-----------------------------------------------------------------------
//-----------------------------------------------------------------------


////==========================================================================
////==========================================================================
////============================ -DDN- MASK ===============================
////==========================================================================
////==========================================================================

///////////////////////////// First Dataset ////////////////////////////////// 
var dataset1 = ee.Image('MODIS/006/MCD12Q1/2017_01_01');
var datamask1 = dataset1.select('LC_Type1').unmask(0);
var ModisIgbpDDN1 = datamask1.eq(3)
var dataset2 = ee.Image('MODIS/006/MCD12Q1/2018_01_01');
var datamask2 = dataset2.select('LC_Type1').unmask(0);
var ModisIgbpDDN2 = datamask2.eq(3)
var dataset3 = ee.Image('MODIS/006/MCD12Q1/2019_01_01');
var datamask3 = dataset3.select('LC_Type1').unmask(0);
var ModisIgbpDDN3 = datamask3.eq(3)
var ModisDDN=ModisIgbpDDN3.add(ModisIgbpDDN2.add(ModisIgbpDDN1))
ModisDDN=ModisDDN.divide(3)
Map.addLayer(ModisDDN,{min: 0, max: 1,format:'jpg'},'Modis1DDN',false);

///////////////////////////// Second Dataset /////////////////////////////////
var dataset1 = ee.Image('MODIS/006/MCD12Q1/2017_01_01');
var datamask1 = dataset1.select('LC_Type2').unmask(0);
var ModisIgbpDDN1 = datamask1.eq(3)
var dataset2 = ee.Image('MODIS/006/MCD12Q1/2018_01_01');
var datamask2 = dataset2.select('LC_Type2').unmask(0);
var ModisIgbpDDN2 = datamask2.eq(3)
var dataset3 = ee.Image('MODIS/006/MCD12Q1/2019_01_01');
var datamask3 = dataset3.select('LC_Type2').unmask(0);
var ModisIgbpDDN3 = datamask3.eq(3)
var ModisDDN2=ModisIgbpDDN3.add(ModisIgbpDDN2.add(ModisIgbpDDN1))
ModisDDN2=ModisDDN2.divide(3)
Map.addLayer(ModisDDN2,{min: 0, max: 1,format:'jpg'},'Modis2DDN',false);
var Modis12DDN = ModisDDN2.add(ModisDDN)
Map.addLayer(Modis12DDN,{min: 0, max: 2,format:'jpg'},'Modis12DDN',false);

///////////////////////////// Third Dataset ///////////////////////////////// 
var dataset1 = ee.Image('MODIS/006/MCD12Q1/2017_01_01');
var datamask1 = dataset1.select('LC_Type3').unmask(0);
var ModisIgbpDDN1 = datamask1.eq(8)
var dataset2 = ee.Image('MODIS/006/MCD12Q1/2018_01_01');
var datamask2 = dataset2.select('LC_Type3').unmask(0);
var ModisIgbpDDN2 = datamask2.eq(8)
var dataset3 = ee.Image('MODIS/006/MCD12Q1/2019_01_01');
var datamask3 = dataset3.select('LC_Type3').unmask(0);
var ModisIgbpDDN3 = datamask3.eq(8)
var ModisDDN3=ModisIgbpDDN3.add(ModisIgbpDDN2.add(ModisIgbpDDN1))
ModisDDN3=ModisDDN3.divide(3)
Map.addLayer(ModisDDN3,{min: 0, max: 1,format:'jpg'},'Modis3DDN',false);
var Modis123DDN = ModisDDN3.add(Modis12DDN)
Map.addLayer(Modis123DDN,{min: 0, max: 3,format:'jpg'},'Modis123DDN',false);

///////////////////////////// Fourth Dataset ///////////////////////////////// 
var dataset1 = ee.Image('MODIS/006/MCD12Q1/2017_01_01');
var datamask1 = dataset1.select('LC_Type4').unmask(0);
var ModisIgbpDDN1 = datamask1.eq(3)
var dataset2 = ee.Image('MODIS/006/MCD12Q1/2018_01_01');
var datamask2 = dataset2.select('LC_Type4').unmask(0);
var ModisIgbpDDN2 = datamask2.eq(3)
var dataset3 = ee.Image('MODIS/006/MCD12Q1/2019_01_01');
var datamask3 = dataset3.select('LC_Type4').unmask(0);
var ModisIgbpDDN3 = datamask3.eq(3)
var ModisDDN4=ModisIgbpDDN3.add(ModisIgbpDDN2.add(ModisIgbpDDN1))
ModisDDN4=ModisDDN4.divide(3)
Map.addLayer(ModisDDN4,{min: 0, max: 1,format:'jpg'},'Modis4DDN',false);
var Modis1234DDN = ModisDDN4.add(Modis123DDN)
Map.addLayer(Modis1234DDN,{min: 0, max: 4,format:'jpg'},'Modis1234DDN',false);

///////////////////////////// Fifth Dataset //////////////////////////////////
var dataset1 = ee.Image('MODIS/006/MCD12Q1/2017_01_01');
var datamask1 = dataset1.select('LC_Type5').unmask(0);
var ModisIgbpDDN1 = datamask1.eq(3)
var dataset2 = ee.Image('MODIS/006/MCD12Q1/2018_01_01');
var datamask2 = dataset2.select('LC_Type5').unmask(0);
var ModisIgbpDDN2 = datamask2.eq(3)
var dataset3 = ee.Image('MODIS/006/MCD12Q1/2019_01_01');
var datamask3 = dataset3.select('LC_Type5').unmask(0);
var ModisIgbpDDN3 = datamask3.eq(3)
var ModisDDN5=ModisIgbpDDN3.add(ModisIgbpDDN2.add(ModisIgbpDDN1))
ModisDDN5=ModisDDN5.divide(3)
Map.addLayer(ModisDDN5,{min: 0, max: 1,format:'jpg'},'Modis5DDN',false);
var Modis12345DDN = ModisDDN5.add(Modis1234DDN)
Map.addLayer(Modis12345DDN,{min: 0, max: 5,format:'jpg'},'Modis12345DDN',false);

/////////////////////////// Sixth Dataset /////////////////////////////////////////
var image1 = ee.Image("COPERNICUS/Landcover/100m/Proba-V-C3/Global/2017")
var datamask1_tree_cover =  image1.select('tree-coverfraction').unmask(0);
var datamask1_forest_type =  image1.select('forest_type').unmask(0);
var COPERNICUSDDN1_tree_cover =datamask1_tree_cover.gte(60);
var COPERNICUSDDN1_forest_type =datamask1_forest_type.eq(3);
var COPERNICUSDDN1=COPERNICUSDDN1_tree_cover.add(COPERNICUSDDN1_forest_type)

var image2 = ee.Image("COPERNICUS/Landcover/100m/Proba-V-C3/Global/2018")
var datamask2_tree_cover =  image2.select('tree-coverfraction').unmask(0);
var datamask2_forest_type =  image2.select('forest_type').unmask(0);
var COPERNICUSDDN2_tree_cover =datamask2_tree_cover.gte(60);
var COPERNICUSDDN2_forest_type =datamask2_forest_type.eq(3);
var COPERNICUSDDN2=COPERNICUSDDN2_tree_cover.add(COPERNICUSDDN2_forest_type)

var image3 = ee.Image("COPERNICUS/Landcover/100m/Proba-V-C3/Global/2019")
var datamask3_tree_cover =  image3.select('tree-coverfraction').unmask(0);
var datamask3_forest_type =  image3.select('forest_type').unmask(0);
var COPERNICUSDDN3_tree_cover =datamask3_tree_cover.gte(60);
var COPERNICUSDDN3_forest_type =datamask3_forest_type.eq(3);
var COPERNICUSDDN3=COPERNICUSDDN3_tree_cover.add(COPERNICUSDDN3_forest_type)

var COPERNICUSDDN=COPERNICUSDDN3.add(COPERNICUSDDN2.add(COPERNICUSDDN1))
COPERNICUSDDN=COPERNICUSDDN.divide(3)
Map.addLayer(COPERNICUSDDN,{min: 0, max: 2,format:'jpg'},'COPERNICUSDDN',false);
var ModisCOPERNICUSDDN = COPERNICUSDDN.add(Modis12345DDN)
Map.addLayer(ModisCOPERNICUSDDN,{min: 0, max: 7,format:'jpg'},'ModisCOPERNICUSDDN',false);


///////////////////////////// Eighth Dataset /////////////////////////////////////////
var image = ee.Image('JAXA/ALOS/PALSAR/YEARLY/FNF/2017');
var datamask = image.select('fnf').unmask(0);
var PALSAR =datamask.eq(1)
Map.addLayer(PALSAR,{min: 0, max: 1,format:'jpg'},'PALSAR',false);
var PALSARModisCOPERNICUSDDN = PALSAR.add(ModisCOPERNICUSDDN)
Map.addLayer(PALSARModisCOPERNICUSDDN,{min: 0, max: 8,format:'jpg'},'PALSARModisCOPERNICUSDDN',false);

///////////////////////////// Eleventh Dataset ///////////////////////////
var image = ee.Image("UMD/hansen/global_forest_change_2019_v1_7");
var datamask1 = image.select('treecover2000').unmask(0);
var HansenDDN1 =datamask1.gte(60)////white=Forest black=others
var datamask2 = image.select('loss').unmask(999);
var HansenDDN2 =datamask2.eq(0)////white=Forest black=others
var datamask3 = image.select('gain').unmask(999);
var HansenDDN3 =datamask3.eq(0)
var datamask4 = image.select('datamask').unmask(999);
var Hansen4 =datamask4.neq(2)
var Hansen = HansenDDN1.and(HansenDDN2.and(HansenDDN3.and(Hansen4)))
Map.addLayer(Hansen,{min: 0, max: 1,format:'jpg'},'Hansen',false);
var HansenPALSARModisCOPERNICUSDDN = Hansen.add(PALSARModisCOPERNICUSDDN)
Map.addLayer(HansenPALSARModisCOPERNICUSDDN,{min: 0, max: 9,format:'jpg'},'HansenPALSARModisCOPERNICUSDDN',false);

///////////////////////////// Twelvth Dataset ///////////////////////////
var image = ee.Image('NASA/JPL/global_forest_canopy_height_2005');
var datamask = image.select('1').unmask(0);
var GFCHForestDEN=datamask.gte(2)
Map.addLayer(GFCHForestDEN,{min: 0, max: 1,format:'jpg'},'GFCHForestDEN',false);
var GFCHHansenPALSARModisCOPERNICUSDDN = GFCHForestDEN.add(HansenPALSARModisCOPERNICUSDDN)
Map.addLayer(GFCHHansenPALSARModisCOPERNICUSDDN,{min: 0, max: 10,format:'jpg'},'GFCHHansenPALSARModisCOPERNICUSDDN',false);

///////////////////////////// Thirteenth Dataset ///////////////////////////
var ic = ee.ImageCollection('NASA/MEASURES/GFCC/TC/v3').filter(ee.Filter.date('2015-01-01', '2015-12-31'));

// Mosaic the collection of tiles
var ic_m = mosaicByDate(ic);
var ic_mask12 = ic_m.map(function(image) {
  var mask = image.select('tree_canopy_cover').unmask(0);
  mask = mask.gte(60);
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
var GFCCGFCHHansenPALSARModisCOPERNICUSDDN = GFCC.add(GFCHHansenPALSARModisCOPERNICUSDDN)
Map.addLayer(GFCCGFCHHansenPALSARModisCOPERNICUSDDN,{min: 0, max: 11,format:'jpg'},'GFCCGFCHHansenPALSARModisCOPERNICUSDDN',false);

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
var JRCGFCCGFCHHansenPALSARModisCOPERNICUSDDN =GFCCGFCHHansenPALSARModisCOPERNICUSDDN.multiply(JRC)
Map.addLayer(JRCGFCCGFCHHansenPALSARModisCOPERNICUSDDN,{min: 0, max: 11,format:'jpg'},'JRCGFCCGFCHHansenPALSARModisCOPERNICUSDDN',false);

///////////////////////////////////JRC Mapping ///////////////////////////////////
var image= ee.Image('JRC/GSW1_2/GlobalSurfaceWater');
var datamask = image.select('max_extent').unmask(999);
var JRCM =datamask.eq(0)
Map.addLayer(JRCM,{min: 0, max: 1,format:'jpg'},'JRCM',false);
var DDNwithoutWater = JRCM.multiply(JRCGFCCGFCHHansenPALSARModisCOPERNICUSDDN)
Map.addLayer(DDNwithoutWater,{min: 0, max: 11,format:'jpg'},'DDNwithoutWater',false);

DDNwithoutWater=DDNwithoutWater.divide(11)
Map.addLayer(DDNwithoutWater,{min: 0, max: 1,format:'jpg'},'DDN_addition_divided_by_11',false);

/////////////////////////////////// Tsinghua based Urban areas elimination method ///////////////////////////////////
var Tsinghua1 = ee.Image("Tsinghua/FROM-GLC/GAIA/v10").unmask(999);
var Tsinghua = Tsinghua1.select('change_year_index').eq(999)

DDNwithoutWater=DDNwithoutWater.multiply(Tsinghua); 
Map.addLayer(DDNwithoutWater,{min: 0, max: 1,format:'jpg'},'DDNwithoutWater_without_urban',false);


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
          
        var proj = DDNwithoutWater.projection().nominalScale().getInfo();
          
        Export.image.toAsset({
          image: DDNwithoutWater, 
          description: 'consensus/Forest_DDN',
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
          description: 'reprojected2/Forest_DDN_2240m',
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
        Map.addLayer(image,{min: 0, max: 1,format:'jpg'},'Forest_DDN_2240m_Asset_image',false);
        
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
          f = f.set('land_cover_class', "Forest_DDN");
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
        var filename='coordinates_Forest_DDN'
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









