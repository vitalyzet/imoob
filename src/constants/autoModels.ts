export const AUTO_BRANDS = [
  "Abarth","Aiways","Aixam","Alfa Romeo","Alpine","ARO","Asia",
  "Asia Motors","Aston Martin","Audi","Austin","Auverland","BAIC","Bellier",
  "Bentley","Bertone","Bestune","BMW","Bugatti","Bunker-Trike","BYD",
  "Cadillac","Casalini","Cenntro","Changan","Chatenet","Chevrolet","Chrysler",
  "Citroën","Corvette","Cupra","Dacia","Daewoo","DAF","Daihatsu",
  "Daimler","Denza","DFSK","Dodge","DS","Ferrari","Fiat",
  "Ford","Genesis","Honda","Hyundai","Infiniti","Isuzu","Iveco",
  "Jaguar","Jeep","Kia","Lamborghini","Lancia","Land Rover","LDV",
  "Leapmotor","LEVC","Lexus","Ligier","Lincoln","Livan","Lotus",
  "Lynk & Co","M-Hero","Mahindra","MAN","Maserati","Maxus","Maybach",
  "Mazda","McLaren","Mega","Melex","Mercedes-Benz","MG","Micro",
  "Microcar","Mini","Mitsubishi","Mobilize","Morgan","MW Motors","Nextem",
  "Nissan","Omoda","Opel","Peugeot","PGO Scooters","Piaggio","Polaris",
  "Polestar","Pontiac","Porsche","Renault","Rolls-Royce","Rover","Saab",
  "Seat","Skoda","Smart","SsangYong","Subaru","Suzuki","Tesla",
  "Toyota","Volkswagen","Volvo","Altele"
];

