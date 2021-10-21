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
var purity= 0.85 // 0.00 = 0%    -    1.00 = 100%

//The path where your assets are imported from with this variable
var consnesus_asset_path="users/lareb/consensus/Forest_OEN"
var reprojected_asset_path="users/lareb/reprojected2/Forest_OEN_2240m"
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
////============================ -OEN- MASK ===============================
////==========================================================================
////==========================================================================

///////////////////////////// First Dataset ////////////////////////////////// 
var dataset1 = ee.Image('MODIS/006/MCD12Q1/2017_01_01');
var datamask1 = dataset1.select('LC_Type1').unmask(0);
var ModisIgbpOEN1 = datamask1.eq(9)
var dataset2 = ee.Image('MODIS/006/MCD12Q1/2018_01_01');
var datamask2 = dataset2.select('LC_Type1').unmask(0);
var ModisIgbpOEN2 = datamask2.eq(9)
var dataset3 = ee.Image('MODIS/006/MCD12Q1/2019_01_01');
var datamask3 = dataset3.select('LC_Type1').unmask(0);
var ModisIgbpOEN3 = datamask3.eq(9)
var ModisOEN=ModisIgbpOEN3.add(ModisIgbpOEN2.add(ModisIgbpOEN1))
ModisOEN=ModisOEN.divide(3)
Map.addLayer(ModisOEN,{min: 0, max: 1,format:'jpg'},'Modis1OEN',false);

///////////////////////////// Second Dataset /////////////////////////////////
var dataset1 = ee.Image('MODIS/006/MCD12Q1/2017_01_01');
var datamask1 = dataset1.select('LC_Type2').unmask(0);
var ModisIgbpOEN1 = datamask1.eq(9)
var dataset2 = ee.Image('MODIS/006/MCD12Q1/2018_01_01');
var datamask2 = dataset2.select('LC_Type2').unmask(0);
var ModisIgbpOEN2 = datamask2.eq(9)
var dataset3 = ee.Image('MODIS/006/MCD12Q1/2019_01_01');
var datamask3 = dataset3.select('LC_Type2').unmask(0);
var ModisIgbpOEN3 = datamask3.eq(9)
var ModisOEN2=ModisIgbpOEN3.add(ModisIgbpOEN2.add(ModisIgbpOEN1))
ModisOEN2=ModisOEN2.divide(3)
Map.addLayer(ModisOEN2,{min: 0, max: 1,format:'jpg'},'Modis2OEN',false);
var Modis12OEN = ModisOEN2.add(ModisOEN)
Map.addLayer(Modis12OEN,{min: 0, max: 2,format:'jpg'},'Modis12OEN',false);


///////////////////////////// Fourth Dataset ///////////////////////////////// 
var dataset1 = ee.Image('MODIS/006/MCD12Q1/2017_01_01');
var datamask1 = dataset1.select('LC_Type4').unmask(0);
var ModisIgbpOEN1 = datamask1.eq(1)
var dataset2 = ee.Image('MODIS/006/MCD12Q1/2018_01_01');
var datamask2 = dataset2.select('LC_Type4').unmask(0);
var ModisIgbpOEN2 = datamask2.eq(1)
var dataset3 = ee.Image('MODIS/006/MCD12Q1/2019_01_01');
var datamask3 = dataset3.select('LC_Type4').unmask(0);
var ModisIgbpOEN3 = datamask3.eq(1)
var ModisOEN4=ModisIgbpOEN3.add(ModisIgbpOEN2.add(ModisIgbpOEN1))
ModisOEN4=ModisOEN4.divide(3)
Map.addLayer(ModisOEN4,{min: 0, max: 1,format:'jpg'},'Modis4OEN',false);
var Modis124OEN = ModisOEN4.add(Modis12OEN)
Map.addLayer(Modis124OEN,{min: 0, max: 3,format:'jpg'},'Modis124OEN',false);

///////////////////////////// Fifth Dataset //////////////////////////////////
var dataset1 = ee.Image('MODIS/006/MCD12Q1/2017_01_01');
var datamask1 = dataset1.select('LC_Type5').unmask(0);
var ModisIgbpOEN1 = datamask1.eq(1)
var dataset2 = ee.Image('MODIS/006/MCD12Q1/2018_01_01');
var datamask2 = dataset2.select('LC_Type5').unmask(0);
var ModisIgbpOEN2 = datamask2.eq(1)
var dataset3 = ee.Image('MODIS/006/MCD12Q1/2019_01_01');
var datamask3 = dataset3.select('LC_Type5').unmask(0);
var ModisIgbpOEN3 = datamask3.eq(1)
var ModisOEN5=ModisIgbpOEN3.add(ModisIgbpOEN2.add(ModisIgbpOEN1))
ModisOEN5=ModisOEN5.divide(3)
Map.addLayer(ModisOEN5,{min: 0, max: 1,format:'jpg'},'Modis5OEN',false);
var Modis1245OEN = ModisOEN5.add(Modis124OEN)
Map.addLayer(Modis1245OEN,{min: 0, max: 4,format:'jpg'},'Modis1245OEN',false);

