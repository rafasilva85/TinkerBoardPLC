# TinkerBoardPLC
TinkerboardPLC is intial project of a PLC running on a TinkerBoard (INTEL SBC) 
running a pure C middleware (mqtt paho, gpio, lwiringPI) to RELAY OUTPUTS on a 8 channel relay board from the GPIO.

*************************************
USE THE SAMPLE AS YOU LIKE
*************************************

YOU MAY NEED TO FOLLOW THE PAHO.MQTT.C LIBRARY TO COMPILE TO YOUR BOARD. TO DO SO YOU'LL ALSO NEED OPENSSL. 
MAKE SURE YOU HAVE INTSALLED ON YOUR BOARD BEFORE START.


COMPILE THE MQTTRELAY.C USING THE FOLLOWING COMMAND LINE

git pull https://github.com/rafasilva85/TinkerBoardPLC.git --depth 1 TinkerBoardPLC
cd TinkerBoardPLC
gcc -o mqttrelay mqttrelay.c -lwiringPi -lpaho-mqtt3c
./mqttrelay

You will also need to check for pinage on the Tinkerboard GPIO to set the correct pins on the relay.
**************************************

LEARN - PROCESS - MASTER - SHARE - REPEAT
