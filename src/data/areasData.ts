export interface AreaData {
  id: string;
  name: string;
  coordinates: { lat: number; lng: number };
  scores: {
    hospitals: number;
    schools: number;
    parks: number;
    safety: number;
    communityCenters: number;
  };
  population: number;
  mayor: string;
  lifestyle: string;
  funFact: string;
}

export const areasData: AreaData[] = [
  {
    id: "1",
    name: "Greenfield Heights",
    coordinates: { lat: 40.7128, lng: -74.006 },
    scores: { hospitals: 4, schools: 9, parks: 10, safety: 9, communityCenters: 5 },
    population: 45000,
    mayor: "Sarah Mitchell",
    lifestyle: "Family-friendly suburb with excellent outdoor recreation and top-rated schools",
    funFact: "Home to the oldest oak tree in the state, planted in 1789"
  },
  {
    id: "2",
    name: "Metro Central",
    coordinates: { lat: 40.7589, lng: -73.9851 },
    scores: { hospitals: 10, schools: 5, parks: 3, safety: 5, communityCenters: 9 },
    population: 120000,
    mayor: "James Rodriguez",
    lifestyle: "Vibrant urban center with world-class healthcare and cultural amenities",
    funFact: "The first electric streetcar in America operated here in 1887"
  },
  {
    id: "3",
    name: "Lakeside Village",
    coordinates: { lat: 40.6892, lng: -74.0445 },
    scores: { hospitals: 3, schools: 6, parks: 8, safety: 10, communityCenters: 4 },
    population: 28000,
    mayor: "Emily Chen",
    lifestyle: "Peaceful lakefront community known for exceptional safety and tranquility",
    funFact: "Featured in three Hollywood films as the 'ideal American town'"
  },
  {
    id: "4",
    name: "Riverside Park District",
    coordinates: { lat: 40.7831, lng: -73.9712 },
    scores: { hospitals: 5, schools: 10, parks: 7, safety: 6, communityCenters: 4 },
    population: 55000,
    mayor: "Michael Thompson",
    lifestyle: "Education-focused neighborhood with award-winning schools and academic programs",
    funFact: "Produced 5 Nobel laureates from its high school alumni"
  },
  {
    id: "5",
    name: "Sunset Hills",
    coordinates: { lat: 40.7282, lng: -73.7949 },
    scores: { hospitals: 6, schools: 4, parks: 5, safety: 7, communityCenters: 10 },
    population: 38000,
    mayor: "Patricia Williams",
    lifestyle: "Active community with extensive recreational programs and vibrant social scene",
    funFact: "Hosts the largest annual community fair in the tri-state area"
  },
  {
    id: "6",
    name: "Harbor Point",
    coordinates: { lat: 40.6501, lng: -73.9496 },
    scores: { hospitals: 9, schools: 4, parks: 4, safety: 4, communityCenters: 7 },
    population: 82000,
    mayor: "Robert Kim",
    lifestyle: "Historic waterfront district with excellent medical facilities and dining",
    funFact: "Once the busiest shipping port on the Eastern seaboard in the 1800s"
  },
  {
    id: "7",
    name: "Oak Valley",
    coordinates: { lat: 40.7614, lng: -73.8443 },
    scores: { hospitals: 3, schools: 5, parks: 10, safety: 9, communityCenters: 3 },
    population: 22000,
    mayor: "Jennifer Davis",
    lifestyle: "Nature-lover's paradise with extensive trails and serene environment",
    funFact: "Contains a protected forest where a species of butterfly was first discovered"
  },
  {
    id: "8",
    name: "Innovation District",
    coordinates: { lat: 40.7484, lng: -73.9967 },
    scores: { hospitals: 7, schools: 8, parks: 2, safety: 6, communityCenters: 8 },
    population: 95000,
    mayor: "David Park",
    lifestyle: "Tech hub with cutting-edge facilities, great schools, and startup culture",
    funFact: "More patents per capita are filed here than anywhere else in the country"
  },
  {
    id: "9",
    name: "Meadowbrook",
    coordinates: { lat: 40.6782, lng: -73.9442 },
    scores: { hospitals: 6, schools: 7, parks: 8, safety: 7, communityCenters: 6 },
    population: 42000,
    mayor: "Lisa Anderson",
    lifestyle: "Balanced community with good access to all amenities and green spaces",
    funFact: "Named after the wild meadows that still bloom every spring in the central park"
  },
  {
    id: "10",
    name: "Heritage Square",
    coordinates: { lat: 40.7359, lng: -73.9911 },
    scores: { hospitals: 8, schools: 3, parks: 4, safety: 5, communityCenters: 10 },
    population: 68000,
    mayor: "Thomas Brown",
    lifestyle: "Cultural center with top hospitals, museums, and strong community engagement",
    funFact: "The town square has hosted public gatherings continuously since 1776"
  },
  {
    id: "11",
    name: "Pinecrest",
    coordinates: { lat: 40.8012, lng: -73.9234 },
    scores: { hospitals: 2, schools: 8, parks: 9, safety: 10, communityCenters: 5 },
    population: 19000,
    mayor: "Amanda Foster",
    lifestyle: "Quiet residential area perfect for families seeking top safety and good schools",
    funFact: "Has the lowest crime rate in the entire metropolitan region for 15 consecutive years"
  },
  {
    id: "12",
    name: "Downtown Core",
    coordinates: { lat: 40.7527, lng: -73.9772 },
    scores: { hospitals: 10, schools: 6, parks: 2, safety: 4, communityCenters: 9 },
    population: 150000,
    mayor: "Marcus Lee",
    lifestyle: "Fast-paced urban living with immediate access to premier hospitals and nightlife",
    funFact: "The first skyscraper in the region was built here in 1902"
  },
  {
    id: "13",
    name: "Willowdale",
    coordinates: { lat: 40.6654, lng: -73.8897 },
    scores: { hospitals: 5, schools: 10, parks: 6, safety: 8, communityCenters: 4 },
    population: 31000,
    mayor: "Catherine Moore",
    lifestyle: "Education-centric community where families prioritize academic excellence",
    funFact: "97% of high school graduates attend four-year universities"
  },
  {
    id: "14",
    name: "Cedar Springs",
    coordinates: { lat: 40.7198, lng: -74.0342 },
    scores: { hospitals: 4, schools: 5, parks: 10, safety: 8, communityCenters: 7 },
    population: 25000,
    mayor: "Daniel Wright",
    lifestyle: "Outdoor enthusiast community with abundant parks and recreational trails",
    funFact: "Home to a natural hot spring that locals have used for over 200 years"
  },
  {
    id: "15",
    name: "Northgate",
    coordinates: { lat: 40.8234, lng: -73.9501 },
    scores: { hospitals: 9, schools: 7, parks: 5, safety: 6, communityCenters: 8 },
    population: 72000,
    mayor: "Rachel Green",
    lifestyle: "Well-connected neighborhood with excellent healthcare and strong community ties",
    funFact: "The historic north gate to the original colonial settlement still stands today"
  },
  {
    id: "16",
    name: "Bayview Terrace",
    coordinates: { lat: 40.6423, lng: -74.0178 },
    scores: { hospitals: 6, schools: 4, parks: 7, safety: 9, communityCenters: 5 },
    population: 33000,
    mayor: "Steven Clark",
    lifestyle: "Scenic coastal community with beautiful views and family-friendly atmosphere",
    funFact: "Dolphins can be spotted from the shore during summer months"
  },
  {
    id: "17",
    name: "University Heights",
    coordinates: { lat: 40.7456, lng: -73.8623 },
    scores: { hospitals: 7, schools: 9, parks: 4, safety: 5, communityCenters: 8 },
    population: 48000,
    mayor: "Julia Martinez",
    lifestyle: "Academic atmosphere with cafes, bookstores, and intellectual community",
    funFact: "Three major universities have campuses within walking distance"
  },
  {
    id: "18",
    name: "Silverbrook",
    coordinates: { lat: 40.6987, lng: -73.9123 },
    scores: { hospitals: 5, schools: 6, parks: 6, safety: 10, communityCenters: 6 },
    population: 27000,
    mayor: "Andrew Taylor",
    lifestyle: "Safe, quiet neighborhood ideal for those seeking peace of mind",
    funFact: "Named after the silver-colored brook that runs through the town center"
  },
  {
    id: "19",
    name: "Arts District",
    coordinates: { lat: 40.7312, lng: -74.0089 },
    scores: { hospitals: 4, schools: 5, parks: 5, safety: 4, communityCenters: 10 },
    population: 56000,
    mayor: "Olivia Bennett",
    lifestyle: "Creative hub with galleries, theaters, and a thriving arts community",
    funFact: "More artists per capita live here than any other neighborhood in the country"
  },
  {
    id: "20",
    name: "Maplewood Gardens",
    coordinates: { lat: 40.7789, lng: -73.8789 },
    scores: { hospitals: 6, schools: 8, parks: 9, safety: 8, communityCenters: 6 },
    population: 35000,
    mayor: "Christopher Adams",
    lifestyle: "Charming tree-lined streets with excellent schools and abundant green space",
    funFact: "Every street is named after a different tree species native to the region"
  }
];