/////////////////////////// Sixth Dataset /////////////////////////////////////////
var image1 = ee.Image("COPERNICUS/Landcover/100m/Proba-V-C3/Global/2017")
var datamask1_tree_cover =  image1.select('tree-coverfraction').unmask(0);
var datamask1_forest_type =  image1.select('forest_type').unmask(0);
var COPERNICUSOEN1_tree_cover =datamask1_tree_cover.gte(15).and(datamask1_tree_cover.lte(30));
var COPERNICUSOEN1_forest_type =datamask1_forest_type.eq(1);
var COPERNICUSOEN1=COPERNICUSOEN1_tree_cover.add(COPERNICUSOEN1_forest_type)

var image2 = ee.Image("COPERNICUS/Landcover/100m/Proba-V-C3/Global/2018")
var datamask2_tree_cover =  image2.select('tree-coverfraction').unmask(0);
var datamask2_forest_type =  image2.select('forest_type').unmask(0);
var COPERNICUSOEN2_tree_cover =datamask2_tree_cover.gte(15).and(datamask2_tree_cover.lte(30));
var COPERNICUSOEN2_forest_type =datamask2_forest_type.eq(1);
var COPERNICUSOEN2=COPERNICUSOEN2_tree_cover.add(COPERNICUSOEN2_forest_type)

var image3 = ee.Image("COPERNICUS/Landcover/100m/Proba-V-C3/Global/2019")
var datamask3_tree_cover =  image3.select('tree-coverfraction').unmask(0);
var datamask3_forest_type =  image3.select('forest_type').unmask(0);
var COPERNICUSOEN3_tree_cover =datamask3_tree_cover.gte(15).and(datamask3_tree_cover.lte(30));
var COPERNICUSOEN3_forest_type =datamask3_forest_type.eq(1);
var COPERNICUSOEN3=COPERNICUSOEN3_tree_cover.add(COPERNICUSOEN3_forest_type)

var COPERNICUSOEN=COPERNICUSOEN3.add(COPERNICUSOEN2.add(COPERNICUSOEN1))
COPERNICUSOEN=COPERNICUSOEN.divide(3)
Map.addLayer(COPERNICUSOEN,{min: 0, max: 2,format:'jpg'},'COPERNICUSOEN',false);
var ModisCOPERNICUSOEN = COPERNICUSOEN.add(Modis1245OEN)
Map.addLayer(ModisCOPERNICUSOEN,{min: 0, max: 6,format:'jpg'},'ModisCOPERNICUSOEN',false);

///////////////////////////// Seventh Dataset ////////////////////////////////
var image = ee.Image('ESA/GLOBCOVER_L4_200901_200912_V2_3').select('landcover');
var datamask =  image.select('landcover').unmask(0);
var GLOBCOVEROEN =datamask.eq(90)
Map.addLayer(GLOBCOVEROEN,{min: 0, max: 1,format:'jpg'},'GLOBCOVEROEN',false);
var GLOBCOVERModisCOPERNICUSOEN = GLOBCOVEROEN.add(ModisCOPERNICUSOEN)
Map.addLayer(GLOBCOVERModisCOPERNICUSOEN,{min: 0, max: 7,format:'jpg'},'GLOBCOVERModisCOPERNICUSOEN',false);


///////////////////////////// Eighth Dataset /////////////////////////////////////////
var image = ee.Image('JAXA/ALOS/PALSAR/YEARLY/FNF/2017');
var datamask = image.select('fnf').unmask(0);
var PALSAR =datamask.eq(1)
Map.addLayer(PALSAR,{min: 0, max: 1,format:'jpg'},'PALSAR',false);
var PALSARGLOBCOVERModisCOPERNICUSOEN = PALSAR.add(GLOBCOVERModisCOPERNICUSOEN)
Map.addLayer(PALSARGLOBCOVERModisCOPERNICUSOEN,{min: 0, max: 8,format:'jpg'},'PALSARGLOBCOVERModisCOPERNICUSOEN',false);

