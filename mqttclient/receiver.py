import paho.mqtt.client as mqttClient
import time
import datetime as dt
from influxdb import InfluxDBClient

mqttmessages = {}

def write(messages):
    data = f"indoorclimate,location=Shelly temperature={messages['temperature']},humidity={messages['humidity']},battery={messages['battery']}"
    print("Writing to database: " + data)
    client = InfluxDBClient(host='influxdb', port=8086)
    client.switch_database('homedb')
    client.write_points(data, time_precision='ms', protocol='line')

def on_connect(client, userdata, flags, rc):
    if rc == 0: 
        print("Connected to broker")
 
        global Connected                #Use global variable
        Connected = True                #Signal connection 

        #topic = "home/sensors/#"
        topic = "#"
        print("Subscribe to " + topic)
        client.subscribe(topic)
 
    else:
        print("Connection failed")

def on_message(client, userdata, message):
    global mqttmessages
    msg = message.payload.decode("utf-8")
    topic = message.topic.split('/')[-1]
    print(f"Message received: {topic} {msg}")
    if(topic in ['temperature', 'humidity', 'battery']):
        print(f"Adding to mqttmessages: {topic} {msg}")
        mqttmessages[topic] = msg
    for x, y in mqttmessages.items():
      print(x, y)
    if(len(mqttmessages) == 3):
        print("All 3 climate values received")
        write(mqttmessages)
        mqttmessages = {}
 
Connected = False   #global variable for the state of the connection
 
broker_address= "homeapp73-docker_mosquitto_1"  #Broker address
port = 1883                         #Broker port
user = "yourUser"                    #Connection username
password = "yourPassword"            #Connection password
 
client = mqttClient.Client("Python")               #create new instance
#client.username_pw_set(user, password=password)    #set username and password
client.on_connect= on_connect                      #attach function to callback
client.on_message= on_message                      #attach function to callback
print("Connecting to mqtt broker: " + broker_address) 
client.connect(broker_address, port=port)          #connect to broker
 
client.loop_start()        #start the loop
 
try:
    while True:
       time.sleep(1)
 
except Exception as e:
    print("exiting with exception " + e)
    client.disconnect()
    client.loop_stop()