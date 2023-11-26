class Terminal {
    constructor(selector) {
        this.element = document.querySelector(selector);
        this.reserve_carrige = false;

        this.element.onwheel = (e) => { 
            e.preventDefault();
            if (terminal.scrollHeight > terminal.clientHeight) {
                terminal.scrollTop += e.deltaY;
            }
        };
        this.last_scroll_height = 0;
        this.last_scroll_check_bottom = true;
    }

    _bottom_check() {
        this.last_scroll_height = this.scrollHeight;
        this.last_scroll_check_bottom = this.element.scrollHeight - this.element.scrollTop === this.element.clientHeight;
    }

    _to_bottom() {
        if (this.last_scroll_check_bottom) {
            let height_delta = this.element.scrollHeight - this.last_scroll_height;
            this.element.scrollTop += height_delta;
        }
    }

    add(contents) {
        switch (contents["type"]){
            case "none":
                break;
            case "stdout":
                this._split_and_add(contents["out"]);
                break;
            case "stderr":
                this._addspan("red");
                this._split_and_add(contents["out"]);
                this._addspan("white")
                break;
        }
    }

    _cleanlastdiv() {
        var lastdiv = this._lastdiv();
        var col = lastdiv.firstChild.classList[0];

        while (lastdiv.firstChild) {
            lastdiv.removeChild(lastdiv.firstChild);
        }
        this._addspan(col)
    }

    _split_and_add(full_text) {
        const lines = full_text.split('\n');
        const length = lines.length

        this._bottom_check();

        if (this.reserve_carrige) {
            this.reserve_carrige = false;
            this._cleanlastdiv();
        }

        for (var index in lines) {
            var linetext = lines[index];
            var splite_carriage = linetext.split("\r");
            
            if (splite_carriage.length == 1) {
                this._write(linetext);
            }
            else if (splite_carriage[splite_carriage.length-1] == "") {
                this._write(splite_carriage[splite_carriage.length-2]);
                this.reserve_carrige = true;
            } else {
                this._cleanlastdiv();
                this._write(splite_carriage[splite_carriage.length-1]);
            }
            
            if (index != length-1) {
                this.reserve_carrige = false;
                this._adddiv();
                this._addspan();
            }
        }

        this._to_bottom();
    }

    _addspan(color=null) {
        if (color === null) {
            let lastspan = this._lastspan()
            color = lastspan.classList[0]
        }

        const newspan = document.createElement('span')
        newspan.classList.add(color);
        
        this._lastdiv().appendChild(newspan)
    }

    _adddiv() {
        const lastspan = this._lastspan();
        
        const newdiv = document.createElement('div')
        this.element.appendChild(newdiv)

        this._addspan(lastspan.classList[0])
    }

    _write(text) {
        const last = this._lastspan()
        last.textContent += text
    }
    
    _lastdiv() {
        return this.element.lastElementChild
    }
    
    _lastspan() {
        return this.element.lastElementChild.lastElementChild
    }
}


