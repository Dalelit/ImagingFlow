function droppedImage(e, imageLoadedCallback)
{
    droppedEvent = e;
    e.preventDefault();

    if (e.dataTransfer.files.length === 0) return;
    // console.log('Dropped. Files length is ' + e.dataTransfer.files.length);

    rdr = new FileReader();
    rdr.onload = function(re) {
        // console.log('reader loaded');
        img = new Image();
        img.onload = function(e) { showImageOnCanvas(img, dropCnvs); if (imageLoadedCallback) imageLoadedCallback(); }
        // img.crossOrigin = 'anonymous';
        img.src = re.target.result;
    }
    rdr.readAsDataURL(e.dataTransfer.files[0]);
}

function showImageOnCanvas(image, canvas)
{
    canvas.width = image.width;
    canvas.height = image.height;
    canvas.getContext('2d').drawImage(image, 0, 0);
}

function appendNewCanvas(node)
{
    cnvs = document.createElement('canvas');
    cnvs.width = 100;
    cnvs.height = 100;
    node.append(cnvs);
    return cnvs;
}
