# TinkerBoardPLC
Simple C application that shows how to configure and access the RaspberryPI or TinkerBoard GPIO;
I have included an interface for MQTT communication using the PAHO.MQTT.C Library (including OpenSSL Security);

I'm looking forward new Pull Requests to improve this project;

************************************
COMPILING
************************************

1. Upgrade your OS to latest release and Install OpenSSL to your OS by running:
              
              sudo apt-get update;
              sudo apt-get upgrade;
              sudo apt-get dist-upgrade;
              sudo apt-get install openssl;
              
   
2. Clone this repository into your work folder by running:  
              
              git clone http://github.com/rafasilva85/TinkerBoardPLC.git
              
3. Clone the PAHO.MQTT.C into TinkerBoardPLC folder by running: 
               
               cd TinkerBoardPLC
               git clone https://github.com/eclipse/paho.mqtt.c.git
               
4. Follow the instructions from https://github.com/eclipse/paho.mqtt.c to compile the library;
5. Go back to TinkerBoardPLC folder by running: 

               cd ..
               
6. Clone the LWiringPi Library by running: git clone https://github.com/WiringPi/WiringPi.git
7. Follow the instructions at: https://github.com/WiringPi/WiringPi to compile the library;
8. Go back to the TinkerBoardPLC folder by running: 

               cd ..
              
9. Open the MQTTRELAY.C file using your preferred text editor, make sure the PINOUTS are well configured to match your RELAY board;
10. Compile the MQTTRELAY.C using gcc, by running the following command: 
              
              gcc mqttrelay.c -lwiringPi -lpaho-mqtt3c -o mqttrelay.c

11. Run the middleware to engage the RELAYS and listen to the MQTT port configured by default as 1883;
12. Using the MQTT Tool APP (for android or Apple) connect to your RaspberryPI or TinkerBoard and start sending values 1-9 to a TOPIC named RELAY;
 

LEARN - PROCESS - MASTER - SHARE - REPEAT
