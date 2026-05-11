const CONFIG = {
  submitted:    { label: 'Submitted',     classes: 'bg-blue-50 text-blue-700 ring-blue-200' },
  under_review: { label: 'Under Review',  classes: 'bg-yellow-50 text-yellow-700 ring-yellow-200' },
  accepted:     { label: 'Accepted',      classes: 'bg-green-50 text-green-700 ring-green-200' },
  rejected:     { label: 'Rejected',      classes: 'bg-red-50 text-red-700 ring-red-200' },
  withdrawn:    { label: 'Withdrawn',     classes: 'bg-gray-50 text-gray-600 ring-gray-200' },
  conditional:  { label: 'Conditional',   classes: 'bg-orange-50 text-orange-700 ring-orange-200' },
  // commission statuses
  pending:      { label: 'Pending',       classes: 'bg-yellow-50 text-yellow-700 ring-yellow-200' },
  approved:     { label: 'Approved',      classes: 'bg-green-50 text-green-700 ring-green-200' },
  paid:         { label: 'Paid',          classes: 'bg-blue-50 text-blue-700 ring-blue-200' },
  cancelled:    { label: 'Cancelled',     classes: 'bg-gray-50 text-gray-500 ring-gray-200' },
  // recruiter approval
  active:       { label: 'Active',        classes: 'bg-green-50 text-green-700 ring-green-200' },
  inactive:     { label: 'Inactive',      classes: 'bg-gray-50 text-gray-500 ring-gray-200' },
}

export default function StatusBadge({ status, size = 'sm' }) {
  const cfg = CONFIG[status] ?? { label: status, classes: 'bg-gray-50 text-gray-600 ring-gray-200' }
  const padding = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'
  return (
    <span className={`inline-flex items-center rounded-full font-medium ring-1 ring-inset ${padding} ${cfg.classes}`}>
      {cfg.label}
    </span>
  )
}
