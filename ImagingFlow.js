///////////////////////
// To Do's
//
// - no checking that filter dimensions are odd numbers

function onLoadInitialise()
{
    configDiv = document.getElementById("configArea");
    displayDiv = document.getElementById("displayArea");
    dropCnvs = document.getElementById("dropCanvas");

    dropCnvs = document.getElementById("dropCanvas");
    dropCnvs.ondragover = function(e) {e.preventDefault();};
    dropCnvs.ondrop = droppedImage;

    tgtCnvs1 = appendNewCanvas(displayDiv);
    addButtons(dropCnvs, tgtCnvs1);

    tgtCnvs2 = appendNewCanvas(displayDiv);
    addButtons(tgtCnvs1, tgtCnvs2);

    tgtCnvs3 = appendNewCanvas(displayDiv);
    addButtons(tgtCnvs2, tgtCnvs3);

    tgtCnvs4 = appendNewCanvas(displayDiv);
    addButtons(tgtCnvs3, tgtCnvs4);
}

function addButtons(src, tgt)
{
    appendButton(displayDiv, 'Copy', function() {applyFilter(src, tgt, new copyFilter());} );
    appendButton(displayDiv, '3x3 Blur', function() {applyFilter(src, tgt, new flatFilter(3,3));} );
    appendButton(displayDiv, 'Gaussian', function() {applyFilter(src, tgt, new gaussianFilter());} );
    appendButton(displayDiv, 'Sharpening', function() {applyFilter(src, tgt, new sharpeningFilter());} );
    appendButton(displayDiv, 'Laplacian', function() {applyFilter(src, tgt, new laplacianFilter());} );
    appendButton(displayDiv, 'Vert', function() {applyFilter(src, tgt, new vertFilter());} );
    appendButton(displayDiv, 'Hori', function() {applyFilter(src, tgt, new horiFilter());} );
    appendButton(displayDiv, 'Edge', function() {applyFilter(src, tgt, new edgeFilter());} );
    appendButton(displayDiv, 'Neg', function() {applyFilter(src, tgt, new negativeFilter());} );
    appendButton(displayDiv, 'BW', function() {applyFilter(src, tgt, new bwFilter());} );
    appendButton(displayDiv, 'BWLum', function() {applyFilter(src, tgt, new bwLumFilter());} );
    appendButton(displayDiv, 'GC', function() {applyFilter(src, tgt, new gammaFilter(1.0/2.2));} );
    appendButton(displayDiv, 'GR', function() {applyFilter(src, tgt, new gammaFilter(2.2));} );
    appendButton(displayDiv, 'BWGC', function() {applyFilter(src, tgt, new bwGammaFilter(1.0/2.2));} );
    appendButton(displayDiv, 'BWGR', function() {applyFilter(src, tgt, new bwGammaFilter(2.2));} );
    appendButton(displayDiv, 'Cull 25', function() {applyFilter(src, tgt, new cullFilter(25));} );
    appendButton(displayDiv, 'experiment', function() {applyFilter(src, tgt, new experimentFilter());} );
}

function appendNewCanvas(node)
{
    cnvs = document.createElement('canvas');
    cnvs.width = 100;
    cnvs.height = 100;
    node.append(cnvs);
    return cnvs;
}

function appendButton(node, name, func)
{
    btn = document.createElement('input');
    btn.type = 'button';
    btn.value = name;
    btn.name = name;
    btn.onclick = function() {console.log('Starting '+name); func(); console.log('Done.')};
    node.append(btn);
    node.append(document.createElement('br'));
}

class baseFilter
{
    constructor()
    {
        this.data = [1];
        this.columns = 1;
        this.rows = 1;
    }

    xOffset()
    {
        return (this.columns - 1) / 2;
    }

    yOffset()
    {
        return (this.rows - 1) / 2;
    }

    apply(imgData, imgX, imgY)
    {
        // console.log("In filter at " + imgX + ", " + imgY);
        let r = 0;
        let g = 0;
        let b = 0;
        let a = 255;

        let srcIndxStart = (imgY * imgData.width + imgX) * 4; // get the source index
        srcIndxStart -= (this.yOffset() * imgData.width * 4); // offset the start by half the number of rows in the filter
        srcIndxStart -= (this.xOffset() * 4); // offset the start by half the number of columns in the fitler

        let filterIndx = 0;

        for (let y = 0; y < this.rows; y++)
        {
            let srcIndx = srcIndxStart + (y * imgData.width * 4);
            for (let x = 0; x < this.columns; x++)
            {
                r += this.data[filterIndx] * imgData.data[srcIndx++];
                g += this.data[filterIndx] * imgData.data[srcIndx++];
                b += this.data[filterIndx] * imgData.data[srcIndx++];
                srcIndx++; // skip alpha

                filterIndx++;
            }
        }        

        return [r,g,b,a];
    }

