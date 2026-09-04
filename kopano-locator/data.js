// Kopano Media — OOH Sites Inventory, March 2026
// Parsed from Kopano_Media_OOH_Inventory_March_2026.pptx

// ---------------------------------------------------------------
// LIVE AVAILABILITY SYNC
// Paste the "Publish to web" CSV link of your Google Sheet here.
// Leave as "" to run on static data only (no live updates).
// See LIVE_SYNC_SETUP.md for how to set this up.
// ---------------------------------------------------------------
// MAP TILES
// CARTO now requires a free API key for their basemap tiles (this changed
// recently — it's not something we broke). Get one in under a minute,
// no account needed, at https://carto.com/basemaps/apikey and paste it
// below. Free for up to 5 million tile loads/month. Leave "" and the map
// will still work but shows a "API KEY REQUIRED" watermark.
// ---------------------------------------------------------------
const CONFIG = {
  SHEET_CSV_URL: "https://docs.google.com/spreadsheets/d/e/2PACX-1vR4EqCasg5kocxv3WLRROsH8nCxJnIsEu4PuV2GkLeZQyfqYrWULYYquSaSx-YPaV8rEa3YC2o_kzoE/pub?gid=1481682342&single=true&output=csv",
  REFRESH_SECONDS: 45,
  CARTO_API_KEY: "cb1_2kmy_1_abed039dd0f9e2ce493f22ff",
};

const CONTACT = {
  name: "Peter Mashamba",
  role: "Managing Director",
  email: "peter@kopanomediacomms.co.za",
  phone: "082 675 0747",
  phoneHref: "+27826750747",
};

const AREAS = [
  "Fourways & Northriding",
  "Midrand",
  "Sandton",
  "Hyde Park Corner",
  "Parktown, Westcliff & Braamfontein",
  "Krugersdorp – Noordheuwel",
  "Cosmo City",
  "Kagiso, Mogale City",
  "Soweto",
  "Olievenhoutbosch, Centurion"
];

