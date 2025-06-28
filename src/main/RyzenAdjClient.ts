import { spawn } from 'child_process'

const sudoOptions = {
  name: 'Ryzen Control Center'
}

export interface DataRow {
  Name: string
  Value: number | string
  Parameter: string
}

export class RyzenadjClient {
  public data: string = ''

  parse(content): DataRow[] {
    const lines = content.split('\n')
    // Find the table header
    const tableStart = lines.findIndex((line) => line.includes('Name') && line.includes('Value'))
    if (tableStart === -1) return []

    // Skip header and separator
    const tableLines = lines.slice(tableStart + 2)

    const result: DataRow[] = []
    for (const line of tableLines) {
      if (!line.trim().startsWith('|')) continue
      // Remove leading/trailing | and split
      const cols = line
        .trim()
        .slice(1, -1)
        .split('|')
        .map((s) => s.trim())
      if (cols.length !== 3) continue
      const [Name, ValueStr, Parameter] = cols
      const Value = isNaN(Number(ValueStr)) ? ValueStr : Number(ValueStr)
      result.push({ Name, Value, Parameter })
      console.log(`Parsed row: ${Name} = ${Value} (${Parameter})`)
    }
    return result
  }

  public runInfo(): void {
    // sudo.exec('ryzenadj -i', sudoOptions, (error, stdout, stderr) => {
    //   console.log('ran ryzenadj -i')
    //   if (error) {
    //     console.error(stderr)
    //     throw error
    //   }
    //   console.log(stdout)
    //   console.log(this.parse(stdout))
    // })

    const child = spawn('pkexec', ['ryzenadj', '-i'])

    child.stdout.on('data', (data) => console.log(data))
  }
}
