const sayings = [
  'Reticulating Splines...',
  'Recombobulating Turbo Encabulators...',
  'Deploying Microservices...',
  'Auto-Updating Serverless Server-Side Renderer...',
  'Pruning Bonsai Trees...',
  'Calibrating Tachyon Field Fluctuations...'
]

export function sillySaying(): string {
  const index = Math.floor(Math.random() * sayings.length)
  return sayings[index]
}
