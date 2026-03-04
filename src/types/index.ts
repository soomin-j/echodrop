// EchoDrop Type Definitions

export type EchoType = "photo" | "text" | "handwriting" | "audio" | "drawing";

export interface EchoMetadata {
  timeOfDay?: "dawn" | "morning" | "afternoon" | "dusk" | "night";
  season?: "spring" | "summer" | "autumn" | "winter";
  weather?: "sunny" | "cloudy" | "rainy" | "snowy" | "foggy";
  lightQuality?: "golden hour" | "overcast" | "harsh" | "soft" | "dim";
  tags?: string[];
}

export interface Echo {
  id: string;
  userId: string;
  type: EchoType;
  content: string; // URL for photo/audio, text content for text/handwriting
  caption?: string;
  metadata?: EchoMetadata;
  locationName?: string;
  createdAt: string; // ISO date
}

export interface Postcard {
  id: string;
  senderId: string;
  echoes: Echo[];
  caption?: string;
  city: string;
  area: string;
  locationName?: string;
  pseudonym?: string;
  createdAt: string;
  // AI-generated design (gradient, layout, typography, mesh, waveform)
  design?: {
    gradientColors?: string[];
    mood?: string;
    layoutVariant?: "classic" | "centered" | "minimal";
    typographyStyle?: "calm" | "energetic" | "reflective" | "default";
    gradientMesh?: string[];
    waveformBars?: number[];
  };
}

export interface ReceivedPostcard extends Postcard {
  receivedAt: string;
  saved?: boolean;
}

export interface User {
  id: string;
  email: string;
  country?: string;
  city: string;
  area: string;
  pseudonym?: string;
  deliveryCadence?: 1 | 2 | 3; // per week
}

export interface CityArea {
  city: string;
  areas: string[];
}

export interface CountryCities {
  country: string;
  cities: string[];
}

