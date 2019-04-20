import shutil

from keras.models import load_model
from keras.preprocessing import image
from keras.preprocessing.image import load_img
from keras.backend import tensorflow_backend
import tensorflow as tf
import numpy as np
import os
import cv2
from PIL import Image

province_model = load_model('./models/province_resnet_model.hdf5')
province_model._make_predict_function()

PROVINCE = (
    "京", "闽", "贵", "琼", "冀", "黑", "豫", "鄂",
    "湘", "赣", "吉", "辽", "粤", "蒙", "宁", "青",
    "鲁", "晋", "陕", "川", "津", "新", "云", "苏",
    "沪", "浙", "皖", "渝", "甘", "桂"
)

letter_model = load_model('./models/letter_resnet_model.hdf5')
letter_model._make_predict_function()

LETTER = (
    "O", "I", "A", "B", "C", "D",
    "E", "F", "G", "H", "J", "K",
    "L", "M", "N", "P", "Q", "R",
    "S", "T", "U", "V", "W", "X",
    "Y", "Z"
)
digit_model = load_model('./models/digit_resnet_model.hdf5')
digit_model._make_predict_function()

DIGIT = (
    "0", "1", "A", "B", "C", "D", "E", "F", "G", "H", "J", "K",
    "2", "L", "M", "N", "P", "Q", "R", "S", "T", "U", "V", "3",
    "W", "X", "Y", "Z", "4", "5", "6", "7", "8", "9"
)

'''
车牌检测，剪切，保存
'''


def find_plate(img):
    watch_cascade = cv2.CascadeClassifier('./cascade.xml')
    # 读取图片
    # image = cv2.imread('./pic_tmp/car_plate.jpg')
    image = img
    resize_h = 1000
    height = image.shape[0]
    scale = image.shape[1] / float(image.shape[0])
    image = cv2.resize(
        image,
        (int(scale * resize_h), resize_h)
    )
    image_gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    watches = watch_cascade.detectMultiScale(
        image_gray,
        1.2, 2,
        minSize=(36, 9),
        maxSize=(36 * 40, 9 * 40)
    )
    # print('检测到车牌数：', len(watches))

    for x, y, w, h in watches:
        cv2.rectangle(
            image,
            (x, y),
            (x + w, y + h),
            (0, 0, 255),
            1
        )

        # 裁剪坐标为[y0:y1, x0:x1]
        cut_img = image[y + 0: y - 0 + h, x + 0: x - 0 + w]
        cut_gray = cv2.cvtColor(cut_img, cv2.COLOR_BGR2GRAY)
        mmm = cv2.resize(
            cut_gray,
            (720, 180)
        )
        # mmm = im.resize(size, Image.ANTIALIAS)
        return mmm
    raise Exception("not found plate")


'''
对剪切后的车牌进行字符拆分保存
'''


