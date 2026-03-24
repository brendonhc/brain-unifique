export interface VttSegment {
  startTime: string
  endTime: string
  speaker: string
  text: string
}

export interface ParsedTranscript {
  segments: VttSegment[]
  speakers: string[]
  fullText: string
  durationMinutes: number
}

function timeToSeconds(time: string): number {
  const parts = time.split(":")
  const [hours, mins] = parts.map(Number)
  const secs = parseFloat(parts[2])
  return hours * 3600 + mins * 60 + secs
}

export function parseVtt(content: string): ParsedTranscript {
  const segments: VttSegment[] = []
  const speakersSet = new Set<string>()

  // Split into cue blocks (separated by blank lines)
  const blocks = content.split(/\n\s*\n/)
  let maxTime = 0

  for (const block of blocks) {
    const lines = block.trim().split("\n")

    // Find timestamp line
    const timestampLine = lines.find((l) => l.includes("-->"))
    if (!timestampLine) continue

    const [startTime, endTime] = timestampLine.split("-->").map((t) => t.trim())
    maxTime = Math.max(maxTime, timeToSeconds(endTime))

    // Everything after timestamp is text content
    const timestampIdx = lines.indexOf(timestampLine)
    const textLines = lines.slice(timestampIdx + 1).join(" ")

    // Extract speaker from voice tags: <v Speaker Name>text</v>
    const voiceMatch = textLines.match(/<v\s+([^>]+)>([^<]*)<\/v>/)

    if (voiceMatch) {
      const speaker = voiceMatch[1].trim()
      const text = voiceMatch[2].trim()
      speakersSet.add(speaker)
      segments.push({ startTime, endTime, speaker, text })
    } else {
      // No voice tag — try plain text with possible "Speaker: text" format
      const colonMatch = textLines.match(/^([^:]+):\s*(.+)$/)
      if (colonMatch) {
        const speaker = colonMatch[1].trim()
        const text = colonMatch[2].trim()
        speakersSet.add(speaker)
        segments.push({ startTime, endTime, speaker, text })
      } else {
        // Unknown speaker
        const text = textLines.replace(/<[^>]+>/g, "").trim()
        if (text) {
          segments.push({ startTime, endTime, speaker: "Unknown", text })
        }
      }
    }
  }

  const speakers = Array.from(speakersSet)
  const fullText = segments.map((s) => `${s.speaker}: ${s.text}`).join("\n")
  const durationMinutes = Math.ceil(maxTime / 60)

  return { segments, speakers, fullText, durationMinutes }
}

export function parsePlainText(content: string): ParsedTranscript {
  const segments: VttSegment[] = []
  const speakersSet = new Set<string>()
  const lines = content.split("\n").filter((l) => l.trim())

  for (const line of lines) {
    const match = line.match(/^([^:]+):\s*(.+)$/)
    if (match) {
      const speaker = match[1].trim()
      const text = match[2].trim()
      speakersSet.add(speaker)
      segments.push({ startTime: "00:00:00", endTime: "00:00:00", speaker, text })
    }
  }

  return {
    segments,
    speakers: Array.from(speakersSet),
    fullText: content,
    durationMinutes: 0,
  }
}
