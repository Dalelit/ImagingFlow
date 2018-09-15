/////////////////////////////////////////////////////////////////
//
// To Do
// - test and work out the best way to scale the histogram height
// - have the image stored separately to be used, so big pictures can be scaled down on a canvas to fit the screen

function onLoadInitialise()
{
    displayDiv = document.getElementById("displayArea");
    dropCnvs = document.getElementById("dropCanvas");

    dropCnvs = document.getElementById("dropCanvas");
    dropCnvs.ondragover = function(e) {e.preventDefault();};
    dropCnvs.ondrop = function(e) { droppedImage(e, showHistogram); };

    hgCanvas = null;
}

function showHistogram()
{
    console.log('Show histogram');

    if (!hgCanvas)
    {
        hgCanvas = appendNewCanvas(displayDiv);
    }
    hs = new histogram(dropCnvs, hgCanvas);

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

        // convert them to percentage of total number of pixels
        let pixCount = imgData.data.length / 4;
        for (i = 0; i < 256; i++) this.red[i] /= pixCount;
        for (i = 0; i < 256; i++) this.green[i] /= pixCount;
        for (i = 0; i < 256; i++) this.blue[i] /= pixCount;
        this.redMax /= pixCount;
        this.greenMax /= pixCount;
        this.blueMax /= pixCount;


        this.redAvg = 0;
        for (let i = 0; i < 256; i++) this.redAvg += this.red[i];
        this.redAvg /= 256;

        this.blueAvg = 0;
        for (let i = 0; i < 256; i++) this.blueAvg += this.green[i];
        this.blueAvg /= 256;

        this.greenAvg = 0;
        for (let i = 0; i < 256; i++) this.greenAvg += this.blue[i];
        this.greenAvg /= 256;

        this.log();
    }

    log()
    {
        console.log('Red');
        console.log(this.red);
        console.log('Green');
        console.log(this.green);
        console.log('Blue');
        console.log(this.blue);

        console.log('Red. Max ' + this.redMax);
        console.log("Red. Avg " + this.redAvg);
        console.log('Green. Max ' + this.greenMax);
        console.log("Green. Avg " + this.greenAvg);
        console.log('Blue. Max ' + this.blueMax);
        console.log("Blue. Avg " + this.blueAvg);

    }

    draw()
    {
        console.log('Historgram draw');

        let maxValue = 0;
        for (let i = 5; i < 251; i++) if (this.red[i] > maxValue) maxValue = this.red[i];
        for (let i = 5; i < 251; i++) if (this.green[i] > maxValue) maxValue = this.green[i];
        for (let i = 5; i < 251; i++) if (this.blue[i] > maxValue) maxValue = this.blue[i];
        maxValue *= 1.1;

        let yscale = this.height / maxValue;

        let ctx = this.outputCanvas.getContext('2d');

        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, this.outputCanvas.width, this.outputCanvas.height);

        // move 0,0 to bottom left, and flip y axis to be bottom up
        ctx.translate(0, this.outputCanvas.height);
        ctx.scale(1,-1);

        ////// draw the fill of each colour
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

        ////// draw the line across the top
        ctx.globalAlpha = 1;

        // // draw red
        ctx.beginPath();
        ctx.strokeStyle = 'red';
        var x = 0;
        ctx.moveTo(0, this.red[0]*yscale); // start the outline from the first position
        for (var i = 1; i < 256; i++)
        {
            x += this.xscale;
            ctx.lineTo(x, this.red[i]*yscale);
        }
        ctx.stroke();

        // // draw green
        ctx.beginPath();
        ctx.strokeStyle = 'green';
        var x = 0;
        ctx.moveTo(0, this.green[0]*yscale); // start the outline from the first position
        for (var i = 1; i < 256; i++)
        {
            x += this.xscale;
            ctx.lineTo(x, this.green[i]*yscale);
        }
        ctx.stroke();

        // // draw blue
        ctx.beginPath();
        ctx.strokeStyle = 'blue';
        var x = 0;
        ctx.moveTo(0, this.blue[0]*yscale); // start the outline from the first position
        for (var i = 1; i < 256; i++)
        {
            x += this.xscale;
            ctx.lineTo(x, this.blue[i]*yscale);
        }
        ctx.stroke();

    }
}

