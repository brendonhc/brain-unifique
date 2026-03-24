import Fuse from "fuse.js"

export interface PersonRecord {
  id: string
  fullName: string
  displayName: string | null
  aliases: string[]
}

export interface ResolveResult {
  speakerName: string
  personId: string | null
  confidence: number
  isConfirmed: boolean
}

export function resolveSpeakers(
  speakerNames: string[],
  existingPeople: PersonRecord[]
): ResolveResult[] {
  // Build a searchable list with all name variants
  const searchEntries = existingPeople.flatMap((person) => {
    const names = [person.fullName]
    if (person.displayName) names.push(person.displayName)
    names.push(...(person.aliases || []))
    return names.map((name) => ({ name: name.toLowerCase(), personId: person.id }))
  })

  // Fuse.js for fuzzy matching
  const fuse = new Fuse(searchEntries, {
    keys: ["name"],
    threshold: 0.3, // Lower = more strict
    includeScore: true,
  })

  return speakerNames.map((speakerName) => {
    const normalized = speakerName.toLowerCase().trim()

    // 1. Exact match
    const exactMatch = searchEntries.find((e) => e.name === normalized)
    if (exactMatch) {
      return {
        speakerName,
        personId: exactMatch.personId,
        confidence: 1.0,
        isConfirmed: true,
      }
    }

    // 2. Fuzzy match
    const results = fuse.search(normalized)
    if (results.length > 0 && results[0].score !== undefined) {
      const bestMatch = results[0]
      const confidence = 1 - (bestMatch.score ?? 1)

      return {
        speakerName,
        personId: bestMatch.item.personId,
        confidence,
        isConfirmed: confidence >= 0.85,
      }
    }

    // 3. No match
    return {
      speakerName,
      personId: null,
      confidence: 0,
      isConfirmed: false,
    }
  })
}
