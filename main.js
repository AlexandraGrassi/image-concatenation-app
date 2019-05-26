const canvas = document.getElementById("photosContainer");
const ctx = canvas.getContext("2d");
const inputs = Array.from(document.getElementsByTagName("input"));
const images = [];
let pixelRatio;
let temp;

document.addEventListener('DOMContentLoaded',() => {
    canvas.width = 0;
    /*pixelRatio = getPixelRatio();
    ctx.scale(pixelRatio, pixelRatio);
    canvas.style.width = canvas.width * pixelRatio + 'px';
    canvas.style.height = canvas.height * pixelRatio + 'px';*/
});

inputs.forEach((input, index) => {
    if (input.type === "file") {
        input.onchange = (e) => {
            let files = e.target.files;
            let curImg = new Image();
            images[index] = curImg;
            loadImage(files, curImg, index);
        };
    }
});

/*const getPixelRatio = () => {
    let factor = 1;

    // retina display?
    const isRetina = (window.devicePixelRatio > 1);
    // iOS? (-> no auto double)
    const isIOS = ((ctx.webkitBackingStorePixelRatio < 2) || (ctx.webkitBackingStorePixelRatio === undefined));

    if (isRetina && isIOS) {
        factor = 2;
    }
    return factor;
};*/

const getAspectRatio = (width, height) => width / height;

const getOffset = (index, canvasWidth) => {
    let offset = 0;
    for (let i = 1; i <= index; i++) {
        if (images[i - 1]) {
            offset = offset + images[i - 1].width;
        } /*else {
            offset = canvasWidth - images[i].width;
            console.log(offset);
        }*/
    }
    return offset;
};

const getImagesWidth = () => {
    return images.reduce( (accumulator, currentValue) => {
        return accumulator + currentValue.width;
    },0);
};

function pushToCanvas(img, index) {
    img.onload = () => {
        const {width: imgWidth, height: imgHeight} = img;
        const {width: canvasWidth, height: canvasHeight} = canvas;

        const imgAspectRatio = getAspectRatio(imgWidth, imgHeight);

        img.height = canvasHeight;
        img.width = canvasHeight * imgAspectRatio;

        const imgOffset = getOffset(index, canvasWidth);

        if(canvasWidth === 0) {
            canvas.width = img.width;
            canvas.style.border = '2px solid gold';
        } else {
            canvas.width = getImagesWidth();
            console.log(canvas.width);
            ctx.putImageData(temp,0,0);
        }

        ctx.drawImage(img, imgOffset, 0, img.width, img.height);
        temp = ctx.getImageData(0, 0, canvas.width, canvas.height);
    };
}

function loadImage(files, img, index) {
    if (FileReader && files && files.length) {
        const fr = new FileReader();
        fr.readAsDataURL(files[0]);

        fr.onload = () => {
            img.src = fr.result;
            pushToCanvas(img, index);
            console.log(images);
        };

    }
}