// Countries with city options for onboarding and sending
export const COUNTRIES: CountryCities[] = [
  { country: "South Korea", cities: ["Seoul", "Busan", "Incheon", "Daegu", "Daejeon", "Gwangju", "Suwon", "Ulsan", "Changwon", "Goyang", "Yongin", "Seongnam", "Cheongju", "Ansan", "Namyangju", "Jeonju", "Cheonan", "Gimhae", "Anyang", "Pohang"] },
  { country: "Japan", cities: ["Tokyo", "Yokohama", "Osaka", "Nagoya", "Sapporo", "Fukuoka", "Kobe", "Kyoto", "Kawasaki", "Saitama", "Hiroshima", "Sendai", "Kitakyushu", "Chiba", "Sakai", "Niigata", "Hamamatsu", "Kumamoto", "Shizuoka", "Okayama", "Kagoshima", "Sagamihara", "Funabashi", "Higashiosaka", "Hachioji", "Matsuyama", "Matsudo", "Utsunomiya", "Nagasaki", "Kanazawa", "Oita", "Wakayama", "Gifu", "Toyota", "Machida", "Fukuyama", "Kawaguchi", "Maebashi", "Koriyama", "Kashiwa"] },
  { country: "United States", cities: ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia", "San Antonio", "San Diego", "Dallas", "San Jose", "Austin", "Jacksonville", "Fort Worth", "Columbus", "Charlotte", "San Francisco", "Indianapolis", "Seattle", "Denver", "Boston", "Nashville", "Detroit", "Portland", "Las Vegas", "Memphis", "Louisville", "Baltimore", "Milwaukee", "Albuquerque", "Tucson", "Fresno", "Sacramento", "Kansas City", "Mesa", "Atlanta", "Omaha", "Colorado Springs", "Raleigh", "Miami", "Long Beach", "Virginia Beach", "Oakland", "Minneapolis", "Tulsa", "Tampa", "Arlington", "New Orleans", "Wichita", "Cleveland", "Bakersfield", "Aurora"] },
  { country: "United Kingdom", cities: ["London", "Birmingham", "Manchester", "Leeds", "Glasgow", "Liverpool", "Bristol", "Sheffield", "Edinburgh", "Cardiff", "Belfast", "Newcastle", "Nottingham", "Southampton", "Brighton", "Leicester", "Coventry", "Hull", "Bradford", "Stoke-on-Trent", "Wolverhampton", "Derby", "Plymouth", "Reading", "Northampton", "Luton", "Aberdeen", "Portsmouth", "Milton Keynes", "Swansea"] },
  { country: "Germany", cities: ["Berlin", "Hamburg", "Munich", "Cologne", "Frankfurt", "Stuttgart", "Düsseldorf", "Dortmund", "Essen", "Leipzig", "Bremen", "Dresden", "Hannover", "Nuremberg", "Duisburg", "Bochum", "Wuppertal", "Bielefeld", "Bonn", "Münster", "Karlsruhe", "Mannheim", "Augsburg", "Wiesbaden", "Gelsenkirchen", "Mönchengladbach", "Braunschweig", "Chemnitz", "Kiel", "Aachen"] },
  { country: "France", cities: ["Paris", "Marseille", "Lyon", "Toulouse", "Nice", "Nantes", "Strasbourg", "Montpellier", "Bordeaux", "Lille", "Rennes", "Reims", "Saint-Étienne", "Toulon", "Le Havre", "Grenoble", "Dijon", "Angers", "Nîmes", "Villeurbanne", "Clermont-Ferrand", "Le Mans", "Aix-en-Provence", "Brest", "Tours", "Amiens", "Limoges", "Annecy", "Perpignan", "Béziers"] },
  { country: "Canada", cities: ["Toronto", "Montreal", "Vancouver", "Calgary", "Edmonton", "Ottawa", "Winnipeg", "Quebec City", "Hamilton", "Kitchener", "London", "Victoria", "Halifax", "Oshawa", "Windsor", "Saskatoon", "Regina", "Sherbrooke", "Barrie", "Kelowna", "Abbotsford", "Kingston", "Saguenay", "Trois-Rivières", "Guelph", "Moncton", "Saint John", "Thunder Bay", "Saint John's"] },
  { country: "Australia", cities: ["Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide", "Gold Coast", "Newcastle", "Canberra", "Sunshine Coast", "Wollongong", "Hobart", "Geelong", "Townsville", "Cairns", "Darwin", "Toowoomba", "Ballarat", "Bendigo", "Launceston", "Mackay", "Rockhampton", "Bundaberg", "Coffs Harbour", "Wagga Wagga", "Hervey Bay", "Port Macquarie", "Orange", "Dubbo", "Nowra", "Bathurst"] },
  { country: "China", cities: ["Shanghai", "Beijing", "Guangzhou", "Shenzhen", "Chengdu", "Hangzhou", "Wuhan", "Xi'an", "Suzhou", "Tianjin", "Nanjing", "Chongqing", "Zhengzhou", "Qingdao", "Dongguan", "Shenyang", "Dalian", "Jinan", "Changsha", "Kunming", "Hefei", "Fuzhou", "Xiamen", "Wuxi", "Ningbo", "Harbin", "Changchun", "Shijiazhuang", "Taiyuan", "Nanning"] },
  { country: "India", cities: ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Kolkata", "Pune", "Ahmedabad", "Jaipur", "Surat", "Lucknow", "Kanpur", "Nagpur", "Indore", "Thane", "Bhopal", "Visakhapatnam", "Pimpri-Chinchwad", "Patna", "Vadodara", "Ghaziabad", "Ludhiana", "Agra", "Nashik", "Faridabad", "Meerut", "Rajkot", "Varanasi", "Srinagar", "Aurangabad", "Dhanbad"] },
  { country: "Spain", cities: ["Madrid", "Barcelona", "Valencia", "Seville", "Zaragoza", "Málaga", "Murcia", "Palma", "Las Palmas", "Bilbao", "Alicante", "Córdoba", "Valladolid", "Vigo", "Gijón", "Hospitalet", "A Coruña", "Granada", "Elche", "Oviedo", "Badalona", "Cartagena", "Terrassa", "Jerez", "Sabadell", "Santa Cruz de Tenerife", "Pamplona", "Santander", "León", "Tarragona"] },
  { country: "Italy", cities: ["Rome", "Milan", "Naples", "Turin", "Palermo", "Genoa", "Bologna", "Florence", "Venice", "Verona", "Messina", "Padua", "Trieste", "Brescia", "Parma", "Modena", "Prato", "Reggio Emilia", "Livorno", "Cagliari", "Foggia", "Ravenna", "Ferrara", "Rimini", "Syracuse", "Sassari", "Latina", "Giugliano", "Monza", "Bergamo"] },
  { country: "Brazil", cities: ["São Paulo", "Rio de Janeiro", "Brasília", "Salvador", "Fortaleza", "Belo Horizonte", "Manaus", "Curitiba", "Recife", "Goiânia", "Belém", "Porto Alegre", "Guarulhos", "Campinas", "São Luís", "São Gonçalo", "Maceió", "Duque de Caxias", "Natal", "Teresina", "Campo Grande", "Nova Iguaçu", "São Bernardo do Campo", "João Pessoa", "Santo André", "Osasco", "Jaboatão dos Guararapes", "Ribeirão Preto", "Uberlândia", "Sorocaba"] },
  { country: "Mexico", cities: ["Mexico City", "Guadalajara", "Monterrey", "Puebla", "Tijuana", "León", "Juárez", "Zapopan", "Mérida", "Cancún", "Querétaro", "Aguascalientes", "San Luis Potosí", "Hermosillo", "Morelia", "Saltillo", "Toluca", "Chihuahua", "Reynosa", "Tampico", "Oaxaca", "Cuernavaca", "Culiacán", "Acapulco", "Durango", "Xalapa", "Mazatlán", "Veracruz", "Torreón", "Villahermosa"] },
  { country: "Netherlands", cities: ["Amsterdam", "Rotterdam", "The Hague", "Utrecht", "Eindhoven", "Groningen", "Tilburg", "Almere", "Breda", "Nijmegen", "Enschede", "Haarlem", "Arnhem", "Zaanstad", "Amersfoort", "Apeldoorn", "Den Bosch", "Hoofddorp", "Maastricht", "Leiden", "Dordrecht", "Zoetermeer", "Zwolle", "Deventer", "Delft", "Heerlen", "Venlo", "Leeuwarden", "Ede", "Bergen op Zoom"] },
  { country: "Singapore", cities: ["Singapore"] },
  { country: "Taiwan", cities: ["Taipei", "Kaohsiung", "Taichung", "Tainan", "New Taipei", "Taoyuan", "Keelung", "Hsinchu", "Chiayi", "Changhua"] },
  { country: "Hong Kong", cities: ["Hong Kong", "Kowloon", "New Territories"] },
  { country: "Thailand", cities: ["Bangkok", "Chiang Mai", "Phuket", "Nakhon Ratchasima", "Udon Thani", "Khon Kaen", "Ubon Ratchathani", "Nakhon Si Thammarat", "Hat Yai", "Rayong", "Pattaya", "Surat Thani", "Chiang Rai", "Nakhon Sawan", "Ratchaburi", "Lampang", "Phitsanulok", "Songkhla", "Ayutthaya", "Mae Sot"] },
  { country: "Vietnam", cities: ["Ho Chi Minh City", "Hanoi", "Da Nang", "Haiphong", "Can Tho", "Bien Hoa", "Nha Trang", "Hue", "Vung Tau", "Buon Ma Thuot", "Qui Nhon", "Rach Gia", "Pleiku", "Long Xuyen", "Thai Nguyen", "Nam Dinh", "Vinh", "Cam Ranh", "Thanh Hoa", "Soc Trang"] },
  { country: "Indonesia", cities: ["Jakarta", "Surabaya", "Bandung", "Medan", "Semarang", "Palembang", "Makassar", "Batam", "Pekanbaru", "Manado", "Bogor", "Malang", "Denpasar", "Samarinda", "Pontianak", "Balikpapan", "Jambi", "Cirebon", "Mataram", "Banjarmasin", "Yogyakarta", "Bengkulu", "Padang", "Surakarta", "Bandar Lampung", "Tangerang", "Bekasi", "Depok", "South Tangerang"] },
  { country: "Philippines", cities: ["Manila", "Quezon City", "Davao", "Cebu", "Zamboanga", "Taguig", "Antipolo", "Cagayan de Oro", "Pasig", "Valenzuela", "Dasmarinas", "Las Piñas", "Makati", "Bacolod", "General Santos", "Parañaque", "Marikina", "Muntinlupa", "Iloilo", "Caloocan", "Mandaluyong", "Baguio", "Butuan", "Angeles", "Cavite", "Lapu-Lapu", "Tarlac", "Batangas", "Naga", "Olongapo"] },
  { country: "Malaysia", cities: ["Kuala Lumpur", "George Town", "Ipoh", "Shah Alam", "Petaling Jaya", "Johor Bahru", "Malacca", "Kuching", "Kota Kinabalu", "Alor Setar", "Kota Bharu", "Kangar", "Kuantan", "Kota Melaka", "Seremban", "Kuantan", "Kota Tinggi", "Kulai", "Pasir Gudang", "Klang", "Kajang", "Subang Jaya", "Kuching", "Sibu", "Miri", "Kota Samarahan"] },
];

// Flat list of all cities (for create/send city dropdown)
export const ALL_CITIES = COUNTRIES.flatMap((c) => c.cities);
