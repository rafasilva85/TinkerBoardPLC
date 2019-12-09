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

	digitalWrite(RELAY0,LOW);
	digitalWrite(RELAY1,LOW);
	digitalWrite(RELAY2,LOW);
	digitalWrite(RELAY3,LOW);
	digitalWrite(RELAY4,LOW);
	digitalWrite(RELAY5,LOW);
	digitalWrite(RELAY6,LOW);
	digitalWrite(RELAY7,LOW);
	
	
        for (;;)
        {
		printf("LOOP_START\n");
               	printf("CHANNEL_0\n");
		digitalWrite (RELAY0, HIGH);
                delay (500);
                digitalWrite (RELAY0, LOW);
                delay (500);
		printf("CHANNEL_1\n");
                digitalWrite (RELAY1, HIGH);
                delay (500);
                digitalWrite (RELAY1, LOW);
                delay (500);
		printf("CHANNEL_2\n");
                digitalWrite (RELAY2, HIGH);
                delay (500);
                digitalWrite (RELAY2, LOW);
                delay (500);
		printf("CHANNEL_3\n");
                digitalWrite (RELAY3, HIGH);
                delay (500);
                digitalWrite (RELAY3, LOW);
                delay (500);
		printf("CHANNEL_4\n");
                digitalWrite (RELAY4, HIGH);
                delay (500);
                digitalWrite (RELAY4, LOW);
                delay (500);
		printf("CHANNEL_5\n");
                digitalWrite (RELAY5, HIGH);
                delay (500);
                digitalWrite (RELAY5, LOW);
                delay (500);
		printf("CHANNEL_6\n");
                digitalWrite (RELAY6, HIGH);
                delay (500);
                digitalWrite (RELAY6, LOW);
                delay (500);
		printf("CHANNEL_7\n");
                digitalWrite (RELAY7, HIGH);
                delay (500);
                digitalWrite (RELAY7, LOW);
                delay (500);
		printf("LOOP_END\n");
         }
        return 0;
}
