import sys, os
import random
import string
import time
import hashlib
from queue import Queue

def makeid():
    rawid = random.randint(-2147483648, 2147483647) + int(time.time())
    return hashlib.sha256(str(rawid).encode()).hexdigest()

class Timeout:
    def __init__(self, sec, wait_interval=0.1):
        self.sec = sec
        self.wait_interval = wait_interval
        self.start_time = time.time()
        
    def __bool__(self):
        time.sleep(self.wait_interval)
        elapsed_time = time.time() - self.start_time
        return elapsed_time <= self.sec

class StdoutPipe:
    def __init__(self):
        self.sessions = {}
        self.pipes = Queue()
    
    def push(self, sid, item):
        if sid not in self.sessions:
            self.sessions[sid] = Queue()
        self.sessions[sid].put(item)

    def pop(self, sid):
        if self.empty(sid):
            return None
        else:
            return self.sessions[sid].get()

    def empty(self, sid):
        if sid not in self.sessions:
            return True
        else:
            return self.sessions[sid].empty()