const SITES = [
  {
    code: "KOP001", area: "Fourways & Northriding", image: "images/full/KOP001.jpg", thumb: "images/thumb/KOP001.jpg", rateCard: 60000, suggestedRate: 42000, production: 24000,
    title: "Witkoppen Road – towards Fourways",
    description: "On Witkoppen road facing traffic from Malibongwe drive and Northriding traveling northerly direction towards Fourways Mall, Cedar Square, Monte Casino, Fourways Crossings, Sunninghill, The Buzz Shopping Centre, Rivonia Office Parks, Paulshof, Kyalami and Sunninghill.",
    size: "4m x 16m", lsm: "LSM 6-8 to 9-10",
    material: "PVC Flex Block-out", availability: "2026-09-01", trafficFlow: "Continuous traffic",
    trafficCount: "90 001 – 140 000+ vehicles/day", illuminated: true, lat: -26.030893, lng: 27.968855
  },
  {
    code: "KOP002", area: "Fourways & Northriding", image: "images/full/KOP002.jpg", thumb: "images/thumb/KOP002.jpg", rateCard: 60000, suggestedRate: 42000, production: 24000,
    title: "Witkoppen Road – Fourways / Northriding",
    description: "On Witkoppen road facing traffic traveling southerly direction from Fourways towards Malibongwe Drive, Northriding, Northgate Shopping Centre, The Dome Kya Sands, Northlands Decor Park, Lanseria Airport, Jackal Creek and Cosmo City.",
    size: "4m x 16m", lsm: "LSM 6-8 to 9-10",
    material: "PVC Flex Block-out", availability: "2026-11-01", trafficFlow: "Continuous traffic",
    trafficCount: "90 001 – 140 000+ vehicles/day", illuminated: true, lat: -26.030893, lng: 27.968855
  },
  {
    code: "KOP009", area: "Fourways & Northriding", image: "images/full/KOP009.jpg", thumb: "images/thumb/KOP009.jpg", rateCard: 60000, suggestedRate: 40000, production: 24000,
    title: "Witkoppen Road – Deco Park, Northriding",
    description: "On Witkoppen Road, close to Northlands Deco Park and Northlands corner in Northriding, facing traffic traveling from Malibongwe towards Fourways Mall, Cedar Square, Monte Casino, Fourways Crossings, Sunninghill, The Buzz Shopping Centre, Kyalami, Paulshof, Rivonia and Sandton.",
    size: "4m x 16m", lsm: "LSM 6-8 to 9-10",
    material: "PVC Flex Block-out", availability: "2026-05-06", trafficFlow: "Continuous traffic",
    trafficCount: "90 001 – 140 000+ vehicles/day", illuminated: true, lat: -26.036697, lng: 27.961101
  },
  {
    code: "KOP008", area: "Fourways & Northriding", image: "images/full/KOP008.jpg", thumb: "images/thumb/KOP008.jpg", rateCard: 60000, suggestedRate: 40000, production: 24000,
    title: "Witkoppen Road – Deco Park, Northriding",
    description: "Located on Witkoppen Road, close to Northlands Decopark and Northland Corner in Northriding, facing traffic from Fourways, Sunninghill and Paulshof traveling towards Northgate Shopping Centre and Malibongwe Drive (1km), 700m from Deco Park, on route towards Northriding suburb, The Dome Kya Sands, Northlands Decor Park, Jackal Creek, Cosmo City and Honeydew.",
    size: "4m x 16m", lsm: "LSM 6-8 to 9-10",
    material: "PVC Flex Block-out", availability: "2026-09-01", trafficFlow: "Continuous traffic",
    trafficCount: "90 001 – 140 000+ vehicles/day", illuminated: true, lat: -26.036175, lng: 27.961582
  },
  {
    code: "KOP019", area: "Midrand", image: "images/full/KOP019.jpg", thumb: "images/thumb/KOP019.jpg", rateCard: 60000, suggestedRate: 45000, production: 24000,
    title: "Olifantsfontein Road – Midrand",
    description: "On Olifantsfontein road in Midrand next to Regal Inn Midrand and the newly built 700th Engen garage, facing traffic from the N1 North (Pretoria/Centurion) and N1 South (Sandton) towards Blue Hill Shopping Centre, Vodaworld, Savanah Hills Estate, Blue Hills Medical Centre, Kyalami and Blue Valley Golf Estate. Also faces traffic from Midrand Gautrain station towards greater Midrand, Spar Noordwyk, Carlswald Lifestyle Centre and Sandridge Square, plus traffic passing through Midrand to Woodmead, Diepsloot and Olievenhoutbosch.",
    size: "4m x 16m", lsm: "LSM 7-8 to 9-10",
    material: "PVC Flex Block-out", availability: "2026-06-01", trafficFlow: "Continuous traffic flow",
    trafficCount: "90 001 – 140 000+ vehicles/day", illuminated: false, lat: -25.952644, lng: 28.129198
  },
  {
    code: "KOP020", area: "Midrand", image: "images/full/KOP020.jpg", thumb: "images/thumb/KOP020.jpg", rateCard: 60000, suggestedRate: 45000, production: 24000,
    title: "Olifantsfontein Road – Midrand",
    description: "On Olifantsfontein road in Midrand next to Regal Inn Midrand and the newly built Engen 700th garage, facing traffic leading out of Midrand from Blue Valley, Noordwyk, Blue Hills and Carlswald, heading towards the N1 highway (north and south), with routes to Joburg, Pretoria, Centurion, Sandton, OR Tambo International Airport, Mall of Africa, Gautrain station and Tembisa.",
    size: "4m x 16m", lsm: "LSM 7-8 to 9-10",
    material: "PVC Flex Block-out", availability: "2026-03-01", trafficFlow: "Continuous traffic flow",
    trafficCount: "90 001 – 140 000+ vehicles/day", illuminated: false, lat: -25.952644, lng: 28.129198
  },
  {
    code: "KOP023", area: "Sandton", image: "images/full/KOP023.jpg", thumb: "images/thumb/KOP023.jpg", rateCard: 60000, suggestedRate: 38000, production: 13500,
    title: "Katherine Street – Sandton",
    description: "Located on Katherine street in Sandton, between Marlboro and Grayston drive. Faces traffic from Rivonia, Morningside, the M1 highway and Marlboro dr towards Sandton City and Gautrain Station (3km), Sandton CBD. 700m to Barlow Park Lifestyle Centre (retail, luxury apartments, Curro school). Surrounded by office parks and prime residential/commercial real estate.",
    size: "3m x 12m", lsm: "LSM 8-10",
    material: "PVC Flex Block-out", availability: "2026-05-01", trafficFlow: "Continuous traffic flow",
    trafficCount: "60 001 – 100 000+ vehicles/day", illuminated: false, lat: -26.097238, lng: 28.081570
  },
  {
    code: "KOP024", area: "Hyde Park Corner", image: "images/full/KOP024.jpg", thumb: "images/thumb/KOP024.jpg", rateCard: 60000, suggestedRate: 38000, production: 15750,
    title: "Jan Smuts Ave – Hyde Park",
    description: "Located on Jan Smuts Ave next to Hyde Park Corner shopping mall. Faces traffic traveling from Rosebank towards Sandton and Bryanston via Winnie Mandela drive, and towards Randburg via Jan Smuts. Close to prime commercial properties and office parks including YFM and eTV studios.",
    size: "3.5m x 12m", lsm: "LSM 8-10",
    material: "PVC Flex Block-out", availability: "2026-03-01", trafficFlow: "Continuous traffic flow",
    trafficCount: "60 001 – 80 000+ vehicles/day", illuminated: false, lat: -26.126738, lng: 28.032825
  },
  {
    code: "KOP003", area: "Parktown, Westcliff & Braamfontein", image: "images/full/KOP003.jpg", thumb: "images/thumb/KOP003.jpg", rateCard: 60000, suggestedRate: 38000, production: 13500,
    title: "Empire Road Gantry – Parktown, Johannesburg",
    description: "On Empire Road, next to Milpark Rea Vaya bus station. On route from the M1 Highway, Parktown and Braamfontein towards Auckland Park, Melville, Greenside, Emmarentia, UJ Kingsway Campus, SABC, Media24 offices and Campus Square shopping centre. Several business schools, student accommodation, 4 high schools, a skate park and Milpark Hospital within 300m. Near the 44 Stanley food, drinks and entertainment precinct.",
    size: "3m x 12m", lsm: "LSM 6-8 to 9-10",
    material: "PVC Flex Block-out", availability: "2026-03-01", trafficFlow: "Continuous traffic & pedestrian flow at the bus station stop",
    trafficCount: "99 000+ vehicles/day", illuminated: false, lat: -26.183274, lng: 28.020151
  },
  {
    code: "KOP012", area: "Parktown, Westcliff & Braamfontein", image: "images/full/KOP012.jpg", thumb: "images/thumb/KOP012.jpg", rateCard: 50000, suggestedRate: 35000, production: 13500,
    title: "Barry Hertzog & Empire Road – Parktown, JHB",
    description: "On Barry Hertzog Ave off the Empire Road intersection, facing traffic traveling from Empire Road, Linden, Greenside, Milpark and Emmarentia towards Braamfontein and JHB CBD. Route leads to the University of Johannesburg and other tertiary/business schools. Next to 44 Stanley, Atlas Studios and student accommodation.",
    size: "3m x 12m", lsm: "LSM 6-8 to 9-10",
    material: "PVC Flex Block-out", availability: "2026-03-01", trafficFlow: "Continuous traffic",
    trafficCount: "85 000+ vehicles/day", illuminated: false, lat: -26.184297, lng: 28.017900
  },
  {
    code: "KOP013", area: "Parktown, Westcliff & Braamfontein", image: "images/full/KOP013.jpg", thumb: "images/thumb/KOP013.jpg", rateCard: 50000, suggestedRate: 35000, production: 13500,
    title: "Barry Hertzog & Empire Road – Parktown, JHB",
    description: "On Barry Hertzog Ave next to 44 Stanley towards the Empire Road intersection, facing traffic from Braamfontein, Auckland Park and Johannesburg CBD, traveling towards Greenside, Milpark Hospital, Rand Steam shopping centre, Melville, Parktown, Emmarentia and Randburg.",
    size: "3m x 12m", lsm: "LSM 6-8 to 9-10",
    material: "PVC Flex Block-out", availability: "2026-03-01", trafficFlow: "Continuous traffic and pedestrian flow",
    trafficCount: "85 000+ vehicles/day", illuminated: false, lat: -26.184243, lng: 28.017841
  },
  {
    code: "KOP017", area: "Parktown, Westcliff & Braamfontein", image: "images/full/KOP017.jpg", thumb: "images/thumb/KOP017.jpg", rateCard: 60000, suggestedRate: 35000, production: 13500,
    title: "Barry Hertzog – Westcliff, JHB",
    description: "Located on Barry Hertzog Ave in Westcliff, a main road connecting JHB CBD, Auckland Park, Melville and Parktown with Emmarentia, Greenside, Linden, Victory Park, Parkview and Randburg. Faces traffic from Empire Road, Milpark Hospital, Braamfontein and UJ traveling towards Emmarentia Dam, Greenside, Linden and Parkview Golf Course. 1.5km from Checkers Emmarentia, Wimpy, Pizza Hut, Debonairs, Pedro's and Ocean Basket.",
    size: "3m x 12m", lsm: "LSM 6-8 to 9-10",
    material: "PVC Flex Block-out", availability: "2026-03-01", trafficFlow: "Continuous traffic and pedestrian flow",
    trafficCount: "85 000+ vehicles/day", illuminated: false, lat: -26.172479, lng: 28.015431
  },
  {
    code: "KOP011", area: "Parktown, Westcliff & Braamfontein", image: "images/full/KOP011.jpg", thumb: "images/thumb/KOP011.jpg", rateCard: 65000, suggestedRate: 40000, production: 13500,
    title: "Jan Smuts Ave – Parktown, JHB",
    description: "On Jan Smuts Ave off Empire Road, next to KPMG offices, on route to the M1 Highway, Westcliff, Rosebank, Killarney, Hyde Park and Donald Gordon Medical Centre. Numerous office parks and business schools nearby including Wits Business School, under 1km from Wits University.",
    size: "3m x 12m", lsm: "LSM 6-8 to 9-10",
    material: "PVC Flex Block-out", availability: "2026-03-01", trafficFlow: "Continuous traffic and pedestrian flow",
    trafficCount: "85 000+ vehicles/day", illuminated: false, lat: -26.184936, lng: 28.032337
  },
  {
    code: "KOP027", area: "Parktown, Westcliff & Braamfontein", image: "images/full/KOP027.jpg", thumb: "images/thumb/KOP027.jpg", rateCard: 50000, suggestedRate: 35000, production: 15080,
    title: "Smit Street – Braamfontein, JHB",
    description: "Located on Smit Street entering the Braamfontein precinct, facing traffic heading into Braamfontein CBD and joining the N1 highway (north and south, towards the M2), the Nelson Mandela Bridge and the Neighbourgoods Market, plus higher-learning institutions like Wits University, Rosebank College and Boston City Campus.",
    size: "3m x 12m", lsm: "LSM 6-8 and 8-10",
    material: "Vinyl", availability: "2026-03-01", trafficFlow: "Continuous traffic and pedestrian flow",
    trafficCount: "85 000+ vehicles/day", illuminated: false, lat: -26.196139, lng: 28.028417
  },
  {
    code: "KOP005", area: "Krugersdorp – Noordheuwel", image: "images/full/KOP005.jpg", thumb: "images/thumb/KOP005.jpg", rateCard: 55000, suggestedRate: 38000, production: 13500,
    title: "Robert Broom Drive – Krugersdorp",
    description: "On Robert Broom Drive facing traffic traveling from Roodepoort, Valley View Shopping Centre, Noordheuwel Shopping Mall and Krugersdorp on the R28, on route towards Pretoria (R28/N14), Silver Stars Casino and Cradlestone Mall.",
    size: "3m x 12m", lsm: "LSM 6-8 to 9-10",
    material: "PVC Flex Block-out", availability: "2026-05-01", trafficFlow: "Continuous traffic",
    trafficCount: "85 000+ vehicles/day", illuminated: false, lat: -26.076824, lng: 27.796028
  },
  {
    code: "KOP004", area: "Krugersdorp – Noordheuwel", image: "images/full/KOP004.jpg", thumb: "images/thumb/KOP004.jpg", rateCard: 55000, suggestedRate: 35000, production: 13500,
    title: "Robert Broom Drive – Krugersdorp",
    description: "On Robert Broom Drive in Noordheuwel, Krugersdorp, on route to Valley View Shopping Centre, Noordheuwel Shopping Mall, Roodepoort and Wilro Park. A main road connecting the affluent area to surrounding Krugersdorp, Helderkruin, Roodepoort, Muldersdrift and Pretoria.",
    size: "3m x 12m", lsm: "LSM 7-8 to 9-10",
    material: "PVC Flex Block-out", availability: "2026-03-01", trafficFlow: "Continuous traffic and pedestrian flow",
    trafficCount: "70 000+ vehicles/day", illuminated: false, lat: -26.076414, lng: 27.795710
  },
  {
    code: "KOP015", area: "Cosmo City", image: "images/full/KOP015.jpg", thumb: "images/thumb/KOP015.jpg", rateCard: 50000, suggestedRate: 35000, production: 13500,
    title: "Cosmo City Gantry – Cosmo City",
    description: "Located on Cosmo City's main road, South Africa Drive, next to Cosmo Shopping Centre, a taxi rank and an Engen garage. Faces traffic from Malibongwe Drive towards Cosmo Fire Station and the heart of Cosmo City. Close to Cosmo Meridian School, Cosmo Primary and High Schools, the Cosmo Multipurpose Centre and a medical centre.",
    size: "3m x 12m", lsm: "LSM 6-8",
    material: "PVC Flex Block-out", availability: "2026-04-01", trafficFlow: "Continuous traffic and pedestrian flow + 15k per day",
    trafficCount: "60 000+ vehicles/day", illuminated: false, lat: -26.021122, lng: 27.928046
  },
  {
    code: "KOP016", area: "Cosmo City", image: "images/full/KOP016.jpg", thumb: "images/thumb/KOP016.jpg", rateCard: 50000, suggestedRate: 35000, production: 13500,
    title: "Cosmo City Gantry – Cosmo City",
    description: "Located on Cosmo City's main road, South Africa Drive, next to Cosmo Shopping Centre, a taxi rank and an Engen garage. Faces traffic traveling towards Malibongwe Drive, Cosmo City Mall, Lanseria Airport, N14 Highway, Northriding, Fourways and Randburg.",
    size: "3m x 12m", lsm: "LSM 5-8",
    material: "PVC Flex Block-out", availability: "2027-01-01", trafficFlow: "Continuous traffic and pedestrian flow + 15k per day",
    trafficCount: "60 000+ vehicles/day", illuminated: false, lat: -26.021158, lng: 27.928043
  },
  {
    code: "KOP025", area: "Cosmo City", image: "images/full/KOP025.jpg", thumb: "images/thumb/KOP025.jpg", rateCard: 50000, suggestedRate: 30000, production: 13500,
    title: "Cosmo City – South Africa Drive",
    description: "Located on South Africa Drive next to Shell garage, KFC, Cosmo Fire Station and a taxi/bus stop. 400m from Cosmo SAPS and 300m from Moscow Corner Centre (Usave, Blue Bottle Liquors, Moscow Grill House & Pub and major bank ATMs). Faces traffic from Malibongwe Drive towards Cosmo Fire Station, Jackal Creek, Moscow Corner, Build It, the VW/Audi Auto Clinic, Honeydew and Beyers Naude Drive.",
    size: "3m x 12m", lsm: "LSM 6-8",
    material: "PVC Flex Block-out", availability: "2026-04-01", trafficFlow: "Continuous traffic and pedestrian flow + 7k per day",
    trafficCount: "45 000+ vehicles/day", illuminated: false, lat: -26.036541, lng: 27.921873
  },
  {
    code: "KOP026", area: "Cosmo City", image: "images/full/KOP026.jpg", thumb: "images/thumb/KOP026.jpg", rateCard: 50000, suggestedRate: 30000, production: 13500,
    title: "Cosmo City – South Africa Drive",
    description: "Located on South Africa Drive next to Shell garage, KFC, Cosmo Fire Station and a taxi/bus stop. 400m from Cosmo SAPS and 300m from Moscow Corner Centre. Faces traffic traveling towards Malibongwe Drive, Lanseria Airport, N14 highway, Cosmo Shopping Centre, Jackal Creek, Moscow Corner and Miami Grill.",
    size: "3m x 12m", lsm: "LSM 6-8",
    material: "PVC Flex Block-out", availability: "2026-04-01", trafficFlow: "Continuous traffic and pedestrian flow + 7k per day",
    trafficCount: "45 000+ vehicles/day", illuminated: false, lat: -26.036541, lng: 27.921873
  },
  {
    code: "KOP007", area: "Kagiso, Mogale City", image: "images/full/KOP007.jpg", thumb: "images/thumb/KOP007.jpg", rateCard: 35000, suggestedRate: 25000, production: 14063,
    title: "Kagiso Drive – Kagiso, Mogale City",
    description: "Located at the entrance of Kagiso, facing traffic entering Kagiso Drive from Krugersdorp, Westgate, Roodepoort, Florida and Johannesburg towards Kagiso Mall and the different sections of the township. Situated at a taxi rank serving Krugersdorp, Westgate, Roodepoort, Florida and JHB CBD.",
    size: "7.5m x 5m", lsm: "LSM 5-8",
    material: "PVC Flex Block-out", availability: "2026-03-01", trafficFlow: "Continuous traffic and pedestrian flow + 10k per day",
    trafficCount: "35 000+ vehicles/day", illuminated: false, lat: -26.140136, lng: 27.793641
  },
  {
    code: "KOP006", area: "Kagiso, Mogale City", image: "images/full/KOP006.jpg", thumb: "images/thumb/KOP006.jpg", rateCard: 35000, suggestedRate: 25000, production: 14063,
    title: "Kagiso Drive – Kagiso, Mogale City",
    description: "Along Kagiso Drive (main road) from Kagiso central, driving towards Krugersdorp, Westgate, Roodepoort, Johannesburg and surrounding towns. Situated at a taxi rank serving JHB, Roodepoort and surrounding towns and malls.",
    size: "7.5m x 5m", lsm: "LSM 5-8",
    material: "PVC Flex Block-out", availability: "2026-04-01", trafficFlow: "Continuous traffic and pedestrian flow",
    trafficCount: "35 000+ vehicles/day", illuminated: false, lat: -26.140329, lng: 27.793738
  },
  {
    code: "KOP018", area: "Kagiso, Mogale City", image: "images/full/KOP018.jpg", thumb: "images/thumb/KOP018.jpg", rateCard: 50000, suggestedRate: 35000, production: 16875,
    title: "Kagiso Drive & Randfontein Road – Kagiso",
    description: "Next to Kagiso Mall and Chief Mogale Hall, on the corner of Kagiso Drive and Randfontein Road. Visible to three-way traffic to and from Kagiso Mall, and traffic traveling towards greater Kagiso, Azaadville, Randfontein, Soweto, JHB and Roodepoort. A few hundred metres from Kagiso Magistrate's Court, Kagiso Police Station and Kagiso Licensing Department.",
    size: "3m x 15m", lsm: "LSM 5-8",
    material: "PVC Flex Block-out", availability: "2026-03-01", trafficFlow: "Continuous traffic and pedestrian flow",
    trafficCount: "35 000+ vehicles/day", illuminated: false, lat: -26.167741, lng: 27.778627
  },
  {
    code: "KOP010", area: "Soweto", image: "images/full/KOP010.jpg", thumb: "images/thumb/KOP010.jpg", rateCard: 45000, suggestedRate: 30000, production: 15080,
    title: "N17 Highway, New Canada – Soweto",
    description: "Located on the N17 Highway in Soweto, which connects residents in Orlando, Meadowlands, Dube, Noordgesig, Pimville and Diepkloof to the N1 north-western bypass, FNB Stadium, Riverlea and Nasrec. Provides the easiest access from Soweto to the N1 Highway, Johannesburg, Sandton and Pretoria.",
    size: "3m x 12m", lsm: "LSM 5-8",
    material: "Vinyl", availability: "2026-03-01", trafficFlow: "Continuous traffic flow",
    trafficCount: "70 000+ vehicles/day", illuminated: false, lat: -26.219295, lng: 27.939186
  },
  {
    code: "KOP014", area: "Soweto", image: "images/full/KOP014.jpg", thumb: "images/thumb/KOP014.jpg", rateCard: 45000, suggestedRate: 35000, production: 15080,
    title: "Eldorado Park, Lenasia – Klipspruit West, Soweto",
    description: "On Klipspruit Valley Road in Klipspruit West, between Eldorado Park and Lenasia, on route to the N12 Highway. Faces traffic traveling from greater Soweto to join the N12 towards JHB, Potchefstroom, Ahmed Kathrada Hospital Lenasia, Trade Route Mall and Protea Glen, plus traffic off-ramping the N12 to Lenasia.",
    size: "3m x 12m", lsm: "LSM 5-8",
    material: "Vinyl", availability: "2026-03-01", trafficFlow: "Continuous traffic and pedestrian flow",
    trafficCount: "60 000+ vehicles/day", illuminated: false, lat: -26.303992, lng: 27.872743
  },
  {
    code: "KOP021", area: "Olievenhoutbosch, Centurion", image: "images/full/KOP021.jpg", thumb: "images/thumb/KOP021.jpg", rateCard: 45000, suggestedRate: 35000, production: 13500,
    title: "Olievenhoutbosch Gantry (Entrance) – Centurion, Tshwane",
    description: "Located at the Olievenhoutbosch Ext 36 entrance on Waterberg Road, facing traffic driving into 'Olieven', a township in Centurion, Tshwane close to Midrand on the R55 route. 300m from Olievenhoutbosch Corner Shopping Centre (Engen garage, Chicken Licken, Shoprite, sports betting outlet, KFC) and a community centre 500m away. Near Dunlop Tyres Fitment Centre, Olieven Motor Spares and the R55 Chillout entertainment spot. LSM 4-7 group area.",
    size: "3m x 12m", lsm: "LSM 5-8",
    material: "PVC Flex Block-out", availability: "2026-03-01", trafficFlow: "Continuous traffic and pedestrian flow",
    trafficCount: "50 000+ vehicles/day", illuminated: false, lat: -25.905682, lng: 28.097100
  },
  {
    code: "KOP022", area: "Olievenhoutbosch, Centurion", image: "images/full/KOP022.jpg", thumb: "images/thumb/KOP022.jpg", rateCard: 45000, suggestedRate: 35000, production: 13500,
    title: "Olievenhoutbosch Gantry (Exit) – Centurion, Tshwane",
    description: "Located at the Olievenhoutbosch Ext 36 exit on Waterberg Road, facing traffic driving out of 'Olieven' towards Pretoria, the R55, Midrand and Woodmead. 300m from Olievenhoutbosch Corner Shopping Centre and a community centre 500m away. Near Dunlop Tyres Fitment Centre, Olieven Motor Spares and the R55 Chillout entertainment spot. LSM 4-7 group area.",
    size: "3m x 12m", lsm: "LSM 5-8",
    material: "PVC Flex Block-out", availability: "2026-03-01", trafficFlow: "Continuous traffic and pedestrian flow",
    trafficCount: "50 000+ vehicles/day", illuminated: false, lat: -25.905682, lng: 28.097100
  }
];

