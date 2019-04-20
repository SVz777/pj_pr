import keras
from keras.layers import Dense, Conv2D, BatchNormalization, Activation
from keras.layers import AveragePooling2D, Input, Flatten
from keras.optimizers import Adam
from keras.regularizers import l2
from keras import backend as K
from keras.models import Model
from keras.datasets import cifar10
from keras.callbacks import ModelCheckpoint, LearningRateScheduler
from keras.callbacks import ReduceLROnPlateau
from keras.preprocessing.image import ImageDataGenerator
import numpy as np
import os

train_dir = './train_images/training-set/letters'
validation_dir = './train_images/validation-set/letters'

train_datagen = ImageDataGenerator(
    rescale=1. / 255,
    shear_range=0.2,
    zoom_range=0.2,
    rotation_range=40,
    horizontal_flip=True,
    fill_mode='nearest'
)

validation_datagen = ImageDataGenerator(
    rescale=1. / 255
)

train_generator = train_datagen.flow_from_directory(
    train_dir,
    target_size=(40, 40),
    batch_size=32,
    class_mode='categorical'
)

validation_generator = validation_datagen.flow_from_directory(
    validation_dir,
    target_size=(40, 40),
    batch_size=32,
    class_mode='categorical'
)

# ResNet模块
def resnet_block(
        inputs, num_filters=16,
        kernel_size=3, strides=1,
        activation='relu'
):
    x = Conv2D(
        num_filters, kernel_size=kernel_size, strides=strides,
        padding='same', kernel_initializer='he_normal',
        kernel_regularizer=l2(1e-4)
    )(inputs)
    x = BatchNormalization()(x)
    if activation:
        x = Activation('relu')(x)
    return x


# 构建一个20层的ResNet网络
def resnet_v1(input_shape):
    inputs = Input(shape=input_shape)  # input层，占位用

    # 第一层
    x = resnet_block(inputs)
    print('layer 1, xshape', x.shape)
    # 2~7层
    for i in range(6):
        a = resnet_block(inputs=x)
        b = resnet_block(inputs=a, activation=None)
        x = keras.layers.add([x, b])
        x = Activation('relu')(x)
    # out: 32*32*16 40*40*16

    # 8~13层
    for i in range(6):
        if i == 0:
            a = resnet_block(inputs=x, strides=2, num_filters=32)
        else:
            a = resnet_block(inputs=x, num_filters=32)
        b = resnet_block(inputs=a, activation=None, num_filters=32)
        if i == 0:
            x = Conv2D(
                32, kernel_size=3, strides=2, padding='same',
                kernel_initializer='he_normal',
                kernel_regularizer=l2(1e-4)
            )(x)
            x = keras.layers.add([x, b])
            x = Activation('relu')(x)
    # out: 16*16*32 20*20*32

    # 14~19
    for i in range(6):
        if i == 0:
            a = resnet_block(inputs=x, strides=2, num_filters=64)
        else:
            a = resnet_block(inputs=x, num_filters=64)
        b = resnet_block(inputs=a, activation=None, num_filters=64)
        if i == 0:
            x = Conv2D(
                64, kernel_size=3, strides=2, padding='same',
                kernel_initializer='he_normal',
                kernel_regularizer=l2(1e-4)
            )(x)
        x = keras.layers.add([x, b])  # 相加操作，要求x,b的shape一样
        x = Activation('relu')(x)
    # out: 8*8*64 10*10*64

    # 20
    x = AveragePooling2D(pool_size=2)(x)
    # out:4*4*64 5*5*64

    y = Flatten()(x)
    # out: 1024 1600
    outputs = Dense(
        26, activation='softmax',
        kernel_initializer='he_normal'
    )(y)

    # 初始化模型
    # 之前的操作只是将多个神经网络进行了项链，通过下面这一句的初始化操作
    # 才算是正则完成了一个模型的结构初始化
    model = Model(inputs=inputs, outputs=outputs)
    return model

model = resnet_v1((40, 40, 3))
print(model)

model.compile(
    loss='categorical_crossentropy',
    optimizer=Adam(),
    metrics=['accuracy']
)

model.summary()

checkpoint = ModelCheckpoint(
    filepath='./letter_resnet_model.hdf5', monitor='val_acc',
    verbose=1, save_best_only=True
)

def lr_sch(epoch):
    # 200 total
    if epoch < 50:
        return 1e-3
    if 50 <= epoch <= 100:
        return 1e-4
    if epoch >= 100:
        return 1e-5

lr_scheduler = LearningRateScheduler(lr_sch)
lr_reducer = ReduceLROnPlateau(
    monitor='val_acc', factor=0.2, patience=5,
    mode='max', min_lr=1e-3
)
callbacks = [checkpoint, lr_scheduler, lr_reducer]

model.fit_generator(
    train_generator,
    epochs=200,
    verbose=1,
    validation_data=validation_generator,
    validation_steps=200,
    callbacks=callbacks
)



