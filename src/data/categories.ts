import { CategoryMeta } from '../types'

export const SERVICE_CATEGORIES: CategoryMeta[] = [
  {
    id: 'water_sanitation',
    name: 'Water & Sanitation',
    description: 'Report pipe bursts, sewage overflows, dry taps, or contaminated water supply.',
    icon: 'Droplets',
    slaStandardHours: 24,
    department: 'Water & Sewerage Services Directorate'
  },
  {
    id: 'roads_transport',
    name: 'Roads & Infrastructure',
    description: 'Report road potholes, broken guard rails, faulty traffic lights, or missing road signs.',
    icon: 'Hammer',
    slaStandardHours: 48,
    department: 'Kenya Urban Roads Authority & County Works'
  },
  {
    id: 'energy_lighting',
    name: 'Energy & Street Lighting',
    description: 'Report non-functioning streetlights, high-mast floodlights, or exposed power cables.',
    icon: 'Zap',
    slaStandardHours: 24,
    department: 'County Public Lighting Department'
  },
  {
    id: 'waste_environment',
    name: 'Waste & Environment',
    description: 'Report uncollected garbage, illegal dumping, blocked stormwater drains, or pollution.',
    icon: 'Trash2',
    slaStandardHours: 36,
    department: 'Department of Environment & Natural Resources'
  },
  {
    id: 'public_safety',
    name: 'Public Safety & Hazards',
    description: 'Report open manholes, damaged footbridges, stray livestock, or collapsed walls.',
    icon: 'ShieldAlert',
    slaStandardHours: 12,
    department: 'County Disaster Management & Inspectorate'
  },
  {
    id: 'public_health',
    name: 'Public Health & Sanitation',
    description: 'Report food hygiene violations, unsanitary market conditions, or pest infestations.',
    icon: 'Activity',
    slaStandardHours: 48,
    department: 'Public Health & Sanitation Services'
  }
]
