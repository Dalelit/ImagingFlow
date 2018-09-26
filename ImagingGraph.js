function onLoadInitialise()
{
    graphCnvs = document.getElementById("graphCanvas");

    let g = new Graph(graphCnvs);
    g.draw();
}

class Graph
{
    constructor(targetCanvas)
    {
        this.canvas = targetCanvas;

        this.xRange = 255;
        this.yRange = 255;

        // pixels moved per step in the range
        this.dx = this.canvas.width / this.xRange;
        this.dy = this.canvas.height / this.yRange;
    }

    calc(x) // return y
    {
        let xx = x / this.xRange;


        // sin v1
        // let yy = Math.sin(xx * Math.PI);

        // sin v2
        // xx  = (xx * 2.0) - 1.0; // change range to -1,1
        // let yy = Math.sin(xx * Math.PI);
        // yy = (yy + 1) / 2;

        // arcsin
        xx  = (xx * 2.0) - 1.0; // change range to -1,1
        let yy = Math.asin(xx); // answer range is -PI/2, PI/2
        yy = (yy + Math.PI / 2.0) / Math.PI; // change answer range to 0,1

        return yy * this.yRange;
    }

    draw()
    {
        console.log('Graph draw');

        let ctx = this.canvas.getContext('2d');

        // move 0,0 to bottom left, and flip y axis to be bottom up... makes it easier
        ctx.translate(0, this.canvas.height);
        ctx.scale(1,-1);

        ctx.beginPath();
        ctx.strokeStyle = 'black';
        ctx.moveTo(0, 0);

        // loop for each value in the range
        for (let x = 0; x <= this.xRange; x++)
        {
            let y = this.calc(x);
            console.log(`Calc f(${x}) = ${y}`);

            ctx.lineTo(x * this.dx, Math.floor(y * this.dy));
        }

        ctx.stroke();
    }
}