///////////////////////////// Eleventh Dataset ///////////////////////////
var image = ee.Image("UMD/hansen/global_forest_change_2019_v1_7");
var datamask1 = image.select('treecover2000').unmask(0);
var HansenOEN1 =datamask1.gte(15).and(datamask1.lte(30))////white=Forest black=others
var datamask2 = image.select('loss').unmask(999);
var HansenOEN2 =datamask2.eq(0)////white=Forest black=others
var datamask3 = image.select('gain').unmask(999);
var HansenOEN3 =datamask3.eq(0)
var datamask4 = image.select('datamask').unmask(999);
var Hansen4 =datamask4.neq(2)
var Hansen = HansenOEN1.and(HansenOEN2.and(HansenOEN3.and(Hansen4)))
Map.addLayer(Hansen,{min: 0, max: 1,format:'jpg'},'Hansen',false);
var HansenPALSARGLOBCOVERModisCOPERNICUSOEN = Hansen.add(PALSARGLOBCOVERModisCOPERNICUSOEN)
Map.addLayer(HansenPALSARGLOBCOVERModisCOPERNICUSOEN,{min: 0, max: 9,format:'jpg'},'HansenPALSARGLOBCOVERModisCOPERNICUSOEN',false);

///////////////////////////// Twelvth Dataset ///////////////////////////
var image = ee.Image('NASA/JPL/global_forest_canopy_height_2005');
var datamask = image.select('1').unmask(0);
var GFCHForestDEN=datamask.gte(2)
Map.addLayer(GFCHForestDEN,{min: 0, max: 1,format:'jpg'},'GFCHForestDEN',false);
var GFCHHansenPALSARGLOBCOVERModisCOPERNICUSOEN = GFCHForestDEN.add(HansenPALSARGLOBCOVERModisCOPERNICUSOEN)
Map.addLayer(GFCHHansenPALSARGLOBCOVERModisCOPERNICUSOEN,{min: 0, max: 10,format:'jpg'},'GFCHHansenPALSARGLOBCOVERModisCOPERNICUSOEN',false);

///////////////////////////// Thirteenth Dataset ///////////////////////////
var ic = ee.ImageCollection('NASA/MEASURES/GFCC/TC/v3').filter(ee.Filter.date('2015-01-01', '2015-12-31'));

// Mosaic the collection of tiles
var ic_m = mosaicByDate(ic);
var ic_mask12 = ic_m.map(function(image) {
  var mask = image.select('tree_canopy_cover').unmask(0);
  mask = mask.gte(15).and(mask.lte(30));
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
var GFCCGFCHHansenPALSARGLOBCOVERModisCOPERNICUSOEN = GFCC.add(GFCHHansenPALSARGLOBCOVERModisCOPERNICUSOEN)
Map.addLayer(GFCCGFCHHansenPALSARGLOBCOVERModisCOPERNICUSOEN,{min: 0, max: 11,format:'jpg'},'GFCCGFCHHansenPALSARGLOBCOVERModisCOPERNICUSOEN',false);

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
var JRCGFCCGFCHHansenPALSARGLOBCOVERModisCOPERNICUSOEN =GFCCGFCHHansenPALSARGLOBCOVERModisCOPERNICUSOEN.multiply(JRC)
Map.addLayer(JRCGFCCGFCHHansenPALSARGLOBCOVERModisCOPERNICUSOEN,{min: 0, max: 11,format:'jpg'},'JRCGFCCGFCHHansenPALSARGLOBCOVERModisCOPERNICUSOEN',false);

///////////////////////////////////JRC Mapping ///////////////////////////////////
var image= ee.Image('JRC/GSW1_2/GlobalSurfaceWater');
var datamask = image.select('max_extent').unmask(999);
var JRCM =datamask.eq(0)
Map.addLayer(JRCM,{min: 0, max: 1,format:'jpg'},'JRCM',false);
var OENwithoutWater = JRCM.multiply(JRCGFCCGFCHHansenPALSARGLOBCOVERModisCOPERNICUSOEN)
Map.addLayer(OENwithoutWater,{min: 0, max: 11,format:'jpg'},'OENwithoutWater',false);

OENwithoutWater=OENwithoutWater.divide(11)
Map.addLayer(OENwithoutWater,{min: 0, max: 1,format:'jpg'},'OEN_addition_divided_by_10',false);

/////////////////////////////////// Tsinghua based Urban areas elimination method ///////////////////////////////////
var Tsinghua1 = ee.Image("Tsinghua/FROM-GLC/GAIA/v10").unmask(999);
var Tsinghua = Tsinghua1.select('change_year_index').eq(999)

OENwithoutWater=OENwithoutWater.multiply(Tsinghua); 
Map.addLayer(OENwithoutWater,{min: 0, max: 1,format:'jpg'},'OENwithoutWater_without_urban',false);


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
          
        var proj = OENwithoutWater.projection().nominalScale().getInfo();
          
        Export.image.toAsset({
          image: OENwithoutWater, 
          description: 'consensus/Forest_OEN',
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
          description: 'reprojected2/Forest_OEN_2240m',
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
        Map.addLayer(image,{min: 0, max: 1,format:'jpg'},'Forest_OEN_2240m_Asset_image',false);
        
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
          f = f.set('land_cover_class', "Forest_OEN");
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
        var filename='coordinates_Forest_OEN'
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