export const AUTO_MODELS: Record<string, string[]> = {
  "Alfa Romeo": ["Giulia","Giulietta","Stelvio","Tonale","MiTo","159","156","147","Brera","Spider","4C"],
  "Audi": ["A1","A1 Sportback","A3","A3 Sportback","A3 Sedan","A3 Cabriolet","A4","A4 Avant","A4 Allroad","A5","A5 Sportback","A5 Coupé","A5 Cabriolet","A6","A6 Avant","A6 Allroad","A7","A7 Sportback","A8","A8 L","Q2","Q3","Q3 Sportback","Q4 e-tron","Q4 Sportback e-tron","Q5","Q5 Sportback","Q7","Q8","Q8 e-tron","Q8 Sportback e-tron","e-tron","e-tron Sportback","e-tron GT","TT","TT Coupé","TT Roadster","TTS","TT RS","R8","R8 Spyder","RS3","RS3 Sportback","RS3 Sedan","RS4","RS4 Avant","RS5","RS5 Sportback","RS5 Coupé","RS6","RS6 Avant","RS7","RS7 Sportback","RSQ3","RSQ3 Sportback","RSQ8","RS e-tron GT","S1","S1 Sportback","S3","S3 Sportback","S3 Sedan","S4","S4 Avant","S5","S5 Sportback","S5 Coupé","S5 Cabriolet","S6","S6 Avant","S7","S7 Sportback","S8","SQ2","SQ5","SQ5 Sportback","SQ7","SQ8","SQ8 e-tron"],
  "BMW": ["Seria 1","Seria 2","Seria 3","Seria 4","Seria 5","Seria 6","Seria 7","Seria 8","X1","X2","X3","X4","X5","X6","X7","XM","Z4","i3","i4","i5","i7","iX","iX1","iX3","M2","M3","M4","M5","M8"],
  "Chevrolet": ["Aveo","Captiva","Cruze","Spark","Trax","Orlando","Camaro","Corvette","Malibu"],
  "Citroën": ["C1","C3","C3 Aircross","C4","C4 X","C5","C5 Aircross","C5 X","Berlingo","C-Elysée","DS3","DS4","DS5","Jumpy"],
  "Cupra": ["Ateca","Born","Formentor","Leon","Tavascan"],
  "Dacia": ["Duster","Logan","Sandero","Sandero Stepway","Jogger","Spring","Lodgy","Dokker","1300","1310"],
  "DS": ["DS 3","DS 4","DS 5","DS 7","DS 9"],
  "Ferrari": ["296 GTB","488","F8 Tributo","Roma","Portofino","SF90","812","LaFerrari","California"],
  "Fiat": ["500","500L","500X","Panda","Punto","Tipo","Doblo","Ducato","Bravo","Linea","Freemont"],
  "Ford": ["Fiesta","Focus","Mondeo","Kuga","Puma","EcoSport","Explorer","Mustang","Galaxy","S-Max","Transit","Ranger","Maverick","C-Max","B-Max"],
  "Honda": ["Civic","HR-V","CR-V","Jazz","Accord","e:Ny1","ZR-V","City"],
  "Hyundai": ["i10","i20","i30","i40","Tucson","Kona","Santa Fe","Ioniq","Ioniq 5","Ioniq 6","Bayon","ix20","ix35","Elantra","Accent"],
  "Jaguar": ["E-Pace","F-Pace","F-Type","I-Pace","XE","XF","XJ"],
  "Jeep": ["Renegade","Compass","Cherokee","Grand Cherokee","Wrangler","Gladiator","Avenger"],
  "Kia": ["Picanto","Rio","Ceed","Proceed","Sportage","Sorento","Stonic","Niro","EV6","EV9","Stinger","Venga","Carens","Soul"],
  "Lamborghini": ["Huracán","Urus","Aventador","Revuelto","Gallardo"],
  "Land Rover": ["Defender","Discovery","Discovery Sport","Range Rover","Range Rover Sport","Range Rover Velar","Range Rover Evoque","Freelander"],
  "Lexus": ["CT","IS","ES","GS","LS","NX","RX","UX","LC","LX","LBX","RZ"],
  "Maserati": ["Ghibli","Levante","Quattroporte","MC20","Grecale","GranTurismo"],
  "Mazda": ["2","3","6","CX-3","CX-30","CX-5","CX-60","MX-5","MX-30"],
  "Mercedes-Benz": ["Clasa A","Clasa B","Clasa C","Clasa E","Clasa S","CLA","CLS","GLA","GLB","GLC","GLE","GLS","EQA","EQB","EQC","EQE","EQS","AMG GT","Sprinter","Vito","Clasa V","Clasa G"],
  "MG": ["ZS","HS","MG4","MG5","Marvel R"],
  "Mini": ["Cooper","Countryman","Clubman","Paceman","Cabrio"],
  "Mitsubishi": ["ASX","Eclipse Cross","Outlander","Space Star","L200","Pajero","Colt","Lancer"],
  "Nissan": ["Micra","Juke","Qashqai","X-Trail","Leaf","Ariya","Navara","Note","Pulsar","Patrol","370Z"],
  "Opel": ["Corsa","Astra","Insignia","Mokka","Crossland","Grandland","Combo","Vivaro","Zafira","Meriva","Adam","Karl"],
  "Peugeot": ["108","208","308","408","508","2008","3008","5008","Partner","Rifter","Expert","e-208","e-2008","e-308"],
  "Porsche": ["911","718 Cayman","718 Boxster","Cayenne","Macan","Panamera","Taycan"],
  "Renault": ["Clio","Megane","Captur","Kadjar","Koleos","Scenic","Talisman","Austral","Arkana","Espace","Twingo","Kangoo","Master","Zoe","Megane E-Tech"],
  "Seat": ["Ibiza","Leon","Arona","Ateca","Tarraco","Alhambra","Toledo","Mii"],
  "Skoda": ["Fabia","Octavia","Superb","Kamiq","Karoq","Kodiaq","Scala","Enyaq","Citigo","Rapid","Yeti","Roomster"],
  "Smart": ["ForTwo","ForFour","#1"],
  "Subaru": ["Impreza","XV","Outback","Forester","Legacy","BRZ","Levorg","WRX"],
  "Suzuki": ["Swift","Vitara","S-Cross","Jimny","Ignis","Baleno","SX4","Across"],
  "Tesla": ["Model 3","Model Y","Model S","Model X","Cybertruck"],
  "Toyota": ["Yaris","Yaris Cross","Corolla","Camry","C-HR","RAV4","Highlander","Land Cruiser","Supra","GR86","Prius","Proace","Hilux","Aygo","Avensis","Auris","bZ4X"],
  "Volkswagen": ["Polo","Golf","Passat","Arteon","Tiguan","T-Roc","T-Cross","Touareg","Taigo","ID.3","ID.4","ID.5","ID.7","ID. Buzz","Caddy","Transporter","Jetta","Scirocco","Touran","Sharan","Up!","Beetle"],
  "Volvo": ["XC40","XC60","XC90","S60","S90","V40","V60","V90","C40","EX30","EX90"],
  "Altele": ["Altele"]
};

export const MOTO_BRANDS = [
  "Aprilia", "BMW", "Ducati", "Harley-Davidson", "Honda", "Kawasaki", "KTM", "Suzuki", "Triumph", "Yamaha",
  "Vespa", "Piaggio", "Husqvarna", "Indian", "Royal Enfield", "Altele"
];

export const MOTO_MODELS: Record<string, string[]> = {
  "Aprilia": ["RSV4", "Tuono", "RS 660", "Tuareg 660", "SRV 850"],
  "BMW": ["S 1000 RR", "R 1250 GS", "F 850 GS", "R nineT", "K 1600"],
  "Ducati": ["Panigale V4", "Multistrada V4", "Monster", "Diavel", "Scrambler"],
  "Harley-Davidson": ["Sportster S", "Fat Boy", "Pan America", "Street Glide", "Iron 883"],
  "Honda": ["CBR1000RR", "Africa Twin", "CB650R", "NC750X", "Rebel 500", "Gold Wing"],
  "Kawasaki": ["Ninja ZX-10R", "Z900", "Versys 1000", "Vulcan S", "Ninja H2"],
  "KTM": ["1290 Super Duke R", "390 Duke", "890 Adventure", "1290 Super Adventure R", "RC 390"],
  "Suzuki": ["Hayabusa", "GSX-R1000", "V-Strom 1050", "SV650", "Katana"],
  "Triumph": ["Street Triple", "Speed Triple", "Tiger 900", "Bonneville T120", "Rocket 3"],
  "Yamaha": ["YZF-R1", "MT-09", "Tracer 9", "Tenere 700", "TMAX"],
  "Vespa": ["Primavera", "GTS", "Sprint", "Elettrica"],
  "Piaggio": ["Beverly", "Liberty", "Medley", "MP3"],
  "Husqvarna": ["Vitpilen", "Svartpilen", "Norden 901", "701 Supermoto"],
  "Indian": ["Scout", "Chief", "Chieftain", "FTR 1200"],
  "Royal Enfield": ["Interceptor 650", "Classic 350", "Himalayan", "Continental GT 650"],
  "Altele": ["Altele"]
};

