// Kopano Media & The Medium — combined OOH Sites Inventory
// Kopano Media parsed from Kopano_Media_OOH_Inventory_March_2026.pptx
// The Medium parsed from The_Medium_January_2026_Inventory_packages.pptx
//
// This file is shared by both brands' data. The app switches which
// brand's data is active via BRANDS[id] — see app.js's activateBrandData().
//
// Map tiles come from OpenFreeMap (via MapLibre GL JS in app.js) — no API
// key needed at all, so unlike the old CARTO setup there's nothing to
// configure here for the map itself.

// ---------------------------------------------------------------
// LIVE AVAILABILITY SYNC — per brand, since Kopano Media and The Medium
// are run separately (Peter and Bongane each manage their own sheet).
// Paste each brand's "Publish to web" CSV link into its own CONFIG below.
// Leave "" to run that brand on static data only. See LIVE_SYNC_SETUP.md.
// ---------------------------------------------------------------

const BRANDS = {
  kopano: {
    id: "kopano",
    name: "Kopano",
    nameAccent: "Media",
    tagline: "OOH Site Locator",
    CONFIG: {
      SHEET_CSV_URL: "",
      REFRESH_SECONDS: 45,
    },
    CONTACT: {
  name: "Peter Mashamba",
  role: "Managing Director",
  email: "peter@kopanomediacomms.co.za",
  phone: "082 675 0747",
  phoneHref: "+27826750747",
},
    AREAS: [
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
],
    SITES: [
  {
    code: "KOP001", video: "videos/KOP001.mp4", area: "Fourways & Northriding", image: "images/full/KOP001.jpg", thumb: "images/thumb/KOP001.jpg", rateCard: 60000, suggestedRate: 42000, production: 24000,
    title: "Witkoppen Road – towards Fourways",
    description: "On Witkoppen road facing traffic from Malibongwe drive and Northriding traveling northerly direction towards Fourways Mall, Cedar Square, Monte Casino, Fourways Crossings, Sunninghill, The Buzz Shopping Centre, Rivonia Office Parks, Paulshof, Kyalami and Sunninghill.",
    size: "4m x 16m", lsm: "LSM 6-8 to 9-10",
    material: "PVC Flex Block-out", availability: "2026-09-01", trafficFlow: "Continuous traffic",
    trafficCount: "90 001 – 140 000+ vehicles/day", illuminated: true, lat: -26.030893, lng: 27.968855
  },
  {
    code: "KOP002", video: "videos/KOP002.mp4", area: "Fourways & Northriding", image: "images/full/KOP002.jpg", thumb: "images/thumb/KOP002.jpg", rateCard: 60000, suggestedRate: 42000, production: 24000,
    title: "Witkoppen Road – Fourways / Northriding",
    description: "On Witkoppen road facing traffic traveling southerly direction from Fourways towards Malibongwe Drive, Northriding, Northgate Shopping Centre, The Dome Kya Sands, Northlands Decor Park, Lanseria Airport, Jackal Creek and Cosmo City.",
    size: "4m x 16m", lsm: "LSM 6-8 to 9-10",
    material: "PVC Flex Block-out", availability: "2026-11-01", trafficFlow: "Continuous traffic",
    trafficCount: "90 001 – 140 000+ vehicles/day", illuminated: true, lat: -26.030893, lng: 27.968855
  },
  {
    code: "KOP009", video: "videos/KOP009.mp4", area: "Fourways & Northriding", image: "images/full/KOP009.jpg", thumb: "images/thumb/KOP009.jpg", rateCard: 60000, suggestedRate: 40000, production: 24000,
    title: "Witkoppen Road – Deco Park, Northriding",
    description: "On Witkoppen Road, close to Northlands Deco Park and Northlands corner in Northriding, facing traffic traveling from Malibongwe towards Fourways Mall, Cedar Square, Monte Casino, Fourways Crossings, Sunninghill, The Buzz Shopping Centre, Kyalami, Paulshof, Rivonia and Sandton.",
    size: "4m x 16m", lsm: "LSM 6-8 to 9-10",
    material: "PVC Flex Block-out", availability: "2026-05-06", trafficFlow: "Continuous traffic",
    trafficCount: "90 001 – 140 000+ vehicles/day", illuminated: true, lat: -26.036697, lng: 27.961101
  },
  {
    code: "KOP008", video: "videos/KOP008.mp4", area: "Fourways & Northriding", image: "images/full/KOP008.jpg", thumb: "images/thumb/KOP008.jpg", rateCard: 60000, suggestedRate: 40000, production: 24000,
    title: "Witkoppen Road – Deco Park, Northriding",
    description: "Located on Witkoppen Road, close to Northlands Decopark and Northland Corner in Northriding, facing traffic from Fourways, Sunninghill and Paulshof traveling towards Northgate Shopping Centre and Malibongwe Drive (1km), 700m from Deco Park, on route towards Northriding suburb, The Dome Kya Sands, Northlands Decor Park, Jackal Creek, Cosmo City and Honeydew.",
    size: "4m x 16m", lsm: "LSM 6-8 to 9-10",
    material: "PVC Flex Block-out", availability: "2026-09-01", trafficFlow: "Continuous traffic",
    trafficCount: "90 001 – 140 000+ vehicles/day", illuminated: true, lat: -26.036175, lng: 27.961582
  },
  {
    code: "KOP019", video: "videos/KOP019.mp4", area: "Midrand", image: "images/full/KOP019.jpg", thumb: "images/thumb/KOP019.jpg", rateCard: 60000, suggestedRate: 45000, production: 24000,
    title: "Olifantsfontein Road – Midrand",
    description: "On Olifantsfontein road in Midrand next to Regal Inn Midrand and the newly built 700th Engen garage, facing traffic from the N1 North (Pretoria/Centurion) and N1 South (Sandton) towards Blue Hill Shopping Centre, Vodaworld, Savanah Hills Estate, Blue Hills Medical Centre, Kyalami and Blue Valley Golf Estate. Also faces traffic from Midrand Gautrain station towards greater Midrand, Spar Noordwyk, Carlswald Lifestyle Centre and Sandridge Square, plus traffic passing through Midrand to Woodmead, Diepsloot and Olievenhoutbosch.",
    size: "4m x 16m", lsm: "LSM 7-8 to 9-10",
    material: "PVC Flex Block-out", availability: "2026-06-01", trafficFlow: "Continuous traffic flow",
    trafficCount: "90 001 – 140 000+ vehicles/day", illuminated: false, lat: -25.952644, lng: 28.129198
  },
  {
    code: "KOP020", video: "videos/KOP020.mp4", area: "Midrand", image: "images/full/KOP020.jpg", thumb: "images/thumb/KOP020.jpg", rateCard: 60000, suggestedRate: 45000, production: 24000,
    title: "Olifantsfontein Road – Midrand",
    description: "On Olifantsfontein road in Midrand next to Regal Inn Midrand and the newly built Engen 700th garage, facing traffic leading out of Midrand from Blue Valley, Noordwyk, Blue Hills and Carlswald, heading towards the N1 highway (north and south), with routes to Joburg, Pretoria, Centurion, Sandton, OR Tambo International Airport, Mall of Africa, Gautrain station and Tembisa.",
    size: "4m x 16m", lsm: "LSM 7-8 to 9-10",
    material: "PVC Flex Block-out", availability: "2026-03-01", trafficFlow: "Continuous traffic flow",
    trafficCount: "90 001 – 140 000+ vehicles/day", illuminated: false, lat: -25.952644, lng: 28.129198
  },
  {
    code: "KOP023", video: "videos/KOP023.mp4", area: "Sandton", image: "images/full/KOP023.jpg", thumb: "images/thumb/KOP023.jpg", rateCard: 60000, suggestedRate: 38000, production: 13500,
    title: "Katherine Street – Sandton",
    description: "Located on Katherine street in Sandton, between Marlboro and Grayston drive. Faces traffic from Rivonia, Morningside, the M1 highway and Marlboro dr towards Sandton City and Gautrain Station (3km), Sandton CBD. 700m to Barlow Park Lifestyle Centre (retail, luxury apartments, Curro school). Surrounded by office parks and prime residential/commercial real estate.",
    size: "3m x 12m", lsm: "LSM 8-10",
    material: "PVC Flex Block-out", availability: "2026-05-01", trafficFlow: "Continuous traffic flow",
    trafficCount: "60 001 – 100 000+ vehicles/day", illuminated: false, lat: -26.097238, lng: 28.081570
  },
  {
    code: "KOP024", video: "videos/KOP024.mp4", area: "Hyde Park Corner", image: "images/full/KOP024.jpg", thumb: "images/thumb/KOP024.jpg", rateCard: 60000, suggestedRate: 38000, production: 15750,
    title: "Jan Smuts Ave – Hyde Park",
    description: "Located on Jan Smuts Ave next to Hyde Park Corner shopping mall. Faces traffic traveling from Rosebank towards Sandton and Bryanston via Winnie Mandela drive, and towards Randburg via Jan Smuts. Close to prime commercial properties and office parks including YFM and eTV studios.",
    size: "3.5m x 12m", lsm: "LSM 8-10",
    material: "PVC Flex Block-out", availability: "2026-03-01", trafficFlow: "Continuous traffic flow",
    trafficCount: "60 001 – 80 000+ vehicles/day", illuminated: false, lat: -26.126738, lng: 28.032825
  },
  {
    code: "KOP003", video: "videos/KOP003.mp4", area: "Parktown, Westcliff & Braamfontein", image: "images/full/KOP003.jpg", thumb: "images/thumb/KOP003.jpg", rateCard: 60000, suggestedRate: 38000, production: 13500,
    title: "Empire Road Gantry – Parktown, Johannesburg",
    description: "On Empire Road, next to Milpark Rea Vaya bus station. On route from the M1 Highway, Parktown and Braamfontein towards Auckland Park, Melville, Greenside, Emmarentia, UJ Kingsway Campus, SABC, Media24 offices and Campus Square shopping centre. Several business schools, student accommodation, 4 high schools, a skate park and Milpark Hospital within 300m. Near the 44 Stanley food, drinks and entertainment precinct.",
    size: "3m x 12m", lsm: "LSM 6-8 to 9-10",
    material: "PVC Flex Block-out", availability: "2026-03-01", trafficFlow: "Continuous traffic & pedestrian flow at the bus station stop",
    trafficCount: "99 000+ vehicles/day", illuminated: false, lat: -26.183274, lng: 28.020151
  },
  {
    code: "KOP012", video: "videos/KOP012.mp4", area: "Parktown, Westcliff & Braamfontein", image: "images/full/KOP012.jpg", thumb: "images/thumb/KOP012.jpg", rateCard: 50000, suggestedRate: 35000, production: 13500,
    title: "Barry Hertzog & Empire Road – Parktown, JHB",
    description: "On Barry Hertzog Ave off the Empire Road intersection, facing traffic traveling from Empire Road, Linden, Greenside, Milpark and Emmarentia towards Braamfontein and JHB CBD. Route leads to the University of Johannesburg and other tertiary/business schools. Next to 44 Stanley, Atlas Studios and student accommodation.",
    size: "3m x 12m", lsm: "LSM 6-8 to 9-10",
    material: "PVC Flex Block-out", availability: "2026-03-01", trafficFlow: "Continuous traffic",
    trafficCount: "85 000+ vehicles/day", illuminated: false, lat: -26.184297, lng: 28.017900
  },
  {
    code: "KOP013", video: "videos/KOP013.mp4", area: "Parktown, Westcliff & Braamfontein", image: "images/full/KOP013.jpg", thumb: "images/thumb/KOP013.jpg", rateCard: 50000, suggestedRate: 35000, production: 13500,
    title: "Barry Hertzog & Empire Road – Parktown, JHB",
    description: "On Barry Hertzog Ave next to 44 Stanley towards the Empire Road intersection, facing traffic from Braamfontein, Auckland Park and Johannesburg CBD, traveling towards Greenside, Milpark Hospital, Rand Steam shopping centre, Melville, Parktown, Emmarentia and Randburg.",
    size: "3m x 12m", lsm: "LSM 6-8 to 9-10",
    material: "PVC Flex Block-out", availability: "2026-03-01", trafficFlow: "Continuous traffic and pedestrian flow",
    trafficCount: "85 000+ vehicles/day", illuminated: false, lat: -26.184243, lng: 28.017841
  },
  {
    code: "KOP017", video: "videos/KOP017.mp4", area: "Parktown, Westcliff & Braamfontein", image: "images/full/KOP017.jpg", thumb: "images/thumb/KOP017.jpg", rateCard: 60000, suggestedRate: 35000, production: 13500,
    title: "Barry Hertzog – Westcliff, JHB",
    description: "Located on Barry Hertzog Ave in Westcliff, a main road connecting JHB CBD, Auckland Park, Melville and Parktown with Emmarentia, Greenside, Linden, Victory Park, Parkview and Randburg. Faces traffic from Empire Road, Milpark Hospital, Braamfontein and UJ traveling towards Emmarentia Dam, Greenside, Linden and Parkview Golf Course. 1.5km from Checkers Emmarentia, Wimpy, Pizza Hut, Debonairs, Pedro's and Ocean Basket.",
    size: "3m x 12m", lsm: "LSM 6-8 to 9-10",
    material: "PVC Flex Block-out", availability: "2026-03-01", trafficFlow: "Continuous traffic and pedestrian flow",
    trafficCount: "85 000+ vehicles/day", illuminated: false, lat: -26.172479, lng: 28.015431
  },
  {
    code: "KOP011", video: "videos/KOP011.mp4", area: "Parktown, Westcliff & Braamfontein", image: "images/full/KOP011.jpg", thumb: "images/thumb/KOP011.jpg", rateCard: 65000, suggestedRate: 40000, production: 13500,
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
    code: "KOP005", video: "videos/KOP005.mp4", area: "Krugersdorp – Noordheuwel", image: "images/full/KOP005.jpg", thumb: "images/thumb/KOP005.jpg", rateCard: 55000, suggestedRate: 38000, production: 13500,
    title: "Robert Broom Drive – Krugersdorp",
    description: "On Robert Broom Drive facing traffic traveling from Roodepoort, Valley View Shopping Centre, Noordheuwel Shopping Mall and Krugersdorp on the R28, on route towards Pretoria (R28/N14), Silver Stars Casino and Cradlestone Mall.",
    size: "3m x 12m", lsm: "LSM 6-8 to 9-10",
    material: "PVC Flex Block-out", availability: "2026-05-01", trafficFlow: "Continuous traffic",
    trafficCount: "85 000+ vehicles/day", illuminated: false, lat: -26.076824, lng: 27.796028
  },
  {
    code: "KOP004", video: "videos/KOP004.mp4", area: "Krugersdorp – Noordheuwel", image: "images/full/KOP004.jpg", thumb: "images/thumb/KOP004.jpg", rateCard: 55000, suggestedRate: 35000, production: 13500,
    title: "Robert Broom Drive – Krugersdorp",
    description: "On Robert Broom Drive in Noordheuwel, Krugersdorp, on route to Valley View Shopping Centre, Noordheuwel Shopping Mall, Roodepoort and Wilro Park. A main road connecting the affluent area to surrounding Krugersdorp, Helderkruin, Roodepoort, Muldersdrift and Pretoria.",
    size: "3m x 12m", lsm: "LSM 7-8 to 9-10",
    material: "PVC Flex Block-out", availability: "2026-03-01", trafficFlow: "Continuous traffic and pedestrian flow",
    trafficCount: "70 000+ vehicles/day", illuminated: false, lat: -26.076414, lng: 27.795710
  },
  {
    code: "KOP015", video: "videos/KOP015.mp4", area: "Cosmo City", image: "images/full/KOP015.jpg", thumb: "images/thumb/KOP015.jpg", rateCard: 50000, suggestedRate: 35000, production: 13500,
    title: "Cosmo City Gantry – Cosmo City",
    description: "Located on Cosmo City's main road, South Africa Drive, next to Cosmo Shopping Centre, a taxi rank and an Engen garage. Faces traffic from Malibongwe Drive towards Cosmo Fire Station and the heart of Cosmo City. Close to Cosmo Meridian School, Cosmo Primary and High Schools, the Cosmo Multipurpose Centre and a medical centre.",
    size: "3m x 12m", lsm: "LSM 6-8",
    material: "PVC Flex Block-out", availability: "2026-04-01", trafficFlow: "Continuous traffic and pedestrian flow + 15k per day",
    trafficCount: "60 000+ vehicles/day", illuminated: false, lat: -26.021122, lng: 27.928046
  },
  {
    code: "KOP016", video: "videos/KOP016.mp4", area: "Cosmo City", image: "images/full/KOP016.jpg", thumb: "images/thumb/KOP016.jpg", rateCard: 50000, suggestedRate: 35000, production: 13500,
    title: "Cosmo City Gantry – Cosmo City",
    description: "Located on Cosmo City's main road, South Africa Drive, next to Cosmo Shopping Centre, a taxi rank and an Engen garage. Faces traffic traveling towards Malibongwe Drive, Cosmo City Mall, Lanseria Airport, N14 Highway, Northriding, Fourways and Randburg.",
    size: "3m x 12m", lsm: "LSM 5-8",
    material: "PVC Flex Block-out", availability: "2027-01-01", trafficFlow: "Continuous traffic and pedestrian flow + 15k per day",
    trafficCount: "60 000+ vehicles/day", illuminated: false, lat: -26.021158, lng: 27.928043
  },
  {
    code: "KOP025", video: "videos/KOP025.mp4", area: "Cosmo City", image: "images/full/KOP025.jpg", thumb: "images/thumb/KOP025.jpg", rateCard: 50000, suggestedRate: 30000, production: 13500,
    title: "Cosmo City – South Africa Drive",
    description: "Located on South Africa Drive next to Shell garage, KFC, Cosmo Fire Station and a taxi/bus stop. 400m from Cosmo SAPS and 300m from Moscow Corner Centre (Usave, Blue Bottle Liquors, Moscow Grill House & Pub and major bank ATMs). Faces traffic from Malibongwe Drive towards Cosmo Fire Station, Jackal Creek, Moscow Corner, Build It, the VW/Audi Auto Clinic, Honeydew and Beyers Naude Drive.",
    size: "3m x 12m", lsm: "LSM 6-8",
    material: "PVC Flex Block-out", availability: "2026-04-01", trafficFlow: "Continuous traffic and pedestrian flow + 7k per day",
    trafficCount: "45 000+ vehicles/day", illuminated: false, lat: -26.036541, lng: 27.921873
  },
  {
    code: "KOP026", video: "videos/KOP026.mp4", area: "Cosmo City", image: "images/full/KOP026.jpg", thumb: "images/thumb/KOP026.jpg", rateCard: 50000, suggestedRate: 30000, production: 13500,
    title: "Cosmo City – South Africa Drive",
    description: "Located on South Africa Drive next to Shell garage, KFC, Cosmo Fire Station and a taxi/bus stop. 400m from Cosmo SAPS and 300m from Moscow Corner Centre. Faces traffic traveling towards Malibongwe Drive, Lanseria Airport, N14 highway, Cosmo Shopping Centre, Jackal Creek, Moscow Corner and Miami Grill.",
    size: "3m x 12m", lsm: "LSM 6-8",
    material: "PVC Flex Block-out", availability: "2026-04-01", trafficFlow: "Continuous traffic and pedestrian flow + 7k per day",
    trafficCount: "45 000+ vehicles/day", illuminated: false, lat: -26.036541, lng: 27.921873
  },
  {
    code: "KOP007", video: "videos/KOP007.mp4", area: "Kagiso, Mogale City", image: "images/full/KOP007.jpg", thumb: "images/thumb/KOP007.jpg", rateCard: 35000, suggestedRate: 25000, production: 14063,
    title: "Kagiso Drive – Kagiso, Mogale City",
    description: "Located at the entrance of Kagiso, facing traffic entering Kagiso Drive from Krugersdorp, Westgate, Roodepoort, Florida and Johannesburg towards Kagiso Mall and the different sections of the township. Situated at a taxi rank serving Krugersdorp, Westgate, Roodepoort, Florida and JHB CBD.",
    size: "7.5m x 5m", lsm: "LSM 5-8",
    material: "PVC Flex Block-out", availability: "2026-03-01", trafficFlow: "Continuous traffic and pedestrian flow + 10k per day",
    trafficCount: "35 000+ vehicles/day", illuminated: false, lat: -26.140136, lng: 27.793641
  },
  {
    code: "KOP006", video: "videos/KOP006.mp4", area: "Kagiso, Mogale City", image: "images/full/KOP006.jpg", thumb: "images/thumb/KOP006.jpg", rateCard: 35000, suggestedRate: 25000, production: 14063,
    title: "Kagiso Drive – Kagiso, Mogale City",
    description: "Along Kagiso Drive (main road) from Kagiso central, driving towards Krugersdorp, Westgate, Roodepoort, Johannesburg and surrounding towns. Situated at a taxi rank serving JHB, Roodepoort and surrounding towns and malls.",
    size: "7.5m x 5m", lsm: "LSM 5-8",
    material: "PVC Flex Block-out", availability: "2026-04-01", trafficFlow: "Continuous traffic and pedestrian flow",
    trafficCount: "35 000+ vehicles/day", illuminated: false, lat: -26.140329, lng: 27.793738
  },
  {
    code: "KOP018", video: "videos/KOP018.mp4", area: "Kagiso, Mogale City", image: "images/full/KOP018.jpg", thumb: "images/thumb/KOP018.jpg", rateCard: 50000, suggestedRate: 35000, production: 16875,
    title: "Kagiso Drive & Randfontein Road – Kagiso",
    description: "Next to Kagiso Mall and Chief Mogale Hall, on the corner of Kagiso Drive and Randfontein Road. Visible to three-way traffic to and from Kagiso Mall, and traffic traveling towards greater Kagiso, Azaadville, Randfontein, Soweto, JHB and Roodepoort. A few hundred metres from Kagiso Magistrate's Court, Kagiso Police Station and Kagiso Licensing Department.",
    size: "3m x 15m", lsm: "LSM 5-8",
    material: "PVC Flex Block-out", availability: "2026-03-01", trafficFlow: "Continuous traffic and pedestrian flow",
    trafficCount: "35 000+ vehicles/day", illuminated: false, lat: -26.167741, lng: 27.778627
  },
  {
    code: "KOP010", video: "videos/KOP010.mp4", area: "Soweto", image: "images/full/KOP010.jpg", thumb: "images/thumb/KOP010.jpg", rateCard: 45000, suggestedRate: 30000, production: 15080,
    title: "N17 Highway, New Canada – Soweto",
    description: "Located on the N17 Highway in Soweto, which connects residents in Orlando, Meadowlands, Dube, Noordgesig, Pimville and Diepkloof to the N1 north-western bypass, FNB Stadium, Riverlea and Nasrec. Provides the easiest access from Soweto to the N1 Highway, Johannesburg, Sandton and Pretoria.",
    size: "3m x 12m", lsm: "LSM 5-8",
    material: "Vinyl", availability: "2026-03-01", trafficFlow: "Continuous traffic flow",
    trafficCount: "70 000+ vehicles/day", illuminated: false, lat: -26.219295, lng: 27.939186
  },
  {
    code: "KOP014", video: "videos/KOP014.mp4", area: "Soweto", image: "images/full/KOP014.jpg", thumb: "images/thumb/KOP014.jpg", rateCard: 45000, suggestedRate: 35000, production: 15080,
    title: "Eldorado Park, Lenasia – Klipspruit West, Soweto",
    description: "On Klipspruit Valley Road in Klipspruit West, between Eldorado Park and Lenasia, on route to the N12 Highway. Faces traffic traveling from greater Soweto to join the N12 towards JHB, Potchefstroom, Ahmed Kathrada Hospital Lenasia, Trade Route Mall and Protea Glen, plus traffic off-ramping the N12 to Lenasia.",
    size: "3m x 12m", lsm: "LSM 5-8",
    material: "Vinyl", availability: "2026-03-01", trafficFlow: "Continuous traffic and pedestrian flow",
    trafficCount: "60 000+ vehicles/day", illuminated: false, lat: -26.303992, lng: 27.872743
  },
  {
    code: "KOP021", video: "videos/KOP021.mp4", area: "Olievenhoutbosch, Centurion", image: "images/full/KOP021.jpg", thumb: "images/thumb/KOP021.jpg", rateCard: 45000, suggestedRate: 35000, production: 13500,
    title: "Olievenhoutbosch Gantry (Entrance) – Centurion, Tshwane",
    description: "Located at the Olievenhoutbosch Ext 36 entrance on Waterberg Road, facing traffic driving into 'Olieven', a township in Centurion, Tshwane close to Midrand on the R55 route. 300m from Olievenhoutbosch Corner Shopping Centre (Engen garage, Chicken Licken, Shoprite, sports betting outlet, KFC) and a community centre 500m away. Near Dunlop Tyres Fitment Centre, Olieven Motor Spares and the R55 Chillout entertainment spot. LSM 4-7 group area.",
    size: "3m x 12m", lsm: "LSM 5-8",
    material: "PVC Flex Block-out", availability: "2026-03-01", trafficFlow: "Continuous traffic and pedestrian flow",
    trafficCount: "50 000+ vehicles/day", illuminated: false, lat: -25.905682, lng: 28.097100
  },
  {
    code: "KOP022", video: "videos/KOP022.mp4", area: "Olievenhoutbosch, Centurion", image: "images/full/KOP022.jpg", thumb: "images/thumb/KOP022.jpg", rateCard: 45000, suggestedRate: 35000, production: 13500,
    title: "Olievenhoutbosch Gantry (Exit) – Centurion, Tshwane",
    description: "Located at the Olievenhoutbosch Ext 36 exit on Waterberg Road, facing traffic driving out of 'Olieven' towards Pretoria, the R55, Midrand and Woodmead. 300m from Olievenhoutbosch Corner Shopping Centre and a community centre 500m away. Near Dunlop Tyres Fitment Centre, Olieven Motor Spares and the R55 Chillout entertainment spot. LSM 4-7 group area.",
    size: "3m x 12m", lsm: "LSM 5-8",
    material: "PVC Flex Block-out", availability: "2026-03-01", trafficFlow: "Continuous traffic and pedestrian flow",
    trafficCount: "50 000+ vehicles/day", illuminated: false, lat: -25.905682, lng: 28.097100
  }
],
    LANDMARKS: [
  { name: "Fourways Mall", category: "mall", tier: "area", lat: -26.0188644, lng: 28.0064222, sites: ["KOP001", "KOP002", "KOP009", "KOP008"] },
  { name: "Monte Casino", category: "entertainment", tier: "area", lat: -26.0245212, lng: 28.0118433, sites: ["KOP001", "KOP002", "KOP009", "KOP008"] },
  { name: "Cedar Square", category: "mall", tier: "area", lat: -26.0171174, lng: 27.9993122, sites: ["KOP001", "KOP002", "KOP009", "KOP008"] },
  { name: "Northgate Shopping Centre", category: "mall", tier: "area", lat: -26.061005, lng: 27.9464571, sites: ["KOP002", "KOP008"] },

  { name: "Mall of Africa", category: "mall", tier: "area", lat: -26.0150679, lng: 28.1055399, sites: ["KOP019", "KOP020"] },
  { name: "Vodacom World", category: "office", tier: "area", lat: -25.9701557, lng: 28.1285179, sites: ["KOP019", "KOP020"] },
  { name: "Engen Summit Road", category: "fuel", tier: "area", lat: -25.9522169, lng: 28.1302890, sites: ["KOP019", "KOP020"] },

  { name: "Sandton City", category: "mall", tier: "area", lat: -26.1088467, lng: 28.0527198, sites: ["KOP023"] },
  { name: "Gautrain Sandton Station", category: "transport", tier: "area", lat: -26.1078845, lng: 28.0572632, sites: ["KOP023"] },

  { name: "Hyde Park Corner", category: "mall", tier: "area", lat: -26.1252748, lng: 28.0330341, sites: ["KOP024"] },

  { name: "44 Stanley", category: "dining", tier: "area", lat: -26.1850934, lng: 28.0187278, sites: ["KOP003", "KOP012", "KOP013", "KOP017"] },
  { name: "University of the Witwatersrand", category: "education", tier: "area", lat: -26.1928628, lng: 28.0304471, sites: ["KOP011", "KOP027"] },
  { name: "Nelson Mandela Bridge", category: "landmark", tier: "area", lat: -26.1968697, lng: 28.0342220, sites: ["KOP027"] },
  { name: "Wimpy Greenside", category: "dining", tier: "area", lat: -26.1614531, lng: 28.0124562, sites: ["KOP017"] },

  { name: "Cradlestone Mall", category: "mall", tier: "area", lat: -26.0603788, lng: 27.8371339, sites: ["KOP005", "KOP004"] },
  { name: "Silverstar Casino", category: "entertainment", tier: "area", lat: -26.0672798, lng: 27.8284211, sites: ["KOP005", "KOP004"] },

  { name: "Cosmo City Shopping Centre", category: "mall", tier: "area", lat: -26.0222793, lng: 27.9286348, sites: ["KOP015", "KOP016", "KOP025", "KOP026"] },

  { name: "Kagiso Mall", category: "mall", tier: "area", lat: -26.1671809, lng: 27.7813171, sites: ["KOP007", "KOP006", "KOP018"] },

  { name: "FNB Stadium", category: "landmark", tier: "area", lat: -26.2347569, lng: 27.9826554, sites: ["KOP010"] },
  { name: "Trade Route Mall", category: "mall", tier: "area", lat: -26.3274906, lng: 27.8688145, sites: ["KOP014"] },

  { name: "Shoprite Olievenhoutbosch Corner", category: "mall", tier: "area", lat: -25.9035290, lng: 28.0944299, sites: ["KOP021", "KOP022"] },

  // --- Closer-in landmarks: literally next to / within a few hundred
  // metres of a site, straight from the original site descriptions,
  // verified for real coordinates. These sit alongside the area-anchor
  // landmarks above, not replacing them. ---
  { name: "Netcare Milpark Hospital", category: "health", tier: "close", lat: -26.1802894, lng: 28.0176318, sites: ["KOP003"] },
  { name: "Milpark Rea Vaya Station", category: "transport", tier: "close", lat: -26.1832600, lng: 28.0198100, sites: ["KOP003"] },
  { name: "Northlands Deco Park", category: "mall", tier: "close", lat: -26.0330863, lng: 27.9613374, sites: ["KOP009", "KOP008"] },
  { name: "Engen Cosmo City Convenience Centre", category: "fuel", tier: "close", lat: -26.0216680, lng: 27.9286172, sites: ["KOP015", "KOP016"] },
  { name: "KFC Cosmo City", category: "dining", tier: "close", lat: -26.0370883, lng: 27.9218208, sites: ["KOP025", "KOP026"] },
  { name: "Moscow Corner Centre", category: "mall", tier: "close", lat: -26.0383776, lng: 27.9232362, sites: ["KOP025", "KOP026"] },
  { name: "Kagiso Magistrates Court", category: "landmark", tier: "close", lat: -26.1637201, lng: 27.7803257, sites: ["KOP018"] },
  { name: "Regal Inn Hotel Midrand", category: "landmark", tier: "close", lat: -25.9528174, lng: 28.1269338, sites: ["KOP019", "KOP020"] },
  { name: "Valleyview Shopping Centre", category: "mall", tier: "close", lat: -26.0820874, lng: 27.8039895, sites: ["KOP005"] },
  { name: "Noordheuwel Mall", category: "mall", tier: "close", lat: -26.0829604, lng: 27.8021552, sites: ["KOP004"] },
  { name: "Barlow Park Lifestyle Centre", category: "mall", tier: "close", lat: -26.0993393, lng: 28.0790018, sites: ["KOP023"] },
  { name: "KPMG Crescent", category: "office", tier: "close", lat: -26.1856333, lng: 28.0313874, sites: ["KOP011"] },
  { name: "Checkers Emmarentia", category: "mall", tier: "close", lat: -26.1610000, lng: 28.0120000, sites: ["KOP017"] },
  { name: "Lenmed Ahmed Kathrada Private Hospital", category: "health", tier: "close", lat: -26.3277018, lng: 27.8640828, sites: ["KOP014"] },
  { name: "Chicken Licken Olievenhoutbosch", category: "dining", tier: "close", lat: -25.9041384, lng: 28.0955668, sites: ["KOP021", "KOP022"] },
  { name: "eTV Studios", category: "landmark", tier: "close", lat: -26.1273098, lng: 28.0315964, sites: ["KOP024"] },
  { name: "University of Johannesburg (Kingsway)", category: "education", tier: "area", lat: -26.1835900, lng: 27.9976812, sites: ["KOP012", "KOP013"] },
  { name: "Maponya Mall", category: "mall", tier: "area", lat: -26.2580323, lng: 27.9020381, sites: ["KOP010"] },
  { name: "Kagiso Central Taxi Rank", category: "transport", tier: "area", lat: -26.1585554, lng: 27.7831347, sites: ["KOP007", "KOP006"] },
],
  },

  medium: {
    id: "medium",
    name: "The",
    nameAccent: "Medium",
    tagline: "OOH Site Locator",
    CONFIG: {
      SHEET_CSV_URL: "",
      REFRESH_SECONDS: 45,
    },
    CONTACT: {
  name: "Bongane Motlhabane",
  role: "The Medium",
  email: "Bongane@themedium.co.za",
  phone: "083 212 0003",
  phoneHref: "+27832120003",
},
    AREAS: [
  "Johannesburg – M2 Highway",
  "Soweto – Jabulani",
  "Cosmo City",
  "Diepsloot",
  "Tembisa",
  "Vosloorus",
  "Daveyton",
  "Kagiso – Chamdor",
  "Hammanskraal",
  "Mokopane, Limpopo",
],
    SITES: [
  {
    code: "TMD010", area: "Johannesburg – M2 Highway",
    title: "M2 Highway Digital Screen",
    format: "digital",
    image: "images/full/TMD010.jpg", thumb: "images/thumb/TMD010.jpg",
    description: "Located along the M2 highway between the Mooi Street off-ramp and the Rissik/Selby Street off-ramps. Faces traffic heading to the CBD, Maboneng Precinct, and the N3/N12 highways towards Newtown, Crown Mines, the N1, M1 and N12 — connecting Braamfontein, Parktown, Sandton, Soweto, Pretoria, South Rand and the West Rand.",
    size: "6m x 14m (84 sqm)",
    rateCard: 80000, suggestedRate: 65000, production: 0,
    slots: 12, spotLength: "15 sec", loop: "3 min loop", spotsPerDay: 480,
    availability: "2025-01-01", trafficCount: "3,000,000+ cars/month",
    illuminated: true, lat: -26.212541, lng: 28.049633,
  },
  {
    code: "TM001A", area: "Soweto – Jabulani",
    title: "Cnr Bolani Dr & Koma Str – Jabulani Mall",
    format: "static",
    image: "images/full/TM001A.jpg", thumb: "images/thumb/TM001A.jpg",
    description: "Located outside Jabulani Mall (banks, Shoprite, Virgin Active, KFC, McDonald's, Nando's, Game, Clicks). Across the road from Bheki Mlangeni Hospital and opposite an Engen garage. 1km from Soweto Theatre, a Shell garage, Jabulani Police Station and the Jabulani taxi rank.",
    size: "7.5m x 5m",
    rateCard: 35000, suggestedRate: 30000, production: 15000,
    availability: "2025-01-01", trafficCount: "800,889+ cars/month",
    illuminated: false, lat: -26.248696, lng: 27.854758,
  },
  {
    code: "TM001B", area: "Soweto – Jabulani",
    title: "Cnr Bolani Dr & Koma Str – Jabulani Mall",
    format: "static",
    image: "images/full/TM001B.jpg", thumb: "images/thumb/TM001B.jpg",
    description: "Located outside Jabulani Mall (banks, Shoprite, Virgin Active, KFC, McDonald's, Nando's, Game, Clicks). Across the road from Bheki Mlangeni Hospital and opposite an Engen garage. 1km from Soweto Theatre, a Shell garage, Jabulani Police Station and the Jabulani taxi rank.",
    size: "7.5m x 5m",
    rateCard: 35000, suggestedRate: 30000, production: 10500,
    availability: "2027-01-01", trafficCount: "800,889+ cars/month",
    illuminated: false, lat: -26.248696, lng: 27.854758,
  },
  {
    code: "TM002A", area: "Cosmo City",
    title: "Cnr Malibongwe Dr & South Africa Dr – Cosmo City Mall",
    format: "static",
    image: "images/full/TM002A.jpg", thumb: "images/thumb/TM002A.jpg",
    description: "Located outside the Cosmo taxi rank, across from Cosmo Mall (banks, McDonald's, Pick n Pay, liquor store, fast food). Opposite a Sasol garage, Shoprite and Liquor, Cambridge Food/Liquor and KFC.",
    size: "3m x 12m",
    rateCard: 45000, suggestedRate: 35000, production: 15500,
    availability: "2026-04-01", trafficCount: "1,212,389+ cars/month",
    illuminated: false, lat: -26.016552, lng: 27.939255,
  },
  {
    code: "TM002B", area: "Cosmo City",
    title: "Cnr Malibongwe Dr & South Africa Dr – Cosmo City Mall",
    format: "static",
    image: "images/full/TM002B.jpg", thumb: "images/thumb/TM002B.jpg",
    description: "Located outside the Cosmo taxi rank, across from Cosmo Mall (banks, McDonald's, Pick n Pay, liquor store, fast food). Opposite a Sasol garage, Shoprite and Liquor, Cambridge Food/Liquor and KFC.",
    size: "3m x 12m",
    rateCard: 45000, suggestedRate: 35000, production: 15500,
    availability: "2026-04-01", trafficCount: "1,212,389+ cars/month",
    illuminated: false, lat: -26.016552, lng: 27.939255,
  },
  {
    code: "TM009A", area: "Diepsloot",
    title: "Winnie Mandela Drive – First Entrance",
    format: "static",
    image: "images/full/TM009A.jpg", thumb: "images/thumb/TM009A.jpg",
    description: "Located on Winnie Mandela Drive by the first entrance to Diepsloot, facing traffic towards the N14, next to a taxi rank, Diepsloot Mall and Diepsloot Square. Side B faces traffic towards Steyn City, Makro Riversands and Fourways.",
    size: "3m x 12m",
    rateCard: 55000, suggestedRate: 45000, production: 15000,
    availability: "2025-01-01", trafficCount: "1,003,927+ cars/month",
    illuminated: false, lat: -25.942895, lng: 28.019964,
  },
  {
    code: "TM009B", area: "Diepsloot",
    title: "Winnie Mandela Drive – First Entrance",
    format: "static",
    image: "images/full/TM009B.jpg", thumb: "images/thumb/TM009B.jpg",
    description: "Located on Winnie Mandela Drive by the first entrance to Diepsloot, facing traffic towards the N14, next to a taxi rank, Diepsloot Mall and Diepsloot Square. Side B faces traffic towards Steyn City, Makro Riversands and Fourways.",
    size: "3m x 12m",
    rateCard: 55000, suggestedRate: 45000, production: 15000,
    availability: "2025-01-01", trafficCount: "1,003,927+ cars/month",
    illuminated: false, lat: -25.942895, lng: 28.019964,
  },
  {
    code: "TM003A", area: "Tembisa",
    title: "Cnr Olifantsfontein Rd & Aluminium Dr – Mall of Tembisa",
    format: "static",
    image: "images/full/TM003A.jpg", thumb: "images/thumb/TM003A.jpg",
    description: "Located outside Mall of Tembisa on Olifantsfontein Road leading to Midrand, Busy Corner and Phumlani Mall. Surrounding areas include Ivory Park and the Winnie Mandela informal settlement.",
    size: "3m x 12m",
    rateCard: 45000, suggestedRate: 35000, production: 15500,
    availability: "2025-01-01", trafficCount: "1,133,679+ cars/month",
    illuminated: false, lat: -25.959600, lng: 28.2035582,
  },
  {
    code: "TM003B", area: "Tembisa",
    title: "Cnr Olifantsfontein Rd & Aluminium Dr – Mall of Tembisa",
    format: "static",
    image: "images/full/TM003B.jpg", thumb: "images/thumb/TM003B.jpg",
    description: "Located outside Mall of Tembisa on Olifantsfontein Road leading to Midrand, Busy Corner and Phumlani Mall. Surrounding areas include Ivory Park and the Winnie Mandela informal settlement.",
    size: "3m x 12m",
    rateCard: 45000, suggestedRate: 35000, production: 15500,
    availability: "2025-01-01", trafficCount: "1,133,679+ cars/month",
    illuminated: false, lat: -25.959600, lng: 28.2035582,
  },
  {
    code: "TM004A", area: "Vosloorus",
    title: "Bierman Rd & Brickfield Rd – Chris Hani Mall",
    format: "static",
    image: "images/full/TM004A.jpg", thumb: "images/thumb/TM004A.jpg",
    description: "Located outside two shopping centres facing each other (Chris Hani Crossing and Chris Hani Mall) in Vosloorus, with a taxi rank between them. The road leads out of Vosloorus to the N3 towards Durban and Johannesburg.",
    size: "3m x 12m",
    rateCard: 45000, suggestedRate: 35000, production: 15500,
    availability: "2026-04-01", trafficCount: "871,691+ cars/month",
    illuminated: false, lat: -26.341337, lng: 28.182874,
  },
  {
    code: "TM004B", area: "Vosloorus",
    title: "Bierman Rd & Brickfield Rd – Chris Hani Mall",
    format: "static",
    image: "images/full/TM004B.jpg", thumb: "images/thumb/TM004B.jpg",
    description: "Located outside two shopping centres facing each other (Chris Hani Crossing and Chris Hani Mall) in Vosloorus, with a taxi rank between them. The road leads out of Vosloorus to the N3 towards Durban and Johannesburg.",
    size: "3m x 12m",
    rateCard: 45000, suggestedRate: 35000, production: 15500,
    availability: "2025-01-01", trafficCount: "871,691+ cars/month",
    illuminated: false, lat: -26.341337, lng: 28.182874,
  },
  {
    code: "TM006A", area: "Daveyton",
    title: "DM Mthimunye Street, Daveyton",
    format: "static",
    image: "images/full/TM006A.jpg", thumb: "images/thumb/TM006A.jpg",
    description: "Located on the main road leading in and out of Daveyton, 2km from the N12 towards Mpumalanga and Johannesburg. A Total garage sits 100m away, and the shopping centre at the nearby robot has Shoprite, KFC, PEP, Roots Butchery and Liquor City.",
    size: "3m x 12m",
    rateCard: 45000, suggestedRate: 35000, production: 15000,
    availability: "2026-04-01", trafficCount: "750,800+ cars/month",
    illuminated: false, lat: -26.162181, lng: 28.399153,
  },
  {
    code: "TM006B", area: "Daveyton",
    title: "DM Mthimunye Street, Daveyton",
    format: "static",
    image: "images/full/TM006B.jpg", thumb: "images/thumb/TM006B.jpg",
    description: "Located on the main road leading in and out of Daveyton, 2km from the N12 towards Mpumalanga and Johannesburg. A Total garage sits 100m away, and the shopping centre at the nearby robot has Shoprite, KFC, PEP, Roots Butchery and Liquor City.",
    size: "3m x 12m",
    rateCard: 45000, suggestedRate: 35000, production: 15000,
    availability: "2025-01-01", trafficCount: "750,800+ cars/month",
    illuminated: false, lat: -26.162181, lng: 28.399153,
  },
  {
    code: "TM007A", area: "Kagiso – Chamdor",
    title: "Jacobs Street, Kagiso – Chamdor Centre",
    format: "static",
    image: "images/full/TM007A.jpg", thumb: "images/thumb/TM007A.jpg",
    description: "Located on the main road in Kagiso, opposite Pick n Pay, PnP Liquor and Build It, 100m from Chamdor Square (Shoprite, PEP, Easy Pack Liquor, Finbond, Nedbank, FNB and Absa ATMs). A Shell garage is 300m away and a SAB brewery 200m away. The road leads to Leratong District Hospital.",
    size: "3m x 12m",
    rateCard: 45000, suggestedRate: 35000, production: 15000,
    availability: "2025-01-01", trafficCount: "623,500+ cars/month",
    illuminated: false, lat: -26.158013, lng: 27.797142,
  },
  {
    code: "TM007B", area: "Kagiso – Chamdor",
    title: "Jacobs Street, Kagiso – Chamdor Centre",
    format: "static",
    image: "images/full/TM007B.jpg", thumb: "images/thumb/TM007B.jpg",
    description: "Located on the main road in Kagiso, opposite Pick n Pay, PnP Liquor and Build It, 100m from Chamdor Square (Shoprite, PEP, Easy Pack Liquor, Finbond, Nedbank, FNB and Absa ATMs). A Shell garage is 300m away and a SAB brewery 200m away. The road leads to Leratong District Hospital.",
    size: "3m x 12m",
    rateCard: 45000, suggestedRate: 35000, production: 15000,
    availability: "2025-01-01", trafficCount: "623,500+ cars/month",
    illuminated: false, lat: -26.158013, lng: 27.797142,
  },
  {
    code: "TM008A", area: "Hammanskraal",
    title: "Temba Rd / Juba Rd – Jubilee Mall & Jubilee Crossing",
    format: "static",
    image: "images/full/TM008A.jpg", thumb: "images/thumb/TM008A.jpg",
    description: "Located between Jubilee Mall and Jubilee shopping centre in Hammanskraal, Pretoria, on Temba Road. Next to Jubilee Hospital, Jubilee Police Station, a taxi rank and an Engen garage. Combined anchor tenants include Shoprite, Absa, FNB, PEP, Pick n Pay, KFC, Nando's and McDonald's.",
    size: "3m x 12m",
    rateCard: 45000, suggestedRate: 35000, production: 15500,
    availability: "2027-01-01", trafficCount: "711,273+ cars/month",
    illuminated: false, lat: -25.404847, lng: 28.266457,
  },
  {
    code: "TM008B", area: "Hammanskraal",
    title: "Temba Rd / Juba Rd – Jubilee Mall & Jubilee Crossing",
    format: "static",
    image: "images/full/TM008B.jpg", thumb: "images/thumb/TM008B.jpg",
    description: "Located between Jubilee Mall and Jubilee shopping centre in Hammanskraal, Pretoria, on Temba Road. Next to Jubilee Hospital, Jubilee Police Station, a taxi rank and an Engen garage. Combined anchor tenants include Shoprite, Absa, FNB, PEP, Pick n Pay, KFC, Nando's and McDonald's.",
    size: "3m x 12m",
    rateCard: 45000, suggestedRate: 35000, production: 15500,
    availability: "2026-08-01", trafficCount: "711,273+ cars/month",
    illuminated: false, lat: -25.404847, lng: 28.266457,
  },
  {
    code: "TM005A", area: "Mokopane, Limpopo",
    title: "Dudu Madisha Dr – Mahwelereng Shopping Centre",
    format: "static",
    image: "images/full/TM005A.jpg", thumb: "images/thumb/TM005A.jpg",
    description: "Located opposite Mahwelereng Shopping Centre on Dudu Madisha Drive, next to an Engen garage. Anchor tenants include Shoprite, Absa, Nedbank, Capitec, FNB, PEP, Jet and the Post Office. 2km from Mokopane Hospital, the Magistrate's Court, SASSA offices, Sasko Bakery, Mahwelereng Stadium, Waterberg TVET College and the Traffic Department.",
    size: "3m x 12m",
    rateCard: 45000, suggestedRate: 35000, production: 15000,
    availability: "2026-08-01", trafficCount: "356,010+ cars/month",
    illuminated: false, lat: -24.140851, lng: 28.968667,
  },
  {
    code: "TM005B", area: "Mokopane, Limpopo",
    title: "Dudu Madisha Dr – Mahwelereng Shopping Centre",
    format: "static",
    image: "images/full/TM005B.jpg", thumb: "images/thumb/TM005B.jpg",
    description: "Located opposite Mahwelereng Shopping Centre on Dudu Madisha Drive, next to an Engen garage. Anchor tenants include Shoprite, Absa, Nedbank, Capitec, FNB, PEP, Jet and the Post Office. 2km from Mokopane Hospital, the Magistrate's Court, SASSA offices, Sasko Bakery, Mahwelereng Stadium, Waterberg TVET College and the Traffic Department.",
    size: "3m x 12m",
    rateCard: 45000, suggestedRate: 35000, production: 15000,
    availability: "2025-01-01", trafficCount: "356,010+ cars/month",
    illuminated: false, lat: -24.140851, lng: 28.968667,
  },
],
    // Close-proximity landmarks haven't been researched for The Medium's
    // sites yet — leaving empty for now rather than guessing.
    LANDMARKS: [
      { name: "Jabulani Mall", category: "mall", tier: "close", lat: -26.2514239, lng: 27.8582055, sites: ["TM001A", "TM001B"] },
      { name: "Diepsloot Mall", category: "mall", tier: "close", lat: -25.9419012, lng: 28.0194172, sites: ["TM009A", "TM009B"] },
      { name: "Bheki Mlangeni District Hospital", category: "health", tier: "close", lat: -26.2478767, lng: 27.8570665, sites: ["TM001A", "TM001B"] },
      { name: "Soweto Theatre", category: "entertainment", tier: "area", lat: -26.2490705, lng: 27.8598536, sites: ["TM001A", "TM001B"] },
      { name: "Cosmo City Shopping Centre", category: "mall", tier: "area", lat: -26.0222793, lng: 27.9286348, sites: ["TM002A", "TM002B"] },
      { name: "Mall of Tembisa", category: "mall", tier: "close", lat: -25.9592264, lng: 28.2031257, sites: ["TM003A", "TM003B"] },
      { name: "Chris Hani Mall", category: "mall", tier: "close", lat: -26.3429914, lng: 28.1824854, sites: ["TM004A", "TM004B"] },
      { name: "Shoprite Daveyton", category: "mall", tier: "close", lat: -26.1635117, lng: 28.4022227, sites: ["TM006A", "TM006B"] },
      { name: "Chamdor Square Shopping Centre", category: "mall", tier: "close", lat: -26.1559518, lng: 27.7955722, sites: ["TM007A", "TM007B"] },
      { name: "Jubilee Mall", category: "mall", tier: "close", lat: -25.4053878, lng: 28.2696922, sites: ["TM008A", "TM008B"] },
      { name: "Jubilee District Hospital", category: "health", tier: "area", lat: -25.4031152, lng: 28.2662349, sites: ["TM008A", "TM008B"] },
      { name: "Mokopane Hospital", category: "health", tier: "area", lat: -24.1550510, lng: 28.9891494, sites: ["TM005A", "TM005B"] },
      { name: "Maboneng Precinct", category: "landmark", tier: "area", lat: -26.2042543, lng: 28.0591310, sites: ["TMD010"] },
    ],
  },
};
