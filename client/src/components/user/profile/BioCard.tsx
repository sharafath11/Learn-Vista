import { bioDetails } from "@/src/lib/testimonials"
import { WithTooltip } from "@/src/hooks/UseTooltipProps" // ✅ Tooltip wrapper

export default function BioCard() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 transition-all hover:shadow-md">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">About Me</h3>

      <WithTooltip content="This is your personal bio. Click edit to update.">
        <p className="text-sm text-gray-600 cursor-default">
          Passionate about learning new technologies and building web applications. 
          Currently focused on mastering React and Next.js.
        </p>
      </WithTooltip>

      <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
   {bioDetails.map(({ icon: Icon, text, tooltip }) => (
  <WithTooltip key={text} content={tooltip || text}>
    <div className="flex items-center text-sm text-gray-500 cursor-default">
      <Icon className="h-4 w-4 mr-2" />
      <span>{text}</span>
    </div>
  </WithTooltip>
))}


      </div>
    </div>
  )
}