// ---------------------------------------------------------------
// NEARBY LANDMARKS
// Real, verified places (malls, entertainment, transport, education,
// dining) near clusters of billboard sites — coordinates confirmed via
// Google Places. Shown on the map once zoomed in far enough, scoped to
// whichever billboard sites are currently visible, to help sell each
// site by showing the foot/vehicle traffic context around it.
// ---------------------------------------------------------------
const LANDMARKS = [
  { name: "Fourways Mall", category: "mall", lat: -26.0188644, lng: 28.0064222, sites: ["KOP001", "KOP002", "KOP009", "KOP008"] },
  { name: "Monte Casino", category: "entertainment", lat: -26.0245212, lng: 28.0118433, sites: ["KOP001", "KOP002", "KOP009", "KOP008"] },
  { name: "Cedar Square", category: "mall", lat: -26.0171174, lng: 27.9993122, sites: ["KOP001", "KOP002", "KOP009", "KOP008"] },
  { name: "Northgate Shopping Centre", category: "mall", lat: -26.061005, lng: 27.9464571, sites: ["KOP002", "KOP008"] },

  { name: "Mall of Africa", category: "mall", lat: -26.0150679, lng: 28.1055399, sites: ["KOP019", "KOP020"] },
  { name: "Vodacom World", category: "office", lat: -25.9701557, lng: 28.1285179, sites: ["KOP019", "KOP020"] },
  { name: "Engen Summit Road", category: "fuel", lat: -25.9522169, lng: 28.1302890, sites: ["KOP019", "KOP020"] },

  { name: "Sandton City", category: "mall", lat: -26.1088467, lng: 28.0527198, sites: ["KOP023"] },
  { name: "Gautrain Sandton Station", category: "transport", lat: -26.1078845, lng: 28.0572632, sites: ["KOP023"] },

  { name: "Hyde Park Corner", category: "mall", lat: -26.1252748, lng: 28.0330341, sites: ["KOP024"] },

  { name: "44 Stanley", category: "dining", lat: -26.1850934, lng: 28.0187278, sites: ["KOP003", "KOP012", "KOP013", "KOP017"] },
  { name: "University of the Witwatersrand", category: "education", lat: -26.1928628, lng: 28.0304471, sites: ["KOP011", "KOP027"] },
  { name: "Nelson Mandela Bridge", category: "landmark", lat: -26.1968697, lng: 28.0342220, sites: ["KOP027"] },
  { name: "Wimpy Greenside", category: "dining", lat: -26.1614531, lng: 28.0124562, sites: ["KOP017"] },

  { name: "Cradlestone Mall", category: "mall", lat: -26.0603788, lng: 27.8371339, sites: ["KOP005", "KOP004"] },
  { name: "Silverstar Casino", category: "entertainment", lat: -26.0672798, lng: 27.8284211, sites: ["KOP005", "KOP004"] },

  { name: "Cosmo City Shopping Centre", category: "mall", lat: -26.0222793, lng: 27.9286348, sites: ["KOP015", "KOP016", "KOP025", "KOP026"] },

  { name: "Kagiso Mall", category: "mall", lat: -26.1671809, lng: 27.7813171, sites: ["KOP007", "KOP006", "KOP018"] },

  { name: "FNB Stadium", category: "landmark", lat: -26.2347569, lng: 27.9826554, sites: ["KOP010"] },
  { name: "Trade Route Mall", category: "mall", lat: -26.3274906, lng: 27.8688145, sites: ["KOP014"] },

  { name: "Shoprite Olievenhoutbosch Corner", category: "mall", lat: -25.9035290, lng: 28.0944299, sites: ["KOP021", "KOP022"] },
];
