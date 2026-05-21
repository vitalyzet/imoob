export interface RomaniaLocation {
  name: string;
  county: string;
  isCounty?: boolean;
}

export const ROMANIA_LOCATIONS: RomaniaLocation[] = [
  { name: "București", county: "București" },
  { name: "Sector 1", county: "București" },
  { name: "Sector 2", county: "București" },
  { name: "Sector 3", county: "București" },
  { name: "Sector 4", county: "București" },
  { name: "Sector 5", county: "București" },
  { name: "Sector 6", county: "București" },

  // Alba
  { name: "Alba Iulia", county: "Alba" }, { name: "Sebeș", county: "Alba" }, { name: "Aiud", county: "Alba" }, { name: "Cugir", county: "Alba" }, { name: "Blaj", county: "Alba" }, { name: "Ocna Mureș", county: "Alba" }, { name: "Zlatna", county: "Alba" }, { name: "Câmpeni", county: "Alba" }, { name: "Teiuș", county: "Alba" }, { name: "Abrud", county: "Alba" }, { name: "Baia de Arieș", county: "Alba" },
  // Arad
  { name: "Arad", county: "Arad" }, { name: "Pecica", county: "Arad" }, { name: "Sântana", county: "Arad" }, { name: "Lipova", county: "Arad" }, { name: "Ineu", county: "Arad" }, { name: "Chișineu-Criș", county: "Arad" }, { name: "Nădlac", county: "Arad" }, { name: "Curtici", county: "Arad" }, { name: "Pâncota", county: "Arad" }, { name: "Sebiș", county: "Arad" },
  // Argeș
  { name: "Pitești", county: "Argeș" }, { name: "Mioveni", county: "Argeș" }, { name: "Câmpulung", county: "Argeș" }, { name: "Curtea de Argeș", county: "Argeș" }, { name: "Ștefănești", county: "Argeș" }, { name: "Costești", county: "Argeș" }, { name: "Topoloveni", county: "Argeș" },
  // Bacău
  { name: "Bacău", county: "Bacău" }, { name: "Onești", county: "Bacău" }, { name: "Moinești", county: "Bacău" }, { name: "Comănești", county: "Bacău" }, { name: "Buhuși", county: "Bacău" }, { name: "Dărmănești", county: "Bacău" }, { name: "Târgu Ocna", county: "Bacău" }, { name: "Slănic-Moldova", county: "Bacău" },
  // Bihor
  { name: "Oradea", county: "Bihor" }, { name: "Salonta", county: "Bihor" }, { name: "Marghita", county: "Bihor" }, { name: "Săcueni", county: "Bihor" }, { name: "Beiuș", county: "Bihor" }, { name: "Valea lui Mihai", county: "Bihor" }, { name: "Aleșd", county: "Bihor" }, { name: "Ștei", county: "Bihor" }, { name: "Vașcău", county: "Bihor" }, { name: "Nucet", county: "Bihor" },
  // Bistrița-Năsăud
  { name: "Bistrița", county: "Bistrița-Năsăud" }, { name: "Beclean", county: "Bistrița-Năsăud" }, { name: "Sângeorz-Băi", county: "Bistrița-Năsăud" }, { name: "Năsăud", county: "Bistrița-Năsăud" },
  // Botoșani
  { name: "Botoșani", county: "Botoșani" }, { name: "Dorohoi", county: "Botoșani" }, { name: "Darabani", county: "Botoșani" }, { name: "Flămânzi", county: "Botoșani" }, { name: "Săveni", county: "Botoșani" }, { name: "Ștefănești", county: "Botoșani" }, { name: "Bucecea", county: "Botoșani" },
  // Brașov
  { name: "Brașov", county: "Brașov" }, { name: "Făgăraș", county: "Brașov" }, { name: "Săcele", county: "Brașov" }, { name: "Zărnești", county: "Brașov" }, { name: "Codlea", county: "Brașov" }, { name: "Râșnov", county: "Brașov" }, { name: "Victoria", county: "Brașov" }, { name: "Rupea", county: "Brașov" }, { name: "Ghimbav", county: "Brașov" }, { name: "Predeal", county: "Brașov" },
  // Brăila
  { name: "Brăila", county: "Brăila" }, { name: "Ianca", county: "Brăila" }, { name: "Însurăței", county: "Brăila" }, { name: "Făurei", county: "Brăila" },
  // Buzău
  { name: "Buzău", county: "Buzău" }, { name: "Râmnicu Sărat", county: "Buzău" }, { name: "Nehoiu", county: "Buzău" }, { name: "Pătârlagele", county: "Buzău" }, { name: "Pogoanele", county: "Buzău" },
  // Caraș-Severin
  { name: "Reșița", county: "Caraș-Severin" }, { name: "Caransebeș", county: "Caraș-Severin" }, { name: "Bocșa", county: "Caraș-Severin" }, { name: "Moldova Nouă", county: "Caraș-Severin" }, { name: "Oravița", county: "Caraș-Severin" }, { name: "Oțelu Roșu", county: "Caraș-Severin" }, { name: "Anina", county: "Caraș-Severin" }, { name: "Băile Herculane", county: "Caraș-Severin" },
  // Călărași
  { name: "Călărași", county: "Călărași" }, { name: "Oltenița", county: "Călărași" }, { name: "Budești", county: "Călărași" }, { name: "Fundulea", county: "Călărași" }, { name: "Lehliu Gară", county: "Călărași" },
  // Cluj
  { name: "Cluj-Napoca", county: "Cluj" }, { name: "Turda", county: "Cluj" }, { name: "Dej", county: "Cluj" }, { name: "Câmpia Turzii", county: "Cluj" }, { name: "Gherla", county: "Cluj" }, { name: "Huedin", county: "Cluj" },
  // Constanța
  { name: "Constanța", county: "Constanța" }, { name: "Medgidia", county: "Constanța" }, { name: "Mangalia", county: "Constanța" }, { name: "Năvodari", county: "Constanța" }, { name: "Cernavodă", county: "Constanța" }, { name: "Ovidiu", county: "Constanța" }, { name: "Murfatlar", county: "Constanța" }, { name: "Hârșova", county: "Constanța" }, { name: "Eforie", county: "Constanța" }, { name: "Techirghiol", county: "Constanța" }, { name: "Băneasa", county: "Constanța" }, { name: "Negru Vodă", county: "Constanța" },
  // Covasna
  { name: "Sfântu Gheorghe", county: "Covasna" }, { name: "Târgu Secuiesc", county: "Covasna" }, { name: "Covasna", county: "Covasna" }, { name: "Baraolt", county: "Covasna" }, { name: "Întorsura Buzăului", county: "Covasna" },
  // Dâmbovița
  { name: "Târgoviște", county: "Dâmbovița" }, { name: "Moreni", county: "Dâmbovița" }, { name: "Pucioasa", county: "Dâmbovița" }, { name: "Găești", county: "Dâmbovița" }, { name: "Titu", county: "Dâmbovița" }, { name: "Fieni", county: "Dâmbovița" }, { name: "Răcari", county: "Dâmbovița" },
  // Dolj
  { name: "Craiova", county: "Dolj" }, { name: "Băilești", county: "Dolj" }, { name: "Calafat", county: "Dolj" }, { name: "Filiași", county: "Dolj" }, { name: "Dăbuleni", county: "Dolj" }, { name: "Segarcea", county: "Dolj" }, { name: "Bechet", county: "Dolj" },
  // Galați
  { name: "Galați", county: "Galați" }, { name: "Tecuci", county: "Galați" }, { name: "Târgu Bujor", county: "Galați" }, { name: "Berești", county: "Galați" },
  // Giurgiu
  { name: "Giurgiu", county: "Giurgiu" }, { name: "Bolintin-Vale", county: "Giurgiu" }, { name: "Mihăilești", county: "Giurgiu" },
  // Gorj
  { name: "Târgu Jiu", county: "Gorj" }, { name: "Motru", county: "Gorj" }, { name: "Rovinari", county: "Gorj" }, { name: "Bumbești-Jiu", county: "Gorj" }, { name: "Târgu Cărbunești", county: "Gorj" }, { name: "Turceni", county: "Gorj" }, { name: "Tismana", county: "Gorj" }, { name: "Novaci", county: "Gorj" }, { name: "Țicleni", county: "Gorj" },
  // Harghita
  { name: "Miercurea Ciuc", county: "Harghita" }, { name: "Odorheiu Secuiesc", county: "Harghita" }, { name: "Gheorgheni", county: "Harghita" }, { name: "Toplița", county: "Harghita" }, { name: "Cristuru Secuiesc", county: "Harghita" }, { name: "Vlăhița", county: "Harghita" }, { name: "Bălan", county: "Harghita" }, { name: "Borsec", county: "Harghita" }, { name: "Băile Tușnad", county: "Harghita" },
  // Hunedoara
  { name: "Deva", county: "Hunedoara" }, { name: "Hunedoara", county: "Hunedoara" }, { name: "Petroșani", county: "Hunedoara" }, { name: "Vulcan", county: "Hunedoara" }, { name: "Lupeni", county: "Hunedoara" }, { name: "Petrila", county: "Hunedoara" }, { name: "Orăștie", county: "Hunedoara" }, { name: "Brad", county: "Hunedoara" }, { name: "Simeria", county: "Hunedoara" }, { name: "Călan", county: "Hunedoara" }, { name: "Hațeg", county: "Hunedoara" }, { name: "Uricani", county: "Hunedoara" }, { name: "Geoagiu", county: "Hunedoara" }, { name: "Aninoasa", county: "Hunedoara" },
  // Ialomița
  { name: "Slobozia", county: "Ialomița" }, { name: "Fetești", county: "Ialomița" }, { name: "Urziceni", county: "Ialomița" }, { name: "Țăndărei", county: "Ialomița" }, { name: "Amara", county: "Ialomița" }, { name: "Fierbinți-Târg", county: "Ialomița" }, { name: "Căzănești", county: "Ialomița" },
  // Iași
  { name: "Iași", county: "Iași" }, { name: "Pașcani", county: "Iași" }, { name: "Hârlău", county: "Iași" }, { name: "Târgu Frumos", county: "Iași" }, { name: "Podu Iloaiei", county: "Iași" },
  // Ilfov
  { name: "Voluntari", county: "Ilfov" }, { name: "Pantelimon", county: "Ilfov" }, { name: "Buftea", county: "Ilfov" }, { name: "Popești-Leordeni", county: "Ilfov" }, { name: "Bragadiru", county: "Ilfov" }, { name: "Chitila", county: "Ilfov" }, { name: "Otopeni", county: "Ilfov" }, { name: "Măgurele", county: "Ilfov" },
  // Maramureș
  { name: "Baia Mare", county: "Maramureș" }, { name: "Sighetu Marmației", county: "Maramureș" }, { name: "Borșa", county: "Maramureș" }, { name: "Baia Sprie", county: "Maramureș" }, { name: "Vișeu de Sus", county: "Maramureș" }, { name: "Târgu Lăpuș", county: "Maramureș" }, { name: "Seini", county: "Maramureș" }, { name: "Somcuta Mare", county: "Maramureș" }, { name: "Ulmeni", county: "Maramureș" }, { name: "Tăuții-Măgherăuș", county: "Maramureș" }, { name: "Cavnic", county: "Maramureș" }, { name: "Săliștea de Sus", county: "Maramureș" }, { name: "Dragomirești", county: "Maramureș" },
  // Mehedinți
  { name: "Drobeta-Turnu Severin", county: "Mehedinți" }, { name: "Strehaia", county: "Mehedinți" }, { name: "Orșova", county: "Mehedinți" }, { name: "Baia de Aramă", county: "Mehedinți" }, { name: "Vânju Mare", county: "Mehedinți" },
  // Mureș
  { name: "Târgu Mureș", county: "Mureș" }, { name: "Reghin", county: "Mureș" }, { name: "Sighișoara", county: "Mureș" }, { name: "Târnăveni", county: "Mureș" }, { name: "Luduș", county: "Mureș" }, { name: "Sovata", county: "Mureș" }, { name: "Iernut", county: "Mureș" }, { name: "Sărmașu", county: "Mureș" }, { name: "Ungheni", county: "Mureș" }, { name: "Miercurea Nirajului", county: "Mureș" }, { name: "Sângeorgiu de Pădure", county: "Mureș" },
  // Neamț
  { name: "Piatra Neamț", county: "Neamț" }, { name: "Roman", county: "Neamț" }, { name: "Târgu Neamț", county: "Neamț" }, { name: "Roznov", county: "Neamț" }, { name: "Bicaz", county: "Neamț" },
  // Olt
  { name: "Slatina", county: "Olt" }, { name: "Caracal", county: "Olt" }, { name: "Balș", county: "Olt" }, { name: "Corabia", county: "Olt" }, { name: "Scornicești", county: "Olt" }, { name: "Drăgănești-Olt", county: "Olt" }, { name: "Piatra-Olt", county: "Olt" }, { name: "Potcoava", county: "Olt" }, { name: "Negreni", county: "Olt" }, { name: "Deveselu", county: "Olt" }, { name: "Izbiceni", county: "Olt" }, { name: "Ianca", county: "Olt" }, { name: "Vlădila", county: "Olt" }, { name: "Vișina", county: "Olt" }, { name: "Tufeni", county: "Olt" }, { name: "Teslui", county: "Olt" }, { name: "Studina", county: "Olt" }, { name: "Stoicănești", county: "Olt" }, { name: "Sprâncenata", county: "Olt" }, { name: "Slătioara", county: "Olt" }, { name: "Schitu", county: "Olt" }, { name: "Rusănești", county: "Olt" }, { name: "Priseaca", county: "Olt" }, { name: "Pleșoiu", county: "Olt" }, { name: "Osica de Sus", county: "Olt" }, { name: "Oboga", county: "Olt" }, { name: "Movileni", county: "Olt" }, { name: "Milcov", county: "Olt" }, { name: "Mărunței", county: "Olt" }, { name: "Icoana", county: "Olt" }, { name: "Grădinari", county: "Olt" }, { name: "Gârcov", county: "Olt" }, { name: "Găneasa", county: "Olt" }, { name: "Fărcașele", county: "Olt" }, { name: "Dăneasa", county: "Olt" }, { name: "Curtișoara", county: "Olt" }, { name: "Crâmpoia", county: "Olt" }, { name: "Coteana", county: "Olt" }, { name: "Colonești", county: "Olt" }, { name: "Cezieni", county: "Olt" }, { name: "Călui", county: "Olt" }, { name: "Brâncoveni", county: "Olt" }, { name: "Bobicești", county: "Olt" }, { name: "Bărăști", county: "Olt" }, { name: "Brebeni", county: "Olt" },
  // Prahova
  { name: "Ploiești", county: "Prahova" }, { name: "Câmpina", county: "Prahova" }, { name: "Băicoi", county: "Prahova" }, { name: "Breaza", county: "Prahova" }, { name: "Mizil", county: "Prahova" }, { name: "Comarnic", county: "Prahova" }, { name: "Vălenii de Munte", county: "Prahova" }, { name: "Boldești-Scăeni", county: "Prahova" }, { name: "Urlați", county: "Prahova" }, { name: "Sinaia", county: "Prahova" }, { name: "Bușteni", county: "Prahova" }, { name: "Plopeni", county: "Prahova" }, { name: "Slănic", county: "Prahova" }, { name: "Azuga", county: "Prahova" },
  // Satu Mare
  { name: "Satu Mare", county: "Satu Mare" }, { name: "Carei", county: "Satu Mare" }, { name: "Negrești-Oaș", county: "Satu Mare" }, { name: "Tășnad", county: "Satu Mare" }, { name: "Livada", county: "Satu Mare" }, { name: "Ardud", county: "Satu Mare" },
  // Sălaj
  { name: "Zalău", county: "Sălaj" }, { name: "Șimleu Silvaniei", county: "Sălaj" }, { name: "Jibou", county: "Sălaj" }, { name: "Cehu Silvaniei", county: "Sălaj" },
  // Sibiu
  { name: "Sibiu", county: "Sibiu" }, { name: "Mediaș", county: "Sibiu" }, { name: "Cisnădie", county: "Sibiu" }, { name: "Avrig", county: "Sibiu" }, { name: "Agnita", county: "Sibiu" }, { name: "Dumbrăveni", county: "Sibiu" }, { name: "Tălmaciu", county: "Sibiu" }, { name: "Copșa Mică", county: "Sibiu" }, { name: "Săliște", county: "Sibiu" }, { name: "Miercurea Sibiului", county: "Sibiu" }, { name: "Ocna Sibiului", county: "Sibiu" },
  // Suceava
  { name: "Suceava", county: "Suceava" }, { name: "Fălticeni", county: "Suceava" }, { name: "Rădăuți", county: "Suceava" }, { name: "Câmpulung Moldovenesc", county: "Suceava" }, { name: "Vatra Dornei", county: "Suceava" }, { name: "Vicovu de Sus", county: "Suceava" }, { name: "Gura Humorului", county: "Suceava" }, { name: "Dolhasca", county: "Suceava" }, { name: "Liteni", county: "Suceava" }, { name: "Salcea", county: "Suceava" }, { name: "Siret", county: "Suceava" }, { name: "Cajvana", county: "Suceava" }, { name: "Frasin", county: "Suceava" }, { name: "Broșteni", county: "Suceava" }, { name: "Milișăuți", county: "Suceava" }, { name: "Solca", county: "Suceava" },
  // Teleorman
  { name: "Alexandria", county: "Teleorman" }, { name: "Roșiorii de Vede", county: "Teleorman" }, { name: "Turnu Măgurele", county: "Teleorman" }, { name: "Zimnicea", county: "Teleorman" }, { name: "Videle", county: "Teleorman" },
  // Timiș
  { name: "Timișoara", county: "Timiș" }, { name: "Lugoj", county: "Timiș" }, { name: "Sânnicolau Mare", county: "Timiș" }, { name: "Jimbolia", county: "Timiș" }, { name: "Recaș", county: "Timiș" }, { name: "Făget", county: "Timiș" }, { name: "Buziaș", county: "Timiș" }, { name: "Deta", county: "Timiș" }, { name: "Gătaia", county: "Timiș" }, { name: "Ciacova", county: "Timiș" },
  // Tulcea
  { name: "Tulcea", county: "Tulcea" }, { name: "Babadag", county: "Tulcea" }, { name: "Măcin", county: "Tulcea" }, { name: "Isaccea", county: "Tulcea" }, { name: "Sulina", county: "Tulcea" },
  // Vaslui
  { name: "Vaslui", county: "Vaslui" }, { name: "Bârlad", county: "Vaslui" }, { name: "Huși", county: "Vaslui" }, { name: "Murgeni", county: "Vaslui" },
  // Vâlcea
  { name: "Râmnicu Vâlcea", county: "Vâlcea" }, { name: "Drăgășani", county: "Vâlcea" }, { name: "Băbeni", county: "Vâlcea" }, { name: "Călimănești", county: "Vâlcea" }, { name: "Horezu", county: "Vâlcea" }, { name: "Brezoi", county: "Vâlcea" }, { name: "Bălcești", county: "Vâlcea" }, { name: "Berbești", county: "Vâlcea" }, { name: "Băile Olănești", county: "Vâlcea" }, { name: "Ocnele Mari", county: "Vâlcea" }, { name: "Băile Govora", county: "Vâlcea" },
  // Vrancea
  { name: "Focșani", county: "Vrancea" }, { name: "Adjud", county: "Vrancea" }, { name: "Mărășești", county: "Vrancea" }, { name: "Panciu", county: "Vrancea" }, { name: "Odobești", county: "Vrancea" },

  // Județe explicite (Counties explicitly as options)
  { name: "Județul Alba", county: "Județ", isCounty: true }, { name: "Județul Arad", county: "Județ", isCounty: true }, { name: "Județul Argeș", county: "Județ", isCounty: true }, { name: "Județul Bacău", county: "Județ", isCounty: true }, { name: "Județul Bihor", county: "Județ", isCounty: true }, { name: "Județul Bistrița-Năsăud", county: "Județ", isCounty: true }, 
  { name: "Județul Botoșani", county: "Județ", isCounty: true }, { name: "Județul Brașov", county: "Județ", isCounty: true }, { name: "Județul Brăila", county: "Județ", isCounty: true }, { name: "Județul Buzău", county: "Județ", isCounty: true }, { name: "Județul Caraș-Severin", county: "Județ", isCounty: true }, { name: "Județul Călărași", county: "Județ", isCounty: true }, 
  { name: "Județul Cluj", county: "Județ", isCounty: true }, { name: "Județul Constanța", county: "Județ", isCounty: true }, { name: "Județul Covasna", county: "Județ", isCounty: true }, { name: "Județul Dâmbovița", county: "Județ", isCounty: true }, { name: "Județul Dolj", county: "Județ", isCounty: true }, { name: "Județul Galați", county: "Județ", isCounty: true }, 
  { name: "Județul Giurgiu", county: "Județ", isCounty: true }, { name: "Județul Gorj", county: "Județ", isCounty: true }, { name: "Județul Harghita", county: "Județ", isCounty: true }, { name: "Județul Hunedoara", county: "Județ", isCounty: true }, { name: "Județul Ialomița", county: "Județ", isCounty: true }, { name: "Județul Iași", county: "Județ", isCounty: true }, 
  { name: "Județul Ilfov", county: "Județ", isCounty: true }, { name: "Județul Maramureș", county: "Județ", isCounty: true }, { name: "Județul Mehedinți", county: "Județ", isCounty: true }, { name: "Județul Mureș", county: "Județ", isCounty: true }, { name: "Județul Neamț", county: "Județ", isCounty: true }, { name: "Județul Olt", county: "Județ", isCounty: true }, 
  { name: "Județul Prahova", county: "Județ", isCounty: true }, { name: "Județul Satu Mare", county: "Județ", isCounty: true }, { name: "Județul Sălaj", county: "Județ", isCounty: true }, { name: "Județul Sibiu", county: "Județ", isCounty: true }, { name: "Județul Suceava", county: "Județ", isCounty: true }, { name: "Județul Teleorman", county: "Județ", isCounty: true }, 
  { name: "Județul Timiș", county: "Județ", isCounty: true }, { name: "Județul Tulcea", county: "Județ", isCounty: true }, { name: "Județul Vaslui", county: "Județ", isCounty: true }, { name: "Județul Vâlcea", county: "Județ", isCounty: true }, { name: "Județul Vrancea", county: "Județ", isCounty: true }
].sort((a, b) => {
  if (a.name === "București") return -1;
  if (b.name === "București") return 1;
  return a.name.localeCompare(b.name, 'ro');
});
