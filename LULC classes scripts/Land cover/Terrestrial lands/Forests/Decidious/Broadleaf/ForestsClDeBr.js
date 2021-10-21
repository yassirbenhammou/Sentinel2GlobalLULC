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
var consnesus_asset_path="users/lareb/consensus/Forest_CDB"
var reprojected_asset_path="users/lareb/reprojected2/Forest_CDB_2240m"
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
////=============================Forest -CDB- MASK============================
////==========================================================================
////==========================================================================


///////////////////////////// Fourth Dataset ///////////////////////////////// 
var dataset1 = ee.Image('MODIS/006/MCD12Q1/2017_01_01');
var datamask1 = dataset1.select('LC_Type4').unmask(0);
var ModisIgbpCDB1 = datamask1.eq(4)
var dataset2 = ee.Image('MODIS/006/MCD12Q1/2018_01_01');
var datamask2 = dataset2.select('LC_Type4').unmask(0);
var ModisIgbpCDB2 = datamask2.eq(4)
var dataset3 = ee.Image('MODIS/006/MCD12Q1/2019_01_01');
var datamask3 = dataset3.select('LC_Type4').unmask(0);
var ModisIgbpCDB3 = datamask3.eq(4)
var ModisCDB4=ModisIgbpCDB3.add(ModisIgbpCDB2.add(ModisIgbpCDB1))
ModisCDB4=ModisCDB4.divide(3)
Map.addLayer(ModisCDB4,{min: 0, max: 1,format:'jpg'},'Modis4CDB',false);

///////////////////////////// Fifth Dataset //////////////////////////////////
var dataset1 = ee.Image('MODIS/006/MCD12Q1/2017_01_01');
var datamask1 = dataset1.select('LC_Type5').unmask(0);
var ModisIgbpCDB1 = datamask1.eq(4)
var dataset2 = ee.Image('MODIS/006/MCD12Q1/2018_01_01');
var datamask2 = dataset2.select('LC_Type5').unmask(0);
var ModisIgbpCDB2 = datamask2.eq(4)
var dataset3 = ee.Image('MODIS/006/MCD12Q1/2019_01_01');
var datamask3 = dataset3.select('LC_Type5').unmask(0);
var ModisIgbpCDB3 = datamask3.eq(4)
var ModisCDB5=ModisIgbpCDB3.add(ModisIgbpCDB2.add(ModisIgbpCDB1))
ModisCDB5=ModisCDB5.divide(3)
Map.addLayer(ModisCDB5,{min: 0, max: 1,format:'jpg'},'Modis5CDB',false);
var Modis45CDB = ModisCDB5.add(ModisCDB4)
Map.addLayer(Modis45CDB,{min: 0, max: 2,format:'jpg'},'Modis45CDB',false);

/////////////////////////// Sixth Dataset /////////////////////////////////////////
var image1 = ee.Image("COPERNICUS/Landcover/100m/Proba-V-C3/Global/2017")
var datamask1_tree_cover =  image1.select('tree-coverfraction').unmask(0);
var datamask1_forest_type =  image1.select('forest_type').unmask(0);
var COPERNICUSCDB1_tree_cover =datamask1_tree_cover.gte(40).and(datamask1_tree_cover.lte(60));
var COPERNICUSCDB1_forest_type =datamask1_forest_type.eq(4);
var COPERNICUSCDB1=COPERNICUSCDB1_tree_cover.add(COPERNICUSCDB1_forest_type)

var image2 = ee.Image("COPERNICUS/Landcover/100m/Proba-V-C3/Global/2018")
var datamask2_tree_cover =  image2.select('tree-coverfraction').unmask(0);
var datamask2_forest_type =  image2.select('forest_type').unmask(0);
var COPERNICUSCDB2_tree_cover =datamask2_tree_cover.gte(40).and(datamask2_tree_cover.lte(60));
var COPERNICUSCDB2_forest_type =datamask2_forest_type.eq(4);
var COPERNICUSCDB2=COPERNICUSCDB2_tree_cover.add(COPERNICUSCDB2_forest_type)

