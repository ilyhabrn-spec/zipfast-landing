type IllustrationProps = {
  className?: string;
};

export function EngineerRepairIllustration({ className = "" }: IllustrationProps) {
  return (
    <svg
      viewBox="0 0 560 480"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="redGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#E60012" />
          <stop offset="100%" stopColor="#FF4D5E" />
        </linearGradient>
        <linearGradient id="softRed" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFF5F5" />
          <stop offset="100%" stopColor="#FFFFFF" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <rect x="20" y="20" width="520" height="440" rx="32" fill="url(#softRed)" />
      <circle cx="420" cy="90" r="70" fill="#E60012" opacity="0.08" />
      <circle cx="120" cy="380" r="90" fill="#E60012" opacity="0.06" />

      <rect x="300" y="100" width="200" height="280" rx="20" fill="#FFFFFF" stroke="#E60012" strokeWidth="3" />
      <rect x="320" y="130" width="160" height="100" rx="12" fill="#FFF5F5" stroke="#FECACA" strokeWidth="2" />
      <rect x="340" y="150" width="120" height="12" rx="6" fill="#E60012" opacity="0.3" />
      <rect x="340" y="175" width="80" height="8" rx="4" fill="#E60012" opacity="0.15" />
      <rect x="340" y="195" width="100" height="8" rx="4" fill="#E60012" opacity="0.15" />

      <circle cx="400" cy="280" r="36" fill="url(#redGrad)" filter="url(#glow)" />
      <circle cx="400" cy="280" r="20" fill="#FFFFFF" opacity="0.25" />
      <rect x="360" y="330" width="80" height="30" rx="8" fill="#1A1A1A" opacity="0.08" />

      <text x="330" y="395" fill="#E60012" fontSize="14" fontWeight="700" fontFamily="system-ui">
        RATIONAL
      </text>
      <text x="330" y="415" fill="#6B7280" fontSize="11" fontFamily="system-ui">
        Пароконвектомат
      </text>

      <ellipse cx="180" cy="340" rx="50" ry="12" fill="#1A1A1A" opacity="0.06" />

      <circle cx="160" cy="220" r="42" fill="#FFE4E6" stroke="#E60012" strokeWidth="2" />
      <rect x="130" y="255" width="60" height="80" rx="16" fill="url(#redGrad)" />
      <rect x="118" y="270" width="24" height="50" rx="12" fill="#FF4D5E" />
      <rect x="178" y="270" width="24" height="50" rx="12" fill="#FF4D5E" />
      <rect x="142" y="330" width="18" height="55" rx="9" fill="#1A1A1A" opacity="0.7" />
      <rect x="160" y="330" width="18" height="55" rx="9" fill="#1A1A1A" opacity="0.7" />

      <path
        d="M200 290 L280 250 L290 265 L210 305 Z"
        fill="#FFFFFF"
        stroke="#E60012"
        strokeWidth="2"
      />
      <circle cx="285" cy="255" r="8" fill="#E60012" />
      <rect x="275" y="240" width="30" height="8" rx="4" fill="#1A1A1A" opacity="0.6" transform="rotate(-25 290 244)" />

      <path
        d="M250 180 Q310 140 370 160"
        stroke="#E60012"
        strokeWidth="2"
        strokeDasharray="6 6"
        opacity="0.4"
      />
      <circle cx="250" cy="180" r="5" fill="#E60012" opacity="0.5" />
      <circle cx="370" cy="160" r="5" fill="#E60012" opacity="0.5" />

      <rect x="48" y="48" width="100" height="28" rx="14" fill="#FFFFFF" stroke="#FECACA" strokeWidth="1.5" />
      <text x="62" y="67" fill="#E60012" fontSize="11" fontWeight="600" fontFamily="system-ui">
        Сервис 24/7
      </text>
    </svg>
  );
}

export function GlobalPartsIllustration({ className = "" }: IllustrationProps) {
  return (
    <svg
      viewBox="0 0 400 320"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <circle cx="200" cy="160" r="130" fill="#FFF5F5" stroke="#FECACA" strokeWidth="2" />
      <ellipse cx="200" cy="160" rx="130" ry="50" stroke="#E60012" strokeWidth="1.5" opacity="0.2" />
      <ellipse cx="200" cy="160" rx="50" ry="130" stroke="#E60012" strokeWidth="1.5" opacity="0.2" />
      <path
        d="M70 160 H330 M200 30 V290"
        stroke="#E60012"
        strokeWidth="1"
        opacity="0.15"
      />
      <circle cx="200" cy="160" r="8" fill="#E60012" />
      <circle cx="120" cy="100" r="6" fill="#E60012" opacity="0.6" />
      <circle cx="300" cy="120" r="6" fill="#E60012" opacity="0.6" />
      <circle cx="280" cy="220" r="6" fill="#E60012" opacity="0.6" />
      <circle cx="100" cy="210" r="6" fill="#E60012" opacity="0.6" />
      <path
        d="M120 100 Q160 130 200 160 Q240 190 280 220"
        stroke="#E60012"
        strokeWidth="2"
        strokeDasharray="5 5"
        opacity="0.5"
      />
      <rect x="155" y="135" width="90" height="50" rx="10" fill="#FFFFFF" stroke="#E60012" strokeWidth="2" />
      <text x="172" y="165" fill="#E60012" fontSize="12" fontWeight="700" fontFamily="system-ui">
        ЗИП
      </text>
    </svg>
  );
}

export function EquipmentGridIllustration({ className = "" }: IllustrationProps) {
  return (
    <svg
      viewBox="0 0 480 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i} transform={`translate(${i * 96 + 8}, 20)`}>
          <rect
            x="0"
            y="0"
            width="80"
            height="160"
            rx="16"
            fill="#FFFFFF"
            stroke="#FECACA"
            strokeWidth="2"
          />
          <rect
            x="16"
            y="24"
            width="48"
            height="48"
            rx="12"
            fill="#FFF5F5"
            stroke="#E60012"
            strokeWidth="1.5"
            opacity={0.5 + i * 0.1}
          />
          <rect x="20" y="90" width="40" height="6" rx="3" fill="#E60012" opacity="0.2" />
          <rect x="20" y="104" width="28" height="6" rx="3" fill="#E60012" opacity="0.12" />
          <rect x="20" y="118" width="36" height="6" rx="3" fill="#E60012" opacity="0.12" />
        </g>
      ))}
    </svg>
  );
}
