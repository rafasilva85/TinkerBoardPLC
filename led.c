#include <stdio.h>
#include <wiringPi.h>

// #define LED 0 matches with ASUS_GPIO 164! This can be checked with command 'sudo gpio readall'.
#define RELAY0     31
#define RELAY1     33
#define RELAY2     35
#define RELAY3     37
#define RELAY4     32
#define RELAY5     36
#define RELAY6     38
#define RELAY7     40

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

        for (;;)
        {
                digitalWrite (RELAY0, HIGH);
                delay (500);
                digitalWrite (RELAY0, LOW);
                delay (500);
                digitalWrite (RELAY1, HIGH);
                delay (500);
                digitalWrite (RELAY1, LOW);
                delay (500);
                digitalWrite (RELAY2, HIGH);
                delay (500);
                digitalWrite (RELAY2, LOW);
                delay (500);
                digitalWrite (RELAY3, HIGH);
                delay (500);
                digitalWrite (RELAY3, LOW);
                delay (500);
                digitalWrite (RELAY4, HIGH);
                delay (500);
                digitalWrite (RELAY4, LOW);
                delay (500);
                digitalWrite (RELAY5, HIGH);
                delay (500);
                digitalWrite (RELAY5, LOW);
                delay (500);
                digitalWrite (RELAY6, HIGH);
                delay (500);
                digitalWrite (RELAY6, LOW);
                delay (500);
                digitalWrite (RELAY7, HIGH);
                delay (500);
                digitalWrite (RELAY7, LOW);
                delay (500);
         }
        return 0;
}


