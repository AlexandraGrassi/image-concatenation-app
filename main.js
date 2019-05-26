const canvas = document.getElementById("photosContainer");
const ctx = canvas.getContext("2d");

const inputs = Array.from(document.getElementsByTagName("input"));
const images = [];

inputs.forEach( (input, index) => {
    if(input.type === "file") {
        input.onchange = (e) => {
            let files = e.target.files;
            let curImg = new Image();
            images[index] = curImg;
            pushToCanvas(files, curImg, index);
            console.log(images);
        };
    }
});

const getAspectRation = (width, height) => width / height;

const getOffset = (index, canvasWidth) => {
    let offset = 0;
    for(let i = 1; i <= index; i++) {
        if(images[i-1]) {
            offset = offset + images[i-1].width;
        } else {
            offset = canvasWidth - images[i].width;
        }
    }
    return offset;
};

function loadImage(img, index) {
    img.onload = () => {
        const { width: imgWidth, height: imgHeight } = img;
        const { width: canvasWidth, height: canvasHeight } = canvas;

        const aspectRatio = getAspectRation(imgWidth, imgHeight);
        img.width = canvasHeight * aspectRatio;
        img.height = canvasHeight;

        const imgOffset = getOffset(index, canvasWidth);
        ctx.drawImage(img, imgOffset, 0, img.width, img.height);
    };
}

function pushToCanvas(files, img, index) {
    if (FileReader && files && files.length) {
        const fr = new FileReader();
        fr.readAsDataURL(files[0]);

        fr.onload = () => {
            img.src = fr.result;
            loadImage(img, index);
        };
    }
}
