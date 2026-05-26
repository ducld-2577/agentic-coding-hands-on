// Event info rows: label (16px white) + value (24px gold #FFEA9E), then livestream note
const DATE_ROW = { label: 'Thời gian:', value: '18h30' }
const VENUE_ROW = { label: 'Địa điểm:', value: 'Nhà hát nghệ thuật quân đội' }
const LIVESTREAM_NOTE = 'Tường thuật trực tiếp qua sóng Livestream'

export function HomeEventInfo() {
  return (
    <div className="flex flex-col" style={{ gap: '8px' }}>
      {/* Date and venue on the same row, separated by gap */}
      <div className="flex flex-wrap items-center" style={{ gap: '60px' }}>
        <EventRow label={DATE_ROW.label} value={DATE_ROW.value} />
        <EventRow label={VENUE_ROW.label} value={VENUE_ROW.value} />
      </div>
      {/* Livestream note */}
      <p
        className="font-montserrat font-bold text-white"
        style={{ fontSize: '16px', lineHeight: '24px', letterSpacing: '0.5px' }}
      >
        {LIVESTREAM_NOTE}
      </p>
    </div>
  )
}

function EventRow({ label, value }: { label: string; value: string }) {
  return (
    <span className="flex items-baseline gap-2">
      <span
        className="font-montserrat font-bold text-white"
        style={{ fontSize: '16px', lineHeight: '24px', letterSpacing: '0.15px' }}
      >
        {label}
      </span>
      <span
        className="font-montserrat font-bold"
        style={{ fontSize: '24px', lineHeight: '32px', color: '#FFEA9E' }}
      >
        {value}
      </span>
    </span>
  )
}
