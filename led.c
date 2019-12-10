#include <stdio.h>
#include <wiringPi.h>
#include "PubSubClient.h"

// Update these with values suitable for your network.
byte mac[]    = {  0x80, 0xC5, 0xF2, 0xBA, 0x80, 0x65 };
IPAddress ip(192,168,5,213);
IPAddress server(192,168,5,213);

void callback(char* topic, byte* payload, unsigned int length) {
  Serial.print("Message arrived [");
  Serial.print(topic);
  Serial.print("] ");
  for (int i=0;i<length;i++) {
    Serial.print((char)payload[i]);
  }
  Serial.println();
}

EthernetClient ethClient;
PubSubClient client(ethClient);

void reconnect() {
  // Loop until we're reconnected
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    // Attempt to connect
    if (client.connect("TinkerBoard")) {
      Serial.println("connected");
      // ... and resubscribe
      client.subscribe("RELAYCTRL");
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      // Wait 5 seconds before retrying
      delay(5000);
    }
  }
}

// #define LED 0 matches with ASUS_GPIO 164! This can be checked with command 'sudo gpio readall'.
#define RELAY0 0 
#define RELAY1 2
#define RELAY2 3
#define RELAY3 21
#define RELAY4 22
#define RELAY5 23
#define RELAY6 24
#define RELAY7 25

void setAllOff()
{
	digitalWrite(RELAY0,HIGH);
	digitalWrite(RELAY1,HIGH);
	digitalWrite(RELAY2,HIGH);
	digitalWrite(RELAY3,HIGH);
	digitalWrite(RELAY4,HIGH);
	digitalWrite(RELAY5,HIGH);
	digitalWrite(RELAY6,HIGH);
	digitalWrite(RELAY7,HIGH);
}

int main (void)
        {
        wiringPiSetup ();
        pinMode (RELAY0, OUTPUT);
        pinMode (RELAY1, OUTPUT);
        pinMode (RELAY2, OUTPUT);
        pinMode (RELAY3, OUTPUT);
        pinMode (RELAY4, OUTPUT);
        pinMode (RELAY5, OUTPUT);
  	pinMode (RELAY6, OUTPUT);
        pinMode (RELAY7, OUTPUT);

	setAllOff()    
		
	Serial.begin(57600);

	client.setServer(server, 1883);
	client.setCallback(callback);

	Ethernet.begin(mac, ip);
	// Allow the hardware to sort itself out8
	delay(1500);

	for (;;)
	{
	  if (!client.connected()) {
	    reconnect();
	  }
	  client.loop();
	}
}
