import type { CountyInfo } from '../types'

export const KENYAN_COUNTIES: CountyInfo[] = [
  {
    code: '047',
    name: 'Nairobi City',
    subCounties: [
      {
        name: 'Westlands',
        wards: ['Parklands/Highridge', 'Karura', 'Kangemi', 'Mountain View', 'Kitisuru']
      },
      {
        name: 'Kibra',
        wards: ['Woodley/Kenyatta Golf Course', 'Makina', 'Lindi', 'Laini Saba', 'Sarangombe']
      },
      {
        name: 'Starehe',
        wards: ['Nairobi Central', 'Ngara', 'Pangani', 'Ziwani/Kariokor', 'Landimawe']
      },
      {
        name: 'Dagoretti North',
        wards: ['Kilimani', 'Kawangware', 'Gatina', 'Kileleshwa', 'Kabiro']
      },
      {
        name: 'Ruaraka',
        wards: ['Baba Dogo', 'Utalii', 'Mathare North', 'Lucky Summer', 'Korogocho']
      },
      {
        name: 'Langata',
        wards: ['Karen', 'Nairobi West', 'Mugumo-ini', 'South C', 'Nyayo Highrise']
      }
    ]
  },
  {
    code: '001',
    name: 'Mombasa',
    subCounties: [
      {
        name: 'Nyali',
        wards: ['Frere Town', 'Ziwa La Ng\'ombe', 'Mkomani', 'Kongowea', 'Kadzandani']
      },
      {
        name: 'Mvita',
        wards: ['Mji wa Kale/Makadara', 'Tudor', 'Tononoka', 'Shimanzi/Ganjoni', 'Majengo']
      },
      {
        name: 'Kisauni',
        wards: ['Mjambere', 'Junda', 'Bamburi', 'Mwakirunge', 'Mtopanga']
      }
    ]
  },
  {
    code: '042',
    name: 'Kisumu',
    subCounties: [
      {
        name: 'Kisumu Central',
        wards: ['Railways', 'Migosi', 'Shaurimoyo Kaloleni', 'Market Milimani', 'Kondele']
      },
      {
        name: 'Kisumu East',
        wards: ['Kajulu', 'Kolwa East', 'Manyatta B', 'Nyalenda A', 'Kolwa Central']
      }
    ]
  },
  {
    code: '032',
    name: 'Nakuru',
    subCounties: [
      {
        name: 'Nakuru East',
        wards: ['Biashara', 'Kivumbini', 'Flamingo', 'Menengai', 'Nakuru East']
      },
      {
        name: 'Nakuru West',
        wards: ['Barut', 'London', 'Kaptembwo', 'Kapkures', 'Rhoda']
      }
    ]
  },
  {
    code: '027',
    name: 'Uasin Gishu',
    subCounties: [
      {
        name: 'Ainabkoi',
        wards: ['Kapsoya', 'Kaptagat', 'Ainabkoi/Olare']
      },
      {
        name: 'Kapseret',
        wards: ['Simat/Kapseret', 'Kipkenyo', 'Ngeria', 'Megun', 'Langas']
      },
      {
        name: 'Turbo',
        wards: ['Kapsaos', 'Kamagut', 'Kiplombe', 'Kapyemit', 'Huruma']
      }
    ]
  },
  {
    code: '022',
    name: 'Kiambu',
    subCounties: [
      {
        name: 'Ruiru',
        wards: ['Gitothua', 'Biashara', 'Gatongora', 'Kahawa Sukari', 'Kahawa Wendani']
      },
      {
        name: 'Thika Town',
        wards: ['Township', 'Kamenu', 'Hospital', 'Gatuanyaga', 'Ngoliba']
      },
      {
        name: 'Kikuyu',
        wards: ['Karai', 'Nachu', 'Sigona', 'Kikuyu', 'Kinoo']
      }
    ]
  },
  {
    code: '016',
    name: 'Machakos',
    subCounties: [
      {
        name: 'Mavoko',
        wards: ['Athi River', 'Kinanie', 'Muthwani', 'Syokimau/Mulolongo']
      },
      {
        name: 'Machakos Town',
        wards: ['Kalama', 'Mua', 'Mutituni', 'Machakos Central', 'Muvuti/Kiima-Kimwe']
      }
    ]
  }
]
