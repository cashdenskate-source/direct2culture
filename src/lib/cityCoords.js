// Lat/lng for the cities Direct2Culture cares about.
// Extend as needed. Matching is case + punctuation insensitive.

const cities = {
  'atlanta':       { lat: 33.7490, lng: -84.3880, label: 'Atlanta' },
  'los angeles':   { lat: 34.0522, lng: -118.2437, label: 'Los Angeles' },
  'miami':         { lat: 25.7617, lng: -80.1918, label: 'Miami' },
  'new york':      { lat: 40.7128, lng: -74.0060, label: 'New York' },
  'new orleans':   { lat: 29.9511, lng: -90.0715, label: 'New Orleans' },
  'london':        { lat: 51.5074, lng:  -0.1278, label: 'London' },
  'paris':         { lat: 48.8566, lng:   2.3522, label: 'Paris' },
  'berlin':        { lat: 52.5200, lng:  13.4050, label: 'Berlin' },
  'lagos':         { lat:  6.5244, lng:   3.3792, label: 'Lagos' },
  'tokyo':         { lat: 35.6762, lng: 139.6503, label: 'Tokyo' },
  'toronto':       { lat: 43.6532, lng: -79.3832, label: 'Toronto' },
  'mexico city':   { lat: 19.4326, lng: -99.1332, label: 'Mexico City' },
  'sao paulo':     { lat: -23.5505, lng: -46.6333, label: 'São Paulo' },
  'são paulo':     { lat: -23.5505, lng: -46.6333, label: 'São Paulo' },
  'chicago':       { lat: 41.8781, lng: -87.6298, label: 'Chicago' },
  'houston':       { lat: 29.7604, lng: -95.3698, label: 'Houston' },
  'dallas':        { lat: 32.7767, lng: -96.7970, label: 'Dallas' },
  'philadelphia':  { lat: 39.9526, lng: -75.1652, label: 'Philadelphia' },
  'detroit':       { lat: 42.3314, lng: -83.0458, label: 'Detroit' },
  'oakland':       { lat: 37.8044, lng: -122.2711, label: 'Oakland' },
  'san francisco': { lat: 37.7749, lng: -122.4194, label: 'San Francisco' },
  'memphis':       { lat: 35.1495, lng: -90.0490, label: 'Memphis' },
  'nashville':     { lat: 36.1627, lng: -86.7816, label: 'Nashville' },
};

const norm = (s) => (s || '').toLowerCase().replace(/[.,]/g, '').trim();

export function lookupCity(name) {
  if (!name) return null;
  const k = norm(name);
  if (cities[k]) return cities[k];
  // Try removing ", GA" / ", CA" type suffix
  const stripped = k.split(',')[0].trim();
  return cities[stripped] || null;
}

export const SEED_CITIES = [
  cities['atlanta'], cities['los angeles'], cities['miami'],
  cities['new york'], cities['new orleans'], cities['london'],
];

export const ALL_KNOWN = Object.values(cities);