export const VAN_BRANDS = [
  "Citroën", "DAF", "Fiat", "Ford", "Isuzu", "Iveco", "MAN", 
  "Mercedes-Benz", "Nissan", "Opel", "Peugeot", "Renault", 
  "Scania", "Toyota", "Volkswagen", "Volvo"
];

export const VAN_MODELS: Record<string, string[]> = {
  "Citroën": ["Berlingo", "Jumper", "Jumpy"],
  "DAF": ["XF", "CF", "LF"],
  "Fiat": ["Doblo", "Ducato", "Fiorino", "Scudo", "Talento"],
  "Ford": ["Transit", "Transit Custom", "Transit Connect", "Transit Courier", "Ranger"],
  "Isuzu": ["D-Max", "N-Series"],
  "Iveco": ["Daily", "Eurocargo", "Stralis"],
  "MAN": ["TGE", "TGX", "TGS", "TGM", "TGL"],
  "Mercedes-Benz": ["Sprinter", "Vito", "Citan", "Actros", "Atego"],
  "Nissan": ["Navara", "NV200", "NV300", "NV400", "Interstar", "Primastar"],
  "Opel": ["Combo", "Movano", "Vivaro"],
  "Peugeot": ["Boxer", "Expert", "Partner"],
  "Renault": ["Kangoo", "Master", "Trafic"],
  "Scania": ["R-Series", "S-Series", "G-Series", "P-Series"],
  "Toyota": ["Hilux", "Proace", "Proace City"],
  "Volkswagen": ["Caddy", "Crafter", "Transporter", "Amarok"],
  "Volvo": ["FH", "FM", "FMX", "FL", "FE"]
};

export const TRUCK_BRANDS = [
  "DAF", "Ford", "Isuzu", "Iveco", "MAN", "Mercedes-Benz", "Renault", "Scania", "Volvo", "Altele"
];

export const TRUCK_MODELS: Record<string, string[]> = {
  "DAF": ["XF", "CF", "LF", "XG", "XG+"],
  "Ford": ["F-Max", "Cargo"],
  "Isuzu": ["N-Series", "F-Series"],
  "Iveco": ["Stralis", "S-Way", "X-Way", "Eurocargo", "Trakker"],
  "MAN": ["TGX", "TGS", "TGM", "TGL"],
  "Mercedes-Benz": ["Actros", "Arocs", "Atego", "Econic"],
  "Renault": ["T", "K", "C", "D"],
  "Scania": ["S-Series", "R-Series", "G-Series", "P-Series", "L-Series"],
  "Volvo": ["FH", "FH16", "FM", "FMX", "FE", "FL"],
  "Altele": ["Altele"]
};

export const AGRI_BRANDS = [
  "Bobcat", "Case IH", "Caterpillar", "CLAAS", "Deutz-Fahr", 
  "Fendt", "JCB", "John Deere", "Komatsu", "Kubota", 
  "Massey Ferguson", "New Holland", "Valtra", "Altele"
];

export const AGRI_MODELS: Record<string, string[]> = {
  "Bobcat": ["S-Series", "T-Series", "E-Series"],
  "Case IH": ["Puma", "Optum", "Magnum", "Steiger", "Farmall"],
  "Caterpillar": ["Excavator", "Bulldozer", "Loader", "Grader"],
  "CLAAS": ["Lexion", "Axion", "Arion", "Xerion", "Jaguar"],
  "Deutz-Fahr": ["Series 9", "Series 8", "Series 7", "Series 6", "Series 5"],
  "Fendt": ["1000 Vario", "900 Vario", "800 Vario", "700 Vario", "300 Vario"],
  "JCB": ["Fastrac", "Telehandler", "Backhoe Loader", "Excavator"],
  "John Deere": ["Series 9", "Series 8", "Series 7", "Series 6", "Series 5"],
  "Komatsu": ["Excavator", "Bulldozer", "Wheel Loader", "Dump Truck"],
  "Kubota": ["M7", "M6", "M5", "L-Series", "B-Series"],
  "Massey Ferguson": ["MF 8S", "MF 7S", "MF 6S", "MF 5S", "MF 4700"],
  "New Holland": ["T9", "T8", "T7", "T6", "T5", "CR Revelation", "CX"],
  "Valtra": ["S Series", "Q Series", "T Series", "N Series", "A Series"],
  "Altele": ["Altele"]
};
