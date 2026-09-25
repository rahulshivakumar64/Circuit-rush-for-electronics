-- ====================================================================
-- CircuitRush Supabase Seed Data
-- 30+ Products, 10+ Categories, 3 Stores, Inventory, 8 Kits, Zones
-- ====================================================================

-- 1. SEED CATEGORIES (12 Categories)
INSERT INTO public.categories (id, name, slug, icon_name, description, count) VALUES
('cat-arduino', 'Arduino', 'arduino', 'Cpu', 'Microcontrollers, Uno, Nano, Mega & compatible boards', 6),
('cat-esp32', 'ESP32', 'esp32', 'Wifi', 'WiFi + Bluetooth dual-core IoT development boards', 5),
('cat-rpi', 'Raspberry Pi', 'raspberry-pi', 'Layers', 'Pi Pico, RP2040, compute boards & accessories', 4),
('cat-sensors', 'Sensors', 'sensors', 'Radio', 'Ultrasonic, PIR, IR, temperature, humidity, gas & optical', 14),
('cat-motors', 'Motors', 'motors', 'Cog', 'DC gear motors, SG90 servos, stepper motors', 6),
('cat-drivers', 'Motor Drivers', 'motor-drivers', 'Zap', 'L298N, TB6612, L293D motor controller modules', 5),
('cat-displays', 'Displays', 'displays', 'Monitor', 'OLED 0.96", 16x2 LCD with I2C, 7-segment LED', 5),
('cat-relays', 'Relay Modules', 'relay-modules', 'Power', '1, 2, 4, 8 channel 5V/12V isolated relay boards', 4),
('cat-comm', 'Communication Modules', 'communication-modules', 'RadioReceiver', 'HC-05 Bluetooth, NRF24L01, LoRa, ESP-NOW', 5),
('cat-iot', 'IoT', 'iot', 'CloudLightning', 'Cloud enabled boards, NodeMCU, ESP32 and gateway kits', 8),
('cat-robotics', 'Robotics', 'robotics', 'Bot', 'Chassis kits, wheels, omni wheels, caster, arms', 9),
('cat-tools', 'Tools & Prototyping', 'tools-prototyping', 'Wrench', 'Breadboards, jumpers, multimeters, soldering tools', 10)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;

-- 2. SEED STORES (3 Mysuru Dark Stores)
INSERT INTO public.stores (id, name, area, city, pincode, phone, is_open, operating_hours, current_delivery_estimate_min, coverage_areas, address) VALUES
('store-saraswathi', 'CircuitRush Hub A — Saraswathipuram', 'Saraswathipuram', 'Mysuru', '570009', '+91 821 254 8810', true, '8:00 AM – 11:30 PM (Everyday)', 18, ARRAY['Saraswathipuram', 'NIE Campus', 'Manasagangothri', 'Kuvempunagar', 'K.G. Koppal', 'Ramakrishnanagar', 'Tonachikoppal'], 'Near Kukkarahalli Lake Road, Saraswathipuram, Mysuru - 570009'),
('store-hebbal', 'CircuitRush Hub B — Hebbal Industrial', 'Hebbal 1st Stage', 'Mysuru', '570016', '+91 821 241 6632', true, '8:00 AM – 11:00 PM (Everyday)', 22, ARRAY['Hebbal', 'VVCE Campus', 'Gokulam', 'Jayalakshmipuram', 'Vijayanagar 1st-4th Stage', 'Yadavagiri', 'KRS Road'], 'Hebbal Industrial Area, Near VVCE Campus, Mysuru - 570016'),
('store-vidya', 'CircuitRush Hub C — Vidyaranyapuram', 'Vidyaranyapuram', 'Mysuru', '570008', '+91 821 248 1190', true, '8:30 AM – 11:00 PM (Everyday)', 20, ARRAY['Vidyaranyapuram', 'SJCE / JSS STU', 'Chamundipuram', 'Agrahara', 'J.P. Nagar', 'Ashokapuram', 'KRS Road'], 'Main Road, Vidyaranyapuram, Mysuru - 570008')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  address = EXCLUDED.address,
  coverage_areas = EXCLUDED.coverage_areas;

-- 3. SEED DELIVERY ZONES
INSERT INTO public.delivery_zones (id, name, store_id, min_delivery_mins, max_delivery_mins, delivery_fee, free_delivery_threshold, coverage_areas, active) VALUES
('zone-saraswathipuram', 'South-Central Mysuru (Saraswathipuram & Campuses)', 'store-saraswathi', 15, 25, 29.00, 499.00, ARRAY['Saraswathipuram', 'NIE Campus', 'Manasagangothri', 'Kuvempunagar', 'K.G. Koppal'], true),
('zone-hebbal-gokulam', 'North-West Mysuru (Hebbal, Gokulam & VVCE)', 'store-hebbal', 18, 30, 35.00, 499.00, ARRAY['Hebbal', 'VVCE Campus', 'Gokulam', 'Jayalakshmipuram', 'Vijayanagar 1st-4th Stage'], true),
('zone-vidyaranyapuram', 'South-East Mysuru (SJCE, Agrahara, JP Nagar)', 'store-vidya', 15, 25, 29.00, 499.00, ARRAY['Vidyaranyapuram', 'SJCE / JSS STU', 'Chamundipuram', 'Agrahara', 'J.P. Nagar'], true),
('zone-outskirts', 'Greater Mysuru Outskirts (KRS Road, Ring Road)', 'store-hebbal', 30, 45, 49.00, 799.00, ARRAY['KRS Road', 'Ring Road Junction', 'Hootagalli', 'Belagola'], true)
ON CONFLICT (id) DO NOTHING;

