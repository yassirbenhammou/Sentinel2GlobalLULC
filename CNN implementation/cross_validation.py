# coding=utf-8
# Script para realizar validación cruzada dada una estructura de carpetas
# con tantas particiones como folds se quieran realizar en la validación cruzada.

from __future__ import division
from __future__ import print_function
import os
import argparse
import sys
from transferLearning import *
from keras import backend as K

from numpy.random import seed
seed(31415)
from tensorflow import set_random_seed
set_random_seed(24142)

ARGS = None

def CV(image_dir, imgs_rows, imgs_cols, batch_size, epochs, model, folds,
        output_file, random_shift, horizontal_flip, random_zoom,
        random_rotation, save_model, save_file):
    f = open(output_file, 'a')
    accuracies = []

    for fold in range(folds):
        path_to_partition = image_dir + "/partition" + str(fold)
        save_file = save_file + 'partition' + str(fold) + '.h5'

        acc = transferLearning(path_to_partition, imgs_rows, imgs_cols,
                                batch_size, epochs, model, random_shift,
                                horizontal_flip, random_zoom, random_rotation)
        K.clear_session()

        print("Fold " + str(fold), file = f)
        print("Batch size " + str(batch_size), file = f)
        print("Epochs " + str(epochs), file = f)
        print(acc, file = f)
        accuracies.append(acc)

    return sum(accuracies)/len(accuracies)


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
        default = 224,
        help = "Number of rows in images, after reshape"
    )
    parser.add_argument(
        '--imgs_cols',
        type = int,
        default = 224,
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
        '--output_file',
        type = str,
        default = 'output_file.txt',
        help = "Name of the output file to print the accuracies"
    )
    parser.add_argument(
        '--folds',
        type = int,
        default = 5,
        help = "Number of folds for cross validation"
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
    parser.add_argument(
        '--save_model',
        default = False,
        help = "Whether to save the model.",
        action = 'store_true'
    )
    parser.add_argument(
        '--save_file',
        type = str,
        default = 'model',
        help = "Name of the file in which to save the model."
    )
    ARGS, unparsed = parser.parse_known_args()

    if ARGS.model != 'resnet152' and ARGS.model != 'densenet161' and ARGS.model != 'densenet121' and ARGS.model != 'resnet50' and ARGS.model != 'inception':
        print("model must be 'resnet50', 'resnet152', 'densenet161', 'densenet121' or 'inception'.")
        sys.exit(1)

    acc = CV(ARGS.image_dir, ARGS.imgs_rows, ARGS.imgs_cols, ARGS.batch_size,
                ARGS.epochs, ARGS.model, ARGS.folds, ARGS.output_file,
                ARGS.random_shift, ARGS.horizontal_flip, ARGS.random_zoom,
                ARGS.random_rotation, ARGS.save_model, ARGS.save_file)

    print(acc)
