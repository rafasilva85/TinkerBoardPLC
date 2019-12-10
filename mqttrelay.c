#include <stdio.h>
#include <wiringPi.h>
#include <stdlib.h>
#include <string.h>
#include "MQTTClient.h"

#define ADDRESS     "tcp://localhost:1883"
#define CLIENTID    "TinkerBoard"
#define TOPIC       "RELAY"
#define QOS         1
#define TIMEOUT     10000L

volatile MQTTClient_deliveryToken deliveredtoken;

// #define LED 0 matches with ASUS_GPIO 164! This can be checked with command 'sudo gpio readall'.
#define RELAY0 0 
#define RELAY1 2
#define RELAY2 3
#define RELAY3 21
#define RELAY4 22
#define RELAY5 23
#define RELAY6 24
#define RELAY7 25

void switchrl(char relay)
{
	
	switch(relay)
	{
	  case '0':
		if(digitalRead(RELAY0)==HIGH)
		{
		  digitalWrite(RELAY0, LOW);
		}else{
		  digitalWrite(RELAY0, HIGH);	
		}
		break;
	  case '1':
		if(digitalRead(RELAY1)==HIGH)
		{
		  digitalWrite(RELAY1, LOW);
		}else{
		  digitalWrite(RELAY1, HIGH);	
		}
		break;

	  case '2':
		if(digitalRead(RELAY2)==HIGH)
		{
		  digitalWrite(RELAY2, LOW);
		}else{
		  digitalWrite(RELAY2, HIGH);	
		}
		break;

	  case '3':
		if(digitalRead(RELAY3)==HIGH)
		{
		  digitalWrite(RELAY3, LOW);
		}else{
		  digitalWrite(RELAY3, HIGH);	
		}
		break;

	  case '4':
		if(digitalRead(RELAY4)==HIGH)
		{
		  digitalWrite(RELAY4, LOW);
		}else{
		  digitalWrite(RELAY4, HIGH);	
		}
		break;

	  case '5':
		if(digitalRead(RELAY5)==HIGH)
		{
		  digitalWrite(RELAY5, LOW);
		}else{
		  digitalWrite(RELAY5, HIGH);	
		}
		break;

	  case '6':
		if(digitalRead(RELAY6)==HIGH)
		{
		  digitalWrite(RELAY6, LOW);
		}else{
		  digitalWrite(RELAY6, HIGH);	
		}
		break;

	  case '7':
		if(digitalRead(RELAY7)==HIGH)
		{
		  digitalWrite(RELAY7, LOW);
		}else{
		  digitalWrite(RELAY7, HIGH);	
		}
		break;
	}
}

void initRELAYBoard()
{
    //start board wiring setup
    wiringPiSetup ();
    //set pin mode
    pinMode (RELAY0, OUTPUT);
    pinMode (RELAY1, OUTPUT);
    pinMode (RELAY2, OUTPUT);
    pinMode (RELAY3, OUTPUT);
    pinMode (RELAY4, OUTPUT);
    pinMode (RELAY5, OUTPUT);
    pinMode (RELAY6, OUTPUT);
    pinMode (RELAY7, OUTPUT);

    //turn all relay off
    digitalWrite(RELAY0,HIGH);
    digitalWrite(RELAY1,HIGH);
    digitalWrite(RELAY2,HIGH);
    digitalWrite(RELAY3,HIGH);
    digitalWrite(RELAY4,HIGH);
    digitalWrite(RELAY5,HIGH);
    digitalWrite(RELAY6,HIGH);
    digitalWrite(RELAY7,HIGH);
}


void delivered(void *context, MQTTClient_deliveryToken dt)
{
    printf("Message with token value %d delivery confirmed\n", dt);
    deliveredtoken = dt;
}

int msgarrvd(void *context, char *topicName, int topicLen, MQTTClient_message *message)
{
    int i;
    char* payloadptr;
    printf("Message arrived\n");
    printf("     topic: %s\n", topicName);
    printf("   message: ");
    payloadptr = message->payload;

    for(i=0; i<message->payloadlen; i++)
    {
      putchar(*payloadptr);
    }
      putchar('\n');

    switchrl(*payloadptr);

    MQTTClient_freeMessage(&message);
    MQTTClient_free(topicName);
    return 1;
}

void connlost(void *context, char *cause)
{
    printf("\nConnection lost\n");
    printf("     cause: %s\n", cause);
}

int main(int argc, char* argv[])
{
    initRELAYBoard();
    MQTTClient client;
    MQTTClient_connectOptions conn_opts = MQTTClient_connectOptions_initializer;
    int rc;
    int ch;
    MQTTClient_create(&client, ADDRESS, CLIENTID,
        MQTTCLIENT_PERSISTENCE_NONE, NULL);
    conn_opts.keepAliveInterval = 20;
    conn_opts.cleansession = 1;
    MQTTClient_setCallbacks(client, NULL, connlost, msgarrvd, delivered);
    if ((rc = MQTTClient_connect(client, &conn_opts)) != MQTTCLIENT_SUCCESS)
    {
        printf("Failed to connect, return code %d\n", rc);
        exit(EXIT_FAILURE);
    }
    printf("Subscribing to topic %s\nfor client %s using QoS%d\n\n"
           "Press Q<Enter> to quit\n\n", TOPIC, CLIENTID, QOS);
    MQTTClient_subscribe(client, TOPIC, QOS);
    do
    {
        ch = getchar();
    } while(ch!='Q' && ch != 'q');
    MQTTClient_disconnect(client, 10000);
    MQTTClient_destroy(&client);
    return rc;
}
