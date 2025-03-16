
import { Server } from '@/types/vpn';

// Sample server data
export const sampleServers: Server[] = [
  {
    id: '1',
    name: 'US Server 1',
    country: 'United States',
    countryCode: 'US',
    city: 'New York',
    ping: 45,
    load: 65,
    premium: false
  },
  {
    id: '2',
    name: 'UK Server 1',
    country: 'United Kingdom',
    countryCode: 'GB',
    city: 'London',
    ping: 78,
    load: 45,
    premium: false
  },
  {
    id: '3',
    name: 'JP Server 1',
    country: 'Japan',
    countryCode: 'JP',
    city: 'Tokyo',
    ping: 112,
    load: 30,
    premium: false
  },
  {
    id: '4',
    name: 'DE Server 1',
    country: 'Germany',
    countryCode: 'DE',
    city: 'Frankfurt',
    ping: 62,
    load: 55,
    premium: false
  },
  {
    id: '5',
    name: 'SG Server 1',
    country: 'Singapore',
    countryCode: 'SG',
    city: 'Singapore',
    ping: 98,
    load: 40,
    premium: true
  },
  {
    id: '6',
    name: 'CA Server 1',
    country: 'Canada',
    countryCode: 'CA',
    city: 'Toronto',
    ping: 52,
    load: 70,
    premium: false
  },
  {
    id: '7',
    name: 'AU Server 1',
    country: 'Australia',
    countryCode: 'AU',
    city: 'Sydney',
    ping: 135,
    load: 25,
    premium: true
  },
  {
    id: '8',
    name: 'FR Server 1',
    country: 'France',
    countryCode: 'FR',
    city: 'Paris',
    ping: 68,
    load: 50,
    premium: false
  },
];