def cut_plate(img_gray):

    img_pred = []

    # 1.读取图像，并把图像转为灰度图并显示
    # cv2.imshow('gray', img_gray)  # 显示图片
    # cv2.waitKey(0)

    # 2.将灰度图进行二值化，设定阈值100，转换后 白底黑子===》目标黑底白字
    # 高斯除噪 二值化处理
    blur = cv2.GaussianBlur(
        img_gray,
        (5, 5), 0
    )
    ret3, th3 = cv2.threshold(
        blur, 0, 255,
        cv2.THRESH_BINARY + cv2.THRESH_OTSU
    )
    # cv2.imshow('threshold', th3)
    # cv2.imwrite('./pic_tmp/white_black.jpg', th3)
    # cv2.waitKey(0)

    # 3.分割字符
    white, black = [], []
    height = th3.shape[0]
    width = th3.shape[1]
    white_max, black_max = 0, 0

    # 计算每一列的黑白色像素综合
    for i in range(width):
        s, t = 0, 0  # 这一列白色和黑色的总数
        for j in range(height):
            if th3[j][i] == 255:
                s += 1
            if th3[j][i] == 0:
                t += 1
        white_max = max(white_max, s)
        black_max = max(black_max, t)
        white.append(s)
        black.append(t)
        # print(
        #     str(s) + '---------------' + str(t)
        # )
    # print(
    #     'blackmax---->' + str(black_max) + '----whitemax--->' + str(white_max)
    # )
    arg = False  # false表示白底黑字，true表示黑底白字
    if black_max > white_max:
        arg = True
    n, start, end, temp = 1, 1, 2, 1
    while n < width - 2:
        n += 1
        if (white[n] if arg else black[n]) > (0.05 * white_max if arg else 0.05 * black_max):
            # 以上判断白底黑字或黑底白字
            # 0.05 需要调整，对应上面0.95
            start = n
            end = find_end(
                start, white, black,
                arg, white_max, black_max, width
            )
            n = end
            '''
            车牌框检测分割 二值化处理后 可以看到明显的左右边框
            毕竟用的是网络开放资源 所以车牌框定位角度真的不准，
            所以我在这里截取单个字符时做处理，就当亡羊补牢吧
            思路就是从左开始检测匹配字符，
            若宽度（end - start）小与20则认为是左侧白条 pass掉  继续向右识别，
            否则说明是省份简称，剪切，压缩 保存，
            还有一个当后五位有数字 1 时，他的宽度也是很窄的，
            所以就直接认为是数字 1 不需要再
            做预测了（不然很窄的 1 截切  压缩后宽度是被拉伸的），
            shutil.copy()函数是当检测到这个所谓的 1 时，
            从样本库中拷贝一张 1 的图片给当前temp下标下的字符
            '''

            if end - start > 5:  # 车牌左边白条移除
                # print('end - start' + str(end - start))
                if temp == 1 and end - start < 20:
                    pass
                elif temp > 3 and end - start < 20:
                    # 认为这个字符是数字1
                    img_pred.append('1')
                else:
                    cj = th3[1:height, start:end]
                    cj = cv2.resize(
                        cj,
                        (40,40)
                    )
                    cj = cv2.cvtColor(cj, cv2.COLOR_GRAY2BGR)

                    img_pred.append(cj)
                    temp = temp + 1
    return img_pred


# 分割图像
def find_end(
        start_, white, black, arg,
        white_max, black_max, width
):
    end_ = start_ + 1
    for m in range(start_ + 1, width - 1):
        # 0.95需调整，对应下方0.05
        if (black[m] if arg else white[m]) > \
                (0.95 * black_max if arg else 0.95 * white_max):
            end_ = m
            break
    return end_


'''
车牌号码 省份检测,城市检测，车牌检测
'''


def get_province(img_pred):

    img = img_pred/ 255.0
    img = np.expand_dims(img, axis=0)
    predictions = province_model.predict(img)
    index = np.unravel_index(
        predictions.argmax(),
        predictions.shape
    )
    return PROVINCE[index[1]]

def get_letter(img_pred):

    img = img_pred / 255.0
    img = np.expand_dims(img, axis=0)

    predictions = letter_model.predict(img)
    index = np.unravel_index(
        predictions.argmax(),
        predictions.shape
    )
    return LETTER[index[1]]


def get_digit(img_pred):
    res = []
    for img in img_pred:
        # todo
        if isinstance(img,str):
            res.append(img)
        else:
            img = img / 255.0
            img = np.expand_dims(img, axis=0)

            predictions = digit_model.predict(img)
            index = np.unravel_index(
                predictions.argmax(),
                predictions.shape
            )
            res.append(DIGIT[index[1]])
    return res


def get_plate_from_model(img):
    img = cv2.cvtColor(np.asarray(img), cv2.COLOR_RGB2BGR)
    gray_img = find_plate(img)
    img_pred = cut_plate(gray_img)
    province = get_province(img_pred[0])
    letter = get_letter(img_pred[1])
    digit = get_digit(img_pred[2:7])

    return province + letter + '·' + ''.join(digit)
