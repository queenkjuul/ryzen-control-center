import cn from '@meltdownjs/cn'
import { useContext } from 'react'
import Button from '/@renderer/components/control/Button'
import { RyzenInfoContext } from '/@renderer/lib/context'

function GetInfoPrompt({ className }: { className?: string }): React.JSX.Element {
  const { getRyzenInfo } = useContext(RyzenInfoContext)

  return (
    <div
      className={cn(
        'flex w-full flex-col items-center justify-center gap-2 text-center',
        className
      )}
    >
      <div>
        Press &quot;Get System Status&quot; to view current power values <br />
        (Requires admin password)
      </div>

      <Button
        label="Get System Status"
        className="btn btn-primary"
        onClick={() => getRyzenInfo()}
      />
    </div>
  )
}

export default GetInfoPrompt
