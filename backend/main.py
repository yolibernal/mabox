from typing import List
from pyky040 import pyky040

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.responses import HTMLResponse
import RPi.GPIO as GPIO
import time
import threading
import asyncio
import board
import busio
import adafruit_ads1x15.ads1115 as ADS
from adafruit_ads1x15.analog_in import AnalogIn
import json


app = FastAPI()

html = """
<!DOCTYPE html>
<html>
    <head>
        <title>Chat</title>
    </head>
    <body>
        <h1>WebSocket Chat</h1>
        <h2>Your ID: <span id="ws-id"></span></h2>
        <form action="" onsubmit="sendMessage(event)">
            <input type="text" id="messageText" autocomplete="off"/>
            <button>Send</button>
        </form>
        <ul id='messages'>
        </ul>
        <script>
            var client_id = Date.now()
            document.querySelector("#ws-id").textContent = client_id;
            var ws = new WebSocket(`ws://192.168.178.85:8000/ws/${client_id}`);
            ws.onmessage = function(event) {
                console.log(event.data)
                var messages = document.getElementById('messages')
                var message = document.createElement('li')
                var content = document.createTextNode(event.data)
                message.appendChild(content)
                messages.appendChild(message)
            };
            function sendMessage(event) {
                var input = document.getElementById("messageText")
                ws.send(input.value)
                input.value = ''
                event.preventDefault()
            }
        </script>
    </body>
</html>
"""
"""
{
  "device": "ROTARY_ENCODER" | "JOYSTICK | "BUTTON 1" | "BUTTON 2",
  "message":
        # JOYSTICK
        "LEFT" | "RIGHT" | "TOP" | "BOTTOM" | "CENTER"

        # ROTARY_ENCODER
        "CLOCKWISE" | "ANTICLOCKWISE"

        # BUTTON N
        "ACTIVE" | "INACTIVE"
}
"""

broadcast_queue = []

"""
BUTTON Setup
"""
PIN_BUTTON_0 = 23
PIN_BUTTON_1 = 24
GPIO.setmode(GPIO.BCM)
GPIO.setup(PIN_BUTTON_0, GPIO.IN, pull_up_down=GPIO.PUD_UP)
GPIO.setup(PIN_BUTTON_1, GPIO.IN, pull_up_down=GPIO.PUD_UP)

def get_button_state():
    last_send_button_0_state = None
    last_send_button_1_state = None
    while True:
        time.sleep(0.1)
        button_0_state = "ACTIVE" if GPIO.input(PIN_BUTTON_0) == 0 else "INACTIVE"
        button_1_state = "ACTIVE" if GPIO.input(PIN_BUTTON_1) == 0 else "INACTIVE"
        if (button_0_state != last_send_button_0_state):
            if (last_send_button_0_state):
                broadcast_queue.append({
                    "device": "BUTTON 1",
                    "message": button_0_state
                })
            last_send_button_0_state = button_0_state

        if (button_1_state != last_send_button_1_state):
            if (last_send_button_1_state):
                broadcast_queue.append({
                    "device": "BUTTON 2",
                    "message": button_1_state
                })
            last_send_button_1_state = button_1_state

        last_send_button_0_state = button_0_state

"""
ROTARY Setup
"""
def rotary_clockwise_callback(scale_position):
    broadcast_queue.append({"device" : "ROTARY_ENCODER", "message": "CLOCKWISE"})

def rotary_anticlockwise_callback(scale_position):
    broadcast_queue.append({"device" : "ROTARY_ENCODER", "message": "ANTICLOCKWISE"})

def rotary_push_callback():
    broadcast_queue.append({"device": "ROTARY_ENCODER", "message": "PRESSED"})

rotary_encoder = pyky040.Encoder(CLK=18, DT=22, SW=27)
rotary_encoder.setup(step=1, inc_callback=rotary_clockwise_callback, dec_callback=rotary_anticlockwise_callback, sw_callback=rotary_push_callback, loop=True)

"""
JOYSTICK Setup
"""
i2c = busio.I2C(board.SCL, board.SDA)
ads = ADS.ADS1115(i2c)
JOYSTICK_X = AnalogIn(ads, ADS.P0)
JOYSTICK_Y = AnalogIn(ads, ADS.P1)
JOYSTICK_PRESSED = AnalogIn(ads, ADS.P2)

def get_joystick_direction(value: int, orientation: str):
    if (value >= 18000 and value <= 22000):
        return "CENTER"
    if (value >= 28000):
        return "RIGHT" if orientation == "X" else "TOP"
    if (value <= 2000):
        return "LEFT" if orientation == "X" else "BOTTOM"
    return "CENTER"

def is_joystick_pressed(value: int):
    if (value > 2000):
        return None
    else:
        return "PRESSED"

def get_joystick_state():
    last_joystick_x_state = None
    last_joystick_y_state = None
    last_joystick_pressed_state = None
    while True:
        time.sleep(0.1)
        x_state = get_joystick_direction(JOYSTICK_X.value, "X")
        y_state = get_joystick_direction(JOYSTICK_Y.value, "Y")
        pressed_state = is_joystick_pressed(JOYSTICK_PRESSED.value)

        if x_state != last_joystick_x_state:
            if last_joystick_x_state:
                broadcast_queue.append({
                    "device": "JOYSTICK",
                    "message": x_state
                })
            last_joystick_x_state = x_state
        if y_state != last_joystick_y_state:
            if last_joystick_y_state:
                broadcast_queue.append({
                    "device": "JOYSTICK",
                    "message": y_state
                })
            last_joystick_y_state = y_state
        if pressed_state != last_joystick_pressed_state:
            last_joystick_pressed_state = pressed_state
            if pressed_state:
                broadcast_queue.append({
                    "device": "JOYSTICK",
                    "message": pressed_state
                })

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    async def disconnect(self, websocket: WebSocket):
        await websocket.close()
        self.active_connections.remove(websocket)

    async def send_personal_message(self, message, websocket: WebSocket):
        await websocket.send_text(message)

    async def broadcast(self, message):
        for connection in self.active_connections:
            try:
                await connection.send_text(message)
            except:
                print("Could not broadcast to websocket")


manager = ConnectionManager()



@app.get("/")
async def get():
    return HTMLResponse(html)


t1 = threading.Thread(target=get_button_state)
t2 = threading.Thread(target=rotary_encoder.watch)
t3 = threading.Thread(target=get_joystick_state)
t1.daemon = True
t2.daemon = True
t3.daemon = True
t1.start()
t2.start()
t3.start()

@app.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: str):
    await manager.connect(websocket)

    try:
        while True:
            await asyncio.sleep(0.01)
            if len(broadcast_queue) == 0:
                continue
            await manager.broadcast(json.dumps(broadcast_queue[0]))
            broadcast_queue.pop(0)

    except WebSocketDisconnect:
        manager.disconnect(websocket)