var image3 = ee.Image("COPERNICUS/Landcover/100m/Proba-V-C3/Global/2019")
var datamask3_tree_cover =  image3.select('tree-coverfraction').unmask(0);
var datamask3_forest_type =  image3.select('forest_type').unmask(0);
var COPERNICUSCDB3_tree_cover =datamask3_tree_cover.gte(40).and(datamask3_tree_cover.lte(60));
var COPERNICUSCDB3_forest_type =datamask3_forest_type.eq(4);
var COPERNICUSCDB3=COPERNICUSCDB3_tree_cover.add(COPERNICUSCDB3_forest_type)

var COPERNICUSCDB=COPERNICUSCDB3.add(COPERNICUSCDB2.add(COPERNICUSCDB1))
COPERNICUSCDB=COPERNICUSCDB.divide(3)
Map.addLayer(COPERNICUSCDB,{min: 0, max: 2,format:'jpg'},'COPERNICUSCDB',false);
var ModisCOPERNICUSCDB = COPERNICUSCDB.add(Modis45CDB)
Map.addLayer(ModisCOPERNICUSCDB,{min: 0, max: 4,format:'jpg'},'ModisCOPERNICUSCDB',false);


///////////////////////////// Seventh Dataset ////////////////////////////////
var image = ee.Image('ESA/GLOBCOVER_L4_200901_200912_V2_3');
var datamask =  image.select('landcover').unmask(0);
var GLOBCOVERCDB =datamask.eq(50)////white=CDB black=others
Map.addLayer(GLOBCOVERCDB,{min: 0, max: 1,format:'jpg'},'GLOBCOVERCDB',false);
var GLOBCOVERModisCOPERNICUSCDB = GLOBCOVERCDB.add(ModisCOPERNICUSCDB)
Map.addLayer(GLOBCOVERModisCOPERNICUSCDB,{min: 0, max: 5,format:'jpg'},'GLOBCOVERModisCOPERNICUSCDB',false);

///////////////////////////// Eighth Dataset /////////////////////////////////////////
var image = ee.Image('JAXA/ALOS/PALSAR/YEARLY/FNF/2017');
var datamask = image.select('fnf').unmask(0);
var PALSAR =datamask.eq(1)
Map.addLayer(PALSAR,{min: 0, max: 1,format:'jpg'},'PALSAR',false);
var PALSARGLOBCOVERModisCOPERNICUSCDB = PALSAR.add(GLOBCOVERModisCOPERNICUSCDB)
Map.addLayer(PALSARGLOBCOVERModisCOPERNICUSCDB,{min: 0, max: 6,format:'jpg'},'PALSARGLOBCOVERModisCOPERNICUSCDB',false);

///////////////////////////// Eleventh Dataset ///////////////////////////
var image = ee.Image("UMD/hansen/global_forest_change_2019_v1_7");
var datamask1 = image.select('treecover2000').unmask(0);
var HansenForestCDB1 =datamask1.gte(40).and(datamask1.lte(60))////white=Forest black=others
var datamask2 = image.select('loss').unmask(999);
var HansenForestCDB2 =datamask2.eq(0)////white=Forest black=others
var datamask3 = image.select('gain').unmask(999);
var HansenForestCDB3 =datamask3.eq(0)
var datamask4 = image.select('datamask').unmask(999);
var Hansen4 =datamask4.neq(2)
var HansenForestCDB = HansenForestCDB1.and(HansenForestCDB2.and(HansenForestCDB3.and(Hansen4)))
Map.addLayer(HansenForestCDB,{min: 0, max: 1,format:'jpg'},'HansenForestCDB',false);
var HansenPALSARGLOBCOVERModisCOPERNICUSCDB = HansenForestCDB.add(PALSARGLOBCOVERModisCOPERNICUSCDB)
Map.addLayer(HansenPALSARGLOBCOVERModisCOPERNICUSCDB,{min: 0, max: 7,format:'jpg'},'HansenPALSARGLOBCOVERModisCOPERNICUSCDB',false);

