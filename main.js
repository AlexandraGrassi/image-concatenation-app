const canvas = document.getElementById("photosContainer");
const canvasTest = document.getElementById("test");

const ctx = canvas.getContext("2d");
const ctxTest = canvasTest.getContext("2d");

const inputs = Array.from(document.getElementsByTagName("input"));
const images = [];
let temp;

document.addEventListener('DOMContentLoaded',() => {
    canvas.width = 0;
});

inputs.forEach((input, index) => {
    if (input.type === "file") {
        input.onchange = (e) => {
            let files = e.target.files;
            let curImg = new Image();
            images[index] = curImg;
            if (FileReader && files && files.length) {
                const fr = new FileReader();
                fr.readAsDataURL(files[0]);

                fr.onload = () => {
                    curImg.src = fr.result.toString();
                    pushToCanvas(curImg, index);
                    console.log(images);
                };

            }
        };
    }
});

const getAspectRatio = (width, height) => width / height;

const getOffset = (index) => {
    let offset = 0;
    for (let i = 1; i <= index; i++) {
        if (images[i - 1]) {
            offset = offset + images[i - 1].width;
        }
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

        let tempAfter;
        let imgOffset;

        img.height = canvasHeight;
        img.width = canvasHeight * imgAspectRatio;

        imgOffset = getOffset(index);

        if(canvasWidth === 0) {
            canvas.width = img.width;
            canvas.style.border = '2px solid gold';
        } else {
            ctx.clearRect(0,0,canvasWidth, canvasHeight);
            ctx.putImageData(temp, 0, 0);

            if(imgOffset === 0) {
                tempAfter = ctx.getImageData(canvasWidth, 0, -images[index+1].width, canvas.height);
                ctx.clearRect(0,0, canvas.width, canvas.height);
            }

            canvas.width = getImagesWidth();
            ctx.putImageData(temp,0,0);

            if(imgOffset === 0) {
                let imgOffsetAfter = getOffset(index + 1);
                console.log('After change' + imgOffsetAfter);

                canvas.width = getImagesWidth();
                ctx.putImageData(tempAfter, imgOffsetAfter, 0);
                ctxTest.putImageData(tempAfter,0,0);
            }

        }

        ctx.drawImage(img, imgOffset, 0, img.width, img.height);
        temp = ctx.getImageData(0, 0, canvas.width, canvas.height);
    };
}
