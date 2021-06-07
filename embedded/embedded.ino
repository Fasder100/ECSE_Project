#include <Wire.h>
#include <MPU6050.h>
#include <SoftwareSerial.h>

#define DEBUG true
#define LM35 A0

MPU6050 MPU;
SoftwareSerial esp(10, 11);

// Timers
unsigned long timer = 0;
float timeStep = 0.01;

// Pitch, Roll and Yaw values
int pitch = 0;
int roll = 0;
int yaw = 0;

// ESP MAC Address
String espMacAddress;

void espSetup(){
  String networkName = "";
  String networkPassword = "";
  
  // Reset the esp in case of power outage
  sendData("AT+RST\r\n", 10000, DEBUG);
  
  // Configure ESP to operate as client
  sendData("AT+CWMODE=3\r\n", 10000, DEBUG);

  // List access points
//  sendData("AT+CWLAP\r\n", 10000, DEBUG);

  
  
  // Verify that access point has been joined
  //sendData("AT+CIFSR\r\n", 3000, DEBUG);  
}

String getMacAddress(){
  String response = "";
  response = sendData("AT+CIPSTAMAC?\r\n\r\n", 3000, false);  
  return response.substring(42, 59);
}

String sendData(String command, const int timeout, boolean debug) {
    String response = "";
    
    esp.print(command); // send the read character to the esp8266
    
    unsigned long time = millis();
    
    while( (time+timeout) > millis())
    {
      while(esp.available())
      {
        
        // The esp has data so display its output to the serial window 
        char c = esp.read(); // read the next character.
        response += c;
      }  
    }
    
    if(debug)
    {
      Serial.print(response);
    }
    
    return response;
}

void gyroscopeSetup(){
  // Initialize MPU6050
  Serial.println("Initialize MPU6050");
  while(!MPU.begin(MPU6050_SCALE_2000DPS, MPU6050_RANGE_2G))
  {
    Serial.println("Could not find a valid MPU6050 sensor, check wiring!");
    delay(500);
  }
  
  // gyroscope offsets
  MPU.setGyroOffsetX(138);
  MPU.setGyroOffsetY(80);
  MPU.setGyroOffsetZ(9);
  
  // Calibrate gyroscope. The calibration must be at rest.
  mpu.calibrateGyro();

  // Set threshold sensivty. Default 3.
  mpu.setThreshold(1);
}

int readGyroscope(){  
  Vector rawGyro = mpu.readRawGyro();
  Vector normGyro = mpu.readNormalizeGyro();

//  Serial.print(" Xraw = ");
//  Serial.print(rawGyro.XAxis);
//  Serial.print(" Yraw = ");
//  Serial.print(rawGyro.YAxis);
//  Serial.print(" Zraw = ");
//  Serial.println(rawGyro.ZAxis);
//
//  Serial.print(" Xnorm = ");
//  Serial.print(normGyro.XAxis);
//  Serial.print(" Ynorm = ");
//  Serial.print(normGyro.YAxis);
//  Serial.print(" Znorm = ");
//  Serial.println(normGyro.ZAxis);

  return (int)rawGyro.YAxis;
}

int getTemperature(int testing){
  float voltage, temp;

  if (testing == 0){
    // Read temperature from the LM35 sensor
    voltage = analogRead(LM35) * (5.0/1023.0);
    temp = 100 * voltage;
  }
  else{
    // Generate random test data
    temp = random(30, 41);
  }  

  return temp;
}

String generatePostRequest(String route, String portNumber, int cLength, String Data) {
  String requestType = "POST /" + route + " HTTP/1.1\r\n";
  String hostInfo = "10.10.74.143:" + portNumber + "\r\n";
  String contentType = "Content-Type: application/json\r\n";
  String contentLength = "Content-Length: " + String(cLength) + "\r\n\r\n";
  String postData = Data + "\r\n\r\n";

  return requestType + hostInfo + contentType + contentLength + postData;
}

String generateCIPSend(int requestLength){
  String CIPsend = "AT+CIPSEND=" + String(requestLength) + "\r\n";
  
  return CIPsend;
}

String generatePost(String patient_id, float pos, int temp){
  String post = "{\"patient_id\": \""+patient_id+ "\", \"position\": "+String(pos)+ ", \"temperature\": "+String(temp)+"}\r\n\r\n";
  
  return post;
}

void setup() {
  Serial.begin(9600);
  esp.begin(9600);

  
  // Setup the gyroscope
  gyroscopeSetup();

  // Setup the ESP8266
  espSetup();

  // Setup the LM35
  pinMode(LM35, INPUT);

  // Get the MAC address of the ESP
  espMacAddress = getMacAddress();
  Serial.print("MAC Address: "); Serial.println(espMacAddress);

  }

void loop() {  
  int temp;
  int pos;

  pos = readGyroscope();
  temp = getTemperature(0);

  String Data = generatePost(espMacAddress, pos, temp);
  String postRequest = generatePostRequest("api/record", "5000", Data.length(), Data);  
  String CIPSend = generateCIPSend(postRequest.length());

  sendData("AT+CIPSTART=\"TCP\",\"192.168.1.6\",5000\r\n", 3000, DEBUG);
  sendData(CIPSend, 1000, DEBUG);
  sendData(postRequest, 5000, DEBUG);
}