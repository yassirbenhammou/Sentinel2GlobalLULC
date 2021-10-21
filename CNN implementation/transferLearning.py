# coding=utf-8

from utils import *
import argparse
import os
import sys
from keras.models import Sequential, Model
from keras.layers import Dense, Flatten
from keras.optimizers import SGD, RMSprop
from keras.preprocessing.image import ImageDataGenerator
from keras.models import load_model
from keras.applications.inception_v3 import InceptionV3

ARGS = None

# Función que realiza el transfer learning y devuelve el accuracy obtenido
def transferLearning(image_dir, imgs_rows, imgs_cols, batch_size, epochs,
                        modelT, random_shift, horizontal_flip,
                        random_zoom, random_rotation):
    channel = 3

    classes = next(os.walk(image_dir + '/train'))[1]
    print(classes)

    # Load train
    train, train_labels = loadData(image_dir + '/train', imgs_cols,
                                    imgs_rows, classes)
    # Load test
    test, test_labels = loadData(image_dir + '/test', imgs_cols,
                                    imgs_rows, classes)

    # Definimos el diccionario entre los nombres originales de las classes
    # y los valores enteros que tienen ahora
    #dic = dict(zip(classes, range(len(classes))))

    # Creamos el diccionario con los pesos por clases, según sea RSMAS o EILAT
    # if 'RSMAS' in image_dir:
    #     class_weight = {dic['ACER']: 1., dic['APAL']: 1.42, dic['CNAT']: 1.91,
    #                     dic['DANT']: 1.73, dic['DSTR']: 4.54, dic['GORG']: 1.82,
    #                     dic['MALC']: 4.95, dic['MCAV']: 1.38, dic['MMEA']: 2.02,
    #                     dic['MONT']: 3.89, dic['PALY']: 3.41, dic['SPO']: 1.24,
    #                     dic['SSID']: 2.95, dic['TUNI']: 3.03}
    # else:
    #     class_weight = {dic['A01']: 3.22, dic['A02']: 3.5, dic['A03']: 12.17,
    #                     dic['A04']: 1.75, dic['A05']: 1.4, dic['A06']: 1.3,
    #                     dic['A07']: 1., dic['A08']: 3.64}

    # Load our model
    model = InceptionV3(weights='imagenet', include_top=False, pooling = 'avg')

    # Guardamos el resultado de pasar las imágenes por el modelo entrenado
    # con imagenet sin la última capa
    if (random_shift != 0 or horizontal_flip or random_zoom != 0 or
        random_rotation != 0):
        datagen = ImageDataGenerator(rotation_range = random_rotation,
                                        width_shift_range = random_shift,
                                        height_shift_range = random_shift,
                                        zoom_range = random_zoom,
                                        horizontal_flip = horizontal_flip)

        train, train_labels = performDataAugmentation(train, train_labels,
                                datagen, batch_size, 300, imgs_cols, imgs_rows,
                                len(classes))

    features = getFeatures(model, train, batch_size)
    test_features = getFeatures(model, test, batch_size)

    # Creamos un nuevo modelo, de forma que entrenemos sólo las últimas capas
    new_model = Sequential()
    new_model.add(Dense(512, input_shape = features.shape[1:],
                        activation = 'relu'))
    new_model.add(Dense(len(classes), activation='softmax'))

    opt = SGD(lr=1e-3, decay=1e-6, momentum=0.9, nesterov=True)
    new_model.compile(optimizer=opt, loss='categorical_crossentropy',
                        metrics=['accuracy'])
    new_model.fit(features, train_labels, epochs = epochs,
                    batch_size = batch_size)#, class_weight = class_weight)

    # Make predictions
    predictions = new_model.predict(test_features, batch_size = batch_size,
                                        verbose = 1)

    # Calculate accuracy
    acc = getAccuracy(test_labels, predictions)

    return acc

if __name__ == '__main__':

    parser = argparse.ArgumentParser()
    parser.add_argument(
        '--image_dir',
        type = str,
        default = '',
        help = "Path to folders of labeled images."
    )
    parser.add_argument(
        '--imgs_rows',
        type = int,
        default = 299,
        help = "Number of rows in images, after reshape"
    )
    parser.add_argument(
        '--imgs_cols',
        type = int,
        default = 299,
        help = "Number of cols in images, after reshape"
    )
    parser.add_argument(
        '--batch_size',
        type = int,
        default = 8,
        help = "Batch size"
    )
    parser.add_argument(
        '--epochs',
        type = int,
        default = 10,
        help = "Number of epochs to train"
    )
    parser.add_argument(
        '--model',
        type = str,
        default = 'inception',
        help = "Model to use. It must be 'inception', 'resnet50', 'resnet152', 'densenet161' or 'densenet121'."
    )
    parser.add_argument(
        '--random_shift',
        type = float,
        default = 0,
        help = "Range for random vertical and horizontal shifts."
    )
    parser.add_argument(
        '--horizontal_flip',
        default = False,
        help = "Whether to randomly flip images horizontally",
        action = 'store_true'
    )
    parser.add_argument(
        '--random_zoom',
        type = float,
        default = 0,
        help = "Range for random zoom."
    )
    parser.add_argument(
        '--random_rotation',
        type = int,
        default = 0,
        help = "Degree range for random rotations."
    )
    ARGS, unparsed = parser.parse_known_args()

    if ARGS.model != 'resnet152' and ARGS.model != 'densenet161' and ARGS.model != 'densenet121' and ARGS.model != 'resnet50' and ARGS.model != 'inception':
        print("model must be 'resnet50', 'resnet152', 'densenet161', 'densenet121' or 'inception'.")
        sys.exit(1)

    acc = transferLearning(ARGS.image_dir, ARGS.imgs_rows, ARGS.imgs_cols,
                            ARGS.batch_size, ARGS.epochs, ARGS.model,
                            ARGS.random_shift, ARGS.horizontal_flip,
                            ARGS.random_zoom, ARGS.random_rotation)
    print(acc)
