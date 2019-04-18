import os
import sys
import cv2

input_dir, output_dir = './pr_data', './out_pr'

width, height = 32, 40

def mkdir(path):
    if not os.path.exists(path):
        os.makedirs(path)

index = 1
for (path, dirnames, filenames) in os.walk(input_dir):
    for filename in filenames:
        if filename.endswith('.png') or filename.endswith('.bmp'):
            print('正在处理第 %s 张图片' % index)
            img_path = path + '/' + filename
            img = cv2.imread(img_path)
            new_img = cv2.resize(img, (width, height))
            img_gray = cv2.cvtColor(new_img, cv2.COLOR_BGR2GRAY)  # 转换灰度化
            # 高斯除噪，二值化
            # blur = cv2.GaussianBlur(img_gray, (5, 5), 0)
            # ret, out_img = cv2.threshold(blur, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
            out_img = img_gray

            output_dir_tmp = output_dir
            output_dir_tmp += path[1:]
            mkdir(output_dir_tmp)

            out_dir = output_dir_tmp + '/' + str(index) + '.bmp'
            cv2.imwrite(out_dir, out_img)
            index += 1
            key = cv2.waitKey(10) & 0xff
            if key == 27:
                sys.exit(0)



