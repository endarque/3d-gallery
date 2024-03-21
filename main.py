from flask import Flask, render_template, request
import os, pathlib, datetime, base64, random

base_dir = os.path.dirname(__file__)
template_dir = os.path.join(base_dir, 'templates')
app = Flask(__name__, template_folder=template_dir)

@app.route('/')
def main():
    vr_key_1 = 'gallery?num=leo'
    vr_key_2 = 'gallery?num=virgo'
    vr_key_3 = 'gallery?num=northPole'
    vr_key_4 = 'gallery?num=lake'
    vr_key_5 = 'gallery?num=aquarius'
    vr_key_6 = 'gallery?num=libra'
    return render_template('/pages/main_gallery.html', key_1=vr_key_1, key_2=vr_key_2, key_3=vr_key_3,
                           key_4=vr_key_4, key_5=vr_key_5, key_6=vr_key_6)

@app.route('/gallery')
def gallery():
    num = request.args['num']
    vr_key = 'template_' + num
    return render_template('test.html', key=vr_key)

@app.route('/gallery_001')
def gallery_001():
    vr_key = 'gallery_001'
    return render_template('test.html', key=vr_key)

@app.route('/sample_1')
def sample1():
    vr_key = 'sample_1'
    return render_template('test.html', key=vr_key)

@app.route('/sample_2')
def sample2():
    vr_key = 'sample_2'
    return render_template('test.html', key=vr_key)

@app.route('/sample_3')
def sample3():
    vr_key = 'sample_3'
    return render_template('test.html', key=vr_key)


@app.route('/detail')
def detail():
    print(request.args.get('id'))
    id = request.args.get('id')
    key = request.args.get('key')
    path = 'static/vr/vr/xml/vrgallery/sample/' + 'sample1' + '/image/'

    for root, dirs, files in os.walk(path):
        for name in files:
            if pathlib.Path(name).stem == id:
                path += 'jiwon@pabloarts.com-spl-1676953986890_7c295d4e67c6f672c2187c84ff1b7fdf.1060280-1676968304480_shadow'

    title = '내가 생각하는 4원소란? (물, 불, 땅, 공기)'
    year = '2023'
    detail = 'ARTBONBON TEST IMAGE 에 대한 설명입니다. ARTBONBON TEST IMAGE 에 대한 설명입니다. ARTBONBON TEST IMAGE 에 대한 설명입니다. ARTBONBON TEST IMAGE 에 대한 설명입니다. ARTBONBON TEST IMAGE 에 대한 설명입니다.'

    rnd = random.randrange(1, 5)
    if rnd == 1:
        html = '/detail.html'
    elif rnd == 2:
        html = '/detail_2.html'
    elif rnd == 3:
        html = '/detail_3.html'
    else:
        html = '/detail_4.html'

    return render_template(html, img=path, title=title, year=year, detail=detail )

@app.route('/saveImage', methods=['GET', 'POST'])
def saveImage():
    img = request.form['img']
    img = img[img.find('/9'):]
    path = 'static/images/artimages/'
    now = datetime.datetime.now()
    filename = 'img_' + now.strftime("%y%m%d_%H%M%S%f") + '.jpeg'
    with open(os.path.join(path, filename), 'wb') as f:
        f.write(base64.decodebytes(bytes(img, encoding='utf-8')))
    return 'success'

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=80, debug=False)