-- 4. SEED PRODUCTS (32 Electronics Components)
INSERT INTO public.products (
  id, sku, name, category_id, category, price, original_price, image, description,
  specifications, pin_info, compatible_boards, recommended_projects, frequently_bought_together_ids, tags, module_code, rating, reviews_count, active
) VALUES
(
  'prod-esp32-v1', 'CR-MCU-ESP32-01', 'ESP32 DevKit V1 (30-Pin)', 'cat-esp32', 'ESP32', 349.00, 499.00,
  'https://images.unsplash.com/photo-1553406830-ef2513450d76?w=600&auto=format&fit=crop&q=80',
  'Dual-core Xtensa 32-bit LX6 microprocessor with integrated 2.4 GHz Wi-Fi and Bluetooth v4.2 BR/EDR and BLE. Essential for smart IoT, robotics, and automation projects.',
  '{"Microcontroller": "ESP-WROOM-32 (Dual Core 240MHz)", "Operating Voltage": "3.3V (5V via Micro-USB)", "Digital I/O Pins": "25 with PWM & ADC", "Flash Memory": "4 MB SPI Flash", "Wireless": "Wi-Fi 802.11 b/g/n & BLE 4.2", "USB Interface": "CP2102 UART bridge"}'::jsonb,
  ARRAY['GPIO 2: Onboard LED', 'GPIO 21: I2C SDA', 'GPIO 22: I2C SCL', 'VIN: 5V Power Input', '3V3: 3.3V Output (up to 500mA)', 'GND: Common Ground'],
  ARRAY['Arduino IDE', 'PlatformIO', 'MicroPython', 'ESP-IDF'],
  ARRAY['Smart IoT Energy Meter', 'ESP32 Surveillance Cam', 'Home Automation Gateway', 'BLE Beacon Tracker'],
  ARRAY['prod-oled-096', 'prod-dht11', 'prod-relay-4ch', 'prod-jumper-m2m'],
  ARRAY['iot', 'wifi', 'bluetooth', 'microcontroller', 'bestseller'], 'ESP-WROOM-32', 4.9, 142, true
),
(
  'prod-arduino-uno', 'CR-MCU-UNO-01', 'Arduino UNO R3 (ATmega328P with Cable)', 'cat-arduino', 'Arduino', 449.00, 599.00,
  'https://images.unsplash.com/photo-1608564697071-ddf911d81370?w=600&auto=format&fit=crop&q=80',
  'The flagship microcontroller board powered by ATmega328P. High reliability with removable DIP chip, 14 digital I/O pins, 6 analog inputs, and crystal oscillator.',
  '{"Microcontroller": "ATmega328P", "Operating Voltage": "5V", "Input Voltage (recommended)": "7-12V", "Digital I/O Pins": "14 (6 PWM outputs)", "Analog Input Pins": "6", "DC Current per I/O Pin": "20 mA", "Flash Memory": "32 KB", "Clock Speed": "16 MHz"}'::jsonb,
  ARRAY['Pin 0 (RX) & 1 (TX): Serial', 'Pin 2 & 3: External Interrupts', 'Pin 3,5,6,9,10,11: PWM', 'Pin 13: Built-in LED', 'A4: I2C SDA', 'A5: I2C SCL'],
  ARRAY['Arduino IDE', 'Tinkercad', 'LabVIEW', 'MATLAB'],
  ARRAY['Obstacle Avoiding Robot', 'Digital Tachometer', 'Automated Plant Watering', 'RFID Door Lock'],
  ARRAY['prod-motor-driver-l298n', 'prod-ultrasonic-hcsr04', 'prod-servo-sg90', 'prod-breadboard-830'],
  ARRAY['beginner', 'student', 'college', 'robotics', 'standard'], 'ATmega328P', 4.9, 218, true
),
(
  'prod-ultrasonic-hcsr04', 'CR-SNS-US-01', 'HC-SR04 Ultrasonic Distance Sensor Module', 'cat-sensors', 'Sensors', 89.00, 149.00,
  'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80',
  'Non-contact distance measurement module providing 2cm to 400cm ranging accuracy up to 3mm. Built-in transmitter, receiver, and control circuit.',
  '{"Operating Voltage": "5V DC", "Operating Current": "15mA", "Frequency": "40 kHz", "Max Range": "400 cm (4 meters)", "Min Range": "2 cm", "Trigger Signal": "10uS TTL pulse", "Echo Output": "TTL high proportional to distance"}'::jsonb,
  ARRAY['VCC: +5V Power Supply', 'Trig: Trigger Input (10us TTL pulse)', 'Echo: Output signal duration', 'GND: Ground 0V'],
  ARRAY['Arduino', 'ESP32', 'Raspberry Pi Pico', 'NodeMCU', 'STM32'],
  ARRAY['Smart Dustbin', 'Obstacle Avoiding Robot', 'Water Level Detector', 'Reverse Parking Assistant'],
  ARRAY['prod-servo-sg90', 'prod-arduino-uno', 'prod-jumper-m2f', 'prod-piezo-buzzer'],
  ARRAY['sensors', 'ultrasonic', 'robotics', 'bestseller'], 'HC-SR04', 4.8, 184, true
),
(
  'prod-servo-sg90', 'CR-MOT-SERVO-01', 'SG90 9g Micro Servo Motor', 'cat-motors', 'Motors', 119.00, 199.00,
  'https://images.unsplash.com/photo-1563770660941-20978e870e26?w=600&auto=format&fit=crop&q=80',
  'High-torque miniature nylon gear servo motor capable of 180-degree precise positional rotation. Essential for robotic arms and camera pan-tilt setups.',
  '{"Operating Voltage": "4.8V to 6.0V", "Operating Speed": "0.12 sec/60 deg (4.8V)", "Stall Torque": "1.8 kg-cm (4.8V)", "Gear Type": "Nylon gear", "Rotation": "0 to 180 degrees", "Weight": "9 grams"}'::jsonb,
  ARRAY['Brown Wire: GND', 'Red Wire: +5V Power', 'Orange/Yellow Wire: PWM Pulse Control'],
  ARRAY['Arduino', 'ESP32', 'Raspberry Pi Pico', 'Micro:bit'],
  ARRAY['Smart Dustbin Lid Opener', 'Robotic Gripper Arm', 'Solar Panel Sun Tracker', 'Camera Gimbal'],
  ARRAY['prod-ultrasonic-hcsr04', 'prod-arduino-uno', 'prod-jumper-m2m'],
  ARRAY['motors', 'servo', 'robotics', 'quick-mover'], 'SG90', 4.7, 96, true
),
(
  'prod-motor-driver-l298n', 'CR-DRV-L298N-01', 'L298N Dual H-Bridge Motor Driver', 'cat-drivers', 'Motor Drivers', 149.00, 249.00,
  'https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=600&auto=format&fit=crop&q=80',
  'High-power dual H-bridge motor driver module capable of driving two DC motors or one bipolar stepper motor up to 2A per channel. Integrated 78M05 5V regulator.',
  '{"Driver Chip": "L298N Dual H-Bridge", "Motor Supply Voltage": "5V - 35V", "Peak Motor Current": "2A per bridge", "Logic Voltage": "5V", "Logic Control Current": "0-36mA", "Maximum Power": "25W"}'::jsonb,
  ARRAY['OUT1 & OUT2: Motor A Terminals', 'OUT3 & OUT4: Motor B Terminals', 'VMS: Motor Power 12V', 'GND: Power Ground', '5V: Logic Output/Input', 'ENA & ENB: PWM Speed Enable', 'IN1 to IN4: Direction Logic Inputs'],
  ARRAY['Arduino Uno', 'ESP32', 'Raspberry Pi', 'NodeMCU'],
  ARRAY['Line Following Robot', 'RC Bluetooth Car', 'Obstacle Avoiding Rover', 'Dual Axis Stepper Turntable'],
  ARRAY['prod-bo-motor-wheel', 'prod-arduino-uno', 'prod-battery-18650-2s'],
  ARRAY['motors', 'drivers', 'robotics', 'high-power'], 'L298N', 4.8, 114, true
),
(
  'prod-oled-096', 'CR-DSP-OLED-01', '0.96" I2C IIC 128x64 OLED Display (Blue)', 'cat-displays', 'Displays', 189.00, 299.00,
  'https://images.unsplash.com/photo-1517055729445-fa7d27394b48?w=600&auto=format&fit=crop&q=80',
  'High-contrast crisp 128x64 pixel self-luminous organic LED display module with SSD1306 driver. Needs only 2 I2C wires for communication.',
  '{"Display Size": "0.96 inch", "Resolution": "128 x 64 pixels", "Driver IC": "SSD1306", "Interface": "I2C (Address: 0x3C)", "Supply Voltage": "3.3V - 5V DC", "Power Consumption": "0.04W typical", "Viewing Angle": "> 160 degrees"}'::jsonb,
  ARRAY['GND: Ground', 'VCC: 3.3V or 5V Power', 'SCL: I2C Clock Pin', 'SDA: I2C Data Pin'],
  ARRAY['Arduino', 'ESP32', 'Raspberry Pi Pico', 'STM32', 'RP2040'],
  ARRAY['Mini Weather Dashboard', 'Portable Crypto Ticker', 'Smart Health Monitor', 'Handheld Gaming Console'],
  ARRAY['prod-esp32-v1', 'prod-dht11', 'prod-jumper-m2f'],
  ARRAY['displays', 'i2c', 'oled', 'bestseller'], 'SSD1306', 4.9, 130, true
),
(
  'prod-dht11', 'CR-SNS-DHT-01', 'DHT11 Temperature and Humidity Sensor', 'cat-sensors', 'Sensors', 79.00, 129.00,
  'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=600&auto=format&fit=crop&q=80',
  'Composite sensor containing a calibrated digital signal output of temperature and humidity. Pre-mounted on 3-pin breakout board with pull-up resistor.',
  '{"Temperature Range": "0 to 50 deg C (+/- 2 deg C)", "Humidity Range": "20 to 90% RH (+/- 5% RH)", "Sampling Rate": "1 Hz (once per second)", "Operating Voltage": "3.3V to 5.5V", "Current": "0.5 to 2.5 mA"}'::jsonb,
  ARRAY['VCC: 3.3V - 5V DC', 'DATA: Single-bus Digital Signal', 'GND: Ground 0V'],
  ARRAY['Arduino', 'ESP32', 'Raspberry Pi Pico', 'NodeMCU'],
  ARRAY['Smart Plant Monitor', 'Home Weather Station', 'Server Room Thermostat', 'Greenhouse Automation'],
  ARRAY['prod-oled-096', 'prod-esp32-v1', 'prod-relay-1ch'],
  ARRAY['sensors', 'temperature', 'iot', 'weather'], 'DHT11', 4.6, 75, true
),
(
  'prod-soil-moisture', 'CR-SNS-SOIL-01', 'Capacitive Soil Moisture Sensor V1.2 (Corrosion Resistant)', 'cat-sensors', 'Sensors', 99.00, 169.00,
  'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?w=600&auto=format&fit=crop&q=80',
  'Measures soil moisture levels by capacitive sensing rather than resistive sensing. Won''t corrode over time like cheap resistive probes.',
  '{"Operating Voltage": "3.3V - 5.5V DC", "Output Voltage": "0 - 3.0V DC", "Interface": "Analog Output (PH2.0-3P)", "Dimension": "98 x 23 mm"}'::jsonb,
  ARRAY['VCC: 3.3V - 5.5V Power', 'AOUT: Analog Voltage Output', 'GND: Ground'],
  ARRAY['Arduino', 'ESP32', 'Raspberry Pi Pico'],
  ARRAY['Smart Plant Monitor', 'Automatic Irrigation System', 'Automated Terrace Garden'],
  ARRAY['prod-esp32-v1', 'prod-relay-1ch', 'prod-oled-096'],
  ARRAY['sensors', 'capacitive', 'agriculture', 'iot'], 'CAP-SOIL-1.2', 4.8, 62, true
),
(
  'prod-relay-4ch', 'CR-MOD-RLY-04', '4-Channel 5V Relay Module with Optocoupler', 'cat-relays', 'Relay Modules', 149.00, 249.00,
  'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
  '4 isolated relay channels equipped with high-current relays (AC 250V 10A / DC 30V 10A). Optical isolation prevents electrical noise reaching microcontrollers.',
  '{"Trigger Voltage": "5V DC", "Trigger Current": "5mA per channel", "Relay Max Load": "AC 250V/10A, DC 30V/10A", "Isolation": "Optocoupler PC817"}'::jsonb,
  ARRAY['VCC: +5V Relay Supply', 'GND: Ground', 'IN1 to IN4: Active LOW Trigger Signals', 'COM, NO, NC for each relay channel'],
  ARRAY['Arduino Uno', 'ESP32', 'Raspberry Pi', 'NodeMCU'],
  ARRAY['Home Automation Switchboard', 'Smart Agricultural Pump Control', 'Aquarium Lighting System'],
  ARRAY['prod-esp32-v1', 'prod-hc05-bluetooth', 'prod-jumper-m2f'],
  ARRAY['relays', 'home-automation', 'iot', 'high-voltage'], 'RLY-5V-4CH', 4.9, 88, true
),
(
  'prod-relay-1ch', 'CR-MOD-RLY-01', '1-Channel 5V Relay Module with Optocoupler', 'cat-relays', 'Relay Modules', 49.00, 89.00,
  'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
  'Single 5V relay module with optocoupler isolation, power LED, and trigger status LED. Controls AC appliances safely.',
  '{"Trigger Voltage": "5V DC", "Contact Rating": "10A 250VAC / 10A 30VDC", "Trigger Type": "High/Low Level Selectable"}'::jsonb,
  ARRAY['VCC: 5V Power', 'IN: Trigger Signal', 'GND: Ground', 'COM: Common', 'NO: Normally Open', 'NC: Normally Closed'],
  ARRAY['Arduino', 'ESP32', 'Raspberry Pi Pico'],
  ARRAY['Smart Plant Irrigation Pump', 'Smart Lamp Controller', 'Exhaust Fan Trigger'],
  ARRAY['prod-soil-moisture', 'prod-esp32-v1', 'prod-submersible-pump'],
  ARRAY['relays', 'automation', 'compact'], 'RLY-5V-1CH', 4.7, 54, true
),
(
  'prod-hc05-bluetooth', 'CR-MOD-BT-01', 'HC-05 Wireless Bluetooth Serial Transceiver Module', 'cat-comm', 'Communication Modules', 249.00, 399.00,
  'https://images.unsplash.com/photo-1563770660941-20978e870e26?w=600&auto=format&fit=crop&q=80',
  'Classic Bluetooth SPP (Serial Port Protocol) module for transparent wireless serial connection. Can work in both Master and Slave roles.',
  '{"Bluetooth Protocol": "Bluetooth V2.0+EDR", "Operating Voltage": "3.6V - 6V DC (Breakout Board)", "Operating Current": "30mA", "Range": "Up to 10 meters", "Baud Rate": "9600 bps default"}'::jsonb,
  ARRAY['VCC: 5V Power Input', 'GND: Ground', 'TXD: Serial Transmit to Arduino RX', 'RXD: Serial Receive from Arduino TX', 'STATE: Connection Indicator', 'EN / KEY: AT Command Mode'],
  ARRAY['Arduino Uno', 'ESP32', 'Raspberry Pi', '8051 Microcontroller'],
  ARRAY['Smartphone Controlled RC Car', 'Wireless Sensor Telemetry', 'Bluetooth Wireless Display'],
  ARRAY['prod-motor-driver-l298n', 'prod-bo-motor-wheel', 'prod-arduino-uno'],
  ARRAY['bluetooth', 'wireless', 'robotics', 'serial'], 'HC-05', 4.8, 92, true
),
(
  'prod-bo-motor-wheel', 'CR-MOT-BO-01', 'Dual Shaft BO Motor (150 RPM) + 65mm Rubber Wheel Set', 'cat-motors', 'Motors', 89.00, 149.00,
  'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80',
  'Yellow straight dual-shaft BO geared DC motor with rugged rubber traction wheel. Delivers 150 RPM at 6V with high torque.',
  '{"Operating Voltage": "3V to 6V DC", "RPM": "150 RPM at 6V", "No Load Current": "150mA", "Wheel Diameter": "65 mm", "Wheel Width": "26 mm"}'::jsonb,
  ARRAY['Terminal A: DC Motor Positive', 'Terminal B: DC Motor Negative'],
  ARRAY['Motor Drivers: L298N, L293D'],
  ARRAY['2WD Robotic Chassis', 'Obstacle Avoiding Rover', 'Line Follower Bot'],
  ARRAY['prod-motor-driver-l298n', 'prod-2wd-chassis', 'prod-battery-18650-2s'],
  ARRAY['motors', 'wheels', 'robotics', 'bestseller'], 'BO-150RPM', 4.7, 110, true
),
(
  'prod-2wd-chassis', 'CR-ROB-CHS-01', 'Smart Robot Car 2WD Acrylic Chassis Kit', 'cat-robotics', 'Robotics', 299.00, 449.00,
  'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&auto=format&fit=crop&q=80',
  'Laser-cut transparent acrylic chassis with precut mounting slots for Arduino, L298N, servos, and sensors. Includes caster wheel, battery holder, and hardware.',
  '{"Material": "High-Grade Acrylic", "Dimensions": "20 x 14 cm", "Includes": "Chassis plate, 1x Caster wheel, 2x BO Motors, 2x Wheels, Screws & Spacers"}'::jsonb,
  ARRAY['Pre-drilled mounting holes for Uno, Mega, L298N, ultrasonic sensors and battery packs'],
  ARRAY['Arduino Uno', 'ESP32', 'Raspberry Pi'],
  ARRAY['Obstacle Avoider', 'Bluetooth RC Car', 'Line Following Robot'],
  ARRAY['prod-motor-driver-l298n', 'prod-arduino-uno', 'prod-ultrasonic-hcsr04'],
  ARRAY['chassis', 'robotics', 'diy', 'kits'], '2WD-ROBOT-CHASSIS', 4.8, 80, true
),
(
  'prod-breadboard-830', 'CR-PRT-BB-830', 'MB-102 830-Point Solderless Breadboard', 'cat-tools', 'Tools & Prototyping', 119.00, 199.00,
  'https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?w=600&auto=format&fit=crop&q=80',
  'Premium full-sized prototyping breadboard with 830 tie points (630 terminal strip points and 200 power distribution bus points). Self-adhesive back.',
  '{"Tie Points": "830 Points", "Pitch": "2.54 mm standard DIP", "Power Rails": "4 distribution buses", "Backing": "Self-adhesive tape"}'::jsonb,
  ARRAY['Standard 2.54mm pitch layout matching all ICs, microcontrollers, and DuPont pins'],
  ARRAY['Universal compatibility with all circuits'],
  ARRAY['All electronics prototyping and lab experiments'],
  ARRAY['prod-jumper-m2m', 'prod-jumper-m2f', 'prod-breadboard-psu'],
  ARRAY['breadboard', 'prototyping', 'essential', 'lab'], 'MB-102', 4.9, 210, true
),
(
  'prod-jumper-m2m', 'CR-PRT-JMP-MM', '40-Pin Male-to-Male Jumper Wires (20cm Ribbon)', 'cat-tools', 'Tools & Prototyping', 59.00, 99.00,
  'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
  'Flexible 20cm multi-color 40-pin ribbon cable with gold-plated male DuPont headers on both ends. Easily separable into individual or multi-pin bundles.',
  '{"Length": "20 cm", "Conductor": "Copper-clad aluminum", "Pin Pitch": "2.54 mm", "Wire Gauge": "26 AWG", "Count": "40 pins"}'::jsonb,
  ARRAY['Compatible with breadboards, female headers, Arduino and ESP32 pins'],
  ARRAY['Universal'],
  ARRAY['All DIY circuits'],
  ARRAY['prod-jumper-m2f', 'prod-jumper-f2f', 'prod-breadboard-830'],
  ARRAY['wires', 'jumpers', 'essential'], 'JMP-20CM-MM', 4.9, 280, true
),
(
  'prod-jumper-m2f', 'CR-PRT-JMP-MF', '40-Pin Male-to-Female Jumper Wires (20cm Ribbon)', 'cat-tools', 'Tools & Prototyping', 59.00, 99.00,
  'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
  'Essential for connecting sensor modules and boards directly to breadboards or header pins without soldering.',
  '{"Length": "20 cm", "Connector Type": "Male to Female", "Pin Pitch": "2.54 mm", "Count": "40 wires"}'::jsonb,
  ARRAY['Universal DuPont headers'],
  ARRAY['Universal'],
  ARRAY['Sensor-to-board wiring'],
  ARRAY['prod-jumper-m2m', 'prod-ultrasonic-hcsr04', 'prod-dht11'],
  ARRAY['wires', 'jumpers', 'essential'], 'JMP-20CM-MF', 4.9, 240, true
),
(
  'prod-ir-sensor', 'CR-SNS-IR-01', 'IR Infrared Obstacle Avoidance Sensor Module', 'cat-sensors', 'Sensors', 49.00, 89.00,
  'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80',
  'Compact infrared proximity sensor with transmitter and receiver LED pair. Onboard potentiometer adjusts detection range (2cm to 30cm).',
  '{"Operating Voltage": "3.3V - 5V DC", "Detection Distance": "2cm - 30cm (Adjustable)", "Detection Angle": "35 degrees", "Output": "Digital active LOW"}'::jsonb,
  ARRAY['VCC: 3.3V to 5V Power', 'GND: Ground', 'OUT: Digital Trigger Signal (Low on Obstacle)'],
  ARRAY['Arduino', 'ESP32', 'Raspberry Pi Pico', '8051'],
  ARRAY['Line Following Robot', 'Automatic Hand Sanitizer', 'Conveyor Belt Object Counter'],
  ARRAY['prod-motor-driver-l298n', 'prod-arduino-uno', 'prod-servo-sg90'],
  ARRAY['sensors', 'infrared', 'robotics', 'quick-mover'], 'IR-AVOID-01', 4.7, 95, true
),
(
  'prod-pir-sensor', 'CR-SNS-PIR-01', 'HC-SR501 PIR Motion Sensor Module', 'cat-sensors', 'Sensors', 89.00, 149.00,
  'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=600&auto=format&fit=crop&q=80',
  'Pyroelectric infrared motion detector module with adjustable sensitivity and delay timer. Widely used for home security and automatic lighting.',
  '{"Operating Voltage": "4.5V - 20V DC", "Static Current": "< 50 uA", "Detection Range": "Up to 7 meters (120 deg cone)", "Delay Time": "0.3s - 5 minutes adjustable"}'::jsonb,
  ARRAY['VCC: 5V - 20V Input', 'OUT: 3.3V High Output on Motion', 'GND: Ground'],
  ARRAY['Arduino', 'ESP32', 'Raspberry Pi', 'Relays'],
  ARRAY['Home Security Intruder Alarm', 'Automatic Corridor Lighting', 'Washroom Motion Fan'],
  ARRAY['prod-piezo-buzzer', 'prod-relay-1ch', 'prod-esp32-v1'],
  ARRAY['sensors', 'security', 'pir', 'motion'], 'HC-SR501', 4.8, 102, true
),
(
  'prod-piezo-buzzer', 'CR-MOD-BUZZ-01', '5V Active Piezo Buzzer Module', 'cat-tools', 'Tools & Prototyping', 29.00, 59.00,
  'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
  'Active buzzer module with internal oscillating source. Emits a loud 2.5kHz continuous beep whenever 5V is applied.',
  '{"Operating Voltage": "3.5V - 5.5V DC", "Operating Current": "< 25 mA", "Sound Output": ">= 85 dB at 10cm", "Frequency": "2300 +/- 300 Hz"}'::jsonb,
  ARRAY['VCC / +: 5V Power', 'I/O / Trigger: Signal pin', 'GND / -: Ground'],
  ARRAY['Arduino', 'ESP32', 'Raspberry Pi Pico'],
  ARRAY['Security Alarm', 'Reverse Parking Beep', 'Countdown Timer'],
  ARRAY['prod-pir-sensor', 'prod-ultrasonic-hcsr04', 'prod-arduino-uno'],
  ARRAY['audio', 'buzzer', 'alarm'], 'BUZZ-ACT-5V', 4.6, 68, true
),
(
  'prod-submersible-pump', 'CR-MOT-PUMP-01', 'Mini 5V Submersible Water Pump + 1m Silicone Tube', 'cat-motors', 'Motors', 99.00, 169.00,
  'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80',
  'Low noise brushless DC mini water pump with 1 meter clear food-grade silicone tubing. Delivers up to 100 Liters/hour.',
  '{"Voltage": "DC 3V - 5V", "Current": "100 - 200 mA", "Flow Rate": "80 - 120 L/H", "Lift": "0.3 - 0.8 meters", "Tube ID": "6 mm"}'::jsonb,
  ARRAY['Red Wire: +5V Power', 'Black Wire: Ground 0V'],
  ARRAY['Relays: RLY-5V-1CH, MOSFET IRFZ44N'],
  ARRAY['Smart Plant Watering System', 'Automated Sanitizer Dispenser', 'Mini Desktop Fountain'],
  ARRAY['prod-relay-1ch', 'prod-soil-moisture', 'prod-arduino-uno'],
  ARRAY['pump', 'water', 'agriculture', 'compact'], 'PUMP-DC-5V', 4.8, 77, true
),
(
  'prod-rpi-pico', 'CR-MCU-PICO-01', 'Raspberry Pi Pico (RP2040 Dual-Core ARM Cortex M0+)', 'cat-rpi', 'Raspberry Pi', 379.00, 529.00,
  'https://images.unsplash.com/photo-1553406830-ef2513450d76?w=600&auto=format&fit=crop&q=80',
  'High-performance microcontroller board featuring Raspberry Pi designed RP2040 chip running up to 133MHz with flexible Programmable I/O (PIO).',
  '{"Processor": "Dual-Core ARM Cortex M0+ @ 133MHz", "SRAM": "264 KB on-chip", "Flash": "2 MB QSPI Flash", "GPIO Pins": "26 multi-function", "Programmable I/O": "8 state machines", "ADC": "3x 12-bit ADC channels"}'::jsonb,
  ARRAY['Pin 1 to 26: Configurable GPIO with PIO', 'Pin 36: 3V3 Output', 'Pin 38: GND', 'Pin 39: VSYS Input (1.8V to 5.5V)'],
  ARRAY['MicroPython', 'C/C++ SDK', 'CircuitPython', 'Arduino IDE'],
  ARRAY['USB Macro Keypad', 'VGA Video Output Synthesizer', 'High-Speed Logic Analyzer'],
  ARRAY['prod-breadboard-830', 'prod-oled-096', 'prod-jumper-m2m'],
  ARRAY['raspberry-pi', 'rp2040', 'python', 'modern'], 'RP2040', 4.9, 125, true
),
(
  'prod-lcd-1602-i2c', 'CR-DSP-LCD-01', '16x2 Character LCD Display with I2C Backpack (Blue)', 'cat-displays', 'Displays', 199.00, 299.00,
  'https://images.unsplash.com/photo-1517055729445-fa7d27394b48?w=600&auto=format&fit=crop&q=80',
  'Classic 16 character x 2 line alphanumeric display pre-soldered with PCF8574 I2C adapter. Reduces wiring from 16 pins to just 2 communication wires.',
  '{"Display Format": "16 Characters x 2 Lines", "Backlight": "Bright Blue with White Characters", "Interface": "I2C (Address 0x27 or 0x3F)", "Operating Voltage": "5V DC", "Contrast Adjustment": "Onboard Trimpot"}'::jsonb,
  ARRAY['GND: Ground', 'VCC: 5V Power', 'SDA: I2C Serial Data', 'SCL: I2C Serial Clock'],
  ARRAY['Arduino', 'ESP32', 'Raspberry Pi Pico', '8051'],
  ARRAY['Weather Station Display', 'Visitor Counter', 'RFID Attendance Register', 'Digital Clock'],
  ARRAY['prod-dht11', 'prod-arduino-uno', 'prod-jumper-m2f'],
  ARRAY['displays', 'lcd', 'i2c', 'college-standard'], 'LCD-1602-I2C', 4.8, 145, true
),
(
  'prod-battery-18650-2s', 'CR-PWR-18650-2S', '2x 18650 Battery Holder with DC Jack & On/Off Switch', 'cat-tools', 'Tools & Prototyping', 69.00, 119.00,
  'https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?w=600&auto=format&fit=crop&q=80',
  'Sturdy 2-slot series battery case outputting 7.4V to 8.4V. Includes integrated on/off slide switch and standard 5.5x2.1mm DC barrel connector for Arduino Uno.',
  '{"Configuration": "2S (Series - 7.4V nominal)", "Compatible Cells": "18650 Li-Ion (3.7V)", "Connector": "Standard 5.5 x 2.1 mm DC Barrel Plug", "Switch": "Built-in sliding toggle"}'::jsonb,
  ARRAY['Center Positive 5.5x2.1mm Barrel Jack'],
  ARRAY['Arduino Uno / Mega DC Jack', 'L298N VMS input'],
  ARRAY['Robotic Cars', 'Portable Instrumentation', 'Remote IoT Nodes'],
  ARRAY['prod-arduino-uno', 'prod-motor-driver-l298n', 'prod-2wd-chassis'],
  ARRAY['power', 'battery', 'portable'], 'BAT-HOLDER-2S', 4.7, 85, true
),
(
  'prod-gas-sensor-mq2', 'CR-SNS-GAS-MQ2', 'MQ-2 Gas / Smoke / LPG Sensor Module', 'cat-sensors', 'Sensors', 129.00, 199.00,
  'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80',
  'Electrochemical gas sensor module sensitive to LPG, propane, methane, hydrogen, alcohol, and industrial smoke. Features both Analog and Digital outputs.',
  '{"Heater Voltage": "5.0V +/- 0.2V", "Loop Voltage": "<= 24V DC", "Sensing Range": "300 - 10000 ppm", "Output": "Analog voltage proportional to concentration + Digital threshold"}'::jsonb,
  ARRAY['VCC: 5V Power', 'GND: Ground', 'D0: Digital TTL Trigger Output', 'A0: Analog Concentration Output'],
  ARRAY['Arduino', 'ESP32', 'Raspberry Pi'],
  ARRAY['Kitchen LPG Leakage Detector', 'Factory Smoke Alarm', 'Fire Detection Rover'],
  ARRAY['prod-piezo-buzzer', 'prod-esp32-v1', 'prod-relay-1ch'],
  ARRAY['sensors', 'gas', 'safety', 'iot'], 'MQ-2', 4.8, 64, true
),
(
  'prod-led-pack-50', 'CR-PRT-LED-50', '5mm Diffused LEDs Assortment Kit (50 Pieces - 5 Colors)', 'cat-tools', 'Tools & Prototyping', 79.00, 149.00,
  'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&auto=format&fit=crop&q=80',
  'Box of 50 bright diffused 5mm LEDs (10x Red, 10x Green, 10x Yellow, 10x Blue, 10x White) with standard long anode pins. Ideal for circuit indicators.',
  '{"Diameter": "5 mm", "Forward Voltage": "Red/Yellow: 1.8V - 2.2V; Green/Blue/White: 3.0V - 3.2V", "Max Current": "20 mA", "Quantity": "50 pieces"}'::jsonb,
  ARRAY['Long Pin: Anode (+)', 'Short Pin / Flat Edge: Cathode (-)'],
  ARRAY['Universal'],
  ARRAY['Traffic Light Simulator', 'LED Bargraph Indicator', 'Status Display'],
  ARRAY['prod-resistor-pack-100', 'prod-breadboard-830', 'prod-jumper-m2m'],
  ARRAY['leds', 'optics', 'pack'], 'LED-5MM-50PK', 4.9, 150, true
),
(
  'prod-resistor-pack-100', 'CR-PRT-RES-100', '1/4W Metal Film Resistors Assortment Pack (100 Pieces)', 'cat-tools', 'Tools & Prototyping', 59.00, 99.00,
  'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&auto=format&fit=crop&q=80',
  'High-precision 1% metal film resistors containing 10 popular values (100R, 220R, 330R, 1K, 4.7K, 10K, 22K, 47K, 100K, 1M - 10 pcs each).',
  '{"Power Rating": "0.25 Watt (1/4W)", "Tolerance": "1% Precision", "Package": "Axial Through-Hole"}'::jsonb,
  ARRAY['Standard 5-band color code markings'],
  ARRAY['Universal'],
  ARRAY['All electronic circuits'],
  ARRAY['prod-led-pack-50', 'prod-breadboard-830'],
  ARRAY['resistors', 'passives', 'essential'], 'RES-14W-100PK', 4.9, 180, true
),
(
  'prod-rain-drop-sensor', 'CR-SNS-RAIN-01', 'Raindrop / Snow Water Detection Sensor Module', 'cat-sensors', 'Sensors', 69.00, 119.00,
  'https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=600&auto=format&fit=crop&q=80',
  'Nickel-plated rain sensor board with LM393 comparator module. Detects water droplet deposition on the PCB surface with analog and digital outputs.',
  '{"Voltage": "3.3V - 5V DC", "Board Size": "5.0 x 4.0 cm nickel board", "Outputs": "Analog voltage and Digital comparator threshold"}'::jsonb,
  ARRAY['VCC: 3.3V - 5V Power', 'GND: Ground', 'D0: Digital Rain Trigger', 'A0: Analog Rain Intensity'],
  ARRAY['Arduino', 'ESP32', 'Raspberry Pi Pico'],
  ARRAY['Automatic Window Closer', 'Smart Rain Alarm', 'Agricultural Weather Station'],
  ARRAY['prod-servo-sg90', 'prod-arduino-uno', 'prod-oled-096'],
  ARRAY['sensors', 'weather', 'rain', 'automation'], 'RAIN-SNS-01', 4.7, 58, true
),
(
  'prod-multimeter-dt830d', 'CR-TLS-DMM-01', 'Digital Multimeter DT830D with Probes & Buzzer', 'cat-tools', 'Tools & Prototyping', 199.00, 349.00,
  'https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?w=600&auto=format&fit=crop&q=80',
  'Standard electronics laboratory digital multimeter measuring DC/AC voltage, DC current, resistance, diode test, and audible continuity buzzer.',
  '{"DC Voltage": "200mV - 1000V", "AC Voltage": "200V - 750V", "DC Current": "200uA - 10A", "Resistance": "200 Ohm - 2000K Ohm", "Includes": "1x 9V Battery, 1x Pair of Test Leads"}'::jsonb,
  ARRAY['10A Port: High Current', 'V/Ohm/mA Port: Standard measurements', 'COM: Common Ground Probe'],
  ARRAY['Universal Test & Measurement'],
  ARRAY['Circuit debugging, voltage checking, and cable continuity testing'],
  ARRAY['prod-breadboard-830', 'prod-jumper-m2m'],
  ARRAY['tools', 'multimeter', 'lab-essential'], 'DT830D', 4.8, 160, true
),
(
  'prod-soldering-iron-25w', 'CR-TLS-SLD-25W', '25W Soldering Iron with Pointed Copper Tip', 'cat-tools', 'Tools & Prototyping', 169.00, 299.00,
  'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80',
  'Quick-heating 25-watt pencil soldering iron for circuit board assembly, wire joints, and module header pins.',
  '{"Power": "25 Watts", "Operating Voltage": "220V - 240V AC 50Hz", "Tip": "Replaceable nickel-plated pointed bit", "Handle": "Heat-resistant rubber grip"}'::jsonb,
  ARRAY['Standard Indian 2-pin / 3-pin plug'],
  ARRAY['Electronics repairs and component soldering'],
  ARRAY['Header pin soldering, DIY project assembly'],
  ARRAY['prod-perfboard-7x9', 'prod-multimeter-dt830d'],
  ARRAY['tools', 'soldering', 'hardware'], 'SLD-25W', 4.7, 90, true
),
(
  'prod-perfboard-7x9', 'CR-PRT-PCB-7X9', 'Double-Sided FR4 Glass-Fiber Perfboard (7x9 cm)', 'cat-tools', 'Tools & Prototyping', 45.00, 79.00,
  'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80',
  'Sturdy pre-tinned FR4 double-sided prototype PCB with standard 2.54mm hole spacing. Permanent soldering board for completed prototypes.',
  '{"Material": "FR-4 High Quality Glass Fiber", "Dimensions": "70 mm x 90 mm", "Pitch": "2.54 mm (0.1 inch)", "Hole Diameter": "1.0 mm"}'::jsonb,
  ARRAY['Pre-drilled 2.54mm grid compatible with all DIP chips'],
  ARRAY['Universal'],
  ARRAY['Permanent circuit packaging for college submissions'],
  ARRAY['prod-soldering-iron-25w', 'prod-jumper-m2m'],
  ARRAY['pcb', 'prototyping', 'perfboard'], 'PCB-FR4-7X9', 4.9, 110, true
),
(
  'prod-breadboard-psu', 'CR-PWR-BB-PSU', 'MB-102 Breadboard 3.3V / 5V Power Supply Module', 'cat-tools', 'Tools & Prototyping', 79.00, 139.00,
  'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
  'Plugs right into the top power rails of standard 830-tie breadboards. Offers selectable 3.3V or 5V outputs on each rail from DC adapter or USB.',
  '{"Input Voltage": "6.5V - 12V DC (Barrel Jack) or USB 5V", "Output Voltage": "3.3V / 5V Switchable per rail", "Maximum Output Current": "700 mA"}'::jsonb,
  ARRAY['Header pins plug directly into + and - rails of breadboards'],
  ARRAY['MB-102 Breadboards'],
  ARRAY['Breadboard prototyping without relying on PC USB ports'],
  ARRAY['prod-breadboard-830', 'prod-jumper-m2m'],
  ARRAY['power', 'breadboard', 'convenient'], 'MB-102-PSU', 4.8, 88, true
),
(
  'prod-sound-sensor', 'CR-SNS-SOUND-01', 'Microphone Sound Detection Sensor Module', 'cat-sensors', 'Sensors', 49.00, 89.00,
  'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80',
  'High-sensitivity electret condenser microphone module with LM393 comparator. Detects clapping, voice, and ambient sound thresholds.',
  '{"Voltage": "4V - 6V DC", "Microphone": "Electret Condenser", "Output": "Digital TTL Switch Output"}'::jsonb,
  ARRAY['VCC: 5V Power', 'GND: Ground', 'OUT: Digital Trigger Signal on Sound'],
  ARRAY['Arduino', 'ESP32', 'Raspberry Pi Pico'],
  ARRAY['Clap Switch Lamp', 'Noise Monitor', 'Smart Acoustic Trigger'],
  ARRAY['prod-relay-1ch', 'prod-arduino-uno'],
  ARRAY['sensors', 'sound', 'acoustic'], 'SOUND-SNS-01', 4.6, 52, true
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  image = EXCLUDED.image,
  description = EXCLUDED.description,
  specifications = EXCLUDED.specifications,
  active = EXCLUDED.active;

-- 5. SEED STORE INVENTORY (Store A, Store B, Store C with realistic stock variations)
-- Store A (Saraswathipuram Hub): Well-stocked
-- Store B (Hebbal Industrial Hub): Certain modules sold out / low stock
-- Store C (Vidyaranyapuram Hub): Moderate stock
INSERT INTO public.store_inventory (store_id, product_id, quantity, min_stock_level) VALUES
-- Store A
('store-saraswathi', 'prod-esp32-v1', 28, 5),
('store-saraswathi', 'prod-arduino-uno', 35, 5),
('store-saraswathi', 'prod-ultrasonic-hcsr04', 45, 10),
('store-saraswathi', 'prod-servo-sg90', 40, 8),
('store-saraswathi', 'prod-motor-driver-l298n', 22, 5),
('store-saraswathi', 'prod-oled-096', 18, 5),
('store-saraswathi', 'prod-dht11', 30, 5),
('store-saraswathi', 'prod-soil-moisture', 25, 5),
('store-saraswathi', 'prod-relay-4ch', 16, 4),
('store-saraswathi', 'prod-relay-1ch', 32, 5),
('store-saraswathi', 'prod-hc05-bluetooth', 14, 4),
('store-saraswathi', 'prod-bo-motor-wheel', 50, 10),
('store-saraswathi', 'prod-2wd-chassis', 15, 3),
('store-saraswathi', 'prod-breadboard-830', 60, 10),
('store-saraswathi', 'prod-jumper-m2m', 80, 15),
('store-saraswathi', 'prod-jumper-m2f', 75, 15),
('store-saraswathi', 'prod-ir-sensor', 40, 8),
('store-saraswathi', 'prod-pir-sensor', 24, 5),
('store-saraswathi', 'prod-piezo-buzzer', 50, 10),
('store-saraswathi', 'prod-submersible-pump', 20, 4),
('store-saraswathi', 'prod-rpi-pico', 19, 4),
('store-saraswathi', 'prod-lcd-1602-i2c', 22, 5),
('store-saraswathi', 'prod-battery-18650-2s', 30, 6),
('store-saraswathi', 'prod-gas-sensor-mq2', 15, 4),
('store-saraswathi', 'prod-led-pack-50', 50, 10),
('store-saraswathi', 'prod-resistor-pack-100', 60, 10),
('store-saraswathi', 'prod-rain-drop-sensor', 18, 4),
('store-saraswathi', 'prod-multimeter-dt830d', 12, 3),
('store-saraswathi', 'prod-soldering-iron-25w', 15, 4),
('store-saraswathi', 'prod-perfboard-7x9', 40, 8),
('store-saraswathi', 'prod-breadboard-psu', 25, 5),
('store-saraswathi', 'prod-sound-sensor', 20, 5),

-- Store B (Hebbal) - Some items zero / low stock demonstrating inventory variance
('store-hebbal', 'prod-esp32-v1', 0, 5), -- Out of stock in Store B!
('store-hebbal', 'prod-arduino-uno', 14, 5),
('store-hebbal', 'prod-ultrasonic-hcsr04', 20, 8),
('store-hebbal', 'prod-servo-sg90', 3, 5), -- Low stock!
('store-hebbal', 'prod-motor-driver-l298n', 10, 5),
('store-hebbal', 'prod-oled-096', 0, 5), -- Out of stock in Store B!
('store-hebbal', 'prod-dht11', 12, 5),
('store-hebbal', 'prod-soil-moisture', 8, 4),
('store-hebbal', 'prod-relay-4ch', 6, 4),
('store-hebbal', 'prod-relay-1ch', 18, 5),
('store-hebbal', 'prod-hc05-bluetooth', 5, 3),
('store-hebbal', 'prod-bo-motor-wheel', 25, 8),
('store-hebbal', 'prod-2wd-chassis', 0, 3), -- Out of stock in Store B!
('store-hebbal', 'prod-breadboard-830', 35, 8),
('store-hebbal', 'prod-jumper-m2m', 45, 10),
('store-hebbal', 'prod-jumper-m2f', 40, 10),
('store-hebbal', 'prod-ir-sensor', 22, 6),
('store-hebbal', 'prod-pir-sensor', 10, 4),
('store-hebbal', 'prod-piezo-buzzer', 30, 8),
('store-hebbal', 'prod-submersible-pump', 2, 4), -- Low stock
('store-hebbal', 'prod-rpi-pico', 12, 4),
('store-hebbal', 'prod-lcd-1602-i2c', 14, 4),
('store-hebbal', 'prod-battery-18650-2s', 15, 5),
('store-hebbal', 'prod-gas-sensor-mq2', 8, 3),
('store-hebbal', 'prod-led-pack-50', 30, 8),
('store-hebbal', 'prod-resistor-pack-100', 35, 8),
('store-hebbal', 'prod-rain-drop-sensor', 9, 3),
('store-hebbal', 'prod-multimeter-dt830d', 0, 3), -- Out of stock
('store-hebbal', 'prod-soldering-iron-25w', 8, 4),
('store-hebbal', 'prod-perfboard-7x9', 25, 6),
('store-hebbal', 'prod-breadboard-psu', 12, 4),
('store-hebbal', 'prod-sound-sensor', 10, 4),

-- Store C (Vidyaranyapuram)
('store-vidya', 'prod-esp32-v1', 15, 5),
('store-vidya', 'prod-arduino-uno', 20, 5),
('store-vidya', 'prod-ultrasonic-hcsr04', 28, 8),
('store-vidya', 'prod-servo-sg90', 18, 5),
('store-vidya', 'prod-motor-driver-l298n', 12, 4),
('store-vidya', 'prod-oled-096', 14, 4),
('store-vidya', 'prod-dht11', 19, 5),
('store-vidya', 'prod-soil-moisture', 16, 4),
('store-vidya', 'prod-relay-4ch', 10, 3),
('store-vidya', 'prod-relay-1ch', 22, 5),
('store-vidya', 'prod-hc05-bluetooth', 8, 3),
('store-vidya', 'prod-bo-motor-wheel', 30, 8),
('store-vidya', 'prod-2wd-chassis', 9, 3),
('store-vidya', 'prod-breadboard-830', 40, 8),
('store-vidya', 'prod-jumper-m2m', 55, 10),
('store-vidya', 'prod-jumper-m2f', 50, 10),
('store-vidya', 'prod-ir-sensor', 25, 6),
('store-vidya', 'prod-pir-sensor', 15, 4),
('store-vidya', 'prod-piezo-buzzer', 35, 8),
('store-vidya', 'prod-submersible-pump', 12, 4),
('store-vidya', 'prod-rpi-pico', 14, 4),
('store-vidya', 'prod-lcd-1602-i2c', 16, 4),
('store-vidya', 'prod-battery-18650-2s', 18, 5),
('store-vidya', 'prod-gas-sensor-mq2', 10, 3),
('store-vidya', 'prod-led-pack-50', 35, 8),
('store-vidya', 'prod-resistor-pack-100', 45, 8),
('store-vidya', 'prod-rain-drop-sensor', 12, 3),
('store-vidya', 'prod-multimeter-dt830d', 7, 3),
('store-vidya', 'prod-soldering-iron-25w', 10, 4),
('store-vidya', 'prod-perfboard-7x9', 30, 6),
('store-vidya', 'prod-breadboard-psu', 15, 4),
('store-vidya', 'prod-sound-sensor', 14, 4)
ON CONFLICT (store_id, product_id) DO UPDATE SET
  quantity = EXCLUDED.quantity,
  min_stock_level = EXCLUDED.min_stock_level,
  updated_at = NOW();

-- 6. SEED 8 PROJECT KITS
INSERT INTO public.project_kits (
  id, name, tagline, description, image, difficulty, estimated_build_time, price, original_price, savings, delivery_estimate_min, guide_steps, skills_learned, active
) VALUES
(
  'kit-smart-dustbin', 'Smart Contactless Dustbin Kit',
  'Automatic touchless opening bin using Ultrasonic ranging and servo actuation. Perfect for school science exhibitions and hygiene innovation.',
  'Complete kit containing Arduino Uno, HC-SR04 ultrasonic distance sensor, SG90 servo motor, battery pack, and jumper wires. Ready to assemble in 45 minutes.',
  'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600&auto=format&fit=crop&q=80',
  'Beginner', '45 Mins', 699.00, 899.00, 200.00, 20,
  ARRAY['1. Mount the HC-SR04 ultrasonic sensor on the dustbin lid.', '2. Connect Trigger and Echo pins to Arduino Digital Pins 9 and 10.', '3. Wire SG90 Servo PWM signal to Pin 3.', '4. Flash provided sketch to open lid when object is within 20cm.'],
  ARRAY['Ultrasonic distance calculation', 'PWM Servo motor angle positioning', 'Basic Arduino C++ coding', 'Physical actuator linkage'], true
),
(
  'kit-plant-monitor', 'Smart Plant Monitor & Auto-Watering Kit',
  'IoT soil moisture and automated drip irrigation controller powered by ESP32 WiFi and capacitive probe.',
  'Monitors plant hydration in real-time, displays status on a 0.96" OLED, and activates an automatic water pump when soil moisture drops below threshold.',
  'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?w=600&auto=format&fit=crop&q=80',
  'Beginner', '60 Mins', 799.00, 1099.00, 300.00, 25,
  ARRAY['1. Insert capacitive soil probe into plant pot soil.', '2. Connect analog output pin to ESP32 ADC pin 34.', '3. Connect 5V relay module to trigger submersible water pump.', '4. Configure Blynk/Thingspeak cloud dashboard for remote phone alerts.'],
  ARRAY['Capacitive analog sensing', 'Relay power switching', 'OLED I2C display drivers', 'IoT telemetry on ESP32'], true
),
(
  'kit-line-follower', 'Line Following Autonomous Robot Kit',
  'Classic 2-wheel drive autonomous robot tracking black or white tracks using infrared optical reflectance sensors.',
  'Complete robotic platform with acrylic chassis, dual BO geared motors, L298N motor driver module, dual IR reflectance sensors, and battery power.',
  'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&auto=format&fit=crop&q=80',
  'Intermediate', '90 Mins', 999.00, 1399.00, 400.00, 20,
  ARRAY['1. Assemble 2WD chassis and attach BO motors with rubber wheels.', '2. Mount L298N driver and wire motor terminal blocks.', '3. Position dual IR sensors facing downward 5mm above the track surface.', '4. Implement differential steering control logic on Arduino Uno.'],
  ARRAY['DC Motor differential steering', 'H-Bridge PWM speed regulation', 'Infrared analog/digital thresholding', 'Autonomous navigation algorithms'], true
),
(
  'kit-home-automation', 'ESP32 Smart Home Automation Kit (4-Appliances)',
  'WiFi and Bluetooth IoT switchboard controller to automate 4 household electrical AC appliances from your smartphone.',
  'Includes ESP32 DevKit V1, 4-Channel isolated relay module, breadboard, status LEDs, and step-by-step connection guide for safe switching.',
  'https://images.unsplash.com/photo-1558002038-1055907df827?w=600&auto=format&fit=crop&q=80',
  'Intermediate', '75 Mins', 899.00, 1249.00, 350.00, 25,
  ARRAY['1. Connect ESP32 GPIOs 18, 19, 21, and 22 to the 4-channel relay input terminals.', '2. Power ESP32 and Relay via 5V regulated source.', '3. Flash Arduino sketch with WebSockets / Blynk cloud server credentials.', '4. Control household lights and fans from mobile app.'],
  ARRAY['Optocoupler relay isolation', 'WebSockets / REST API control', 'Safe AC switching protocols', 'Mobile dashboard UX'], true
),
(
  'kit-rc-car', 'Smartphone Bluetooth Controlled RC Car Kit',
  'High-speed mobile controlled robotic car steered seamlessly via Android/iOS Bluetooth terminal application.',
  'Includes 2WD chassis, dual BO motors, L298N driver, HC-05 Bluetooth module, Arduino Uno, 2S 18650 battery holder, and complete assembly screws.',
  'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=600&auto=format&fit=crop&q=80',
  'Intermediate', '90 Mins', 1099.00, 1549.00, 450.00, 25,
  ARRAY['1. Assemble 2WD car chassis and solder wires to BO DC motors.', '2. Mount Arduino Uno, L298N motor driver, and HC-05 Bluetooth transceiver.', '3. Wire UART serial communication (RX/TX).', '4. Pair phone with HC-05 and control forward/reverse/turn gestures.'],
  ARRAY['UART serial communication', 'Wireless packet decoding', 'Motor torque control', 'Chassis mechanical assembly'], true
),
(
  'kit-security-alarm', 'Home Intruder Security Alarm Kit',
  'Active passive infrared detection system that trips a high-decibel piezo siren upon detecting human presence.',
  'Includes HC-SR501 PIR motion sensor, active 5V piezo buzzer, 1-channel relay, status indicator LEDs, and battery clip with Arduino Uno.',
  'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=600&auto=format&fit=crop&q=80',
  'Beginner', '40 Mins', 649.00, 899.00, 250.00, 18,
  ARRAY['1. Position HC-SR501 PIR sensor at room doorway.', '2. Wire PIR digital out pin to Arduino interrupt pin.', '3. Connect 5V piezo buzzer and red alert LED.', '4. Code armed state countdown and intruder alert triggers.'],
  ARRAY['Pyroelectric motion physics', 'Hardware interrupts in microcontrollers', 'Acoustic alarm synthesis', 'Digital input filtering'], true
),
(
  'kit-weather-station', 'IoT Mini Weather Station Kit',
  'Live ambient weather monitoring station measuring temperature, humidity, and atmospheric comfort with crisp OLED visualization.',
  'Features ESP32 DevKit, DHT11 temp/humidity sensor, 0.96" OLED display, breadboard, and cloud data logging capabilities.',
  'https://images.unsplash.com/photo-1592210454359-9043f067919b?w=600&auto=format&fit=crop&q=80',
  'Beginner', '50 Mins', 749.00, 1049.00, 300.00, 20,
  ARRAY['1. Wire DHT11 single-bus digital data pin to ESP32 pin 4.', '2. Connect 0.96" SSD1306 OLED display using I2C (SDA=21, SCL=22).', '3. Initialize Adafruit SSD1306 graphics library.', '4. Render temperature gauge, humidity bar, and heat index.'],
  ARRAY['I2C protocol communication', 'Single-wire digital protocol', 'OLED pixel graphics rendering', 'Environmental sensor calibration'], true
),
(
  'kit-obstacle-avoider', 'Ultrasonic Obstacle Avoiding Rover Kit',
  'Self-navigating smart rover that scans the room using a scanning ultrasonic servo turret and avoids walls automatically.',
  'Includes 2WD chassis kit, Arduino Uno, HC-SR04 sensor, SG90 servo motor for panning, L298N driver, and battery pack.',
  'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&auto=format&fit=crop&q=80',
  'Intermediate', '90 Mins', 1149.00, 1599.00, 450.00, 25,
  ARRAY['1. Assemble 2WD chassis and mount L298N driver with dual BO motors.', '2. Mount SG90 servo motor in front and attach HC-SR04 ultrasonic sensor to servo horn.', '3. Program rover to scan left, center, right when obstacle detected.', '4. Navigate toward the direction with maximum clearance.'],
  ARRAY['Sensor turret servo positioning', 'Distance vector mapping', 'Autonomous collision avoidance algorithms', 'Real-time decision trees'], true
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  image = EXCLUDED.image,
  description = EXCLUDED.description,
  active = EXCLUDED.active;

-- 7. SEED PROJECT KIT ITEMS (Referencing Real Products Without Duplicating Information)
INSERT INTO public.project_kit_items (project_kit_id, product_id, quantity, sort_order) VALUES
-- Smart Dustbin (Uno + Ultrasonic + Servo + Jumper + Battery)
('kit-smart-dustbin', 'prod-arduino-uno', 1, 1),
('kit-smart-dustbin', 'prod-ultrasonic-hcsr04', 1, 2),
('kit-smart-dustbin', 'prod-servo-sg90', 1, 3),
('kit-smart-dustbin', 'prod-jumper-m2m', 1, 4),
('kit-smart-dustbin', 'prod-battery-18650-2s', 1, 5),

-- Smart Plant Monitor (ESP32 + Capacitive Soil + Submersible Pump + 1Ch Relay + OLED + Jumpers)
('kit-plant-monitor', 'prod-esp32-v1', 1, 1),
('kit-plant-monitor', 'prod-soil-moisture', 1, 2),
('kit-plant-monitor', 'prod-submersible-pump', 1, 3),
('kit-plant-monitor', 'prod-relay-1ch', 1, 4),
('kit-plant-monitor', 'prod-oled-096', 1, 5),
('kit-plant-monitor', 'prod-jumper-m2f', 1, 6),

-- Line Follower (2WD Chassis + 2x BO Motors + L298N + 2x IR Sensors + Arduino Uno + Battery)
('kit-line-follower', 'prod-2wd-chassis', 1, 1),
('kit-line-follower', 'prod-motor-driver-l298n', 1, 2),
('kit-line-follower', 'prod-arduino-uno', 1, 3),
('kit-line-follower', 'prod-ir-sensor', 2, 4),
('kit-line-follower', 'prod-battery-18650-2s', 1, 5),
('kit-line-follower', 'prod-jumper-m2m', 1, 6),

-- Home Automation (ESP32 + 4Ch Relay + Breadboard + Jumpers)
('kit-home-automation', 'prod-esp32-v1', 1, 1),
('kit-home-automation', 'prod-relay-4ch', 1, 2),
('kit-home-automation', 'prod-breadboard-830', 1, 3),
('kit-home-automation', 'prod-jumper-m2f', 1, 4),
('kit-home-automation', 'prod-led-pack-50', 1, 5),

-- RC Car (2WD Chassis + L298N + HC-05 Bluetooth + Arduino Uno + Battery + Jumpers)
('kit-rc-car', 'prod-2wd-chassis', 1, 1),
('kit-rc-car', 'prod-motor-driver-l298n', 1, 2),
('kit-rc-car', 'prod-hc05-bluetooth', 1, 3),
('kit-rc-car', 'prod-arduino-uno', 1, 4),
('kit-rc-car', 'prod-battery-18650-2s', 1, 5),
('kit-rc-car', 'prod-jumper-m2m', 1, 6),

-- Security Alarm (Uno + PIR + Piezo Buzzer + 1Ch Relay + Jumpers)
('kit-security-alarm', 'prod-arduino-uno', 1, 1),
('kit-security-alarm', 'prod-pir-sensor', 1, 2),
('kit-security-alarm', 'prod-piezo-buzzer', 1, 3),
('kit-security-alarm', 'prod-relay-1ch', 1, 4),
('kit-security-alarm', 'prod-jumper-m2m', 1, 5),

-- Weather Station (ESP32 + DHT11 + OLED 0.96 + Breadboard + Jumpers)
('kit-weather-station', 'prod-esp32-v1', 1, 1),
('kit-weather-station', 'prod-dht11', 1, 2),
('kit-weather-station', 'prod-oled-096', 1, 3),
('kit-weather-station', 'prod-breadboard-830', 1, 4),
('kit-weather-station', 'prod-jumper-m2f', 1, 5),

-- Obstacle Avoiding Rover (2WD Chassis + Uno + L298N + HC-SR04 + Servo SG90 + Battery)
('kit-obstacle-avoider', 'prod-2wd-chassis', 1, 1),
('kit-obstacle-avoider', 'prod-arduino-uno', 1, 2),
('kit-obstacle-avoider', 'prod-motor-driver-l298n', 1, 3),
('kit-obstacle-avoider', 'prod-ultrasonic-hcsr04', 1, 4),
('kit-obstacle-avoider', 'prod-servo-sg90', 1, 5),
('kit-obstacle-avoider', 'prod-battery-18650-2s', 1, 6)
ON CONFLICT (project_kit_id, product_id) DO UPDATE SET
  quantity = EXCLUDED.quantity,
  sort_order = EXCLUDED.sort_order;

-- 8. SEED REVIEWS
INSERT INTO public.reviews (product_id, user_name, user_role, rating, comment, verified_buyer) VALUES
('prod-esp32-v1', 'Pooja R.', 'Final Year ECE, SJCE Mysuru', 5, 'Arrived in Saraswathipuram in literally 17 minutes! WiFi and BLE paired immediately with ESP-IDF. Both cores running perfectly.', true),
('prod-esp32-v1', 'Kiran M.', 'NIE College Maker Lab', 5, 'CP2102 chip is genuine, flashed via PlatformIO seamlessly. Fast delivery saved our deadline.', true),
('prod-ultrasonic-hcsr04', 'Vikas Gowda', 'Robotics Club, VVCE Mysuru', 5, 'Tested with Arduino Uno on breadboard. Extremely stable readings within 3mm tolerance up to 3 meters.', true),
('prod-motor-driver-l298n', 'Darshan S.', 'ATME College of Engineering', 4, 'Heat sink is sturdy, drives our 2 BO motors effortlessly with 7.4V battery pack. Arrived in ESD antistatic packaging.', true),
('prod-arduino-uno', 'Ananya K.', 'School Science Project User', 5, 'My 9th grade smart dustbin project won 1st prize at school! Delivery rider delivered to Kuvempunagar in 18 minutes flat.', true)
ON CONFLICT DO NOTHING;
