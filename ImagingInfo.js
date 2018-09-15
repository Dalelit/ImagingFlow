/////////////////////////////////////////////////////////////////
//
// To Do
// - test and work out the best way to scale the histogram height
// - have the image stored separately to be used, so big pictures can be scaled down on a canvas to fit the screen
// - run the gamma reversal on image first?

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
        this.white = new Array(256);

        var i = 0;
        for (i = 0; i < 256; i++) this.red[i] = 0;
        for (i = 0; i < 256; i++) this.green[i] = 0;
        for (i = 0; i < 256; i++) this.blue[i] = 0;
        for (i = 0; i < 256; i++) this.white[i] = 0;

        i = 0;
        while (i < imgData.data.length)
        {
            var value = imgData.data[i];
            var white = value;
            this.red[value] += 1;
            i++;

            value = imgData.data[i];
            white += value;
            this.green[value] += 1;
            i++;

            value = imgData.data[i];
            white += value;
            this.blue[value] += 1;
            i++;

            i++; // alpha ignore

            this.white[Math.floor(white / 3)] += 1;
        }

        // convert them to percentage of total number of pixels
        let pixCount = imgData.data.length / 4;
        for (i = 0; i < 256; i++) this.red[i] /= pixCount;
        for (i = 0; i < 256; i++) this.green[i] /= pixCount;
        for (i = 0; i < 256; i++) this.blue[i] /= pixCount;
        for (i = 0; i < 256; i++) this.white[i] /= pixCount;

        // this.log();
    }

    log()
    {
        console.log('Red');
        console.log(this.red);
        console.log('Green');
        console.log(this.green);
        console.log('Blue');
        console.log(this.blue);
    }

    draw()
    {
        console.log('Historgram draw');

        // Work out the y scale.
        // Ignore the ends of the scale (full black or white) when finding the max value.
        // Need to see if this is the best way?
        let maxValue = 0;
        for (let i = 5; i < 251; i++) if (this.red[i] > maxValue) maxValue = this.red[i];
        for (let i = 5; i < 251; i++) if (this.green[i] > maxValue) maxValue = this.green[i];
        for (let i = 5; i < 251; i++) if (this.blue[i] > maxValue) maxValue = this.blue[i];
        maxValue *= 1.1; // add a little headroom
        let yscale = this.height / maxValue;

        // Get the drawing area and clear it
        let ctx = this.outputCanvas.getContext('2d');
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, this.outputCanvas.width, this.outputCanvas.height);

        // move 0,0 to bottom left, and flip y axis to be bottom up... makes it easier
        ctx.translate(0, this.outputCanvas.height);
        ctx.scale(1,-1);

        ////// draw the fill of each colour
        ctx.globalAlpha = 0.33;

        // draw red
        ctx.fillStyle = 'red';
        var x = 0;
        for (var i = 0; i < 256; i++)
        {
            ctx.fillRect(x, 0, this.xscale, this.red[i]*yscale);
            x += this.xscale;
        }

        // draw green
        ctx.fillStyle = 'green';
        var x = 0;
        for (var i = 0; i < 256; i++)
        {
            ctx.fillRect(x, 0, this.xscale, this.green[i]*yscale);
            x += this.xscale;
        }

        // draw blue
        ctx.fillStyle = 'blue';
        var x = 0;
        for (var i = 0; i < 256; i++)
        {
            ctx.fillRect(x, 0, this.xscale, this.blue[i]*yscale);
            x += this.xscale;
        }

        ////// draw the line across the top
        ctx.globalAlpha = 1;

        // draw red
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

        // draw green
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

        // draw blue
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

        // draw white
        ctx.beginPath();
        ctx.strokeStyle = 'white';
        var x = 0;
        ctx.moveTo(0, this.white[0]*yscale); // start the outline from the first position
        for (var i = 1; i < 256; i++)
        {
            x += this.xscale;
            ctx.lineTo(x, this.white[i]*yscale);
        }
        ctx.stroke();

    }
}

