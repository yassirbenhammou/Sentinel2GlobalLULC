//-----------------------------------------------------------------------
//-----------------------------------------------------------------------
//
//                        GlobalHumanModification
//    
//-----------------------------------------------------------------------
//-----------------------------------------------------------------------


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

///////////////////////////// GHM Dataset ////////////////////////////////// 
var dataset = ee.ImageCollection("CSP/HM/GlobalHumanModification").toBands();
var datamask = (dataset.select('2016_gHM')).unmask(0);
Map.addLayer(datamask,{},'GHM',false);

////////////// GHM Asset /////////////////////////////
datamask=datamask.select(['2016_gHM']).rename(['gHM'])
var World =  ee.Geometry.Polygon(
          [[[-180, 90],
          [-180, -90],
          [180, -90],
          [180, 90]]], null, false);
          
var proj = datamask.projection().nominalScale().getInfo();


///reprojection
var GHM_2240=reprojection(datamask)
var proj = GHM_2240.projection().nominalScale().getInfo();

///Exportation
Export.image.toAsset({
  image: GHM_2240, 
  description: 'utils/GHM_2240',
  //crs: proj.crs,
  //crsTransform: transform_new,
  scale: proj,
  maxPixels: 1e13,
  region: World
  });

///Importation an vizualisation
var GHM_2240_asset = ee.Image("users/lareb/utils/GHM_2240");
Map.addLayer(GHM_2240_asset,{},'GHM_2240',false);


