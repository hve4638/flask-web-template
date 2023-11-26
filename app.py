#!/usr/bin/env python3
import subprocess
from http import HTTPStatus
from flask import Flask, jsonify, redirect, render_template, request, url_for, session
from webtools import StdoutPipe, Timeout, makeid
import time

app = Flask(__name__)
app.secret_key = "SECRET_KEY"
outpipe:StdoutPipe = StdoutPipe()

@app.route('/submit', methods=['POST', 'GET'])
def submit():
    text = request.json['value']
    
    outpipe.push(session["id"], {"type": "stdout", "out": f"Test message\n"})
    outpipe.push(session["id"], {"type": "stdout", "out": f"echo : {text}\n"})
    time.sleep(1)
    outpipe.push(session["id"], {"type": "stdout", "out": f"count: 3\r"})
    outpipe.push(session["id"], {"type": "stdout", "out": f"count: 2\r"})
    outpipe.push(session["id"], {"type": "stdout", "out": f"count: 1\r"})
    outpipe.push(session["id"], {"type": "stdout", "out": f"count: 0\n"})
    
    return jsonify({ "status": HTTPStatus.OK })

@app.route('/stdout', methods=['POST'])
def request_stdout():
    if "id" not in session:
        session["id"] = makeid()
        return jsonify({"contents": {"type":"none"}, "status": HTTPStatus.OK})
    
    tm = Timeout(10)
    sid = session["id"]
    while tm:
        if not outpipe.empty(sid):
            value = outpipe.pop(sid)
            return jsonify({"contents": value, "status": HTTPStatus.OK })

    return jsonify({"contents": {"type":"none"}, "status": HTTPStatus.OK})

@app.route('/')
def rootpage():
    if "id" not in session:
        session["id"] = makeid()
    
    return render_template('terminal-template.html',
        caption = "Example",
        title = "Terminal Template",
    )
    
if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port=9000)