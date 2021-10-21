import os
from PIL import Image
#this script requires PIL package
# current_path is the path where you want to create and save the converted dataset
# source_path is the path where the original dataset is stored 
source_path = ""
current_path = ""


#create the new converted dataset folder
newpath = current_path+'/jpg_converted_dataset' 
if not os.path.exists(newpath):
	os.makedirs(newpath)

for root, dirs, files in os.walk(source_path):
	for folder in dirs:
		print(folder)
		#create converted classes sub-folders
		subfolder_path = newpath+'/'+folder 
		if not os.path.exists(subfolder_path):
			os.makedirs(subfolder_path)
			print(subfolder_path," created")
		original_image_path=source_path+'/'+folder
		print(original_image_path)
		for r, d, f in os.walk(original_image_path):
			for i in f:
				im = Image.open(original_image_path+'/'+i)
				print(original_image_path+'/'+i)
				print("Converting into jpeg the image %s" % i)
				im.thumbnail(im.size)
				i = i.replace('.tif','.jpg')
				print(subfolder_path+'/'+i)
				im.save(subfolder_path+'/'+i, "JPEG", quality=100)
				im.close()