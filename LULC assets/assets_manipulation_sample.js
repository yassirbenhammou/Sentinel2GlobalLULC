// Import an example of a final reprojected map asset 
var Map = ee.Image("users/ebenhammou/reprojected2/Barren_2240m");
Map.addLayer(Map.unmask(0), {min:0,max:1}, "imported Map", false);