///////////////////////////// Twelvth Dataset ///////////////////////////
var image = ee.Image('NASA/JPL/global_forest_canopy_height_2005');
var datamask = image.select('1').unmask(0);
var GFCHCDB=datamask.gte(2)
Map.addLayer(GFCHCDB,{min: 0, max: 1,format:'jpg'},'GFCHCDB',false);
var GFCHHansenPALSARGLOBCOVERModisCOPERNICUSCDB = GFCHCDB.add(HansenPALSARGLOBCOVERModisCOPERNICUSCDB)
Map.addLayer(GFCHHansenPALSARGLOBCOVERModisCOPERNICUSCDB,{min: 0, max: 8,format:'jpg'},'GFCHHansenPALSARGLOBCOVERModisCOPERNICUSCDB',false);

///////////////////////////// Thirteenth Dataset ///////////////////////////
var ic = ee.ImageCollection('NASA/MEASURES/GFCC/TC/v3').filter(ee.Filter.date('2015-01-01', '2015-12-31'));

// Mosaic the collection of tiles
var ic_m = mosaicByDate(ic);
var ic_mask12 = ic_m.map(function(image) {
  var mask = image.select('tree_canopy_cover').unmask(0);
  mask = mask.gte(40).and(mask.lte(60));
  return mask
})

// Combine over time
var c = ee.Image(0);
for (var i = 0; i < 1; i++) {
  var image = ee.Image(ic_mask12.toList(ic_mask12.size()).get(i));
  c = c.add(image);
}
var GFCC = c;
Map.addLayer(GFCC,{min: 0, max: 1,format:'jpg'},'GFCCCDB',false);
var GFCCGFCHHansenPALSARGLOBCOVERModisCOPERNICUSCDB = GFCC.add(GFCHHansenPALSARGLOBCOVERModisCOPERNICUSCDB)
Map.addLayer(GFCCGFCHHansenPALSARGLOBCOVERModisCOPERNICUSCDB,{min: 0, max: 9,format:'jpg'},'GFCCGFCHHansenPALSARGLOBCOVERModisCOPERNICUSCDB',false);

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
var JRCGFCCGFCHHansenPALSARGLOBCOVERModisCOPERNICUSCDB =GFCCGFCHHansenPALSARGLOBCOVERModisCOPERNICUSCDB.multiply(JRC)
Map.addLayer(JRCGFCCGFCHHansenPALSARGLOBCOVERModisCOPERNICUSCDB,{min: 0, max: 9,format:'jpg'},'JRCGFCCGFCHHansenPALSARGLOBCOVERModisCOPERNICUSCDB',false);

///////////////////////////////////JRC Mapping ///////////////////////////////////
var image= ee.Image('JRC/GSW1_2/GlobalSurfaceWater');
var datamask = image.select('max_extent').unmask(999);
var JRCM =datamask.eq(0)
Map.addLayer(JRCM,{min: 0, max: 1,format:'jpg'},'JRCM',false);
var CDBwithoutWater = JRCM.multiply(JRCGFCCGFCHHansenPALSARGLOBCOVERModisCOPERNICUSCDB)
Map.addLayer(CDBwithoutWater,{min: 0, max: 9,format:'jpg'},'CDBwithoutWater',false);

CDBwithoutWater=CDBwithoutWater.divide(9)
Map.addLayer(CDBwithoutWater,{min: 0, max: 1,format:'jpg'},'CDB_addition_divided_by_9',false);

/////////////////////////////////// Tsinghua based Urban areas elimination method ///////////////////////////////////
var Tsinghua1 = ee.Image("Tsinghua/FROM-GLC/GAIA/v10").unmask(999);
var Tsinghua = Tsinghua1.select('change_year_index').eq(999)

CDBwithoutWater=CDBwithoutWater.multiply(Tsinghua); 
Map.addLayer(CDBwithoutWater,{min: 0, max: 1,format:'jpg'},'CDBwithoutWater_without_urban',false);





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
          
        var proj = CDBwithoutWater.projection().nominalScale().getInfo();
          
        Export.image.toAsset({
          image: CDBwithoutWater, 
          description: 'consensus/Forest_CDB',
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
          description: 'reprojected2/Forest_CDB_2240m',
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
        Map.addLayer(image,{min: 0, max: 1,format:'jpg'},'Forest_CDB_2240m_Asset_image',false);
        
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
          f = f.set('land_cover_class', "Forest_CDB");
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
        var filename='coordinates_Forest_CDB'
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


