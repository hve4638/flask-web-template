let terminal;

window.onload = () => { 
    let submitField = document.querySelector("#submit")
    submitField.onclick = submit
    
    terminal = new Terminal("#terminal")
    loop()
}

async function submit() {
    value = document.querySelector("#input").value

    fetch('/submit', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "value" : value
        }),    
    });
}

async function loop() {
    while (true) {
        const response = await fetch('/stdout', {
            method : 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
        });
        if (response.ok) {
            const jsonData = await response.json();
            terminal.add(jsonData["contents"])
        }
    }
}

function terminal_add(message) {
    let terminal = document.querySelector('#terminal');
    const splitted = message.split('\n');

    isbottom = scroll_is_bottom()
    height_previos = terminal.scrollHeight
    let length = splitted.length

    for (index in splitted) {
        var text = splitted[index]
        lastchild = terminal.lastElementChild
        lastchild.textContent += text
        
        if (index != length-1) {
            const newline = document.createElement('div')
            terminal.appendChild(newline)
        }
    }
    if (isbottom) {
        height_delta = terminal.scrollHeight-height_previos
        terminal.scrollTop += height_delta
    }
}

function scroll_is_bottom() {
    const terminal = document.querySelector('#terminal');
    return terminal.scrollHeight - terminal.scrollTop === terminal.clientHeight;
}