    normalize()
    {
        let sum = 0;
        for (let i = 0; i < this.data.length; i++) sum += this.data[i];
        for (let i = 0; i < this.data.length; i++) this.data[i] /= sum;
    }

    consolePrint()
    {
        console.log(`Dimensions ${this.columns}x${this.rows}`);
        console.log('Data ' + this.data);

        let sum = 0;
        for (let i = 0; i < this.data.length; i++) sum += this.data[i];
        console.log('Sum ' + sum);
    }
}

class copyFilter extends baseFilter
{
    apply(imgData, imgX, imgY)
    {
        // To Do - could be more efficient and not run the filter
        return super.apply(imgData, imgX, imgY);
    }
}

class negativeFilter extends baseFilter
{
    constructor(columns, rows)
    {
        super();
    }

    apply(imgData, imgX, imgY)
    {
        // To Do - could be more efficient and not run the filter
        let result = super.apply(imgData, imgX, imgY);

        result[0] = 255 - result[0];
        result[1] = 255 - result[1];
        result[2] = 255 - result[2];
        result[3] = 255;

        return result;
    }
}

class bwFilter extends baseFilter
{
    constructor()
    {
        super();
    }

    apply(imgData, imgX, imgY)
    {
        // To Do - could be more efficient and not run the filter
        let result = super.apply(imgData, imgX, imgY);

        result[0] = (result[0] + result[1] + result[2]) / 3;
        result[1] = result[0];
        result[2] = result[0];
        result[3] = 255;

        return result;
    }
}

class bwLumFilter extends baseFilter
{
    constructor()
    {
        super();
    }

    apply(imgData, imgX, imgY)
    {
        // To Do - could be more efficient and not run the filter
        let result = super.apply(imgData, imgX, imgY);

        result[0] = 0.3 * result[0] + 0.59 * result[1] + 0.11 * result[2];
        result[1] = result[0];
        result[2] = result[0];
        result[3] = 255;

        return result;
    }
}

class bwGammaFilter extends baseFilter
{
    // use 1.0/2.2 for gamma correction
    // use 2.2 for gamma reverse
    constructor(gammaValue)
    {
        super();
        this.gcResolution = 1000000;
        this.gcArray = new Array(this.gcResolution);
        
        // pre compute gamma conversions for performance
        let power = gammaValue;
        let delta = 1 / this.gcResolution;
        let val = 0.0;
        for (let i = 0; i < this.gcResolution; i++)
        {
            this.gcArray[i] = Math.pow(val, power) * 255;
            val += delta;
        }
    }

    apply(imgData, imgX, imgY)
    {
        // To Do - could be more efficient and not run the filter
        let result = super.apply(imgData, imgX, imgY);

        let gcVal = (result[0] + result[1] + result[2]) / 765.0; // 765 = 3 * 255.... should now be a number between 0..1
        result[0] = this.gcArray[ Math.floor(gcVal * this.gcResolution) ]; // already pre-calc-ed at 0-255
        result[1] = result[0];
        result[2] = result[0];
        result[3] = 255;

        return result;
    }

}

class gammaFilter extends baseFilter
{
    // use 1.0/2.2 for gamma correction
    // use 2.2 for gamma reverse
    constructor(gammaValue)
    {
        super();
        this.gcResolution = 256;
        this.gcArray = new Array(this.gcResolution);
        
        // pre compute gamma conversions for performance
        let power = gammaValue;
        let delta = 1 / this.gcResolution;
        let val = 0.0;
        for (let i = 0; i < this.gcResolution; i++)
        {
            this.gcArray[i] = Math.pow(val, power) * 256;
            val += delta;
        }
    }

    apply(imgData, imgX, imgY)
    {
        // To Do - could be more efficient and not run the filter
        let result = super.apply(imgData, imgX, imgY);

        result[0] = this.gcArray[ result[0] ]; // already pre-calc-ed at 0-255
        result[1] = this.gcArray[ result[1] ];
        result[2] = this.gcArray[ result[2] ];
        result[3] = 255;

        return result;
    }

}

class cullFilter extends baseFilter
{
    constructor(limit)
    {
        super();
        this.limit = limit;
    }

