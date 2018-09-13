function onLoadInitialise()
{
    displayDiv = document.getElementById("displayArea");
    dropCnvs = document.getElementById("dropCanvas");

    dropCnvs = document.getElementById("dropCanvas");
    dropCnvs.ondragover = function(e) {e.preventDefault();};
    dropCnvs.ondrop = function(e) { droppedImage(e, showHistogram); };

}

function showHistogram()
{
    console.log('Show histogram');

    hs = new histogram(dropCnvs, appendNewCanvas(displayDiv));

    hs.analysis();
    hs.draw();
}


class histogram
{
    constructor(imageCanvas, targetCanvas)
    {
        this.imageCanvas = imageCanvas;
        this.outputCanvas = targetCanvas;
        this.width = 256 * 2;
        this.height = 256;
        this.xscale = this.width / 256;

        this.outputCanvas.width = this.width;
        this.outputCanvas.height = this.height;
    }

    analysis()
    {
        console.log('Historgram analysis');

        var imgData = this.imageCanvas.getContext('2d').getImageData(0, 0, this.imageCanvas.width, this.imageCanvas.height);

        this.red = new Array(256);
        this.green = new Array(256);
        this.blue = new Array(256);

        var i = 0;
        for (i = 0; i < 256; i++) this.red[i] = 0;
        for (i = 0; i < 256; i++) this.green[i] = 0;
        for (i = 0; i < 256; i++) this.blue[i] = 0;

        this.redMax = 0;
        this.greenMax = 0;
        this.blueMax = 0;

        i = 0;
        while (i < imgData.data.length)
        {
            var value = imgData.data[i];
            this.red[value] += 1;
            if (this.red[value] > this.redMax) this.redMax = this.red[value];
            i++;

            var value = imgData.data[i];
            this.green[value] += 1;
            if (this.green[value] > this.greenMax) this.greenMax = this.green[value];
            i++;

            var value = imgData.data[i];
            this.blue[value] += 1;
            if (this.blue[value] > this.blueMax) this.blueMax = this.blue[value];
            i++;

            i++; // alpha ignore
        }

        this.log();
    }

    log()
    {
        console.log('Red. Max ' + this.redMax);
        console.log(this.red);
        console.log('Green. Max ' + this.greenMax);
        console.log(this.green);
        console.log('Blue. Max ' + this.blueMax);
        console.log(this.blue);
    }

    draw()
    {
        console.log('Historgram draw');

        // work out the height scale
        let maxValue = this.redMax;
        if (this.greenMax > maxValue) maxValue = this.greenMax;
        if (this.blueMax > maxValue) maxValue = this.blueMax;

        if (maxValue > 1000) maxValue = 1000;

        let yscale = this.height / maxValue;

        console.log('canvas ' + this.outputCanvas.width);
        let ctx = this.outputCanvas.getContext('2d');
        console.log('tgt ctx ' + ctx.width);

        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, this.outputCanvas.width, this.outputCanvas.height);

        // move 0,0 to bottom left, and flip y axis to be bottom up
        ctx.translate(0, this.outputCanvas.height);
        ctx.scale(1,-1);

        ctx.globalAlpha = 0.33;

        // // draw red
        ctx.fillStyle = 'red';
        var x = 0;
        for (var i = 0; i < 256; i++)
        {
            ctx.fillRect(x, 0, this.xscale, this.red[i]*yscale);
            x += this.xscale;
        }

        // // draw green
        ctx.fillStyle = 'green';
        var x = 0;
        for (var i = 0; i < 256; i++)
        {
            ctx.fillRect(x, 0, this.xscale, this.green[i]*yscale);
            x += this.xscale;
        }

        // // draw blue
        ctx.fillStyle = 'blue';
        var x = 0;
        for (var i = 0; i < 256; i++)
        {
            ctx.fillRect(x, 0, this.xscale, this.blue[i]*yscale);
            x += this.xscale;
        }
    }
}

