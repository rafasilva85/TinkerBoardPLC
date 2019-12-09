#include <stdio.h>
#include <wiringPi.h>

// #define LED 0 matches with ASUS_GPIO 164! This can be checked with command 'sudo gpio readall'.
#define RELAY0 0 
#define RELAY1 2
#define RELAY2 3
#define RELAY3 21
#define RELAY4 22
#define RELAY5 23
#define RELAY6 24
#define RELAY7 25

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

	digitalWrite(RELAY0,HIGH);
	digitalWrite(RELAY1,HIGH);
	digitalWrite(RELAY2,HIGH);
	digitalWrite(RELAY3,HIGH);
	digitalWrite(RELAY4,HIGH);
	digitalWrite(RELAY5,HIGH);
	digitalWrite(RELAY6,HIGH);
	digitalWrite(RELAY7,HIGH);
}