    apply(imgData, imgX, imgY)
    {
        // To Do - could be more efficient and not run the filter
        let result = super.apply(imgData, imgX, imgY);

        if (result[0] < this.limit) result[0] = 0;
        if (result[1] < this.limit) result[1] = 0;
        if (result[2] < this.limit) result[2] = 0;
        result[3] = 255;

        return result;
    }
}

class flatFilter extends baseFilter
{
    constructor(columns, rows)
    {
        super();
        this.data = [];
        this.columns = columns;
        this.rows = rows;

        let numValues = this.columns * this.rows;
        let filterValue = 1 / (numValues);

        while (numValues > 0)
        {
            this.data[--numValues] = filterValue;
        }
    }
}

class sharpeningFilter extends baseFilter
{
    constructor()
    {
        super();
        this.data = [-0.17, -0.67, -0.17,
                     -0.67,  4.33, -0.67,
                     -0.17, -0.67, -0.17];
        this.columns = 3;
        this.rows = 3;

        this.consolePrint();
    }
}

class laplacianFilter extends baseFilter
{
    constructor()
    {
        super();
        this.data = [-0.17, -0.67, -0.17,
                     -0.67,  3.33, -0.67,
                     -0.17, -0.67, -0.17];
        this.columns = 3;
        this.rows = 3;

        this.consolePrint();
    }
}

class gaussianFilter extends baseFilter
{
    constructor()
    {
        super();
        this.data = [0.01, 0.08, 0.01,
                     0.08, 0.62, 0.08,
                     0.01, 0.08, 0.01];
        this.columns = 3;
        this.rows = 3;

        this.consolePrint();
    }
}

class vertFilter extends baseFilter
{
    constructor()
    {
        super();
        this.data = [-1,0,1,
                     -2,0,2,
                     -1,0,1];
        this.columns = 3;
        this.rows = 3;
    }

    apply(imgData, imgX, imgY)
    {
        let result = super.apply(imgData, imgX, imgY);

        result[0] = Math.abs(result[0]);
        result[1] = Math.abs(result[1]);
        result[2] = Math.abs(result[2]);

        return result;
    }
}

class horiFilter extends vertFilter
{
    constructor()
    {
        super();
        this.data = [-1,-2,-1,
                      0, 0, 0,
                      1, 2, 1];
        this.columns = 3;
        this.rows = 3;
    }
}

class edgeFilter extends baseFilter
{
    constructor()
    {
        super();
        this.columns = 3;
        this.rows = 3;
        this.vert = new vertFilter();
        this.hori = new horiFilter();
    }

    apply(imgData, imgX, imgY)
    {
        let hresult = this.hori.apply(imgData, imgX, imgY);
        let vresult = this.vert.apply(imgData, imgX, imgY);

        let result = [0,0,0,0];
        result[0] = Math.sqrt((hresult[0]*hresult[0] + vresult[0]*vresult[0]));
        result[1] = Math.sqrt((hresult[1]*hresult[1] + vresult[1]*vresult[1]));
        result[2] = Math.sqrt((hresult[2]*hresult[2] + vresult[2]*vresult[2]));
        result[3] = 255;

        return result;
    }
}

class experimentFilter extends vertFilter
{
    constructor()
    {
        super();
        this.data = [-1, -1, -1, -1, -1
                     -1,  1,  1,  1, -1
                     -1,  1,  2,  1, -1
                     -1,  1,  1,  1, -1
                     -1, -1, -1, -1, -1];
        this.columns = 5;
        this.rows = 5;
        this.normalize();
    }
}


function applyFilter(srcCanvas, tgtCanvas, filter)
{
    srcImgData = srcCanvas.getContext('2d').getImageData(0, 0, srcCanvas.width, srcCanvas.height);

    tgtImgData = new ImageData(srcImgData.width - (2 * filter.xOffset()), srcImgData.height - (2 * filter.yOffset()));

    tgtIndx = 0;

    y = filter.yOffset();
    while (y < srcImgData.height - filter.yOffset())
    {
        x = filter.xOffset();
        while (x < srcImgData.width - filter.xOffset())
        {
            newPixel = filter.apply(srcImgData, x, y);

            i = 0;
            tgtImgData.data[tgtIndx++] = newPixel[i++];
            tgtImgData.data[tgtIndx++] = newPixel[i++];
            tgtImgData.data[tgtIndx++] = newPixel[i++];
            tgtImgData.data[tgtIndx++] = newPixel[i++];

            x++;
        }
        y++;
    }

    tgtCanvas.width = tgtImgData.width;
    tgtCanvas.height = tgtImgData.height;
    tgtCanvas.getContext('2d').putImageData(tgtImgData, 0, 0);
}

