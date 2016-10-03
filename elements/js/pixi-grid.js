/*
    Draw pixels in the grid and then copy the generated CSS to create a single div piece of pixel art.

    TODO:
    - make pretty
    - add generate button and sort box-shadows (and remove the live updating CSS..)
*/

(function() {
    Polymer({
        red: 100,
        green: 250,
        blue: 100,
        alpha: 1,
        gridSizeX: 24,
        gridSizeY: 12,
        pixelSize: 15,
        mode: "pen",
        mousedown: false,
        pixelSizeChanged: function() {
            this.reset();
        },
        gridSizeXChanged: function() {
            this.reset();
        },
        gridSizeYChanged: function() {
            this.reset();
        },
        created: function() {
            this.options = ["pen", "eraser", "sample", "bucket"];
        },
        down: function(event, detail, sender) {
            this.mousedown = true;
            var that = this;
            document.addEventListener("mouseup", function() {
                that.mousedown = false;
            });
            if(this.mode === "sample") {
                console.log(sender.style.background);
            } else if(this.mode === "bucket") {
                var pixels = Array.prototype.slice.call(this.shadowRoot.querySelectorAll(".pixel"));
                pixels.forEach(function(pixel){
                    this.draw(event, detail, pixel);
                }, this);
            } else {
                this.draw(event, detail, sender);
            }
        },
        draw: function(event, detail, sender) {
            if (this.mousedown) {
                var pixel = sender;
                if (this.mode === "pen" || this.mode === "bucket") {
                    pixel.style.backgroundColor = this.selectedColor();
                    if (!pixel.cssRow) {
                        pixel.cssRow = document.createElement("span");
                    }
                    var x = (parseInt(pixel.dataset.x, 10) + 1) + "em",
                        y = (parseInt(pixel.dataset.y, 10) + 1) + "em";

                    if (this.$.result.childNodes.length === 0 || this.$.result.firstChild === pixel.cssRow) {
                        pixel.cssRow.innerHTML = x + " " + y + " " + this.selectedColor();
                        this.$.result.insertBefore(pixel.cssRow, this.$.result.firstChild);
                    } else {
                        pixel.cssRow.innerHTML = ", " + x + " " + y + " " + this.selectedColor();
                        this.$.result.appendChild(pixel.cssRow);
                    }
                } else {
                    if (pixel.cssRow) {
                        pixel.style.backgroundColor = "rgba(0, 0, 0, 0)";
                        try{
                            this.$.result.removeChild(pixel.cssRow);
                        } catch(e) {}
                    }
                }
            }
        },
        reset: function() {
            var result = this.$.result,
                length = result.childNodes.length;
            for(var i = length - 1; i >= 0; i--) {
                result.removeChild(result.childNodes[i]);
            }
            this.ready();
        },
        ready: function init() {
            this.pixels = [];
            //setup grid container
            this.$.grid.style.width = this.$.grid.style.minWidth = this.$.grid.style.maxWidth = (this.gridSizeX * this.pixelSize + (this.gridSizeX * 2)) + "px";
            this.$.grid.style.height = this.$.grid.style.minHeight = this.$.grid.style.maxHeight = (this.gridSizeY * this.pixelSize + (this.gridSizeY * 2)) + "px";

            var pixel;
            for (var i = 0; i < this.gridSizeY; i++) {
                row = [];
                for (var j = 0; j < this.gridSizeX; j++) {
                    pixel = {x: j, y: i};
                    row.push(pixel);
                }
                this.pixels.push(row);
            }
        },
        selectedColor: function() {
            return "rgba(" + this.red + ", " + this.green + ", " + this.blue + ", " + this.alpha + ")";
        }
    });
})();
